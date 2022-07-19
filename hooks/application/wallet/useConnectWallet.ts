// @ts-nocheck
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'
import { GAS_PRICE } from '@/util/constants'
import { useChainInfo } from '@/hooks/application/chain-pool/useChainInfo'
import { registryRequests } from '@/services/swap'

export const useConnectWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const [{ status }, setWalletState] = useRecoilState(walletState)
  const [chainInfo] = useChainInfo()

  const mutation = useMutation(async () => {
    if (window && !window?.keplr) {
      alert('Please install Keplr extension and refresh the page.')
      return
    }

    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      client: null,
      state: WalletStatusType.connecting,
    }))

    try {
      await window.keplr.experimentalSuggestChain(chainInfo)
      await window.keplr.enable(chainInfo.chainId)

      const offlineSigner = await window.getOfflineSignerAuto(chainInfo.chainId)

      const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
        chainInfo.rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE),
        }
      )

      const [{ address }] = await offlineSigner.getAccounts()
      const key = await window.keplr.getKey(chainInfo?.chainId)
      const transactions = await registryRequests({
        client: wasmChainClient,
        senderAddress: address,
      })

      /* successfully update the wallet state */
      setWalletState({
        key,
        address,
        client: wasmChainClient,
        status: WalletStatusType.connected,
        transactions: transactions,
      })
    } catch (e) {
      /* set the error state */
      setWalletState({
        key: undefined,
        address: '',
        client: null,
        status: WalletStatusType.error,
        transactions: [],
      })

      /* throw the error for the UI */
      throw e
    }
  }, mutationOptions)

  useEffect(
    function restoreWalletConnectionIfHadBeenConnectedBefore() {
      /* restore wallet connection if the state has been set with the */
      if (chainInfo?.rpc && status === WalletStatusType.restored) {
        mutation.mutate(null)
      }
    }, // eslint-disable-next-line
    [status, chainInfo?.rpc]
  )

  useEffect(
    function listenToWalletAddressChangeInKeplr() {
      function reconnectWallet() {
        if (status === WalletStatusType.connected) {
          mutation.mutate(null)
        }
      }

      window.addEventListener('keplr_keystorechange', reconnectWallet)
      return () => {
        window.removeEventListener('keplr_keystorechange', reconnectWallet)
      }
    },
    // eslint-disable-next-line
    [status]
  )

  return mutation
}
