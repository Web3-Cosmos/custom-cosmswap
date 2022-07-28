// @ts-nocheck
/*
 * takes base token price, fetches the ratio of the token provided vs the base token
 * and calculates the dollar value of the provided token
 * */
import { useCosmWasmClient } from '@/hooks/application/client/useCosmWasmClient'
import { useTokenDollarValue } from '@/hooks/application/token/useTokenDollarValue'
import { useBaseTokenInfo } from '@/hooks/application/token/useTokenInfo'
import { tokenToTokenPriceQueryWithPools } from '@/hooks/application/token/tokenToTokenPriceQuery'
import { useGetQueryMatchingPoolForSwap } from '@/hooks/application/chain-pool/useQueryMatchingPoolForSwap'

export const useGetTokenDollarValueQuery = () => {
  const tokenA = useBaseTokenInfo()
  const client = useCosmWasmClient()
  const [tokenADollarPrice, fetchingDollarPrice] = useTokenDollarValue(
    tokenA?.symbol
  )

  const [getMatchingPoolForSwap, isLoadingPoolForSwapMatcher] =
    useGetQueryMatchingPoolForSwap()

  return [
    async function getTokenDollarValue({ tokenInfo, tokenAmountInDenom }: any) {
      if (!tokenAmountInDenom) return 0

      const priceForOneToken = await tokenToTokenPriceQueryWithPools({
        matchingPools: getMatchingPoolForSwap({ tokenA, tokenB: tokenInfo }),
        tokenA,
        tokenB: tokenInfo,
        client,
        amount: 1,
      })

      return (tokenAmountInDenom / priceForOneToken) * tokenADollarPrice
    },
    Boolean(
      tokenA && client && !fetchingDollarPrice && !isLoadingPoolForSwapMatcher
    ),
  ] as const
}
