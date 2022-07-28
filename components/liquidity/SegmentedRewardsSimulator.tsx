import { useRef, useState } from 'react'
import { Row, Col, Button } from '@/components'
import {
  dollarValueFormatterWithDecimals,
  protectAgainstNaN,
} from '@/util/conversion'

type SegmentedRewardsSimulatorProps = {
  interestOnStakedBalance: number
  stakedLiquidityDollarValue: number
}

export const SegmentedRewardsSimulator = ({
  interestOnStakedBalance,
  stakedLiquidityDollarValue,
}: SegmentedRewardsSimulatorProps) => {
  const values = useRef([
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'day', label: 'Day' },
  ]).current

  const [activeValue, setActiveValue] =
    useState<typeof values[number]['value']>('year')

  const hasStakedLiquidity = stakedLiquidityDollarValue > 0

  const yearRewardOnStakedBalance =
    stakedLiquidityDollarValue * interestOnStakedBalance

  let divider = 1
  if (activeValue === 'month') {
    divider = 12
  } else if (activeValue === 'day') {
    divider = 365
  }

  const rewardsAmountInDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(yearRewardOnStakedBalance / divider),
    { includeCommaSeparation: true }
  )

  return (
    <>
      <SegmentedControl
        activeValue={activeValue}
        values={values}
        onChange={({ value }) => setActiveValue(value)}
      />

      <div className="text-primary text-sm">
        {hasStakedLiquidity
          ? `+ $${rewardsAmountInDollarValue} /${activeValue}`
          : '-- /day'}
      </div>
    </>
  )
}

type SegmentedControlProps = {
  activeValue: any
  values: Array<{ value: any; label: any }>
  onChange: (value: { value: any; label: any }, event: MouseEvent) => void
}

export const SegmentedControl = ({
  activeValue,
  values,
  onChange,
}: SegmentedControlProps) => {
  return (
    <Row className="gap-2 my-4">
      {values.map((element) => (
        <Button
          key={element.value}
          onClick={(event) => onChange(element, event)}
          className="flex-1"
          size="sm"
          type={activeValue === element.value ? 'solid' : 'outline'}
        >
          {element.label || element.value}
        </Button>
      ))}
    </Row>
  )
}
