import React, { FC, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { Row, Col, CoinAvatar, Input } from '@/components'

import { useTokenInfo } from '@/hooks/application/token/useTokenInfo'

import { formatTokenBalance } from '@/util/conversion'

type LiquidityInputProps = {
  tokenSymbol: string
  availableAmount: number
  maxApplicableAmount: number
  amount: number
  onAmountChange: (value: number) => void
  className?: string
}

export const LiquidityInput: FC<LiquidityInputProps> = ({
  tokenSymbol,
  availableAmount,
  maxApplicableAmount,
  amount,
  onAmountChange,
  className,
}) => {
  const [focusedOnInput, setFocusedOnInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>()

  // @ts-ignore
  const { name: tokenName, logoURI } = useTokenInfo(tokenSymbol)

  const handleAmountChange = (value: string) => onAmountChange(+value)

  return (
    <Row
      onClick={() => inputRef.current?.focus()}
      className={twMerge(
        `justify-between ${
          focusedOnInput ? 'bg-stack-4' : 'bg-stack-3'
        } p-3 rounded-lg items-center`,
        className
      )}
    >
      <Row className="item-center">
        <CoinAvatar src={logoURI} className="mr-4" />
        <Col>
          <div className="text-primary text-sm uppercase">{tokenName}</div>
          <div className="text-secondary text-xs">
            {`${formatTokenBalance(availableAmount)} available`}
          </div>
        </Col>
      </Row>
      <Input
        inputDomRef={inputRef}
        className="bg-transparent flex-1"
        inputClassName="text-lg text-primary text-right"
        type="number"
        value={`${formatTokenBalance(amount)}`}
        onUserInput={handleAmountChange}
        inputHTMLProps={{
          onFocus: () => setFocusedOnInput(true),
          onBlur: () => setFocusedOnInput(false),
        }}
      />
    </Row>
  )
}
