import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

////////////////////
///// Versions /////
////////////////////

export const PROTOCOL_NAME = "Ellipsis Finance";
export const PROTOCOL_SLUG = "ellipses-finance";
export const PROTOCOL_SCHEMA_VERSION = "1.2.1";
export const PROTOCOL_SUBGRAPH_VERSION = "1.0.1";
export const PROTOCOL_METHODOLOGY_VERSION = "1.0.0";

////////////////////////
///// Schema Enums /////
////////////////////////

// The network names corresponding to the Network enum in the schema.
// They also correspond to the ones in `dataSource.network()` after converting to lower case.
// See below for a complete list:
// https://thegraph.com/docs/en/hosted-service/what-is-hosted-service/#supported-networks-on-the-hosted-service
export namespace Network {
  export const ARBITRUM_ONE = "ARBITRUM_ONE";
  export const AVALANCHE = "AVALANCHE";
  export const AURORA = "AURORA";
  export const BSC = "BSC"; // aka BNB Chain
  export const CELO = "CELO";
  export const MAINNET = "MAINNET"; // Ethereum mainnet
  export const FANTOM = "FANTOM";
  export const FUSE = "FUSE";
  export const MOONBEAM = "MOONBEAM";
  export const MOONRIVER = "MOONRIVER";
  export const NEAR_MAINNET = "NEAR_MAINNET";
  export const OPTIMISM = "OPTIMISM";
  export const MATIC = "MATIC"; // aka Polygon
  export const XDAI = "XDAI"; // aka Gnosis Chain
}

export namespace ProtocolType {
  export const EXCHANGE = "EXCHANGE";
  export const LENDING = "LENDING";
  export const YIELD = "YIELD";
  export const BRIDGE = "BRIDGE";
  export const GENERIC = "GENERIC";
}

export namespace VaultFeeType {
  export const MANAGEMENT_FEE = "MANAGEMENT_FEE";
  export const PERFORMANCE_FEE = "PERFORMANCE_FEE";
  export const DEPOSIT_FEE = "DEPOSIT_FEE";
  export const WITHDRAWAL_FEE = "WITHDRAWAL_FEE";
}

export namespace LiquidityPoolFeeType {
  export const FIXED_TRADING_FEE = "FIXED_TRADING_FEE";
  export const TIERED_TRADING_FEE = "TIERED_TRADING_FEE";
  export const DYNAMIC_TRADING_FEE = "DYNAMIC_TRADING_FEE";
  export const FIXED_LP_FEE = "FIXED_LP_FEE";
  export const DYNAMIC_LP_FEE = "DYNAMIC_LP_FEE";
  export const FIXED_PROTOCOL_FEE = "FIXED_PROTOCOL_FEE";
  export const DYNAMIC_PROTOCOL_FEE = "DYNAMIC_PROTOCOL_FEE";
  export const DEPOSIT_FEE = "DEPOSIT_FEE";
  export const WITHDRAWAL_FEE = "WITHDRAWAL_FEE";
}

export namespace RewardTokenType {
  export const DEPOSIT = "DEPOSIT";
  export const BORROW = "BORROW";
}

export namespace LendingType {
  export const CDP = "CDP";
  export const POOLED = "POOLED";
}

export namespace RiskType {
  export const GLOBAL = "GLOBAL";
  export const ISOLATED = "ISOLATED";
}

export namespace InterestRateType {
  export const STABLE = "STABLE";
  export const VARIABLE = "VARIABLE";
  export const FIXED_TERM = "FIXED_TERM";
}

export namespace InterestRateSide {
  export const LENDER = "LENDER";
  export const BORROWER = "BORROWER";
}

export namespace UsageType {
  export const DEPOSIT = "DEPOSIT";
  export const WITHDRAW = "WITHDRAW";
  export const SWAP = "SWAP";
}

//////////////////////////////
///// Ethereum Addresses /////
//////////////////////////////

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ADDRESS_ZERO = Address.fromString(ZERO_ADDRESS);
export const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

////////////////////////
///// Type Helpers /////
////////////////////////

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_NEG_ONE = BigInt.fromI32(-1);
export const BIGINT_TWO = BigInt.fromI32(2);
export const BIGINT_HUNDRED = BigInt.fromI32(100);
export const BIGINT_THOUSAND = BigInt.fromI32(1000);
export const BIGINT_TEN_TO_EIGHTEENTH = BigInt.fromString("10").pow(18);
export const BIGINT_MAX = BigInt.fromString(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935",
);
//@ts-ignore
export const INT_NEGATIVE_ONE = -1 as i32; //@ts-ignore
export const INT_ZERO = 0 as i32; //@ts-ignore
export const INT_ONE = 1 as i32; //@ts-ignore
export const INT_TWO = 2 as i32; //@ts-ignore
export const INT_FOUR = 4 as i32;

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);
export const BIGDECIMAL_TWO = new BigDecimal(BIGINT_TWO);
export const BIGDECIMAL_ONE_HUNDRED = new BigDecimal(BIGINT_HUNDRED);
export const BIG_DECIMAL_1E18 = new BigDecimal(BIGINT_TEN_TO_EIGHTEENTH);
export const MAX_UINT = BigInt.fromI32(2).times(BigInt.fromI32(255));

/////////////////////
///// Date/Time /////
/////////////////////

export const SECONDS_PER_DAY = 60 * 60 * 24; // 86400
export const SECONDS_PER_HOUR = 60 * 60; // 3600
export const MS_PER_DAY = new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000));
export const DAYS_PER_YEAR = new BigDecimal(BigInt.fromI32(365));
export const MS_PER_YEAR = DAYS_PER_YEAR.times(new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000)));
export const SNAPSHOT_SECONDS = SECONDS_PER_DAY;

////////////////
///// Misc /////
////////////////

export const ETH_SYMBOL = "ETH";
export const ETH_NAME = "Ether";

/////////////////////////////
///// Protocol Specific /////
/////////////////////////////

export const FEE_DENOMINATOR_DECIMALS = 10;

export const ELLIPSIS_PLATFORM_ID = "ellipsis";

export const POOL_FEE = BigDecimal.fromString("0.0004");
export const ADMIN_FEE = BigDecimal.fromString("0.5");

/////////////////
// PANCAKESWAP //
/////////////////
export const PANCAKE_ROUTER_ADDRESS = Address.fromString("0x10ED43C718714eb63d5aA57B78B54704E256024E");
export const PANCAKE_FACTORY_ADDRESS = Address.fromString("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73");

////////////
// TOKENS //
////////////

export const DEFAULT_DECIMALS = 18;
export const USDC_DECIMALS = 6;
export const BUSD_DECIMALS = 18;
export const USDT_DECIMALS = 18;

export const WBNB_ADDRESS = Address.fromString("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
export const BUSD_ADDRESS = Address.fromString("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56");
export const USDC_ADDRESS = Address.fromString("0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d");
export const BBTC_ADDRESS = Address.fromString("0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c");
export const USDT_ADDRESS = Address.fromString("0x55d398326f99059ff775485246999027b3197955");
export const NATIVE_BNB = Address.fromString(NATIVE_TOKEN_ADDRESS);

export const STABLECOINS: Address[] = [USDC_ADDRESS, BUSD_ADDRESS, USDT_ADDRESS];

export const BNB_ADDRESSES: Address[] = [WBNB_ADDRESS, NATIVE_BNB];

export const EPS_ADDRESS = Address.fromString("0xA7f552078dcC247C2684336020c03648500C6d9F");
export const EPX_ADDRESS = Address.fromString("0xaf41054c1487b0e5e2b9250c0332ecbce6ce9d71");

export const TRICRYPTO_LP_TOKEN = Address.fromString("0xaF4dE8E872131AE328Ce21D909C74705d3Aaf452");

////////////////
// REGISTRIES //
///////////////

export const FACTORY_ADDRESS = Address.fromString("0xf65BEd27e96a367c61e0E06C54e14B16b84a5870");

export const REGISTRY_TO_IGNORE = Address.fromString("0xa43A1F35dD0024584b6d7df47AAcaF8235c2Fea5");
export const REGISTRY_ADDRESS_V2 = Address.fromString("0x266Bb386252347b03C7B6eB37F950f476D7c3E63");

///////////
// POOLS //
///////////

export namespace PoolType {
  export const LENDING = "LENDING";
  export const PLAIN = "PLAIN";
  export const METAPOOL = "METAPOOL";
  export const BASEPOOL = "BASEPOOL";
}

export const EARLY_BASEPOOLS: Address[] = [
  Address.fromString("0x160CAed03795365F3A589f10C379FfA7d75d4E76".toLowerCase()),
  Address.fromString("0x2477fB288c5b4118315714ad3c7Fd7CC69b00bf9".toLowerCase()),
];

export const POOL_LP_TOKEN_MAP = new Map<string, Address>();
POOL_LP_TOKEN_MAP.set(
  "0x160CAed03795365F3A589f10C379FfA7d75d4E76".toLowerCase(),
  Address.fromString("0xaF4dE8E872131AE328Ce21D909C74705d3Aaf452"),
);
POOL_LP_TOKEN_MAP.set(
  "0x2477fB288c5b4118315714ad3c7Fd7CC69b00bf9".toLowerCase(),
  Address.fromString("0x2a435Ecb3fcC0E316492Dc1cdd62d0F189be5640"),
);
POOL_LP_TOKEN_MAP.set(
  "0x19EC9e3F7B21dd27598E7ad5aAe7dC0Db00A806d".toLowerCase(),
  Address.fromString("0x5b5bD8913D766D005859CE002533D4838B0Ebbb5"),
);
POOL_LP_TOKEN_MAP.set(
  "0xfA715E7C8fA704Cf425Dd7769f4a77b81420fbF2".toLowerCase(),
  Address.fromString("0xdC7f3E34C43f8700B0EB58890aDd03AA84F7B0e1"),
);

export const BASE_POOL_MAP = new Map<Address, Address>();
BASE_POOL_MAP.set(
  Address.fromString("0x5A7d2F9595eA00938F3B5BA1f97a85274f20b96c".toLowerCase()),
  Address.fromString("0x160CAed03795365F3A589f10C379FfA7d75d4E76"),
);

export const MISSING_POOLS: string[] = ["0x2ddF6Da17Ae64c22b3Af75158726F2B5F73Ea332"];

export const MISSING_POOL_COINS: string[][] = [
  ["0x2e3E3e3CAD5478F63549b7207c860A7f8FEDf4C9", "0xB7d9905eDf8B7B093E3C74af8d6982D0F3d37762"],
];

export const MISSING_LP_TOKENS: string[] = ["0x4084203afbc9b20a3ecb9c80dc164a13c9a41eeb"];

export const MISSING_BASE_POOLs: string[] = [ZERO_ADDRESS];

export const MISSING_BASEPOOL_COINS: string[][] = [[]];
