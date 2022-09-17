import { Address, log } from "@graphprotocol/graph-ts";
import { CryptoPoolDeployed } from "../../generated/Factory/CryptoFactory";
import { LiquidityPool } from "../../generated/schema";
import { FactoryPools } from "../../generated/templates";
import { ADDRESS_ZERO, PoolType } from "../common/constants";
import { getOrCreateToken } from "../common/getters";
import { createNewPool, getBasePool, getLpToken, isLendingPool, cleanCoins } from "../services/pool";

export function handleCryptoPoolDeployed(event: PlainPoolDeployed): void {
  const coins = cleanCoins(event.params.coins);
  log.error("factory.ts handlePlainPoolDeployed tx: {}, coins: {}, lptoken: {}", [
    event.transaction.hash.toHexString(),
    coins.toString(),
    event.params.lp_token.toHexString(),
  ]);
  const lp_token = event.params.lp_token;
  const lpTokenEntity = getOrCreateToken(lp_token);
  let pool = event.params.pool;
  if (!pool || pool == ADDRESS_ZERO) {
    log.error("Plain pool deployed with invalid pool address: {}", [pool.toHexString()]);
    return;
  }
  createNewPool(
    pool,
    lp_token,
    lpTokenEntity.name,
    lpTokenEntity.symbol,
    event.block.number,
    event.block.timestamp,
    getBasePool(pool),
    coins,
  );
  // Create a new pool
  FactoryPools.create(pool);
  log.info("New plain pool deployed: {}", [pool.toHexString()]);
}
