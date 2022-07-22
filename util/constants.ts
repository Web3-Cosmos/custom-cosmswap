import { Console } from 'console'

export const DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL = 15000
export const DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME = 60000 // 1 minute
export const SLIPPAGE_OPTIONS = [0.01, 0.02, 0.03, 0.05]
export const NETWORK_FEE = 0.003
// export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE
export const GAS_PRICE = process.env.NEXT_PUBLIC_GAS_PRICE

export const APP_NAME = process.env.NEXT_PUBLIC_SITE_TITLE
export const APP_MAX_WIDTH = '1920px'

export const POOL_TOKENS_DECIMALS = 6

/* blockchain */
export const TESTNET_MODE = JSON.parse(
  process.env.NEXT_PUBLIC_TESTNET_MODE ?? 'false'
)
export const CHAIN_INFO_URL = TESTNET_MODE
  ? process.env.NEXT_PUBLIC_CHAIN_INFO_TESTNET_URL
  : process.env.NEXT_PUBLIC_CHAIN_INFO_MAINNET_URL
export const POOLS_LIST_URL = TESTNET_MODE
  ? process.env.NEXT_PUBLIC_POOLS_LIST_TESTNET_URL
  : process.env.NEXT_PUBLIC_POOLS_LIST_MAINNET_URL
export const IBC_ASSET_URL = process.env.NEXT_PUBLIC_IBC_ASSETS_URL
export const REGISTRY_STAKE_ADDRESS = TESTNET_MODE
  ? process.env.NEXT_PUBLIC_TESTNET_REGISTRY_STAKE_ADDRESS
  : process.env.NEXT_PUBLIC_MAINNET_REGISTRY_STAKE_ADDRESS
export const WRAPPER_JUNO_SWAP_ADDRESS = TESTNET_MODE
  ? process.env.NEXT_PUBLIC_TESTNET_WRAPPER_JUNO_SWAP
  : process.env.NEXT_PUBLIC_MAINNET_WRAPPER_JUNO_SWAP
export const DENOM = TESTNET_MODE ? 'ujunox' : 'ujuno'
export const INFINITE = '340282366920938463463374607431768211455'
/* /blockchain */

/* feature flags */
export const __POOL_STAKING_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_STAKING ?? 'false'
)
export const __POOL_REWARDS_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_REWARDS ?? 'false'
)
export const __TRANSFERS_ENABLED__ = JSON.parse(
  process.env.NEXT_PUBLIC_ENABLE_FEATURE_TRANSFERS ?? 'false'
)
export const __DARK_MODE_ENABLED_BY_DEFAULT__ = JSON.parse(
  process.env.NEXT_PUBLIC_DARK_MODE_ENABLED_BY_DEFAULT ?? 'false'
)
/* /feature flags */
