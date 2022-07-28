import { useRef, useState } from 'react'
import { usePoolPairTokenAmount } from '@/hooks/application/chain-pool/usePoolPairTokenAmount'
import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'
import { Row, Col, CoinAvatar, Input } from '@/components'
import { formatTokenBalance, protectAgainstNaN } from '@/util/conversion'

type StakingSummaryProps = {
  label: string
  poolId: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  totalLiquidityProvidedTokenAmount: number
  liquidityAmount: number
  onChangeLiquidity: (liquidityAmount: number) => void
  totalLiquidityProvidedDollarValue: number
  liquidityInDollarValue: number
}

export const StakingSummary = ({
  label,
  poolId,
  tokenA,
  tokenB,
  liquidityAmount,
  onChangeLiquidity,
  totalLiquidityProvidedDollarValue,
  liquidityInDollarValue,
}: StakingSummaryProps) => {
  const [isDollarValueInputFocused, setIsDollarValueInputFocused] =
    useState(false)

  const refForInput = useRef<HTMLInputElement>()

  const [tokenAAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: liquidityAmount,
    tokenPairIndex: 0,
    poolId,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    tokenAmountInMicroDenom: liquidityAmount,
    tokenPairIndex: 1,
    poolId,
  })

  const handleChangeDollarValue = (amount: string) => {
    const multiplier =
      liquidityInDollarValue > 0
        ? liquidityAmount / Number(liquidityInDollarValue)
        : 1

    const liquidityValue = +amount * multiplier

    onChangeLiquidity(protectAgainstNaN(liquidityValue))
  }

  return (
    <>
      <div className="text-md text-primary font-medium mb-4">{label}</div>
      <Row className="justify-between items-center">
        <Col className="gap-2">
          <Col className="gap-1">
            <StyledNodeForToken
              logoURI={tokenA?.logoURI}
              name={tokenA?.name}
              amount={tokenAAmount}
            />
            <StyledNodeForToken
              logoURI={tokenB?.logoURI}
              name={tokenB?.name}
              amount={tokenBAmount}
            />
          </Col>
        </Col>
        <Col className="gap-2">
          <Row className="justify-end items-center text-right">
            <Input
              className="bg-stack-3 px-2 rounded-lg"
              type="number"
              placeholder="0.0"
              value={`${liquidityInDollarValue || 0}`}
              onUserInput={handleChangeDollarValue}
              inputClassName="text-lg text-primary text-right"
              disabled
            />
          </Row>
        </Col>
      </Row>
    </>
  )
}

const StyledNodeForToken = ({
  logoURI,
  name,
  amount,
}: {
  logoURI: string
  name: string
  amount: number
}) => (
  <Row className="gap-2 items-center">
    <CoinAvatar src={logoURI} size="md" />
    <div className="text-primary text-sm uppercase">
      {formatTokenBalance(amount)} {name}
    </div>
  </Row>
)
