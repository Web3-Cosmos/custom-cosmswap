import { useCallback } from 'react'
import { useSwapInfo } from '@/hooks/application/swap/useSwapInfo'
import { useTokenDollarValue } from '@/hooks/application/token/useTokenDollarValue'
import {
  PoolEntityType,
  usePoolFromListQueryById,
} from '@/hooks/application/chain-pool/usePoolsListQuery'
import { calcPoolTokenValue } from '@/util/conversion'

type UseGetPoolTokensDollarValueArgs = {
  poolId: PoolEntityType['pool_id']
}

export const useGetPoolTokensDollarValue = ({
  poolId,
}: UseGetPoolTokensDollarValueArgs) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const [tokenAPrice, isPriceLoading] = useTokenDollarValue(
    pool?.pool_assets[0].symbol
  )

  const enabled = pool && typeof tokenAPrice === 'number' && !isPriceLoading

  return [
    useCallback(
      function getPoolTokensDollarValue({
        swapInfo,
        tokenAmountInMicroDenom,
      }: any) {
        if (swapInfo) {
          return (
            calcPoolTokenValue({
              tokenAmountInMicroDenom,
              tokenSupply: swapInfo.lp_token_supply,
              tokenReserves: swapInfo.token1_reserve,
            }) *
            tokenAPrice *
            2
          )
        }
        return 0
      },
      [tokenAPrice]
    ),
    enabled,
  ] as const
}

type UsePoolTokensDollarValueArgs = {
  poolId: string
  tokenAmountInMicroDenom: number
}

export const usePoolTokensDollarValue = ({
  poolId,
  tokenAmountInMicroDenom,
}: UsePoolTokensDollarValueArgs) => {
  const [getPoolTokensDollarValue, enabled] = useGetPoolTokensDollarValue({
    poolId,
  })

  const [swapInfo, isLoading] = useSwapInfo({ poolId })

  if (swapInfo) {
    return [
      getPoolTokensDollarValue({ swapInfo, tokenAmountInMicroDenom }),
      isLoading || !enabled,
    ] as const
  }

  return [0, isLoading || !enabled] as const
}
