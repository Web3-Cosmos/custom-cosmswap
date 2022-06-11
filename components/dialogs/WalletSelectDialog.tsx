import React, { useRef, useState } from 'react'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useWallet } from '@/hooks/application/wallet/useWallet'

import {
  Card,
  Icon,
  Row,
  Col,
  Grid,
  Link,
  ResponsiveDialogDrawer,
  Input,
  Button,
  FadeInStable,
} from '@/components'

import { isInLocalhost } from '@/functions/judgers/isSSR'

export default function WalletSelectDialog() {
  const isWalletSelectShown = useAppSettings((s) => s.isWalletSelectShown)

  const { wallets } = useWallet()

  return (
    <ResponsiveDialogDrawer
      placement="from-top"
      open={isWalletSelectShown}
      onCloseTransitionEnd={() => useAppSettings.setState({ isWalletSelectShown: false })}
    >
      {({ close }) => <WalletSelectDialogContent close={close} wallets={wallets} />}
    </ResponsiveDialogDrawer>
  )
}

function WalletSelectDialogContent({
  close,
  wallets
}: {
  close(): void
  wallets: { adapter: { name: string }; readyState: string }[]
}) {
  const installedWallets = wallets
    .filter((w) => w.readyState === 'installed')
  const notInstalledWallets = wallets
    .filter((w) => w.readyState === 'notInstalled')

  const [isAllWalletShown, setIsAllWalletShown] = useState(false)
  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none max-h-screen w-[min(586px,100vw)] mobile:w-full mobile:h-screen border border-stack-4 bg-stack-2"
      size="lg"
      style={{ boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)' }}
    >
      {/* connect your wallet */}
      <Row className="items-center justify-between px-8 py-8">
        <div className="text-xl font-semibold text-primary">Connect your wallet</div>
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
          installedWallets.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        } grow`}
      >
        {installedWallets.map((wallet) => (
          <WalletSelectPanelItem key={wallet.adapter.name} wallet={wallet} onClick={close} available />
        ))}
      </Grid>

      {/* divider */}
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-3" />

      {/* not installed wallets */}
      <div className="flex-1 overflow-auto no-native-scrollbar">
        <FadeInStable show={isAllWalletShown}>
          <div className="overflow-auto no-native-scrollbar h-full" style={{ scrollbarGutter: 'always' }}>
            <Grid className="flex-1 px-8 justify-items-stretch mobile:px-6 pb-4 overflow-auto gap-x-6 gap-y-3 mobile:gap-2 grid-cols-2 mobile:grid-cols-[1fr,1fr]">
              {notInstalledWallets.map((wallet) => (
                <WalletSelectPanelItem
                  key={wallet.adapter.name}
                  wallet={wallet}
                  onClick={close}
                  available={wallet.readyState === 'notInstalled'}
                />
              ))}
            </Grid>
            {isInLocalhost && <SimulateWallet onClick={close} />}
          </div>
        </FadeInStable>
      </div>

      <Row
        className="mb-4 text-xm justify-center items-center clickable"
        onClick={() => setIsAllWalletShown((b) => !b)}
      >
        <div className="font-bold text-default">Show uninstalled wallets</div>
        <Icon className="mx-2" size="sm" heroIconName={isAllWalletShown ? 'chevron-up' : 'chevron-down'}></Icon>
      </Row>

      {/* <div className="py-4 text-center font-medium text-sm border-t-1.5 border-[rgba(171,196,255,0.2)]">
        New here?{' '}
        <Link href="https://raydium.gitbook.io/raydium/" className="text-[#abc4ff]">
          Get started on Raydium!
        </Link>
      </div> */}
    </Card>
  )
}

function WalletSelectPanelItem({
  wallet,
  available: detected,
  onClick
}: {
  wallet: { adapter: { name: string }; readyState: string }
  available?: boolean
  onClick?(): void
}) {
  const isMobile = useAppSettings((s) => s.isMobile)
  const { select } = useWallet()
  return (
    <Row
      className={`relative items-center gap-3 m-auto px-6 mobile:px-3 mobile:py-1.5 py-3 w-64 mobile:w-[42vw] h-14  mobile:h-12 rounded-xl mobile:rounded-lg ${
        detected ? 'opacity-100' : 'opacity-40'
      } clickable clickable-filter-effect bg-primary`}
      style={{
        background:
          'linear-gradient(162deg, hsl(0, 0%, 100%, 0.12) 28.7%, hsl(0, 0%, 100%, 0.12), hsl(0, 0%, 100%, 0))',
      }}
      // TODO disable status
      onClick={() => {
        select(wallet.adapter.name)
        onClick?.()
      }}
    >
      <Icon className="shrink-0" size={isMobile ? 'md' : 'lg'} src="/wallets/phantom.png" />
      <div className="mobile:text-sm text-base font-bold text-primary">{wallet.adapter.name}</div>
      {/* {installed && (
        <Badge
          noOutline
          colorType="green"
          className="absolute right-1 bottom-1 mobile:right-0 mobile:bottom-0 mobile:text-2xs opacity-80"
        >
          installed
        </Badge>
      )} */}
    </Row>
  )
}

function SimulateWallet({ onClick }: { onClick?(): void }) {
  const isMobile = useAppSettings((s) => s.isMobile)
  const { select } = useWallet()
  const valueRef = useRef('')
  return (
    <Col className="p-6 mobile:py-3 mobile:px-4 flex-grow ring-inset ring-2 mobile:ring-1 ring-primary rounded-3xl mobile:rounded-xl items-center gap-3 m-8 mt-2 mb-4">
      <div className="mobile:text-sm text-base font-bold text-primary">Simulate Wallet Address</div>
      <Input
        className="w-full text-lg text-primary"
        inputClassName="text-left mobile:text-sm font-medium"
        onUserInput={(value) => (valueRef.current = value)}
        onEnter={(value) => {
          if (value) {
            select(value)
            onClick?.()
          }
        }}
      />
      <Button
        onClick={() => {
          if (valueRef.current) {
            select(valueRef.current)
            onClick?.()
          }
        }}
      >
        Fake it 🤘
      </Button>
    </Col>
  )
}
