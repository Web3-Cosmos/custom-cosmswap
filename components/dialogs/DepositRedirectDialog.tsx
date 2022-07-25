import React from 'react'
import { useRouter } from 'next/router'

import { Card, Row, Icon, ResponsiveDialogDrawer, Button } from '@/components'

export interface DepositRedirectDialogProps {
  open: boolean
  onClose(): void
  symbol: string
  href: string
}

export default function DepositRedirectDialog({
  open,
  onClose,
  symbol,
  href,
}: DepositRedirectDialogProps) {
  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={open}
      onClose={onClose}
    >
      {({ close: onClose }) => (
        <DepositRedirectDialogContent
          open={open}
          onClose={onClose}
          symbol={symbol}
          href={href}
        />
      )}
    </ResponsiveDialogDrawer>
  )
}

function DepositRedirectDialogContent({
  open,
  onClose,
  symbol,
  href,
}: DepositRedirectDialogProps) {
  const router = useRouter()

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-[min(250px,100vh)] mobile:h-screen border border-stack-4 bg-stack-2"
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      <div className="px-8 mobile:px-6 pt-6">
        <Row className="justify-between items-center mb-6">
          <div className="text-xl font-semibold text-secondary">
            External Asset Deposit
          </div>
          <Icon
            className="text-primary cursor-pointer clickable clickable-mask-offset-2"
            heroIconName="x"
            onClick={onClose}
          />
        </Row>
      </div>

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4"></div>

      <div className="text-md font-medium text-primary my-auto px-8 mobile:px-6">
        You will be redirected to an external service to deposit your {symbol}{' '}
        on the chain.
      </div>
      <Row className="justify-center mb-8">
        <Button
          className="px-20"
          onClick={() => {
            router.push(href)
            onClose()
          }}
        >
          Proceed
        </Button>
      </Row>
    </Card>
  )
}
