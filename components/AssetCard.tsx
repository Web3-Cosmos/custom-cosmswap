import { HTMLProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useIbcAssetInfo } from '@/hooks/application/token/useIbcAssetInfo'
import { useTokenDollarValue } from '@/hooks/application/token/useTokenDollarValue'
import { dollarValueFormatterWithDecimals } from '@/util/conversion'

import { __TRANSFERS_ENABLED__ } from '@/util/constants'

import {
  Card,
  Col,
  Row,
  CoinAvatar,
  Button,
  ArrowUpIcon,
  DepositRedirectDialog,
} from '@/components'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

export enum AssetCardState {
  fetching = 'FETCHING',
  active = 'ACTIVE',
}

type AssetCardProps = Exclude<HTMLProps<HTMLDivElement>, 'children'> & {
  tokenSymbol?: string
  balance?: number
  onActionClick?: (args: {
    symbol: string
    actionType: 'deposit' | 'withdraw'
  }) => void
  state?: AssetCardState
  className?: string
}

export const AssetCard = ({
  tokenSymbol,
  onActionClick,
  balance,
  state,
  className,
  ...htmlProps
}: AssetCardProps) => {
  const { symbol, name, logoURI, denom, external_deposit_uri } =
    useIbcAssetInfo(tokenSymbol ?? '') || {}
  const [showingRedirectDepositDialog, setShowingRedirectDepositDialog] =
    useState(false)

  const [dollarValue] = useTokenDollarValue(tokenSymbol)

  const shouldPerformDepositOutsideApp = Boolean(external_deposit_uri)

  const { themeMode } = useAppSettings()

  const handleDepositClick = () => {
    // bail early if redirecting the user to perform deposit externally
    if (shouldPerformDepositOutsideApp) {
      return setShowingRedirectDepositDialog(true)
    }
    onActionClick?.({
      symbol: symbol!,
      actionType: 'deposit',
    })
  }

  const handleWithdrawClick = () =>
    onActionClick?.({
      symbol: symbol!,
      actionType: 'withdraw',
    })

  if (state === AssetCardState.fetching) {
    return (
      <Card
        className={twMerge(
          'shadow-xl rounded-xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full border border-stack-4 bg-stack-2 p-2',
          className
        )}
        size="lg"
        style={{
          boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
        }}
      >
        <Row className="w-full justify-between">
          <CoinAvatar />
        </Row>
      </Card>
    )
  }

  return (
    <Card
      className={twMerge(
        'shadow-xl rounded-xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full border border-stack-4 bg-stack-2 my-1 p-2',
        className
      )}
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      <Row className="w-full justify-between">
        <Row className="w-full justify-between">
          <Row>
            <CoinAvatar src={logoURI} className="mr-4" />
            <Col className="justify-center">
              <div className="text-base font-medium text-primary">{symbol}</div>
              {balance! > 0 && (
                <div className="text-xs font-semibold text-secondary">
                  {balance} ($
                  {dollarValueFormatterWithDecimals(dollarValue * balance!, {
                    includeCommaSeparation: true,
                  })}
                  )
                </div>
              )}
            </Col>
          </Row>
          {shouldPerformDepositOutsideApp ? (
            <Button
              disabled={!__TRANSFERS_ENABLED__}
              onClick={handleDepositClick}
              className="flex flex-row items-center text-disabled"
              type="text"
              size="sm"
            >
              Transfer
              <div className="rotate-45">
                <ArrowUpIcon
                  size="md"
                  color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
                />
              </div>
            </Button>
          ) : (
            <Row>
              {balance! > 0 && (
                <Button
                  disabled={!__TRANSFERS_ENABLED__}
                  onClick={handleWithdrawClick}
                  className="flex flex-row items-center text-disabled"
                  type="text"
                  size="sm"
                >
                  Withdraw
                  <ArrowUpIcon
                    size="md"
                    color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
                  />
                </Button>
              )}
              <Button
                disabled={!__TRANSFERS_ENABLED__}
                onClick={handleDepositClick}
                className="flex flex-row items-center text-disabled"
                type="text"
                size="sm"
              >
                Deposit{' '}
                <div className="rotate-180">
                  <ArrowUpIcon
                    size="md"
                    color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
                  />
                </div>
              </Button>
            </Row>
          )}
        </Row>
      </Row>
      {showingRedirectDepositDialog && (
        <DepositRedirectDialog
          open={showingRedirectDepositDialog}
          onClose={() => setShowingRedirectDepositDialog(false)}
          symbol={tokenSymbol!}
          href={external_deposit_uri!}
        />
      )}
    </Card>
  )
}
