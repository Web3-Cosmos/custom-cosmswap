import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'

import { useRefetchQueries } from '@/hooks/application/token/useRefetchQueries'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import { useSwapInfo } from '@/hooks/application/swap/useSwapInfo'
import { PoolEntityTypeWithLiquidity } from '@/hooks/application/chain-pool/useQueryPools'
import { useNotification } from '@/hooks/application/notification/useNotification'
import { walletState } from '@/hooks/application/atoms/walletAtoms'

import {
  executeAddLiquidity,
  executeRemoveLiquidity,
} from '@/services/liquidity'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from '@/util/conversion'

type UsePoolDialogControllerArgs = {
  /* value from 0 to 1 */
  percentage: number
  actionState: 'add' | 'remove'
  pool: PoolEntityTypeWithLiquidity
}

export const usePoolDialogController = ({
  actionState,
  percentage,
  pool,
}: UsePoolDialogControllerArgs) => {
  const {
    liquidity,
    pool_assets: [tokenA, tokenB],
  } = pool || { pool_assets: [] }

  const { balance: tokenABalance } = useTokenBalance(tokenA.symbol)
  const { balance: tokenBBalance } = useTokenBalance(tokenB.symbol)

  function calculateMaxApplicableBalances() {
    // Decimal converted reserves
    const tokenAReserve = convertMicroDenomToDenom(
      liquidity?.reserves?.total[0],
      tokenA.decimals
    )
    const tokenBReserve = convertMicroDenomToDenom(
      liquidity?.reserves?.total[1],
      tokenB.decimals
    )

    // TODO: Make slippage configurable
    const slippage = 0.99
    const tokenAToTokenBRatio = (tokenAReserve * slippage) / tokenBReserve
    const tokenABalanceMinusGasFee = Math.max(tokenABalance - 0.1, 0)

    const isTokenALimitingFactor =
      tokenABalance < tokenBBalance * tokenAToTokenBRatio

    if (isTokenALimitingFactor) {
      return {
        tokenA: tokenABalanceMinusGasFee,
        tokenB: Math.min(
          tokenABalanceMinusGasFee / tokenAToTokenBRatio,
          tokenBBalance
        ),
      }
    }

    return {
      tokenA: Math.min(tokenBBalance * tokenAToTokenBRatio, tokenABalance),
      tokenB: tokenBBalance,
    }
  }

  const {
    tokenA: maxApplicableBalanceForTokenA,
    tokenB: maxApplicableBalanceForTokenB,
  } = calculateMaxApplicableBalances()

  const tokenAReserve = liquidity.reserves?.provided[0]
    ? convertMicroDenomToDenom(liquidity.reserves?.provided[0], tokenA.decimals)
    : 0
  const tokenBReserve = liquidity.reserves?.provided[1]
    ? convertMicroDenomToDenom(liquidity.reserves?.provided[1], tokenB.decimals)
    : 0

  const { isLoading, mutate: mutateAddLiquidity } = useMutateLiquidity({
    pool,
    actionState,
    percentage,
    tokenA,
    tokenB,
    maxApplicableBalanceForTokenA,
    maxApplicableBalanceForTokenB,
    providedLiquidity: liquidity?.available?.provided,
  })

  return {
    state: {
      providedLiquidity: liquidity?.available?.provided,
      providedLiquidityReserve: liquidity?.reserves?.provided,
      tokenAReserve,
      tokenBReserve,
      isLoading,
      tokenASymbol: tokenA.symbol,
      tokenABalance: tokenABalance,
      tokenBBalance,
      maxApplicableBalanceForTokenA,
      maxApplicableBalanceForTokenB,
    },
    actions: {
      mutateAddLiquidity,
    },
  }
}

const useMutateLiquidity = ({
  pool,
  percentage,
  maxApplicableBalanceForTokenA,
  maxApplicableBalanceForTokenB,
  tokenA,
  tokenB,
  actionState,
  providedLiquidity,
}: any) => {
  const { address, client } = useRecoilValue(walletState)
  const refetchQueries = useRefetchQueries(['tokenBalance', 'myLiquidity'])

  const [swap] = useSwapInfo({
    poolId: pool.pool_id,
  })

  const { logSuccess, logError } = useNotification()

  const mutation = useMutation(
    async () => {
      // @ts-ignore
      const { lp_token_address } = swap

      const tokenAAmount = percentage * maxApplicableBalanceForTokenA
      const tokenBAmount = percentage * maxApplicableBalanceForTokenB

      if (actionState === 'add') {
        return executeAddLiquidity({
          tokenA,
          tokenB,
          tokenAAmount: Math.floor(
            convertDenomToMicroDenom(tokenAAmount, tokenA.decimals)
          ),
          maxTokenBAmount: Math.ceil(
            convertDenomToMicroDenom(tokenBAmount, tokenB.decimals)
          ),
          swapAddress: pool.swap_address,
          senderAddress: address,
          // @ts-ignore
          client,
        })
      } else {
        return executeRemoveLiquidity({
          tokenAmount: Math.floor(percentage * providedLiquidity.tokenAmount),
          swapAddress: pool.swap_address,
          senderAddress: address,
          lpTokenAddress: lp_token_address,
          // @ts-ignore
          client,
        })
      }
    },
    {
      onSuccess() {
        logSuccess(
          'SUCCESS',
          `${actionState === 'add' ? 'Add' : 'Remove'} Successful`
        )

        refetchQueries()
        setTimeout(mutation.reset, 350)
      },
      onError(e) {
        console.error(e)
        logError(
          'ERROR',
          `Couldn't ${actionState === 'add' ? 'Add' : 'Remove'} liquidity`
        )
      },
    }
  )

  return mutation
}
