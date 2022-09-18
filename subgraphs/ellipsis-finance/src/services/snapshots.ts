import { LiquidityPool, TokenSnapshot, LptokenPool } from "../../generated/schema";
import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { StableSwap } from "../../generated/factory/StableSwap";
import { getUsdRate } from "../common/prices/pricing";
import { BIGDECIMAL_ZERO, DEFAULT_DECIMALS, SNAPSHOT_SECONDS } from "../common/constants";
import { getAtokenPriceUSD, isAtoken } from "../common/prices/aave";
import { getOrCreateToken } from "../common/getters";
import { bigIntToBigDecimal } from "../common/utils/numbers";

function isCurveLP(tokenAddr: Address): boolean {
  let isLpToken = LptokenPool.load(tokenAddr.toHexString());
  if (!isLpToken) {
    return false;
  }
  return true;
}

export function getTokenPriceSnapshot(tokenAddr: Address, timestamp: BigInt): BigDecimal {
  let tokenSnapshot = TokenSnapshot.load(createTokenSnapshotID(tokenAddr, timestamp));
  if (tokenSnapshot) {
    return tokenSnapshot.price;
  }
  tokenSnapshot = new TokenSnapshot(createTokenSnapshotID(tokenAddr, timestamp));
  if (isCurveLP(tokenAddr)) {
    let lpToken = LptokenPool.load(tokenAddr.toHexString());
    let pool = LiquidityPool.load(lpToken!.pool);
    return getLpTokenPriceUSD(pool!, timestamp);
  }
  if (isAtoken(tokenAddr)) {
    // aave
    return getAtokenPriceUSD(tokenAddr, timestamp);
  }
  let priceUSD = getUsdRate(tokenAddr);

  let token = getOrCreateToken(tokenAddr);
  token.lastPriceUSD = tokenSnapshot.price;
  token.save();

  tokenSnapshot = new TokenSnapshot(createTokenSnapshotID(tokenAddr, timestamp));
  tokenSnapshot.price = priceUSD;
  tokenSnapshot.save();
  return priceUSD;
}

export function getPoolAssetPrice(poolTokens: string[], timestamp: BigInt): BigDecimal {
  log.error("getPoolAssetPrice poolTokens {}", [poolTokens.toString()]);
  let priceUSD = BIGDECIMAL_ZERO;
  for (let i = 0; i < poolTokens.length; ++i) {
    let token = getOrCreateToken(Address.fromString(poolTokens[i]));
    let tokenSnapshot = TokenSnapshot.load(createTokenSnapshotID(Address.fromString(poolTokens[i]), timestamp));
    if (tokenSnapshot && tokenSnapshot.price != BIGDECIMAL_ZERO) {
      priceUSD = tokenSnapshot.price;
      token.lastPriceUSD = priceUSD;
      token.save();
      break;
    } else {
      tokenSnapshot = new TokenSnapshot(createTokenSnapshotID(Address.fromString(poolTokens[i]), timestamp));
      priceUSD = getUsdRate(Address.fromString(poolTokens[i]));
      if (priceUSD != BIGDECIMAL_ZERO) {
        token.lastPriceUSD = priceUSD;
        tokenSnapshot.price = priceUSD;
        token.save();
        tokenSnapshot.save();
        break;
      }
    }
  }
  return priceUSD;
}

export function getLpTokenPriceUSD(pool: LiquidityPool, timestamp: BigInt, poolTokens: string[] = []): BigDecimal {
  log.error("getLpTokenPriceUSD pool {},  poolTokens {}", [pool.id.toString(), poolTokens.toString()]);
  let tokenSnapshot = TokenSnapshot.load(createTokenSnapshotID(Address.fromString(pool.id), timestamp));
  if (tokenSnapshot) {
    return tokenSnapshot.price;
  }
  tokenSnapshot = new TokenSnapshot(createTokenSnapshotID(Address.fromString(pool.id), timestamp));
  let curvePool = StableSwap.bind(Address.fromString(pool.id));
  let tokens = poolTokens.length > 0 ? pool.inputTokens : poolTokens;
  let assetPriceUSD = getPoolAssetPrice(tokens, timestamp);
  let virtualPrice = curvePool.try_get_virtual_price();
  if (virtualPrice.reverted) {
    tokenSnapshot.price = assetPriceUSD;
    tokenSnapshot.save();
    return assetPriceUSD;
  }
  let virtualPriceDecimal = bigIntToBigDecimal(virtualPrice.value, DEFAULT_DECIMALS);
  let price = assetPriceUSD.times(virtualPriceDecimal);
  log.error("getLpTokenPriceUSD virtualPriceDecimal {},  assetPriceUSD {}", [
    virtualPriceDecimal.toString(),
    assetPriceUSD.toString(),
  ]);
  tokenSnapshot.price = price;
  tokenSnapshot.save();
  return price;
}

export function createTokenSnapshotID(tokenAddr: Address, timestamp: BigInt): string {
  return tokenAddr.toHexString() + "-" + timestamp.div(BigInt.fromI32(SNAPSHOT_SECONDS)).toString();
}
