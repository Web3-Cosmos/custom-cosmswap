import React, { ReactNode, useEffect } from 'react'

import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import {
  Button,
  Icon,
  Row,
  FadeIn,
  WalletIcon,
  WalletConnectedIcon,
} from '@/components'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useNotification } from '@/hooks/application/notification/useNotification'
import { useToggle } from '@/hooks/general/useToggle'
import { useWallet } from '@/hooks/application/wallet/useWallet'

import copyToClipboard from '@/functions/dom/copyToClipboard'

function WalletWidgetItem({
  text,
  suffix,
  prefix,
  onClick
}: {
  text: string
  suffix?: ReactNode
  prefix?: ReactNode
  onClick?(): void
}) {
  return (
    <Row
      className="gap-3 py-4 px-6 border-[rgba(171,196,255,0.2)] cursor-pointer clickable clickable-filter-effect items-center"
      onClick={onClick}
    >
      {prefix}
      <div className="text-white text-sm whitespace-nowrap">{text}</div>
      {suffix}
    </Row>
  )
}

// used in layout
export default function WalletWidget() {
  const { isMobile, themeMode } = useAppSettings()

  const [isCopied, { delayOff, on }] = useToggle()

  const { chainId, active, connector, activate, deactivate } = useWeb3React<Web3Provider>()

  // const { logSuccess, logError, logWarning, logInfo } = useNotification.getState()

  useEffect(() => {
    if (isCopied) delayOff()
  }, [isCopied])

  // useEffect(() => {
  //   logSuccess('RPC Switch Success ', `new rpc: connected`)
  //   logError('ERROR', 'no RPC')
  //   logWarning('Warning', 'no RPC')
  //   logInfo('Info', 'no RPC')
  // }, [])

  const { account, disconnect, connected } = useWallet()

  return (
    <Row className="justify-end">
      {connected ? (
        <Button
          className="inline-flex items-center bg-stack-3"
          onClick={() => {
            disconnect()
            useAppSettings.setState({ isWalletSelectShown: false })
          }}
        >
          <div className="mr-2">
            <WalletConnectedIcon size="md" color={themeMode === 'light' ? '#4d4040' : '#ffffff'} />
          </div>
          {`${account?.slice(0, 4)}...${account?.slice(account.length - 4)}`}
        </Button>
      ) : (
        <Button
          className="inline-flex items-center bg-transparent"
          onClick={() => useAppSettings.setState({ isWalletSelectShown: true })}
        >
          <div className="mr-2">
            <WalletIcon size="md" color={themeMode === 'light' ? '#4d4040' : '#ffffff'} />
          </div>
          CONNECT
        </Button>
      )}
    </Row>
    // <PopoverDrawer
    //   canOpen={connected}
    //   alwaysPopper
    //   popupPlacement="bottom-right"
    //   renderPopoverContent={({ close: closePanel }) => (
    //     <>
    //       <div className="pt-3 -mb-1 mobile:mb-2 px-6 text-[rgba(171,196,255,0.5)] text-xs mobile:text-sm">
    //         CONNECTED WALLET
    //       </div>
    //       <div className="gap-3 divide-y-1.5">
    //         <FadeIn noOpenTransitation>
    //           {publicKey && (
    //             <WalletWidgetItem
    //               text={isCopied ? 'copied' : `${String(publicKey).slice(0, 7)}...${String(publicKey).slice(-7)}`}
    //               suffix={
    //                 !isCopied && <Icon size="sm" className="clickable text-[#ABC4FF]" heroIconName="clipboard-copy" />
    //               }
    //               onClick={() => {
    //                 if (!isCopied) copyToClipboard(String(publicKey)).then(on)
    //               }}
    //             />
    //           )}
    //         </FadeIn>
    //         <WalletWidgetItem
    //           prefix={<Icon size="sm" src="/icons/misc-recent-transactions.svg" />}
    //           text="Recent Transactions"
    //           onClick={() => {
    //             useAppSettings.setState({ isRecentTransactionDialogShown: true })
    //             closePanel?.()
    //           }}
    //         />
    //         <WalletWidgetItem
    //           prefix={<Icon size="sm" src="/icons/misc-disconnect-wallet.svg" />}
    //           text="Disconnect wallet"
    //           onClick={() => {
    //             disconnect()
    //             closePanel?.()
    //           }}
    //         />
    //       </div>
    //     </>
    //   )}
    // >
    //   {isMobile ? (
    //     <Button
    //       className="frosted-glass frosted-glass-teal rounded-lg p-2"
    //       onClick={() => {
    //         if (!publicKey) useAppSettings.setState({ isWalletSelectShown: true })
    //       }}
    //     >
    //       <Icon
    //         className="w-4 h-4"
    //         iconClassName="w-4 h-4"
    //         src={connected ? '/icons/msic-wallet-connected.svg' : '/icons/msic-wallet.svg'}
    //       />
    //     </Button>
    //   ) : (
    //     <Button
    //       className="frosted-glass frosted-glass-teal"
    //       onClick={() => {
    //         if (!publicKey) useAppSettings.setState({ isWalletSelectShown: true })
    //       }}
    //     >
    //       {connected ? (
    //         <Row className="items-center gap-3 my-0.5">
    //           <Icon size="sm" src="/icons/msic-wallet-connected.svg" />
    //           <div className="text-sm font-medium text-white">
    //             {String(publicKey).slice(0, 5)}...{String(publicKey).slice(-5)}
    //           </div>
    //         </Row>
    //       ) : (
    //         <Row className="items-center gap-3 my-0.5">
    //           <Icon size="sm" src="/icons/msic-wallet.svg" />
    //           <div className="text-sm font-medium text-[#39D0D8]">Connect Wallet</div>
    //         </Row>
    //       )}
    //     </Button>
    //   )}
    // </PopoverDrawer>
  )
}
