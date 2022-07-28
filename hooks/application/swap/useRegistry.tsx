// @ts-nocheck
import { useTokenInfo } from '@/hooks/application/token/useTokenInfo'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { useRefetchQueries } from '@/hooks/application/token/useRefetchQueries'
import { useQueryMatchingPoolForSwap } from '@/hooks/application/chain-pool/useQueryMatchingPoolForSwap'
import { useNotification } from '@/hooks/application/notification/useNotification'
import {
  TransactionStatus,
  transactionStatusState,
} from '@/hooks/application/atoms/transactionAtoms'
import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'
import {
  slippageAtom,
  tokenSwapAtom,
} from '@/hooks/application/atoms/swapAtoms'

import {
  passThroughTokenSwap,
  registry,
  registryCancelRequests,
  registryRequests,
} from '@/services/swap'

import { convertDenomToMicroDenom } from '@/util/conversion'

type UseRegistryArgs = {
  tokenASymbol: string
  tokenBSymbol: string
  /* token amount in denom */
  tokenAmount: number
  tokenToTokenPrice: number
  type: string
}

type UseRegistryCancelArgs = {
  id: number
}

export const useRegistry = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount: providedTokenAmount,
  tokenToTokenPrice,
  type,
}: UseRegistryArgs) => {
  const [{ client, address, key, status }, setWalletState] =
    useRecoilState(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const slippage = useRecoilValue(slippageAtom)
  const setTokenSwap = useSetRecoilState(tokenSwapAtom)

  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)
  const [matchingPools] = useQueryMatchingPoolForSwap({ tokenA, tokenB })
  const refetchQueries = useRefetchQueries(['tokenBalance'])
  const { logSuccess, logError } = useNotification.getState()

  return useMutation(
    'registry',
    async () => {
      if (status !== WalletStatusType.connected) {
        throw new Error('Please connect your wallet.')
      }

      setTransactionState(TransactionStatus.EXECUTING)

      const tokenAmount = convertDenomToMicroDenom(
        providedTokenAmount,
        tokenA.decimals
      )

      const price = convertDenomToMicroDenom(tokenToTokenPrice, tokenB.decimals)

      const {
        streamlinePoolAB,
        streamlinePoolBA,
        baseTokenAPool,
        baseTokenBPool,
      } = matchingPools

      if (streamlinePoolAB || streamlinePoolBA) {
        const swapDirection = streamlinePoolAB?.swap_address
          ? 'tokenAtoTokenB'
          : 'tokenBtoTokenA'
        const swapAddress =
          streamlinePoolAB?.swap_address ?? streamlinePoolBA?.swap_address

        return await registry({
          tokenAmount,
          price,
          slippage,
          senderAddress: address,
          swapAddress,
          swapDirection,
          tokenA,
          tokenB,
          client,
          type,
        })
      }

      return await passThroughTokenSwap({
        tokenAmount,
        price,
        slippage,
        senderAddress: address,
        tokenA,
        swapAddress: baseTokenAPool.swap_address,
        outputSwapAddress: baseTokenBPool.swap_address,
        client,
      })
    },
    {
      async onSuccess() {
        logSuccess('SUCCESS', 'Transaction successful!')

        const refetchedTransactions = await registryRequests({
          client,
          senderAddress: address,
        })
        setWalletState({
          key,
          status,
          client,
          address,
          transactions: refetchedTransactions,
        })

        setTokenSwap(([tokenA, tokenB]) => [
          {
            ...tokenA,
            amount: 0,
          },
          tokenB,
          true,
        ])

        refetchQueries()
      },
      onError(e) {
        const errorMessage =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
                String(e).length - 150
              )}`
            : String(e)

        logError('ERROR', errorMessage)
      },
      onSettled() {
        setTransactionState(TransactionStatus.IDLE)
      },
    }
  )
}

export const useRegistryCancel = ({ id }: UseRegistryCancelArgs) => {
  const [{ client, address, key, status }, setWalletState] =
    useRecoilState(walletState)
  const setTransactionState = useSetRecoilState(transactionStatusState)
  const refetchQueries = useRefetchQueries(['tokenBalance'])
  const { logSuccess, logError, logWarning, logInfo } =
    useNotification.getState()

  return useMutation(
    'registry-cancel',
    async () => {
      if (status !== WalletStatusType.connected) {
        throw new Error('Please connect your wallet.')
      }

      setTransactionState(TransactionStatus.EXECUTING)

      return await registryCancelRequests({
        client,
        senderAddress: address,
        id,
      })
    },
    {
      async onSuccess() {
        logSuccess('SUCCESS', 'Transaction successful!')

        const refetchedTransactions = await registryRequests({
          client,
          senderAddress: address,
        })
        setWalletState({
          key,
          status,
          client,
          address,
          transactions: refetchedTransactions,
        })

        refetchQueries()
      },
      onError(e) {
        const errorMessage =
          String(e).length > 300
            ? `${String(e).substring(0, 150)} ... ${String(e).substring(
                String(e).length - 150
              )}`
            : String(e)

        logError('Error', errorMessage)
      },
      onSettled() {
        setTransactionState(TransactionStatus.IDLE)
      },
    }
  )
}
