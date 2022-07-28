import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

import { useQueryPoolLiquidity } from '@/hooks/application/chain-pool/useQueryPools'
import { useQueryPoolUnstakingDuration } from '@/hooks/application/chain-pool/useQueryPoolUnstakingDuration'
import { useNotification } from '@/hooks/application/notification/useNotification'
import {
  useBondTokens,
  useUnbondTokens,
} from '@/hooks/application/chain-pool/useBondTokens'
import { useRefetchQueries } from '@/hooks/application/token/useRefetchQueries'

import {
  Button,
  Card,
  Row,
  Col,
  Icon,
  Spinner,
  LiquidityInputSelect,
  ResponsiveDialogDrawer,
  StakingSummary,
} from '@/components'

import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from '@/util/conversion'

type BondLiquidityDialogProps = {
  isShowing: boolean
  onRequestClose: () => void
  poolId: string
}

export default function BondLiquidityDialog(
  props: Parameters<typeof BondLiquidityDialogContent>[0]
) {
  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={props.isShowing}
      onClose={props.onRequestClose}
    >
      {() => <BondLiquidityDialogContent {...props} />}
    </ResponsiveDialogDrawer>
  )
}

export const BondLiquidityDialogContent = ({
  isShowing,
  onRequestClose,
  poolId,
}: BondLiquidityDialogProps) => {
  const [dialogState, setDialogState] = useState<'stake' | 'unstake'>('stake')

  const [pool] = useQueryPoolLiquidity({ poolId })

  const { data: unstakingDuration } = useQueryPoolUnstakingDuration({ poolId })

  const { pool_assets, liquidity } = pool || {}
  const [tokenA, tokenB] = pool_assets || []

  const totalLiquidityProvidedTokenAmount =
    dialogState === 'stake'
      ? liquidity?.available.provided.tokenAmount ?? 0
      : liquidity?.staked.provided.tokenAmount ?? 0

  const totalLiquidityProvidedDollarValue =
    dialogState === 'stake'
      ? liquidity?.available.provided.dollarValue ?? 0
      : liquidity?.staked.provided.dollarValue ?? 0

  const [tokenAmount, setTokenAmount] = useState(0)

  const liquidityDollarAmount =
    (tokenAmount / totalLiquidityProvidedTokenAmount) *
    totalLiquidityProvidedDollarValue

  const refetchQueries = useRefetchQueries([
    'tokenBalance',
    `@pool-liquidity/${pool!.pool_id}`,
    'stakedTokenBalance',
    'claimTokens',
  ])

  const { logSuccess, logError } = useNotification()

  const { mutate: bondTokens, isLoading: isRequestingToBond } = useBondTokens({
    poolId,

    onSuccess() {
      // reset cache
      refetchQueries()

      logSuccess(
        'SUCCESS',
        `Successfully bonded $${dollarValueFormatterWithDecimals(
          liquidityDollarAmount as number,
          { includeCommaSeparation: true }
        )}`
      )

      // close modal
      requestAnimationFrame(onRequestClose)
    },
    onError(error) {
      logError(
        'ERROR',
        `Cannot bond your $${dollarValueFormatterWithDecimals(
          liquidityDollarAmount as number,
          { includeCommaSeparation: true }
        )}`
      )
    },
  })

  // todo reset cache & show toasts
  const { mutate: unbondTokens, isLoading: isRequestingToUnbond } =
    useUnbondTokens({
      poolId,

      onSuccess() {
        // reset cache
        refetchQueries()

        logSuccess(
          'SUCCESS',
          `Unbond of $${dollarValueFormatterWithDecimals(
            liquidityDollarAmount as number,
            { includeCommaSeparation: true }
          )} successfully started!`
        )

        // close modal
        requestAnimationFrame(onRequestClose)
      },
      onError(error) {
        logError(
          'ERROR',
          `Cannot not unbond your $${dollarValueFormatterWithDecimals(
            liquidityDollarAmount as number,
            { includeCommaSeparation: true }
          )}`
        )
      },
    })

  const isLoading = isRequestingToBond || isRequestingToUnbond

  const handleAction = () => {
    const flooredTokenAmount = Math.floor(tokenAmount)
    if (dialogState === 'stake') {
      bondTokens(flooredTokenAmount)
    } else {
      unbondTokens(flooredTokenAmount)
    }
  }

  const getIsFormSubmissionDisabled = () => {
    if (dialogState === 'stake') {
      if (totalLiquidityProvidedTokenAmount <= 0) {
        return true
      }
    }

    if (dialogState === 'unstake') {
      if (totalLiquidityProvidedTokenAmount <= 0) {
        return true
      }
    }

    return isLoading || !tokenAmount
  }

  // @ts-ignore
  const canManageStaking = Boolean(liquidity?.staked.provided.tokenAmount > 0)

  useEffect(() => {
    const shouldResetDialogState =
      !canManageStaking && dialogState === 'unstake'
    if (shouldResetDialogState) setDialogState('stake')
  }, [canManageStaking, dialogState])

  useEffect(() => {
    if (isShowing) setTokenAmount(0)
  }, [isShowing, dialogState])

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isShowing) inputRef.current?.focus()
  }, [isShowing])

  const [step, setStep] = useState(0.1)

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-full border border-stack-4 bg-stack-2 px-8 mobile:px-6 pt-6 pb-5"
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      <Row className="justify-between items-center mb-6">
        {canManageStaking ? (
          <div className="text-xl font-semibold text-primary">
            Manage Bonding
          </div>
        ) : (
          <Col className="gap-1">
            <div className="text-xl font-semibold text-primary">
              Bonding Tokens
            </div>
            <div className="text-md font-normal text-disabled">
              Choose how many tokens to bond
            </div>
          </Col>
        )}
        <Icon
          className="text-primary cursor-pointer clickable clickable-mask-offset-2"
          heroIconName="x"
          onClick={onRequestClose}
        />
      </Row>

      {canManageStaking && (
        <>
          <Row className="gap-2">
            <Button
              type="text"
              size="sm"
              onClick={() => setDialogState('stake')}
              className={
                dialogState === 'stake' ? 'text-default' : 'text-primary'
              }
            >
              Stake
            </Button>
            <Button
              type="text"
              size="sm"
              onClick={() => setDialogState('unstake')}
              className={
                dialogState === 'unstake' ? 'text-default' : 'text-primary'
              }
            >
              Unstake
            </Button>
          </Row>
          <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 mt-0 mb-4" />
          <div className="text-md text-primary font-medium mb-4">
            Choose your token amount
          </div>
        </>
      )}

      <Col className="gap-2">
        <LiquidityInputSelect
          inputRef={inputRef}
          maxLiquidity={totalLiquidityProvidedTokenAmount}
          liquidity={tokenAmount}
          onChangeLiquidity={setTokenAmount}
        />
        <div className="text-secondary text-xs font-bold">
          Max available to {dialogState === 'stake' ? 'bond' : 'unbond'} is $
          {typeof totalLiquidityProvidedDollarValue === 'number' &&
            dollarValueFormatterWithDecimals(
              totalLiquidityProvidedDollarValue,
              {
                includeCommaSeparation: true,
              }
            )}
        </div>
        <Row className="gap-2 justify-around">
          {[0.1, 0.25, 0.5, 0.75, 1].map((valueForStep: number) => (
            <Button
              key={valueForStep}
              type="text"
              className={`${
                valueForStep === step ? 'text-default' : 'text-primary'
              }`}
              onClick={() => {
                setStep(valueForStep)
                setTokenAmount(valueForStep * totalLiquidityProvidedTokenAmount)
              }}
            >
              {valueForStep * 100}%
            </Button>
          ))}
        </Row>
      </Col>

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 mb-4" />
      <StakingSummary
        label={dialogState === 'stake' ? 'Bonding' : 'Unbonding'}
        poolId={poolId}
        tokenA={tokenA!}
        tokenB={tokenB!}
        totalLiquidityProvidedTokenAmount={totalLiquidityProvidedTokenAmount}
        totalLiquidityProvidedDollarValue={totalLiquidityProvidedDollarValue}
        liquidityAmount={tokenAmount}
        onChangeLiquidity={setTokenAmount}
        liquidityInDollarValue={liquidityDollarAmount}
      />

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-4" />
      <Col className="gap-2">
        <div className="text-md text-primary font-medium">
          {dialogState === 'stake'
            ? `Unbonding Period: ${unstakingDuration?.days} days`
            : `Available on: ${dayjs()
                .add(unstakingDuration!.days, 'day')
                .format('MMMM D YYYY')}`}
        </div>
        <div className="text-xs text-disabled">
          {dialogState === 'stake'
            ? `There'll be ${unstakingDuration?.days} days from the time you decide to unbond your tokens, to the time you can redeem your previous unbond.`
            : `Because of the ${
                unstakingDuration?.days
              } days unbonding period, you will be able to redeem your $${
                typeof liquidityDollarAmount === 'number' &&
                dollarValueFormatter(liquidityDollarAmount, {
                  includeCommaSeparation: true,
                })
              } worth of bonded token on ${dayjs()
                .add(unstakingDuration!.days, 'day')
                .format('MMM D')}.`}
        </div>
      </Col>

      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-4"></div>
      <Row className="gap-2 justify-end">
        <Button size="sm" type="text" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleAction}
          className="w-32"
          disabled={getIsFormSubmissionDisabled()}
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>{dialogState === 'stake' ? 'Bond' : 'Unbond'}</>
          )}
        </Button>
      </Row>
    </Card>
  )
}
