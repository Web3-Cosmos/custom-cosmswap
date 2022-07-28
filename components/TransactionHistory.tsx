import { CSSProperties, ReactNode, RefObject, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Row, Col, Icon, Button, CoinAvatar, Tooltip } from '@/components'
import mergeRef from '@/functions/react/mergeRef'
import { useRegistryCancel } from '@/hooks/application/swap/useRegistry'
import { useTokenToTokenPrice } from '@/hooks/application/token/useTokenToTokenPrice'
import { useHover, UseHoverOptions } from '@/hooks/general/useHover'
import { useClick, UseClickOptions } from '@/hooks/general/useClick'
import { convertMicroDenomToDenom } from '@/util/conversion'

export interface TransactionHistoryProps {
  className?: string
  children?: ReactNode
  style?: CSSProperties
  domRef?: RefObject<any>
  onHoverChange?: UseHoverOptions['onHover']
  status: string
  transaction: any
}

export default function TransactionHistory({
  className,
  children,
  style,
  domRef,
  onHoverChange,
  status,
  transaction,
}: TransactionHistoryProps) {
  const ref = useRef<HTMLDivElement>(null)
  useHover(ref, { disable: !onHoverChange, onHover: onHoverChange })
  const [_, currentTokenRate, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: transaction.inputToken.symbol,
    tokenBSymbol: transaction.outputToken.symbol,
    tokenAmount: 1,
  })

  const tokenAAmount = convertMicroDenomToDenom(
    transaction.inputToken.amount,
    transaction.inputToken.decimals
  )
  const tokenBAmount = convertMicroDenomToDenom(
    transaction.outputToken.amount,
    transaction.outputToken.decimals
  )
  const change = isPriceLoading
    ? 0
    : // @ts-ignore
      Math.abs((tokenBAmount / tokenAAmount - currentTokenRate) * 100).toFixed(
        2
      )

  const RenderTooltip: React.FC<any> = () => (
    <Col className="w-full min-w-[400px]">
      <Row className="justify-between">
        <div className="text-sm text-primary">Placed:</div>
        <div className="text-sm text-primary font-bold">
          {new Date(transaction.createdAt * 1000).toDateString()}
        </div>
      </Row>
      <Row className="justify-between">
        <div className="text-sm text-primary">Registry Transaction ID:</div>
        <div className="text-sm text-primary font-bold">{transaction.id}</div>
      </Row>
      <Row className="justify-between">
        <div className="text-sm text-primary">
          Required {transaction.inputToken.symbol}/
          {transaction.outputToken.symbol} change:
        </div>
        <div className="text-sm text-primary font-bold">{change}%</div>
      </Row>
    </Col>
  )

  const {
    mutate: handleRegistryCancel,
    isLoading: isExecutingRegistryCancelTransaction,
  } = useRegistryCancel({
    id: transaction.id,
  })

  const handleCancel = () => {
    if (!isExecutingRegistryCancelTransaction) {
      handleRegistryCancel()
    }
  }

  return (
    <Row
      domRef={ref}
      className={twMerge(`justify-between bg-stack-4 items-center`, className)}
    >
      <Tooltip tooltip={<RenderTooltip />}>
        <Icon
          size="lg"
          heroIconName="exclamation-circle"
          className="text-primary"
        />
      </Tooltip>

      <Col>
        <div className="text-primary text-xs opacity-60">Swap</div>
        <div className="text-primary text-base font-bold">{tokenAAmount}</div>
        <Row className="items-center">
          <CoinAvatar
            src={transaction.inputToken.logoURI}
            size="sm"
            className="mr-2"
          />
          <div className="text-default text-xs opacity-60">
            {transaction.inputToken.symbol}
          </div>
        </Row>
      </Col>

      <Col>
        <div className="text-primary text-xs opacity-60">For</div>
        <div className="text-primary text-base font-bold">{tokenBAmount}</div>
        <Row className="items-center">
          <CoinAvatar
            src={transaction.outputToken.logoURI}
            size="sm"
            className="mr-2"
          />
          <div className="text-default text-xs opacity-60">
            {transaction.outputToken.symbol}
          </div>
        </Row>
      </Col>

      <Button disabled={status !== 'created'} onClick={handleCancel}>
        <div className="uppercase">
          {status === 'created' ? 'CANCEL' : status.toUpperCase()}
        </div>
      </Button>
    </Row>
  )
}
