export const protocolErrorMessages = {
    totalValueLockedUSD: "This field on 'Protocol' entity has a value below $10,000 or above $100,000,000,000.",
    cumulativeSupplySideRevenueUSD: "This field on 'Protocol' entity has a value below $0 or above $100,000,000,000.",
    cumulativeProtocolSideRevenueUSD: "This field on 'Protocol' entity has a value below $0 or above $100,000,000,000.",
    cumulativeTotalRevenueUSD: "'Protocol' entity has a cumulativeTotalRevenueUSD that does not equal cumulativeProtocolSideRevenueUSD + cumulativeSupplySideRevenueUSD.",
    cumulativeVolumeUSD: "This field on 'Protocol' entity has a value lower than $10,000.",
    cumulativeUniqueUsers: "This field on 'Protocol' entity has a value lower than 100 or greater than 100,000,000 unique users.",
    totalPoolCount: "This field on 'Protocol' entity has less than 1 pool or more than 10,000 pools.",
    cumulativeUniqueDepositors: "'Protocol' entity has fewer cumulativeUniqueUsers than cumulativeUniqueDepositors.",
    cumulativeUniqueBorrowers: "This field on 'Protocol' entity has a fewer cumulativeUniqueUsers than cumulativeUniqueBorrowers.",
    cumulativeUniqueLiquidators: "This field on 'Protocol' entity has less cumulativeUniqueUsers than cumulativeUniqueLiquidators.",
    cumulativeUniqueLiquidatees: "This field on 'Protocol' entity has less cumulativeUniqueUsers than cumulativeUniqueLiquidatees.",
    openPositionCount: "This field on 'Protocol' entity has a value lower than 100 or greater than 1,000,000,000.",
    cumulativePositionCount: "'Protocol' entity has a lower openPositionCount than cumulativePositionCount.",
    totalDepositBalanceUSD: "This field on 'Protocol' entity has a value less than $10,000 or greater than $100,000,000,000.",
    cumulativeDepositUSD: "'Protocol' entity has a lower cumulativeDepositUSD than totalDepositBalanceUSD.",
    totalBorrowBalanceUSD: "'Protocol' entity has a lower totalDepositBalanceUSD than totalBorrowBalanceUSD.",
    cumulativeLiquidateUSD: "'Protocol' entity has a lower cumulativeBorrowUSD than cumulativeLiquidateUSD.",
};

export const poolErrorMessages = {
    totalValueLockedUSD: "The pools listed have a TVL below $0 or above $100,000,000,000.",
    cumulativeSupplySideRevenueUSD: "The pools listed have a cumulativeSupplySideRevenueUSD below $0 or above $10,000,000,000.",
    cumulativeProtocolSideRevenueUSD: "The pools listed have a cumulativeProtocolSideRevenueUSD below $0 or above $10,000,000,000.",
    cumulativeTotalRevenueUSD: "The pools listed have a cumulativeTotalRevenueUSD value unequal to the sum of cumulativeSupplySideRevenueUSD and cumulativeProtocolSideRevenueUSD.",
    cumulativeDepositUSD: "The pools listed have a cumulativeDepositUSD below $0.",
    cumulativeBorrowUSD: "The pools listed have a cumulativeBorrowUSD value above the cumulativeDepositUSD value.",
    cumulativeLiquidateUSD: "The pools listed have a cumulativeLiquidateUSD value above the cumulativeBorrowUSD value.",
    totalDepositBalanceUSD: "The pools listed have a totalDepositBalanceUSD below $0 or above $100,000,000,000.",
    totalBorrowBalanceUSD: "The pools listed have a totalBorrowBalanceUSD value above the totalDepositBalanceUSD value.",
    outputTokenSupply: "The pools listed have an outputTokenSupply value of zero or less.",
    outputTokenPriceUSD: "The pools listed have an outputTokenPriceUSD value below $0 or above $100,000",
    cumulativeVolumeUSD: "The pools listed have a cumulativeVolumeUSD value below $0 or above $10,000,000,000."
};

export const protocolErrors = {
    totalValueLockedUSD: [],
    cumulativeSupplySideRevenueUSD: [],
    cumulativeProtocolSideRevenueUSD: [],
    cumulativeTotalRevenueUSD: [],
    cumulativeVolumeUSD: [],
    cumulativeUniqueUsers: [],
    totalPoolCount: [],
    cumulativeUniqueDepositors: [],
    cumulativeUniqueBorrowers: [],
    cumulativeUniqueLiquidators: [],
    cumulativeUniqueLiquidatees: [],
    openPositionCount: [],
    cumulativePositionCount: [],
    totalDepositBalanceUSD: [],
    cumulativeDepositUSD: [],
    totalBorrowBalanceUSD: [],
    cumulativeLiquidateUSD: [],
};

export const errorsObj = {
    lending: {
        totalValueLockedUSD: [],
        cumulativeSupplySideRevenueUSD: [],
        cumulativeProtocolSideRevenueUSD: [],
        cumulativeTotalRevenueUSD: [],
        cumulativeDepositUSD: [],
        cumulativeBorrowUSD: [],
        cumulativeLiquidateUSD: [],
        totalBorrowBalanceUSD: [],
        totalDepositBalanceUSD: [],
        outputTokenSupply: [],
        outputTokenPriceUSD: [],
    },
    exchanges: {
        totalValueLockedUSD: [],
        cumulativeSupplySideRevenueUSD: [],
        cumulativeProtocolSideRevenueUSD: [],
        cumulativeTotalRevenueUSD: [],
        cumulativeDepositUSD: [],
        cumulativeVolumeUSD: [],
        outputTokenSupply: [],
        outputTokenPriceUSD: [],
    },
    vaults: {
        totalValueLockedUSD: [],
        cumulativeSupplySideRevenueUSD: [],
        cumulativeProtocolSideRevenueUSD: [],
        cumulativeTotalRevenueUSD: [],
        outputTokenSupply: [],
        outputTokenPriceUSD: [],
    }
};
