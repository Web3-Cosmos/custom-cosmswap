import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import {
  Card,
  Row,
  Col,
  Grid,
  Button,
  CoinAvatar,
  Tooltip,
  Icon,
  ArrowUpIcon,
} from '@/components'

import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'
import { PoolTokenValue } from '@/hooks/application/chain-pool/useQueryPools'
import { useTokenToTokenPrice } from '@/hooks/application/token/useTokenToTokenPrice'
import { usePoolPairTokenAmount } from '@/hooks/application/chain-pool/usePoolPairTokenAmount'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

import { SerializedRewardsContract } from '@/services/liquidity/queryRewardsContracts'

import {
  formatCompactNumber,
  formatTokenBalance,
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from '@/util/conversion'
import {
  __POOL_REWARDS_ENABLED__,
  __POOL_STAKING_ENABLED__,
} from '@/util/constants'

type LiquidityBreakdownProps = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  poolId: string
  totalLiquidity: PoolTokenValue
  yieldPercentageReturn: number
  rewardsContracts: Array<SerializedRewardsContract>
  size?: 'sm' | 'lg'
}

export const LiquidityBreakdown = ({
  tokenA,
  tokenB,
  poolId,
  totalLiquidity,
  yieldPercentageReturn,
  rewardsContracts,
  size = 'lg',
}: LiquidityBreakdownProps) => {
  const { themeMode } = useAppSettings()

  const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.symbol,
    tokenBSymbol: tokenB?.symbol,
    tokenAmount: 1,
  })

  const [tokenAAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: totalLiquidity?.tokenAmount ?? 0,
    tokenPairIndex: 0,
    poolId,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: totalLiquidity?.tokenAmount ?? 0,
    tokenPairIndex: 1,
    poolId,
  })

  const compactTokenAAmount = formatCompactNumber(tokenAAmount, 'tokenAmount')
  const compactTokenBAmount = formatCompactNumber(tokenBAmount, 'tokenAmount')
  const compactTotalLiquidity = formatCompactNumber(totalLiquidity?.dollarValue)

  const formattedTokenAAmount = formatTokenBalance(tokenAAmount, {
    includeCommaSeparation: true,
  })
  const formattedTokenBAmount = formatTokenBalance(tokenBAmount, {
    includeCommaSeparation: true,
  })
  const formattedTotalLiquidity = dollarValueFormatterWithDecimals(
    totalLiquidity?.dollarValue,
    { includeCommaSeparation: true }
  )

  const formattedYieldPercentageReturn = dollarValueFormatter(
    yieldPercentageReturn ?? 0
  )

  const priceBreakdown = isPriceLoading
    ? ''
    : `1 ${tokenA.symbol} = ${tokenPrice} ${tokenB.symbol}`

  const RenderTooltip: React.FC<any> = ({ text }) => (
    <div className="text-secondary">{text}</div>
  )

  return (
    <>
      <Row className="justify-between items-center my-4">
        <Row>
          <div className="text-primary text-md mr-8">Pool #{poolId}</div>
          <CoinAvatar src={tokenA.logoURI} size="md" className="mr-2" />
          <CoinAvatar src={tokenB.logoURI} size="md" />
        </Row>
        <div className="text-primary text-md">${priceBreakdown}</div>
      </Row>

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4" />

      <TotalInfoRow className="my-4 gap-8">
        <Col>
          <div className="text-secondary font-bold text-xs my-2">
            Total Liquidity
          </div>
          <Row>
            <div className="text-primary text-sm mr-2">
              ${compactTotalLiquidity}
            </div>
            <Tooltip
              className="bg-stack-4"
              tooltip={<RenderTooltip text={`$${formattedTotalLiquidity}`} />}
            >
              <Icon
                size="md"
                heroIconName="exclamation-circle"
                className="text-primary"
              />
            </Tooltip>
          </Row>
        </Col>
        <Col>
          <div className="text-secondary font-bold text-xs my-2">
            {tokenA.symbol}
          </div>
          <Row>
            <div className="text-primary text-sm mr-2">
              {compactTokenAAmount} ${tokenA.symbol}
            </div>
            <Tooltip
              className="bg-stack-4"
              tooltip={
                <RenderTooltip
                  text={`${formattedTokenAAmount} $${tokenA?.symbol}`}
                />
              }
            >
              <Icon
                size="md"
                heroIconName="exclamation-circle"
                className="text-primary"
              />
            </Tooltip>
          </Row>
        </Col>
        <Col>
          <div className="text-secondary font-bold text-xs my-2">
            {tokenB.symbol}
          </div>
          <Row>
            <div className="text-primary text-sm mr-2">
              {compactTokenBAmount} ${tokenB.symbol}
            </div>
            <Tooltip
              className="bg-stack-4"
              tooltip={
                <RenderTooltip
                  text={`${formattedTokenBAmount} $${tokenB?.symbol}`}
                />
              }
            >
              <Icon
                size="md"
                heroIconName="exclamation-circle"
                className="text-primary"
              />
            </Tooltip>
          </Row>
        </Col>
        {__POOL_REWARDS_ENABLED__ && (
          <Col>
            <div className="text-secondary font-bold text-xs my-2 text-center">
              Token Reward
            </div>
            <Row className="justify-center">
              {rewardsContracts.map(({ tokenInfo }) => (
                <CoinAvatar
                  key={tokenInfo.symbol}
                  src={tokenInfo.logoURI}
                  size="md"
                />
              ))}
            </Row>
          </Col>
        )}
        <Col>
          <div className="text-secondary font-bold text-xs my-2 text-center">
            APR Reward
          </div>
          <div className="inline-flex p-0.5 rounded-3xl bg-stack-4 justify-center items-center">
            <div className="rotate-45">
              <ArrowUpIcon
                color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
              />
            </div>
            <div className="text-primary text-xs">
              {formattedYieldPercentageReturn} $APR
            </div>
          </div>
        </Col>
      </TotalInfoRow>
    </>
  )
}

function TotalInfoRow({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  if (__POOL_STAKING_ENABLED__ && __POOL_REWARDS_ENABLED__) {
    return (
      <Grid className={twMerge('grid-cols-[1fr_1fr_1fr_1fr_1fr]', className)}>
        {children}
      </Grid>
    )
  }

  return <Row className="space-between">{children}</Row>
}
