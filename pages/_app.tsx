import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import NextNProgress from 'nextjs-progressbar'

import { RecoilRoot } from 'recoil'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { queryClient } from '@/services/queryClient'

import { WalletSelectDialog, Notification, TestnetDialog } from '@/components'

import {
  useThemeModeSync,
  useDeviceInfoSync,
  useTestnetModeSync,
} from '@/hooks/application/appSettings/initializationHooks'

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
          <meta name="description" content="Autonomy Cosmswap" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* initialization hooks */}
        <ClientInitialization />
        {pathname !== '/' && <ApplicationInitialization />}

        <NextNProgress />

        {/* page components */}
        <Component {...pageProps} />

        {/* global components */}
        <WalletSelectDialog />
        <TestnetDialog />
        <Notification />

        {/* React Query Devtools */}
        <ReactQueryDevtools position="bottom-right" />
      </QueryClientProvider>
    </RecoilRoot>
  )
}

function ClientInitialization() {
  useThemeModeSync()
  useDeviceInfoSync()
  useTestnetModeSync()
  return null
}

function ApplicationInitialization() {
  return null
}

export default MyApp
