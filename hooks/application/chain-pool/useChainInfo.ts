import { ChainInfo } from '@keplr-wallet/types'
import { useQuery } from 'react-query'

import { queryClient } from '@/services/queryClient'
import { CHAIN_INFO_URL } from '@/util/constants'

const chainInfoQueryKey = '@chain-info'

export const unsafelyReadChainInfoCache = () =>
  queryClient.getQueryCache().find(chainInfoQueryKey)?.state?.data as
    | ChainInfo
    | undefined

export const useChainInfo = () => {
  const { data, isLoading } = useQuery<ChainInfo>(
    chainInfoQueryKey,
    async () => {
      const response = await fetch(CHAIN_INFO_URL!)
      return await response.json()
    },
    {
      onError(e) {
        console.error('Error loading chain info:', e)
      },
    }
  )

  return [data, isLoading] as const
}
