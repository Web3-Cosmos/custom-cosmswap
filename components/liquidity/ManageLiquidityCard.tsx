import React from 'react'

import { Card, Row, Col, CoinAvatar, Tooltip, Icon, Button } from '@/components'

import { useTokenInfo } from '@/hooks/application/token/useTokenInfo'
import {
  PoolState,
  PoolTokenValue,
  ReserveType,
} from '@/hooks/application/chain-pool/useQueryPools'
import { useTokenDollarValue } from '@/hooks/application/token/useTokenDollarValue'
import { useSubscribeInteractions } from '@/hooks/general/useSubscribeInteractions'

import {
  convertMicroDenomToDenom,
  dollarValueFormatterWithDecimals,
  protectAgainstNaN,
  formatTokenBalance,
} from '@/util/conversion'

type ManageLiquidityCardProps = {
  stakedLiquidity: PoolState
  providedLiquidity: PoolTokenValue
  providedTotalLiquidity: PoolTokenValue
  providedLiquidityReserve: ReserveType
  stakedLiquidityReserve: ReserveType
  onClick: () => void
  tokenASymbol: string
  tokenBSymbol: string
  supportsIncentives?: boolean
}

export const ManageLiquidityCard = ({
  onClick,
  providedLiquidityReserve,
  stakedLiquidityReserve,
  providedTotalLiquidity,
  providedLiquidity,
  stakedLiquidity,
  tokenASymbol,
  tokenBSymbol,
  supportsIncentives,
}: ManageLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const didBondLiquidity = stakedLiquidity?.provided.tokenAmount > 0
  const didProvideLiquidity =
    providedLiquidityReserve?.[0] > 0 || didBondLiquidity

  const tokenAReserve = convertMicroDenomToDenom(
    providedLiquidityReserve?.[0] + stakedLiquidityReserve?.[0],
    // @ts-ignore
    tokenA.decimals
  )

  const tokenBReserve = convertMicroDenomToDenom(
    providedLiquidityReserve?.[1] + stakedLiquidityReserve?.[1],
    // @ts-ignore
    tokenB.decimals
  )

  const providedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(providedTotalLiquidity?.dollarValue) || '0.00',
    { includeCommaSeparation: true }
  )

  return (
    <Card className="bg-stack-3 p-4 flex flex-col justify-between">
      <Col className="gap-1">
        <div className="text-secondary text-xs font-bold">Your Liquidity</div>
        <div className="text-primary text-lg font-semibold">
          ${providedLiquidityDollarValue}
        </div>
        <div className="text-disabled text-xs">
          $
          {dollarValueFormatterWithDecimals(providedLiquidity?.dollarValue, {
            includeCommaSeparation: true,
          })}{' '}
          available
          {supportsIncentives ? ' to bond' : ''}
        </div>
      </Col>

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-4" />

      <Col className="gap-1">
        <div className="text-secondary text-xs font-bold">
          Underlying Assets
        </div>
        <UnderlyingAssetRow
          tokenSymbol={tokenA?.symbol ?? ''}
          tokenAmount={tokenAReserve}
        />
        <UnderlyingAssetRow
          tokenSymbol={tokenB?.symbol ?? ''}
          tokenAmount={tokenBReserve}
        />
      </Col>

      <Button type="solid" size="sm" onClick={onClick} className="mt-8">
        {didProvideLiquidity ? 'Manage Liquidity' : 'Add Liquidity'}
      </Button>
    </Card>
  )
}

export const UnderlyingAssetRow = ({
  tokenSymbol,
  tokenAmount,
  visible = true,
}: {
  tokenSymbol: string
  tokenAmount: number
  visible?: boolean
}) => {
  // @ts-ignore
  const token = useTokenInfo(visible ? tokenSymbol : undefined)
  const [tokenDollarValue] = useTokenDollarValue(
    visible ? tokenSymbol : undefined
  )

  const tokenAmountDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(tokenAmount * tokenDollarValue),
    { includeCommaSeparation: true }
  )

  const RenderTooltip: React.FC<any> = () => (
    <div className="text-secondary">{`≈ $${tokenAmountDollarValue} USD`}</div>
  )

  return (
    <Row className="gap-1 justify-between">
      <Row className="gap-1 items-center">
        <CoinAvatar src={token?.logoURI} />
        <div className="text-primary text-xs">{tokenSymbol}</div>
      </Row>
      <Row className="gap-1">
        <Row className="gap-1 items-center">
          <div className="text-disabled text-xs">
            {formatTokenBalance(tokenAmount, { includeCommaSeparation: true })}
          </div>
          <div className="text-primary text-xs">{tokenSymbol}</div>
          <Tooltip className="bg-stack-4" tooltip={<RenderTooltip />}>
            <Icon
              size="md"
              heroIconName="exclamation-circle"
              className="text-primary"
            />
          </Tooltip>
        </Row>
      </Row>
    </Row>
  )
}
