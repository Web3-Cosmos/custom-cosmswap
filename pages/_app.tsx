import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import NextNProgress from 'nextjs-progressbar'

import {
  useThemeModeSync,
  useDeviceInfoSync,
} from '@/hooks/application/appSettings/initializationHooks'

function MyApp({ Component, pageProps }: AppProps) {

  const { pathname } = useRouter()

  return (
    <div>
      {/* initialization hooks */}
      <ClientInitialization />
      {pathname !== '/' && <ApplicationInitialization />}

      <NextNProgress  />

      {/* page components */}
      <Component {...pageProps} />

      {/* global components */}
    </div>
  )
}

function ClientInitialization() {
  useThemeModeSync()
  useDeviceInfoSync()
  return null
}

function ApplicationInitialization() {
  return null
}

export default MyApp
