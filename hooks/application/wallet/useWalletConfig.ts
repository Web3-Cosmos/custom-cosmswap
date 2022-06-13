import { useState, useEffect, useCallback } from 'react'

import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3Provider } from '@ethersproject/providers'

import { useWallet } from '@/hooks/application/wallet/useWallet'
import { injected as InjectedConnector } from '@/hooks/application/connector'
import { SUPPORTED_WALLETS } from '@/hooks/application/token/constants'

import { useIsomorphicLayoutEffect } from '@/hooks/general/useIsomorphicLayoutEffect'

export function useWalletConfig() {
  const { chainId, active, account, connector, activate, deactivate, error } = useWeb3React<Web3Provider>()

  const _connect = (connector: AbstractConnector | undefined) => {
    let name = ""
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })

    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector && activate(connector, undefined, true)
      .catch(err => {
        if (err instanceof UnsupportedChainIdError) {
          activate(connector) // a little janky...can't use setError because the connector isn't set
        } else {
          console.log(err)
        }
      })
  }

  useIsomorphicLayoutEffect(() => useWallet.setState({ connect: _connect }), [_connect])
  useIsomorphicLayoutEffect(() => useWallet.setState({ disconnect: deactivate }), [deactivate])
  useWallet.setState({
    account: account ?? '',
    connected: active,
    error,
  })
}