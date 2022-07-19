import React, {
  createRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { NextPage } from 'next'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  Layout,
  CoinAvatar,
  CoinInputBox,
  CoinInputBoxHandle,
  RateInputBox,
  Card,
  TokenSelectDialog,
  Row,
  Button,
  ButtonHandle,
  Icon,
  Tabs,
  PlaceOrderButton,
  TransactionsHistory,
} from '@/components'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useTokenList } from '@/hooks/application/token/useTokenList'
import { useTokenToTokenPrice } from '@/hooks/application/token/useTokenToTokenPrice'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import { useTxRates } from '@/hooks/application/transaction/useTxRates'
import { tokenSwapAtom } from '@/hooks/application/atoms/swapAtoms'
import {
  transactionStatusState,
  TransactionStatus,
} from '@/hooks/application/atoms/transactionAtoms'
import { useToggle } from '@/hooks/general/useToggle'
import { useSwapTwoElements } from '@/hooks/general/useSwapTwoElements'
import { usePersistance } from '@/hooks/general/usePersistance'

import createContextStore from '@/functions/react/createContextStore'

const {
  ContextProvider: SwapUIContextProvider,
  useStore: useSwapContextStore,
} = createContextStore({
  hasAcceptedPriceChange: false,
  coinInputBox1ComponentRef: createRef<CoinInputBoxHandle>(),
  coinInputBox2ComponentRef: createRef<CoinInputBoxHandle>(),
  swapButtonComponentRef: createRef<ButtonHandle>(),
})

const StopLoss: NextPage = () => {
  return (
    <SwapUIContextProvider>
      <Swap />
    </SwapUIContextProvider>
  )
}

function Swap() {
  // true - token A, false - token B
  const [targetToken, setTargetToken] = useState<boolean>(true)
  const [currentPrice, setCurrentPrice] = useState(0)
  const swapElementBox1 = useRef<HTMLDivElement>(null)
  const swapElementBox2 = useRef<HTMLDivElement>(null)
  const [hasUISwapped, { toggleSwap: toggleUISwap }] = useSwapTwoElements(
    swapElementBox1,
    swapElementBox2,
    {
      defaultHasWrapped: false,
    }
  )

  const [tokenList, isTokenListLoading] = useTokenList()
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)
  const transactionStatus = useRecoilValue(transactionStatusState)

  // fetch token list and set initial state
  useEffect(() => {
    const shouldSetDefaultTokenAState =
      !tokenA.tokenSymbol && !tokenB.tokenSymbol && tokenList
    if (shouldSetDefaultTokenAState) {
      setTokenSwapState([
        {
          tokenSymbol: tokenList.base_token.symbol,
          amount: tokenA.amount || 0,
        },
        tokenB,
        true,
      ])
    }
  }, [tokenList, tokenA, tokenB, setTokenSwapState])

  const [isTokenSelectOn, { on: turnOnTokenSelect, off: turnOffTokenSelect }] =
    useToggle()

  const isApprovePanelShown = useAppSettings((s) => s.isApprovePanelShown)

  const {
    hasAcceptedPriceChange,
    swapButtonComponentRef,
    coinInputBox1ComponentRef,
    coinInputBox2ComponentRef,
  } = useSwapContextStore()

  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING || isTokenListLoading

  // fetch token price to token price
  const [currentTokenPrice, currentTokenRate, isPriceLoading] =
    useTokenToTokenPrice({
      tokenASymbol: tokenA?.tokenSymbol ?? '',
      tokenBSymbol: tokenB?.tokenSymbol ?? '',
      tokenAmount: tokenA?.amount,
    })

  useEffect(() => {
    if (currentTokenRate) setCurrentPrice(currentTokenRate)
  }, [currentTokenRate])

  /* persist token price when querying a new one */
  const persistTokenPrice = usePersistance(
    isPriceLoading ? undefined : currentTokenPrice
  )
  const persistTokenRate = usePersistance(
    isPriceLoading ? undefined : currentTokenRate
  )
  const tokenPrice =
    (isPriceLoading ? persistTokenPrice : currentTokenPrice) || 0
  const tokenRate = (isPriceLoading ? persistTokenRate : currentTokenRate) || 0

  const handleSwapTokenPositions = () => {
    setTokenSwapState([
      tokenB ? { ...tokenB, amount: tokenPrice } : tokenB,
      tokenA ? { ...tokenA, amount: tokenB.amount } : tokenA,
      true,
    ])
  }

  const { balance: availableAmount } = useTokenBalance(tokenA.tokenSymbol ?? '')

  const { isShowing, conversionRate, conversionRateInDollar, dollarValue } =
    useTxRates({
      tokenASymbol: tokenA?.tokenSymbol ?? '',
      tokenBSymbol: tokenB?.tokenSymbol ?? '',
      tokenAAmount: 1,
      tokenToTokenPrice: tokenRate,
      isLoading: isPriceLoading,
    })

  const marketValue =
    tokenRate === 0 || currentPrice === 0
      ? null
      : tokenRate === currentPrice
      ? '0.00'
      : (((tokenRate - currentPrice) * 100) / tokenRate).toFixed(2)

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
            // topLeftLabel={hasUISwapped ? 'To' : 'From'}
            onTryToTokenSelect={() => {
              turnOnTokenSelect()
              setTargetToken(true)
            }}
            symbol={tokenA.tokenSymbol}
            amount={tokenA.amount}
            dollar={dollarValue}
            onUserInput={(updateTokenA) => {
              setTokenSwapState([updateTokenA, tokenB, true])
            }}
            topLeftLabel="Swap:"
          />
        </Card>

        {/* swap button */}
        <div className="absolute top-[15rem] inset-x-0 flex justify-center">
          <Icon
            size="lg"
            heroIconName="switch-vertical"
            className={`p-2 rounded-full bg-primary text-primary ${
              isApprovePanelShown ? 'not-clickable' : 'clickable'
            } select-none transition`}
            onClick={() => {
              if (isApprovePanelShown) return
              // toggleUISwap()
              handleSwapTokenPositions()
            }}
          />
        </div>

        {/* rate inputbox */}
        <Card className="bg-stack-3 mb-5">
          <RateInputBox
            rate={tokenRate}
            isPriceLoading={isPriceLoading}
            price={currentPrice}
            onPriceChange={setCurrentPrice}
          />
        </Card>

        {/* coin inputbox 2 */}
        <Card className="bg-stack-3 mb-5">
          <CoinInputBox
            domRef={swapElementBox2}
            componentRef={coinInputBox2ComponentRef}
            disabledInput
            onTryToTokenSelect={() => {
              turnOnTokenSelect()
              setTargetToken(false)
            }}
            symbol={tokenB.tokenSymbol}
            amount={currentPrice * tokenA.amount}
            onUserInput={(updateTokenB) => {
              setTokenSwapState([tokenA, updateTokenB, true])
            }}
            topLeftLabel="For:"
          />
        </Card>

        {/* transaction info */}
        <Card className="bg-stack-3 px-5 py-2 flex flex-col text-xs font-medium mb-5">
          <Row className="justify-between mb-1">
            <div className="text-primary">Current Price:</div>
            <div className="text-default">
              {tokenRate} {tokenB.tokenSymbol} per {tokenA.tokenSymbol}
            </div>
          </Row>
          {marketValue && (
            <Row className="justify-between mb-1">
              <div className="text-primary">
                Required {tokenA.tokenSymbol}/{tokenB.tokenSymbol} change:
              </div>
              <div className="text-default">
                {marketValue}% below market value
              </div>
            </Row>
          )}
        </Card>

        {/* place order button */}
        <Row className="justify-center">
          <PlaceOrderButton
            isPriceLoading={isPriceLoading}
            price={currentPrice * tokenA.amount}
            rate={tokenRate}
            currentPrice={currentPrice}
          />
        </Row>
      </Card>

      {/* request history (open) */}
      <Card className="bg-stack-2 p-5 mb-5">
        <Card className="bg-stack-3 p-5">
          <Card className="bg-stack-4 p-3">
            <TransactionsHistory />
          </Card>
        </Card>
      </Card>

      <TokenSelectDialog
        open={isTokenSelectOn}
        close={turnOffTokenSelect}
        tokens={tokenList?.tokens ?? []}
        onSelectToken={(tokenSymbol: string) => {
          if (targetToken) {
            setTokenSwapState([
              { tokenSymbol, amount: tokenA.amount },
              tokenB,
              true,
            ])
          } else {
            setTokenSwapState([
              tokenA,
              { tokenSymbol, amount: tokenB.amount },
              true,
            ])
          }
        }}
      />
    </Layout>
  )
}

export default StopLoss
