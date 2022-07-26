import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { useGetTokenDollarValueQuery } from '@/hooks/application/token/useGetTokenDollarValueQuery'

export type InternalQueryContext = {
  client: CosmWasmClient
  getTokenDollarValue: ReturnType<typeof useGetTokenDollarValueQuery>[0]
}
