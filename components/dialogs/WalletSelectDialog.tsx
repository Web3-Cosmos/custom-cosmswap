import React, { useRef, useState } from 'react'

import {
  Card,
  Icon,
  Row,
  Col,
  Grid,
  ResponsiveDialogDrawer,
  Input,
  Button,
  Badge,
} from '@/components'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useConnectWallet } from '@/hooks/application/wallet/useConnectWallet'

export default function WalletSelectDialog() {
  const isWalletSelectShown = useAppSettings((s) => s.isWalletSelectShown)

  return (
    <ResponsiveDialogDrawer
      placement="from-top"
      open={isWalletSelectShown}
      onCloseTransitionEnd={() =>
        useAppSettings.setState({ isWalletSelectShown: false })
      }
    >
      {({ close }) => <WalletSelectDialogContent close={close} wallets={[1]} />}
    </ResponsiveDialogDrawer>
  )
}

function WalletSelectDialogContent({
  close,
  wallets,
}: {
  close(): void
  wallets: any
}) {
  function getWalletOptions() {
    return wallets.map((key: number, index: number) => {
      return (
        <WalletSelectPanelItem
          key="keplr_wallet"
          wallet={key}
          onClick={close}
          available
        />
      )
    })
  }

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none max-h-screen w-[min(586px,100vw)] mobile:w-full mobile:h-screen border border-stack-4 bg-stack-2"
      size="lg"
      style={{ boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)' }}
    >
      {/* connect your wallet */}
      <Row className="items-center justify-between px-8 py-8">
        <div className="text-xl font-semibold text-primary">
          Connect your wallet
        </div>
        <Icon
          className="text-primary cursor-pointer clickable clickable-mask-offset-2"
          heroIconName="x"
          onClick={close}
        />
      </Row>

      {/* divider */}
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 mb-3" />

      {/* installed wallets */}
      <Grid
        className={`px-8 mobile:px-6 gap-x-6 gap-y-3 mobile:gap-2 ${
          Object.keys(wallets).length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        } grow`}
      >
        {getWalletOptions()}
      </Grid>

      {/* divider */}
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-3" />
    </Card>
  )
}

function WalletSelectPanelItem({
  wallet,
  available: detected,
  onClick,
}: {
  wallet?: any
  available?: boolean
  onClick?(): void
}) {
  const isMobile = useAppSettings((s) => s.isMobile)

  const { mutate: connectWallet } = useConnectWallet()

  return (
    <Row
      className={`relative items-center gap-3 m-auto px-6 mobile:px-3 mobile:py-1.5 py-3 w-64 mobile:w-[42vw] h-14  mobile:h-12 rounded-xl mobile:rounded-lg ${
        detected ? 'opacity-100' : 'opacity-40'
      } clickable clickable-filter-effect bg-primary`}
      style={{
        background:
          'linear-gradient(162deg, hsl(0, 0%, 100%, 0.12) 28.7%, hsl(0, 0%, 100%, 0.12), hsl(0, 0%, 100%, 0))',
      }}
      onClick={() => {
        connectWallet(null)
        onClick?.()
      }}
    >
      <Icon
        className="shrink-0"
        size={isMobile ? 'md' : 'lg'}
        src="/wallets/keplr-icon.png"
      />
      {/* <div className="mobile:text-sm text-base font-bold text-primary">{wallet.adapter.name}</div> */}
      <div className="mobile:text-sm text-base font-bold text-primary">
        keplr Wallet
      </div>

      <Badge
        className="absolute right-1 bottom-1 mobile:right-0 mobile:bottom-0 mobile:text-2xs opacity-80 text-default"
        size="sm"
      >
        Installed
      </Badge>
    </Row>
  )
}

function SimulateWallet({ onClick }: { onClick?(): void }) {
  const isMobile = useAppSettings((s) => s.isMobile)
  const valueRef = useRef('')
  return (
    <Col className="p-6 mobile:py-3 mobile:px-4 flex-grow ring-inset ring-2 mobile:ring-1 ring-primary rounded-3xl mobile:rounded-xl items-center gap-3 m-8 mt-2 mb-4">
      <div className="mobile:text-sm text-base font-bold text-primary">
        Simulate Wallet Address
      </div>
      <Input
        className="w-full text-lg text-primary"
        inputClassName="text-left mobile:text-sm font-medium"
        onUserInput={(value) => (valueRef.current = value)}
        onEnter={(value) => {
          if (value) {
            // connect(value)
            onClick?.()
          }
        }}
      />
      <Button
        onClick={() => {
          if (valueRef.current) {
            // connect(valueRef.current)
            onClick?.()
          }
        }}
      >
        Fake it 🤘
      </Button>
    </Col>
  )
}
