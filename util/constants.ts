export const DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL = 15000
export const DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME = 60000 // 1 minute
export const SLIPPAGE_OPTIONS = [0.01, 0.02, 0.03, 0.05]
export const NETWORK_FEE = 0.003
// export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE
export const GAS_PRICE = '0.0025ujunox'

export const APP_NAME = process.env.NEXT_PUBLIC_SITE_TITLE
export const APP_MAX_WIDTH = '1920px'

export const POOL_TOKENS_DECIMALS = 6

export const CHAIN_INFO_URL = '/chain_info.testnet.json'
export const POOLS_LIST_URL = '/pools_list.testnet.json'
export const IBC_ASSETS_URL = '/ibc_assets.json'

/* the app operates in test mode */
export const __TEST_MODE__ = true

/* feature flags */
export const __POOL_STAKING_ENABLED__ = true
export const __POOL_REWARDS_ENABLED__ = true
export const __TRANSFERS_ENABLED__ = true
export const __DARK_MODE_ENABLED_BY_DEFAULT__ = false
/* /feature flags */
