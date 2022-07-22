import React, { ReactNode, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { Button, Row, WalletIcon, WalletConnectedIcon } from '@/components'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useToggle } from '@/hooks/general/useToggle'

import copyToClipboard from '@/functions/dom/copyToClipboard'

import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'

function WalletWidgetItem({
  text,
  suffix,
  prefix,
  onClick,
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
  const [{ key, address }, setWalletState] = useRecoilState(walletState)

  function resetWalletConnection() {
    setWalletState({
      status: WalletStatusType.idle,
      address: '',
      key: undefined,
      client: null,
      transactions: [],
    })
  }

  useEffect(() => {
    if (isCopied) delayOff()
  }, [delayOff, isCopied])

  return (
    <Row className="justify-end">
      {key?.name ? (
        <Button
          className="inline-flex items-center bg-stack-3 text-default"
          onClick={() => {
            resetWalletConnection()
            useAppSettings.setState({ isWalletSelectShown: false })
          }}
        >
          <div className="mr-2">
            <WalletConnectedIcon
              size="md"
              color={themeMode === 'light' ? '#4d4040' : '#ffb300'}
            />
          </div>
          {`${address?.slice(0, 4)}...${address?.slice(address.length - 4)}`}
        </Button>
      ) : (
        <Button
          className="inline-flex items-center bg-transparent text-default"
          onClick={() => useAppSettings.setState({ isWalletSelectShown: true })}
        >
          <div className="mr-2">
            <WalletIcon
              size="md"
              color={themeMode === 'light' ? '#4d4040' : '#ffb300'}
            />
          </div>
          CONNECT
        </Button>
      )}
    </Row>
  )
}
