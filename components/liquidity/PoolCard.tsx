import Link from 'next/link'

import { Row, Col, Card, CoinAvatar } from '@/components'

import { PoolEntityType } from '@/hooks/application/chain-pool/usePoolsListQuery'
import {
  PoolState,
  PoolTokenValue,
} from '@/hooks/application/chain-pool/useQueryPools'
import { useTokenInfo } from '@/hooks/application/token/useTokenInfo'
import {
  formatCompactNumber,
  dollarValueFormatterWithDecimals,
} from '@/util/conversion/conversion'
import { __POOL_REWARDS_ENABLED__ } from '@/util/constants'

type PoolCardProps = {
  poolId: string
  providedTotalLiquidity: PoolTokenValue
  stakedLiquidity: PoolState
  availableLiquidity: PoolState
  tokenASymbol: string
  tokenBSymbol: string
  aprValue: number
  rewardsTokens?: PoolEntityType['rewards_tokens']
}

export const PoolCard = ({
  poolId,
  tokenASymbol,
  tokenBSymbol,
  providedTotalLiquidity,
  stakedLiquidity,
  availableLiquidity,
  rewardsTokens,
  aprValue,
}: PoolCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const hasProvidedLiquidity = Boolean(providedTotalLiquidity.tokenAmount)

  const stakedTokenBalanceDollarValue = stakedLiquidity.provided.dollarValue

  const providedLiquidityDollarValueFormatted = hasProvidedLiquidity
    ? formatCompactNumber(providedTotalLiquidity.dollarValue)
    : 0

  const totalDollarValueLiquidityFormatted = formatCompactNumber(
    availableLiquidity.total.dollarValue
  )

  return (
    <Link href={`/liquidity/${poolId}`}>
      <a>
        <Card className="shadow-xl rounded-xl mobile:rounded-none border border-stack-4 bg-stack-2 p-2">
          <Row className="justify-center">
            <CoinAvatar src={tokenA?.logoURI} />
            <CoinAvatar src={tokenB?.logoURI} />
          </Row>
          <Row className="justify-center">
            {tokenA?.symbol} {tokenB?.symbol}
          </Row>
          <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-2" />
          <Col>
            <div className="text-secondary text-xs">Total Liquidity</div>
            <div className="text-primary text-xs">
              {hasProvidedLiquidity
                ? `${providedLiquidityDollarValueFormatted} of $${totalDollarValueLiquidityFormatted}`
                : `$${totalDollarValueLiquidityFormatted}`}
            </div>
          </Col>
          <Row className="justify-between mt-3">
            <Col className="items-start">
              <div className="text-secondary text-xs">Bonded</div>
              <div className="text-primary text-xs">
                {hasProvidedLiquidity &&
                typeof stakedTokenBalanceDollarValue === 'number'
                  ? `$${formatCompactNumber(stakedTokenBalanceDollarValue)}`
                  : '--'}
              </div>
            </Col>
            {__POOL_REWARDS_ENABLED__ && Boolean(rewardsTokens?.length) && (
              <Col>
                <div className="text-secondary text-xs">Rewards</div>
                <Row className="justify-center">
                  {rewardsTokens?.map((token) => (
                    <CoinAvatar
                      key={token.symbol}
                      src={token.logoURI}
                      size="xs"
                    />
                  ))}
                </Row>
              </Col>
            )}
            <Col className="items-end">
              <div className="text-secondary text-xs">APR</div>
              <div className="text-primary text-xs">
                {dollarValueFormatterWithDecimals(aprValue ?? 0)}%
              </div>
            </Col>
          </Row>
        </Card>
      </a>
    </Link>
  )
}
