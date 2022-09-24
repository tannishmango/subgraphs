import { log } from "@graphprotocol/graph-ts";
import { CryptoPoolDeployed } from "../../generated/Factory/CryptoFactory";
import { FactoryPools } from "../../generated/templates";
import { ADDRESS_ZERO } from "../common/constants";
import { getOrCreateToken } from "../common/getters";
import { createNewPool, getBasePool, cleanCoins } from "../services/pool";

export function handleCryptoPoolDeployed(event: CryptoPoolDeployed): void {
  const coins = cleanCoins(event.params.coins);
  log.error("factory.ts handlePlainPoolDeployed tx: {}, coins: {}, lptoken: {}", [
    event.transaction.hash.toHexString(),
    coins.toString(),
    event.params.token.toHexString(),
  ]);
  const lp_token = event.params.token;
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
