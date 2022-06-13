import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar'
import { Web3Provider } from '@ethersproject/providers'

import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'

import { WalletSelectDialog } from '@/components'

import { useThemeModeSync, useDeviceInfoSync } from '@/hooks/application/appSettings/initializationHooks'
import { useTokenLists } from '@/hooks/application/token/useTokenLists'


// const Web3ProviderNetwork = typeof window !== "undefined" ? createWeb3ReactRoot('NETWORK') : null

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 15000
  return library
}

function MyApp({ Component, pageProps }: AppProps) {

  const { pathname } = useRouter()

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div>
        {/* initialization hooks */}
        <ClientInitialization />
        {/* {pathname !== '/' && <ApplicationInitialization />} */}
        <ApplicationInitialization />

        <NextNProgress  />

        {/* page components */}
        <Component {...pageProps} />

        {/* global components */}
        <WalletSelectDialog />
      </div>
    </Web3ReactProvider>
  )
}

function ClientInitialization() {
  useThemeModeSync()
  useDeviceInfoSync()
  return null
}

function ApplicationInitialization() {
  useTokenLists()
  return null
}

export default MyApp
