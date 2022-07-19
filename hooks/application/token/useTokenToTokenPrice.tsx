import { useQuery } from 'react-query'
import { useTokenInfo } from '@/hooks/application/token/useTokenInfo'
import { useQueryMatchingPoolForSwap } from '@/hooks/application/chain-pool/useQueryMatchingPoolForSwap'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '@/util/constants'

import { useCosmWasmClient } from '@/hooks/application/client/useCosmWasmClient'
import { tokenToTokenPriceQueryWithPools } from '@/hooks/application/token/tokenToTokenPriceQuery'
import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'

type UseTokenPairsPricesArgs = {
  tokenASymbol: TokenInfo['symbol']
  tokenBSymbol: TokenInfo['symbol']
  tokenAmount: number
  enabled?: boolean
  refetchInBackground?: boolean
}

export const useTokenToTokenPriceQuery = ({
  tokenAmount,
  tokenASymbol,
  tokenBSymbol,
  enabled = true,
  refetchInBackground,
}: UseTokenPairsPricesArgs) => {
  const client = useCosmWasmClient()

  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  // @ts-ignore
  const [matchingPools] = useQueryMatchingPoolForSwap({ tokenA, tokenB })

  return useQuery({
    queryKey: [
      `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
      tokenAmount,
    ],
    async queryFn() {
      if (tokenA && tokenB && matchingPools) {
        const price = await tokenToTokenPriceQueryWithPools({
          matchingPools,
          tokenA,
          tokenB,
          // @ts-ignore
          client,
          amount: tokenAmount,
        })
        const rate = await tokenToTokenPriceQueryWithPools({
          matchingPools,
          tokenA,
          tokenB,
          // @ts-ignore
          client,
          amount: 1,
        })
        return { price, rate }
      }
    },
    enabled: Boolean(
      enabled &&
        client &&
        matchingPools &&
        tokenA &&
        tokenB &&
        tokenAmount > 0 &&
        tokenBSymbol !== tokenASymbol
    ),
    refetchOnMount: 'always' as const,
    refetchInterval: refetchInBackground
      ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
      : undefined,
    refetchIntervalInBackground: Boolean(refetchInBackground),
  })
}

export const useTokenToTokenPrice = (args: UseTokenPairsPricesArgs) => {
  const { data, isLoading } = useTokenToTokenPriceQuery(args)
  if (data) {
    return [data.price, data.rate, isLoading] as const
  }
  return [undefined, undefined, isLoading] as const
}
