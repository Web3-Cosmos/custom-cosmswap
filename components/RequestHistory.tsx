import { CSSProperties, ReactNode, RefObject, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { Row, Col, Icon, Button, CoinAvatar, Tooltip } from '@/components'
import mergeRef from '@/functions/react/mergeRef'
import { useHover, UseHoverOptions } from '@/hooks/general/useHover'
import { useClick, UseClickOptions } from '@/hooks/general/useClick'

export interface RequestHistoryProps {
  className?: string
  children?: ReactNode
  style?: CSSProperties
  domRef?: RefObject<any>
  onHoverChange?: UseHoverOptions['onHover']
  open?: string
  onClick?: (open: string) => void
}

export default function RequestHistory({
  className,
  children,
  style,
  domRef,
  onHoverChange,
  // token
  open = 'open',
  onClick,
}: RequestHistoryProps) {
  const ref = useRef<HTMLDivElement>(null)
  useHover(ref, { disable: !onHoverChange, onHover: onHoverChange })

  const RenderTooltip: React.FC<any> = () => (
    <Col className="w-full">
      <Row className="justify-between">
        <div className="text-sm text-primary">Placed:</div>
        <div className="text-sm text-primary font-bold">July 9th, 2022 UTC</div>
      </Row>
      <Row className="justify-between">
        <div className="text-sm text-primary">Required BANANA/BNB change:</div>
        <div className="text-sm text-primary font-bold">7.99%</div>
      </Row>
    </Col>
  )

  return (
    <Row domRef={ref} className={twMerge(`justify-between bg-stack-4 items-center`, className)}>
      <Tooltip tooltip={<RenderTooltip />}>
        <Icon size="lg" heroIconName="exclamation-circle" className="text-primary" />
      </Tooltip>

      <Col>
        <div className="text-primary text-xs opacity-60">Swap</div>
        <div className="text-primary text-base font-bold">13.9999000000</div>
        <Row>
          <CoinAvatar size="xs" className="bg-primary mr-2" />
          <div className="text-default text-xs opacity-60">BANANA</div>
        </Row>
      </Col>

      <Col>
        <div className="text-primary text-xs opacity-60">For</div>
        <div className="text-primary text-base font-bold">123.3300000000</div>
        <Row>
          <CoinAvatar size="xs" className="bg-primary mr-2" />
          <div className="text-default text-xs opacity-60">BNN</div>
        </Row>
      </Col>

      <Col>
        <div className="text-primary text-xs opacity-60">At</div>
        <div className="text-primary text-base font-bold">123.33</div>
        <div className="text-default text-xs opacity-60">BANANA / BNB</div>
      </Col>

      <Button disabled={open !== 'open'} onClick={() => onClick ? onClick(open) : (() => {})}>
        <div className="uppercase">{open === 'open' ? 'CANCEL' : open}</div>
      </Button>
    </Row>
  )
}
