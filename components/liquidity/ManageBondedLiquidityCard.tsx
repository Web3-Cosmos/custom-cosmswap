import { PoolTokenValue } from '@/hooks/application/chain-pool/useQueryPools'
import { useSubscribeInteractions } from '@/hooks/general/useSubscribeInteractions'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from '@/util/conversion'

import {
  Card,
  Row,
  Col,
  Button,
  SegmentedRewardsSimulator,
  ArrowUpIcon,
  UnionIcon,
  Icon,
} from '@/components'

type ManageBondedLiquidityCardProps = {
  onClick: () => void
  yieldPercentageReturn?: number
  providedLiquidity: PoolTokenValue
  stakedLiquidity: PoolTokenValue
  supportsIncentives: boolean
}

export const ManageBondedLiquidityCard = ({
  onClick,
  yieldPercentageReturn,
  providedLiquidity,
  stakedLiquidity,
  supportsIncentives,
}: ManageBondedLiquidityCardProps) => {
  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const bondedLiquidity = supportsIncentives && stakedLiquidity?.tokenAmount > 0
  const didProvideLiquidity = providedLiquidity?.tokenAmount > 0

  const bondedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    stakedLiquidity?.dollarValue,
    {
      includeCommaSeparation: true,
    }
  )

  const formattedYieldPercentageReturn = dollarValueFormatter(
    yieldPercentageReturn ?? 0
  )

  const interestOnStakedBalance = (yieldPercentageReturn ?? 0) / 100

  const { themeMode } = useAppSettings()

  if (!supportsIncentives)
    return (
      <Card className="bg-stack-3 p-4 flex flex-col justify-between">
        <Col className="items-center justify-between h-full">
          <Icon size="lg" heroIconName="x" className="text-disabled" />
          <div className="text-disabled text-center font-bold">
            Incentives are not supported for this token, yet.
          </div>
          <div className="text-disabled text-center font-bold">
            Please come back later.
          </div>
        </Col>
      </Card>
    )

  if (!didProvideLiquidity && !bondedLiquidity)
    return (
      <Card className="bg-stack-3 p-4 flex flex-col justify-between">
        <Col className="items-center justify-between h-full">
          <StepIcon step={1} />
          <div className="text-disabled text-center font-bold">
            Add liquidity to the pool so you can bond your tokens and enjoy the{' '}
            {formattedYieldPercentageReturn}% APR
          </div>
          <Row className="items-center text-center">
            <div className="rotate-90">
              <ArrowUpIcon color="#ffb300" />
            </div>
            First, add the liquidity
          </Row>
        </Col>
      </Card>
    )

  return (
    <Card className="bg-stack-3 p-4 flex flex-col justify-between">
      <Col className="gap-1">
        <div className="text-secondary text-xs font-bold">Staked Liquidity</div>
        <div className="text-primary text-lg font-semibold">
          ${bondedLiquidityDollarValue}
        </div>
        <div className="text-disabled text-xs">
          Expected interest with {formattedYieldPercentageReturn}% APR
        </div>
      </Col>

      <SegmentedRewardsSimulator
        interestOnStakedBalance={interestOnStakedBalance}
        stakedLiquidityDollarValue={stakedLiquidity?.dollarValue}
      />

      <Button onClick={() => onClick()} type="solid" size="sm" className="mt-8">
        {bondedLiquidity
          ? supportsIncentives
            ? 'Manage Staking'
            : 'Does not support staking'
          : supportsIncentives
          ? 'Bond Liquidity'
          : 'Does not support bonding'}
      </Button>
    </Card>
  )
}

export const StepIcon = ({ step }: { step: number }) => {
  return (
    <div className="inline-flex text-disabled text-center font-bold rounded-full bg-primary w-8 h-8 justify-center items-center">
      {step}
    </div>
  )
}
