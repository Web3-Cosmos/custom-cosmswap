import { useQuery } from 'react-query'
import {
  useBaseTokenInfo,
  useGetMultipleTokenInfo,
  useTokenInfo,
} from '@/hooks/application/token/useTokenInfo'
import { usePriceForOneToken } from '@/hooks/application/token/usePriceForOneToken'
import { tokenDollarValueQuery } from '@/hooks/application/token/tokenDollarValueQuery'
import { useGetMultipleIbcAssetInfo } from '@/hooks/application/token/useIbcAssetInfo'

import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '@/util/constants'

export const useTokenDollarValue = (tokenSymbol?: string) => {
  const { symbol: baseTokenSymbol } = useBaseTokenInfo() || {}
  const tokenInfo = useTokenInfo(tokenSymbol ?? '')

  const tokenSymbolToLookupDollarValueFor = tokenInfo?.id
    ? tokenSymbol
    : baseTokenSymbol

  const [[tokenDollarPrice], fetchingTokenDollarPrice] =
    useTokenDollarValueQuery(
      tokenSymbolToLookupDollarValueFor
        ? [tokenSymbolToLookupDollarValueFor]
        : undefined
    )

  const [oneTokenToTokenPrice, fetchingTokenToTokenPrice] = usePriceForOneToken(
    {
      tokenASymbol: tokenSymbol ?? '',
      tokenBSymbol: baseTokenSymbol ?? '',
    }
  )

  /* if the token has an id or it's the baseToken then let's return pure price from the api */
  const shouldRenderPureDollarPrice =
    tokenSymbol === baseTokenSymbol || Boolean(tokenInfo?.id)
  if (shouldRenderPureDollarPrice) {
    return [tokenDollarPrice, fetchingTokenDollarPrice] as const
  }

  /* otherwise, let's query the chain and calculate the dollar price based on ratio to base token */
  return [
    tokenDollarPrice * (oneTokenToTokenPrice ?? 0),
    fetchingTokenDollarPrice || fetchingTokenToTokenPrice,
  ] as const
}

export const useTokenDollarValueQuery = (tokenSymbols?: Array<string>) => {
  const getMultipleTokenInfo = useGetMultipleTokenInfo()
  const getMultipleIbcAssetInfo = useGetMultipleIbcAssetInfo()

  const { data, isLoading } = useQuery(
    `tokenDollarValue/${tokenSymbols?.join('/')}`,
    async (): Promise<Array<number> | undefined> => {
      const tokenIds = tokenSymbols?.map(
        (tokenSymbol) =>
          (
            getMultipleTokenInfo([tokenSymbol])?.[0] ||
            getMultipleIbcAssetInfo([tokenSymbol])?.[0]
          )?.id ?? ''
      )

      if (tokenIds) {
        return tokenDollarValueQuery(tokenIds)
      }
    },
    {
      enabled: Boolean(tokenSymbols?.length),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data || [], isLoading] as const
}
