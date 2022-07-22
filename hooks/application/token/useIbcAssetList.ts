import { useQuery } from 'react-query'
import { IBC_ASSET_URL } from '@/util/constants'

export type IbcAssetInfo = {
  id: string
  name: string
  symbol: string
  chain_id: string
  rpc: string
  denom: string
  decimals: number
  juno_denom: string
  juno_channel: string
  channel: string
  logoURI: string
  deposit_gas_fee?: number
  external_deposit_uri?: string
}

export type IbcAssetList = {
  tokens: Array<IbcAssetInfo>
}

export const useIbcAssetList = () => {
  const { data, isLoading } = useQuery<IbcAssetList>(
    '@ibc-asset-list',
    async () => {
      const response = await fetch(IBC_ASSET_URL!)
      return await response.json()
    },
    {
      onError(e) {
        console.error('Error loading ibc asset list:', e)
      },
      refetchOnMount: false,
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 60,
    }
  )

  return [data, isLoading] as const
}
