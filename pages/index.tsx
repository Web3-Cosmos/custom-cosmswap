import React, { createRef, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { NextPage } from 'next'
import {
  Layout,
  CoinAvatar,
  CoinInputBox,
  CoinInputBoxHandle,
  RateInputBox,
  RequestHistory,
  Card,
  TokenSelectDialog,
  Row,
  Button,
  ButtonHandle,
  Icon,
  Tabs,
} from '@/components'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useToken } from '@/hooks/application/token/useToken'
import { useSwap } from '@/hooks/application/swap/useSwap'
import { useToggle } from '@/hooks/general/useToggle'
import { useSwapTwoElements } from '@/hooks/general/useSwapTwoElements'

import createContextStore from '@/functions/react/createContextStore'

import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

const { ContextProvider: SwapUIContextProvider, useStore: useSwapContextStore } = createContextStore({
  hasAcceptedPriceChange: false,
  coinInputBox1ComponentRef: createRef<CoinInputBoxHandle>(),
  coinInputBox2ComponentRef: createRef<CoinInputBoxHandle>(),
  swapButtonComponentRef: createRef<ButtonHandle>()
})

const Home: NextPage = () => {

  // const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, ],})
  // const { chainId, account, activate, active,library } = useWeb3React<Web3Provider>()

  return (
    <SwapUIContextProvider>
      <Swap />
    </SwapUIContextProvider>
  )
}

function Swap() {
  const swapElementBox1 = useRef<HTMLDivElement>(null)
  const swapElementBox2 = useRef<HTMLDivElement>(null)
  const [hasUISwapped, { toggleSwap: toggleUISwap }] = useSwapTwoElements(swapElementBox1, swapElementBox2, {
    defaultHasWrapped: false
  })

  const [isTokenSelectOn, { on: turnOnTokenSelect, off: turnOffTokenSelect }] = useToggle()

  const { isApprovePanelShown, isWalletSelectShown } = useAppSettings()
  // const isApprovePanelShown = useAppSettings((s) => s.isApprovePanelShown)

  const { hasAcceptedPriceChange, swapButtonComponentRef, coinInputBox1ComponentRef, coinInputBox2ComponentRef } = useSwapContextStore()

  const { coin1, coin2, directionReversed } = useSwap()
  const switchDirectionReversed = useCallback(() => {
    useSwap.setState(s => ({directionReversed: !s.directionReversed}))
  }, [])

  return (
    <Layout>
      <Card className="bg-stack-2 p-5 mb-4">
        {/* coin inputbox 1 */}
        <Card className="bg-stack-3 mb-5">
          <CoinInputBox
            domRef={swapElementBox1}
            componentRef={coinInputBox1ComponentRef}
            disabled={isApprovePanelShown}
            // disabledInput={directionReversed}
            haveHalfButton
            haveCoinIcon
            canSelect
            // topLeftLabel={hasUISwrapped ? 'To' : 'From'}
            onTryToTokenSelect={() => {
              turnOnTokenSelect()
              // setTargetCoinNo('1')
            }}
            // onEnter={(input) => {
            //   if (!input) return
            //   if (!coin2) coinInputBox2ComponentRef.current?.selectToken?.()
            //   if (coin2 && coin2Amount) swapButtonComponentRef.current?.click?.()
            // }}
            // token={coin1}
            // value={coin1Amount ? (eq(coin1Amount, 0) ? '' : toString(coin1Amount)) : undefined}
            // onUserInput={(value) => {
            //   useSwap.setState({ focusSide: 'coin1', coin1Amount: value })
            // }}
            topLeftLabel="Swap:"
          />
        </Card>

        {/* swap button */}
        <div className={`absolute top-[15rem] inset-x-0 flex justify-center ${isTokenSelectOn || isWalletSelectShown ? '' : 'z-10'}`}>
          <Icon
            size="lg"
            heroIconName="switch-vertical"
            className={`p-2 rounded-full bg-primary text-primary ${
              isApprovePanelShown ? 'not-clickable' : 'clickable'
            } select-none transition`}
            onClick={() => {
              if (isApprovePanelShown) return
              toggleUISwap()
              switchDirectionReversed()
            }}
          />
        </div>

        {/* rate inputbox */}
        <Card className="bg-stack-3 mb-5">
          <RateInputBox />
        </Card>

        {/* coin inputbox 2 */}
        <Card className="bg-stack-3 mb-5">
          <CoinInputBox
            domRef={swapElementBox2}
            componentRef={coinInputBox2ComponentRef}
            disabledInput
            haveHalfButton
            haveCoinIcon
            canSelect
            onTryToTokenSelect={() => {
              turnOnTokenSelect()
              // setTargetCoinNo('1')
            }}
            topLeftLabel="For:"
          />
        </Card>

        {/* transaction info */}
        <Card className="bg-stack-3 px-5 py-2 flex flex-col text-xs font-medium mb-5">
          <Row className="justify-between mb-1">
            <div className="text-primary">Current Price:</div>
            <div className="text-default">0.00000001 BNB per BANANA</div>
          </Row>
          <Row className="justify-between mb-1">
            <div className="text-primary">Required BANANA/BNB change:</div>
            <div className="text-default">31.089%</div>
          </Row>
          <Row className="justify-between">
            <div className="text-primary">Fee:</div>
            <div className="text-default">0.001BANANA</div>
          </Row>
        </Card>

        {/* place order button */}
        <Row className="justify-center">
          <Button className="px-20">PLACE ORDER</Button>
        </Row>
      </Card>

      {/* request history (open) */}
      <Card className="bg-stack-2 p-5 mb-5">
        <Card className="bg-stack-3 p-5">
          <Card className="bg-stack-4 p-3">
            <Tabs
              className="mb-5 w-full grid grid-cols-3"
              currentValue="OPEN"
              values={['OPEN', 'CLOSED', 'CANCELLED']}
              onChange={() => null}
            />
            <RequestHistory className="mb-5" />
            <RequestHistory className='mb-5' />
            <RequestHistory className='mb-5' />
            <RequestHistory />
          </Card>
        </Card>
      </Card>

      {/* request history (closed & cancelled) */}
      <Card className="px-5">
        <Card className="px-5 mb-2">
          <Card className="bg-stack-4 px-3 py-2 rounded-none">
            <RequestHistory />
          </Card>
        </Card>
        <Card className="px-5">
          <Card className="bg-stack-4 px-3 py-2 rounded-none">
            <RequestHistory />
          </Card>
        </Card>
      </Card>

      <TokenSelectDialog
        open={isTokenSelectOn}
        close={turnOffTokenSelect}
      />
    </Layout>
  )
}

export default Home
