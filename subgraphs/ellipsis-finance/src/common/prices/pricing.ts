import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { bigIntToBigDecimal, exponentToBigInt } from "../utils/numbers";
import {
  BIGDECIMAL_ZERO,
  BIGDECIMAL_ONE,
  ADDRESS_ZERO,
  BUSD_ADDRESS,
  USDT_ADDRESS,
  USDC_ADDRESS,
  STABLECOINS,
  WBNB_ADDRESS,
  NATIVE_BNB,
  BNB_ADDRESSES,
  PANCAKE_ROUTER_ADDRESS,
  PANCAKE_FACTORY_ADDRESS,
  DEFAULT_DECIMALS,
  BUSD_DECIMALS,
  ZERO_ADDRESS,
  SECONDS_PER_HOUR,
} from "../constants";
import { getOrCreateToken } from "../getters";
import { UniswapRouter } from "../../../generated/Factory/UniswapRouter";
import { PancakeFactory } from "../../../generated/Factory/PancakeFactory";
import { Pair } from "../../../generated/schema";
import { ERC20 } from "../../../generated/Factory/ERC20";

export function getDecimals(token: Address): BigInt {
  if (token == NATIVE_BNB) {
    return BigInt.fromI32(DEFAULT_DECIMALS);
  }
  let tokenEntity = getOrCreateToken(token);
  return BigInt.fromI32(tokenEntity.decimals);
}

export function isZeroAddress(address: Address): bool {
  return address == ADDRESS_ZERO;
}

export function getPairTokenBalance(token: Address, holder: Address, usdPrice: bool): BigDecimal {
  let tokenContract = ERC20.bind(token);
  let balance = tokenContract.try_balanceOf(holder);
  if (balance.reverted) {
    return BIGDECIMAL_ZERO;
  }
  let tokenDecimals = getDecimals(token);
  let tokenBalance = bigIntToBigDecimal(balance.value, tokenDecimals.toI32());
  if (usdPrice) {
    if (STABLECOINS.includes(token)) {
      return tokenBalance;
    }
    let tokenPrice = getPriceFromRouter(token);
    if (tokenPrice) {
      return tokenBalance.times(tokenPrice);
    } else {
      return BIGDECIMAL_ZERO;
    }
  }
  return tokenBalance;
}

export function getPair(tokenToPrice: Address, pairedToken: Address, timestamp: BigInt): Pair {
  let pairEntity = Pair.load(tokenToPrice.toHexString() + "-" + pairedToken.toHexString());
  if (!pairEntity) {
    let pairEntity = new Pair(tokenToPrice.toHexString() + "-" + pairedToken.toHexString());
    let factory = PancakeFactory.bind(PANCAKE_FACTORY_ADDRESS);
    let pairCall = factory.try_getPair(tokenToPrice, pairedToken);
    pairEntity.address = pairCall.reverted ? ZERO_ADDRESS : pairCall.value.toHexString();
    if (pairEntity.address == ZERO_ADDRESS) {
      pairEntity.tokenToPriceBalance = BIGDECIMAL_ZERO;
      pairEntity.pairedTokenBalance = BIGDECIMAL_ZERO;
      pairEntity.isLiquid = false;
      pairEntity.lastUpdateTimestamp = timestamp;
      pairEntity.save();
      return pairEntity;
    } else {
      let tokenToPriceBalance = getPairTokenBalance(tokenToPrice, Address.fromString(pairEntity.address), false);
      let pairedTokenBalance = getPairTokenBalance(pairedToken, Address.fromString(pairEntity.address), true);
      pairEntity.tokenToPriceBalance = tokenToPriceBalance;
      pairEntity.pairedTokenBalance = pairedTokenBalance;
      pairEntity.isLiquid = false;
      pairEntity.lastUpdateTimestamp = timestamp;
      if (pairedTokenBalance >= BigDecimal.fromString("10000.0")) {
        pairEntity.isLiquid = true;
      }
      pairEntity.save();
      return pairEntity;
    }
  } else {
    if (pairEntity.address == ZERO_ADDRESS) {
      pairEntity.lastUpdateTimestamp = timestamp;
      pairEntity.save();
      return pairEntity;
    } else {
      // if last update > 1 hour ago, update
      if (timestamp.minus(pairEntity.lastUpdateTimestamp) > BigInt.fromI32(SECONDS_PER_HOUR)) {
        let tokenToPriceBalance = getPairTokenBalance(tokenToPrice, Address.fromString(pairEntity.address), false);
        let pairedTokenBalance = getPairTokenBalance(pairedToken, Address.fromString(pairEntity.address), true);
        pairEntity.tokenToPriceBalance = tokenToPriceBalance;
        pairEntity.pairedTokenBalance = pairedTokenBalance;
        pairEntity.isLiquid = false;
        if (pairedTokenBalance >= BigDecimal.fromString("10000.0")) {
          pairEntity.isLiquid = true;
        }
        pairEntity.lastUpdateTimestamp = timestamp;
        pairEntity.save();
        return pairEntity;
      } else {
        return pairEntity;
      }
    }
  }
}

export function getRouterPath(token: Address, timestamp: BigInt): Address[] | null {
  let wbnb_pair = getPair(token, WBNB_ADDRESS, timestamp);
  let busd_pair = getPair(token, BUSD_ADDRESS, timestamp);
  let usdt_pair = getPair(token, USDT_ADDRESS, timestamp);
  let usdc_pair = getPair(token, USDC_ADDRESS, timestamp);

  let pairs: Pair[] = [wbnb_pair, busd_pair, usdt_pair, usdc_pair];
  let liquidPairs: Pair[] = [];
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].isLiquid) {
      liquidPairs.push(pairs[i]);
    }
  }
  if (liquidPairs.length == 0) {
    return null;
  }

  let maxBalance = BIGDECIMAL_ZERO;
  let maxPair = liquidPairs[0];
  for (let i = 0; i < liquidPairs.length; i++) {
    let balance = liquidPairs[i].pairedTokenBalance;
    if (maxBalance < balance) {
      maxBalance = balance;
      maxPair = liquidPairs[i];
    }
  }

  let path: Address[] = [];

  if ((maxPair.id = wbnb_pair.id)) {
    path.push(token);
    path.push(WBNB_ADDRESS);
    path.push(BUSD_ADDRESS);
    return path;
  }
  path = [token, Address.fromString(maxPair.pairedToken)];
  return path;
}

export function getPriceFromRouter(token: Address): BigDecimal {
  let path: Address[] = [token, WBNB_ADDRESS, BUSD_ADDRESS];
  if (BNB_ADDRESSES.indexOf(token) != -1) {
    path = [WBNB_ADDRESS, BUSD_ADDRESS];
  }
  let router = UniswapRouter.bind(PANCAKE_ROUTER_ADDRESS);
  let decimals = getDecimals(token);
  let tokenAmount = exponentToBigInt(decimals.toI32());

  let amountsOutCall = router.try_getAmountsOut(tokenAmount, path);
  if (!amountsOutCall.reverted) {
    let priceUSD = bigIntToBigDecimal(amountsOutCall.value[amountsOutCall.value.length - 1], BUSD_DECIMALS);
    log.error("getPriceFromRouter token {} price {}", [token.toHexString(), priceUSD.toString()]);
    return priceUSD;
  }
  return BIGDECIMAL_ZERO;
}

function getPriceFromRouterPath(path: Address[]): BigDecimal {
  let router = UniswapRouter.bind(PANCAKE_ROUTER_ADDRESS);
  let decimals = getDecimals(path[0]);
  let usdDecimals = getDecimals(path[path.length - 1]);
  let tokenAmount = exponentToBigInt(decimals.toI32());

  let amountsOutCall = router.try_getAmountsOut(tokenAmount, path);
  if (!amountsOutCall.reverted) {
    let priceUSD = bigIntToBigDecimal(amountsOutCall.value[amountsOutCall.value.length - 1], usdDecimals.toI32());
    log.error("getPriceFromRouterPath token {} price {}", [path[0].toHexString(), priceUSD.toString()]);
    return priceUSD;
  }
  return BIGDECIMAL_ZERO;
}

export function getUsdRate(token: Address, timestamp: BigInt): BigDecimal {
  if (STABLECOINS.indexOf(token) != -1) {
    return BIGDECIMAL_ONE;
  }

  // if bnb, just get price from router as it's handled in that function
  if (BNB_ADDRESSES.indexOf(token) != -1) {
    return getPriceFromRouter(token);
  }

  let path = getRouterPath(token, timestamp);
  if (!path) {
    return BIGDECIMAL_ZERO;
  }

  return getPriceFromRouterPath(path);
}
