import { Address, BigInt, log, BigDecimal } from "@graphprotocol/graph-ts";
import { LiquidityPool, LptokenPool } from "../../generated/schema";
import { getOrCreateDexAmm, getOrCreateToken, createPoolFeeID } from "./getters";
import { bigIntToBigDecimal } from "./utils/numbers";
import {
  ADMIN_FEE,
  BIGDECIMAL_ONE_HUNDRED,
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  FEE_DENOMINATOR_DECIMALS,
  LiquidityPoolFeeType,
  NATIVE_BNB,
  POOL_FEE,
} from "./constants";
import { getPoolAssetPrice } from "../services/snapshots";
import { getPlatform } from "../services/platform";
import { ERC20 } from "../../generated/Factory/ERC20";
import { StableSwap } from "../../generated/Factory/StableSwap";

export function setPoolBalances(pool: LiquidityPool): void {
  let inputTokensBalances: BigInt[] = [];
  for (let i = 0; i < pool.inputTokens.length; ++i) {
    let token = pool.inputTokens[i];
    if (token.toLowerCase() == NATIVE_BNB.toHexString().toLowerCase()) {
      let cryptoSwapContract = StableSwap.bind(Address.fromString(pool.id));
      let balanceCall = cryptoSwapContract.try_balances(BIGINT_ZERO);
      if (!balanceCall.reverted) {
        inputTokensBalances.push(balanceCall.value); // all native tokens are the zero index if a pool has native token in it
      }
    } else {
      let balanceCall = ERC20.bind(Address.fromString(token)).try_balanceOf(Address.fromString(pool.id));
      if (!balanceCall.reverted) {
        log.error("setPoolBalances pool {} token {} balance {}", [pool.id, token, balanceCall.value.toString()]);
        inputTokensBalances.push(balanceCall.value);
      }
    }
  }
  pool.inputTokenBalances = inputTokensBalances;
  pool.save();
  return;
}

export function setPoolFeesV2(pool: LiquidityPool): void {
  let curvePool = StableSwap.bind(Address.fromString(pool.id));
  let totalFeeCall = curvePool.try_fee();
  let adminFeeCall = curvePool.try_admin_fee();
  let totalFee = totalFeeCall.reverted ? POOL_FEE : bigIntToBigDecimal(totalFeeCall.value, FEE_DENOMINATOR_DECIMALS); // format to percentage
  let adminFee = adminFeeCall.reverted ? ADMIN_FEE : bigIntToBigDecimal(adminFeeCall.value, FEE_DENOMINATOR_DECIMALS); // format to percentage

  let tradingFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.DYNAMIC_TRADING_FEE); // v2 pools have dynamic trading fees
  tradingFee.feePercentage = totalFee.times(BIGDECIMAL_ONE_HUNDRED);
  tradingFee.save();

  let protocolFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.DYNAMIC_PROTOCOL_FEE);
  protocolFee.feePercentage = adminFee.times(totalFee).times(BIGDECIMAL_ONE_HUNDRED);
  protocolFee.save();

  let lpFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.DYNAMIC_LP_FEE);
  lpFee.feePercentage = totalFee.minus(adminFee.times(totalFee)).times(BIGDECIMAL_ONE_HUNDRED);
  lpFee.save();

  let liqFeeRatio = BigDecimal.fromString(
    BigInt.fromI32(pool.inputTokens.length / (4 * (pool.inputTokens.length - 1))).toString(),
  );

  // let depositFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.DEPOSIT_FEE);
  // depositFee.feePercentage = liqFeeRatio.times(totalFee.minus(adminFee.times(totalFee))).times(BIGDECIMAL_ONE_HUNDRED);
  // depositFee.save();

  // let withdrawFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.WITHDRAWAL_FEE);
  // withdrawFee.feePercentage = liqFeeRatio.times(totalFee.minus(adminFee.times(totalFee))).times(BIGDECIMAL_ONE_HUNDRED);
  // withdrawFee.save();

  let poolFees = [
    tradingFee.id,
    protocolFee.id,
    lpFee.id,
    //depositFee.id,
    // withdrawFee.id
  ];
  pool.fees = poolFees;
  pool.save();
  return;
}

export function setPoolFees(pool: LiquidityPool): void {
  let curvePool = StableSwap.bind(Address.fromString(pool.id));
  if (pool.isV2) {
    setPoolFeesV2(pool);
    return;
  }
  let totalFeeCall = curvePool.try_fee();
  let adminFeeCall = curvePool.try_admin_fee();
  let totalFee = totalFeeCall.reverted ? POOL_FEE : bigIntToBigDecimal(totalFeeCall.value, FEE_DENOMINATOR_DECIMALS); // format to percentage
  let adminFee = adminFeeCall.reverted ? ADMIN_FEE : bigIntToBigDecimal(adminFeeCall.value, FEE_DENOMINATOR_DECIMALS); // format to percentage

  let tradingFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.FIXED_TRADING_FEE);
  tradingFee.feePercentage = totalFee.times(BIGDECIMAL_ONE_HUNDRED);
  tradingFee.save();

  let protocolFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.FIXED_PROTOCOL_FEE);
  protocolFee.feePercentage = adminFee.times(totalFee).times(BIGDECIMAL_ONE_HUNDRED);
  protocolFee.save();

  let lpFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.FIXED_LP_FEE);
  lpFee.feePercentage = totalFee.minus(adminFee.times(totalFee)).times(BIGDECIMAL_ONE_HUNDRED);
  lpFee.save();

  let liqFeeRatio = BigDecimal.fromString(
    BigInt.fromI32(pool.inputTokens.length / (4 * (pool.inputTokens.length - 1))).toString(),
  );

  // let depositFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.DEPOSIT_FEE);
  // depositFee.feePercentage = liqFeeRatio.times(totalFee.minus(adminFee.times(totalFee))).times(BIGDECIMAL_ONE_HUNDRED);
  // depositFee.save();

  // let withdrawFee = createPoolFeeID(pool.id, LiquidityPoolFeeType.WITHDRAWAL_FEE);
  // withdrawFee.feePercentage = liqFeeRatio.times(totalFee.minus(adminFee.times(totalFee))).times(BIGDECIMAL_ONE_HUNDRED);
  // withdrawFee.save();

  let poolFees = [
    tradingFee.id,
    protocolFee.id,
    lpFee.id,
    //depositFee.id,
    // withdrawFee.id
  ];
  pool.fees = poolFees;
  pool.save();
  return;
}

export function setPoolOutputTokenSupply(pool: LiquidityPool): void {
  let outputTokenSupply = ERC20.bind(Address.fromString(pool.outputToken)).try_totalSupply();
  if (outputTokenSupply.reverted) {
    log.warning("Call to totalSupply failed for pool = {} , lptoken = ({})", [pool.id, pool.outputToken]);
    return;
  }
  pool.outputTokenSupply = outputTokenSupply.value;
  pool.save();
}

export function setPoolTokenWeights(liquidityPool: LiquidityPool, timestamp: BigInt): void {
  // only calculate AFTER TVL has been set/updated
  let inputTokenWeights: BigDecimal[] = [];
  for (let j = 0; j < liquidityPool.inputTokens.length; j++) {
    if (liquidityPool.totalValueLockedUSD == BIGDECIMAL_ZERO) {
      inputTokenWeights.push(BIGDECIMAL_ZERO);
    } else {
      let balance = liquidityPool.inputTokenBalances[j];
      let token = getOrCreateToken(Address.fromString(liquidityPool.inputTokens[j]));
      const priceUSD = getPoolAssetPrice(liquidityPool, timestamp);
      const balanceUSD = bigIntToBigDecimal(balance, token.decimals).times(priceUSD);
      const weight =
        liquidityPool.totalValueLockedUSD == BIGDECIMAL_ZERO
          ? BIGDECIMAL_ZERO
          : balanceUSD.div(liquidityPool.totalValueLockedUSD);
      inputTokenWeights.push(weight);
    }
  }

  // if the weights of the pool are completely off, the pool is probably dead
  for (let i = 0; i < inputTokenWeights.length; i++) {
    let tokenWeight = inputTokenWeights[i];
    if (tokenWeight < BigDecimal.fromString("0.1")) {
      liquidityPool.totalValueLockedUSD = BIGDECIMAL_ZERO;
    }
  }

  liquidityPool.inputTokenWeights = inputTokenWeights;
  liquidityPool.save();
}

export function setPoolTVL(pool: LiquidityPool, timestamp: BigInt): BigDecimal {
  let totalValueLockedUSD = BIGDECIMAL_ZERO;
  const priceUSD = getPoolAssetPrice(pool, timestamp);
  log.error("setPoolTVL: tokens = {}", [pool.inputTokens.toString()]);
  for (let j = 0; j < pool.inputTokens.length; j++) {
    let balance = pool.inputTokenBalances[j];
    let token = getOrCreateToken(Address.fromString(pool.inputTokens[j]));
    log.error("setPoolTVL: token = {}, balance = {}, decimals = {}, priceUSD = {}", [
      token.id,
      balance.toString(),
      token.decimals.toString(),
      priceUSD.toString(),
    ]);
    totalValueLockedUSD = totalValueLockedUSD.plus(bigIntToBigDecimal(balance, token.decimals).times(priceUSD));
  }
  pool.totalValueLockedUSD = totalValueLockedUSD;
  pool.save();
  setPoolTokenWeights(pool, timestamp); // reweight pool every time TVL changes
  return totalValueLockedUSD;
}

export function setProtocolTVL(): void {
  // updates all pool TVLs along with protocol TVL
  let protocol = getOrCreateDexAmm();
  let totalValueLockedUSD = BIGDECIMAL_ZERO;
  const platform = getPlatform();
  for (let i = 0; i < platform.poolAddresses.length; ++i) {
    const poolAddress = platform.poolAddresses[i];
    const pool = LiquidityPool.load(poolAddress);
    if (!pool) {
      return;
    }
    totalValueLockedUSD = totalValueLockedUSD.plus(pool.totalValueLockedUSD);
  }
  protocol.totalValueLockedUSD = totalValueLockedUSD;
  protocol.save();
}

export function setLpTokenPool(lpToken: Address, pool: Address): void {
  let lpTokenPool = new LptokenPool(lpToken.toHexString());
  lpTokenPool.pool = pool.toHexString();
  lpTokenPool.save();
}
