import { useQuery } from 'react-query'
import dayjs from 'dayjs'

import { usePoolPairTokenAmount } from '@/hooks/application/chain-pool/usePoolPairTokenAmount'
import { usePoolTokensDollarValue } from '@/hooks/application/chain-pool/usePoolTokensDollarValue'
import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from '@/util/conversion'

import { Card, Row, Col, CoinAvatar, CautionIcon } from '@/components'

type UnbondingLiquidityCardProps = {
  poolId: string
  tokenA: Pick<TokenInfo, 'symbol' | 'logoURI'>
  tokenB: Pick<TokenInfo, 'symbol' | 'logoURI'>
  size?: 'lg' | 'sm'
  releaseAt: number
  amount: number
}

export const maybePluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`

export const UnbondingLiquidityCard = ({
  tokenA,
  tokenB,
  size = 'lg',
  releaseAt,
  amount,
  poolId,
}: UnbondingLiquidityCardProps) => {
  const [dollarValue] = usePoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: amount,
  })

  const formattedDollarValue =
    typeof dollarValue === 'number' &&
    dollarValueFormatterWithDecimals(dollarValue, {
      includeCommaSeparation: true,
    })

  const [tokenAAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount,
    tokenPairIndex: 0,
  })

  const tokenAFormattedAmount = `${formatTokenBalance(tokenAAmount, {
    includeCommaSeparation: true,
  })} ${tokenA.symbol}`

  const [tokenBAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount,
    tokenPairIndex: 1,
  })

  const tokenBFormattedAmount = `${formatTokenBalance(tokenBAmount, {
    includeCommaSeparation: true,
  })} ${tokenB.symbol}`

  const timeLeftLabel = useRelativeTimestamp({
    timestamp: releaseAt,
  })

  return (
    <>
      <Row className="justify-between">
        <Row>
          <div className="text-primary text-sm">${formattedDollarValue}</div>
          <Row className="gap-1">
            <CoinAvatar src={tokenA.logoURI} />
            <div className="text-primary text-xs">{tokenAFormattedAmount}</div>
          </Row>
          <Row className="gap-1">
            <CoinAvatar src={tokenB.logoURI} />
            <div className="text-primary text-xs">{tokenBFormattedAmount}</div>
          </Row>
        </Row>
        <div className="text-primary text-sm">{timeLeftLabel}</div>
      </Row>
    </>
  )
}

const useRelativeTimestamp = ({ timestamp }: { timestamp: number }) => {
  return useQuery(
    `time/${timestamp}`,
    () => {
      /* parse the actual dates */
      const date = dayjs(timestamp)
      const now = dayjs()

      const hoursLeft = date.diff(now, 'hours')

      /* more than a day */
      if (hoursLeft > 24) {
        const daysLeft = date.diff(now, 'days')
        const hoursLeftAfterDays = Math.round(24 * ((hoursLeft / 24) % 1.0))

        return `${
          hoursLeftAfterDays > 0
            ? `${maybePluralize(hoursLeftAfterDays, 'hour')} and `
            : ''
        } ${maybePluralize(daysLeft, 'day')}`
      }

      /* less than 24 hours left but not less than an hour */
      if (hoursLeft < 24 && hoursLeft > 1) {
        return maybePluralize(hoursLeft, 'hour')
      }

      const minsLeft = date.diff(now, 'minutes')

      if (minsLeft > 0) {
        /* less than an hour */
        return maybePluralize(minsLeft, 'minute')
      }

      const secondsLeft = date.diff(now, 'seconds')

      if (secondsLeft > 0) {
        return 'less than a minute'
      }

      return 'now'
    },
    {
      refetchIntervalInBackground: true,
      refetchInterval: 5000,
    }
  ).data
}
