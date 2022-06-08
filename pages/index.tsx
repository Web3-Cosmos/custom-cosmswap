import React, { createRef, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { NextPage } from 'next'
import Layout from '@/components/layout'
import {
  CoinAvatar,
  CoinInputBox,
  RateInputBox,
  RequestHistory,
  Card,
} from '@/components'

const Home: NextPage = () => {

  const swapElementBox1 = useRef<HTMLDivElement>(null)
  const swapElementBox2 = useRef<HTMLDivElement>(null)

  return (
    <Layout>
      <CoinAvatar />
      <CoinInputBox
        domRef={swapElementBox1}
        // disabled={isApprovePanelShown}
        // disabledInput={directionReversed}
        // componentRef={coinInputBox1ComponentRef}
        haveHalfButton
        haveCoinIcon
        canSelect
        // topLeftLabel={hasUISwrapped ? 'To' : 'From'}
        // onTryToTokenSelect={() => {
        //   turnOnCoinSelector()
        //   setTargetCoinNo('1')
        // }}
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
        topLeftLabel='Swap:'
        className="mb-4"
      />
      <RateInputBox className="mb-4" />
      <CoinInputBox
        className="mb-4"
        domRef={swapElementBox2}
        disabledInput
        haveHalfButton
        haveCoinIcon
        canSelect
        topLeftLabel="For"
      />
      <Card className="bg-stack-2 p-5">
        <Card className="bg-stack-3 p-5">
          <Card className="bg-stack-4 p-5">
            <RequestHistory />
          </Card>
        </Card>
      </Card>
    </Layout>
  )
}

export default Home
