import { useMemo } from 'react'
import {
  ArrowUpIcon,
  Button,
  Card,
  StepIcon,
  UnderlyingAssetRow,
  Row,
  Col,
  Icon,
} from '@/components'

import { dollarValueFormatterWithDecimals } from '@/util/conversion'

export const LiquidityRewardsCard = ({
  pendingRewards,
  hasProvidedLiquidity,
  hasBondedLiquidity,
  onClick,
  loading,
  supportsIncentives,
}: any) => {
  const pendingRewardsDollarValue = useMemo(() => {
    return (
      pendingRewards?.reduce(
        (value: any, item: { dollarValue: any }) =>
          (item?.dollarValue ?? 0) + value,
        0
      ) ?? 0
    )
  }, [pendingRewards])

  const [pendingRewardsRenderedInline, pendingRewardsRenderedInTooltip] =
    useMemo(() => {
      if (!pendingRewards || pendingRewards?.length <= 4) {
        return [pendingRewards || [], undefined]
      }
      return [pendingRewards.slice(0, 3), pendingRewards.slice(3)]
    }, [pendingRewards])

  const receivedRewards = pendingRewardsDollarValue > 0

  const rewardsDollarValue = dollarValueFormatterWithDecimals(
    pendingRewardsDollarValue,
    {
      includeCommaSeparation: true,
    }
  )

  if (!supportsIncentives)
    return (
      <Card className="bg-stack-3 p-4 flex flex-col justify-between">
        <Col className="items-center justify-between h-full">
          <Icon size="lg" heroIconName="x" className="text-disabled" />
          <div className="text-disabled text-center font-bold">
            Rewards are not supported for this token, yet.
          </div>
          <div className="text-disabled text-center font-bold">
            Please come back later.
          </div>
        </Col>
      </Card>
    )

  if (!hasBondedLiquidity && !pendingRewardsDollarValue)
    return (
      <Card className="bg-stack-3 p-4 flex flex-col justify-between">
        <Col className="items-center justify-between h-full">
          <StepIcon step={hasProvidedLiquidity ? 1 : 2} />
          <div className="text-disabled text-center font-bold">
            Bond your tokens and start collecting some pooling rewards. Rewards
            every 6 seconds.
          </div>
          <Row className="items-center text-center">
            <div className="rotate-90">
              <ArrowUpIcon color="#ffb300" />
            </div>
            Then, bond your liquidity
          </Row>
        </Col>
      </Card>
    )

  return (
    <Card
      className="bg-stack-3 p-4 flex flex-col justify-between"
      onClick={receivedRewards ? onClick : undefined}
    >
      <Col className="gap-1">
        <div className="text-secondary text-xs font-bold">
          Liquidity Rewards
        </div>
        <div className="text-primary text-lg font-semibold">
          ${rewardsDollarValue}
        </div>
        <div className="text-disabled text-xs">
          {pendingRewards?.length
            ? `Receive ${pendingRewards.length} tokens`
            : ''}
        </div>
      </Col>
      <Col className="gap-1">
        {pendingRewardsRenderedInline?.map(
          ({ tokenInfo, tokenAmount }: any) => (
            <UnderlyingAssetRow
              key={tokenInfo.symbol}
              tokenSymbol={tokenInfo.symbol}
              tokenAmount={tokenAmount}
            />
          )
        )}
      </Col>
      <Button onClick={onClick} type="solid" size="sm" className="mt-8">
        {loading ? 'Pending...' : 'Claim Your Rewards'}
      </Button>
    </Card>
  )
}
