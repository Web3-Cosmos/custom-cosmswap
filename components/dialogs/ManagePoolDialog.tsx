import { useEffect, useRef, useState } from 'react'

import { useTokenDollarValue } from '@/hooks/application/token/useTokenDollarValue'
import { useQueryPoolLiquidity } from '@/hooks/application/chain-pool/useQueryPools'
import { usePoolDialogController } from '@/hooks/application/chain-pool/usePoolDialogController'

import { usePrevious } from '@/hooks/general/usePrevious'

import {
  Card,
  Row,
  Col,
  Spinner,
  CoinAvatar,
  Button,
  ResponsiveDialogDrawer,
  Icon,
  LiquidityInput,
  TokenToTokenRates,
  LiquidityInputSelect,
} from '@/components'

import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  protectAgainstNaN,
} from '@/util/conversion'

type ManagePoolDialogProps = {
  isShowing: boolean
  initialActionType: 'add' | 'remove'
  onRequestClose: () => void
  poolId: string
}

export default function ManagePoolDialog(
  props: Parameters<typeof ManagePoolDialogContent>[0]
) {
  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={props.isShowing}
      onClose={props.onRequestClose}
    >
      {() => <ManagePoolDialogContent {...props} />}
    </ResponsiveDialogDrawer>
  )
}

export const ManagePoolDialogContent = ({
  isShowing,
  initialActionType,
  onRequestClose,
  poolId,
}: ManagePoolDialogProps) => {
  const [pool] = useQueryPoolLiquidity({ poolId })
  const {
    pool_assets: [tokenA, tokenB],
  } = pool || { pool_assets: [] }

  const [isAddingLiquidity, setAddingLiquidity] = useState(
    initialActionType !== 'remove'
  )

  const [addLiquidityPercent, setAddLiquidityPercent] = useState(0)
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState(0)

  const {
    state: {
      tokenAReserve,
      tokenBReserve,
      tokenABalance,
      tokenBBalance,
      maxApplicableBalanceForTokenA,
      maxApplicableBalanceForTokenB,
      isLoading,
    },
    actions: { mutateAddLiquidity },
  } = usePoolDialogController({
    // @ts-ignore
    pool,
    actionState: isAddingLiquidity ? 'add' : 'remove',
    percentage: isAddingLiquidity
      ? addLiquidityPercent
      : removeLiquidityPercent,
  })

  const canManageLiquidity = tokenAReserve > 0

  const handleSubmit = () =>
    // @ts-ignore
    mutateAddLiquidity(null, {
      onSuccess() {
        requestAnimationFrame(onRequestClose)
        setRemoveLiquidityPercent(0)
        setAddLiquidityPercent(0)
      },
    })

  useEffect(() => {
    if (!canManageLiquidity) {
      setAddingLiquidity((isAdding) => (!isAdding ? true : isAdding))
    }
  }, [canManageLiquidity])

  /* update initial tab whenever dialog opens */
  const previousIsShowing = usePrevious(isShowing)
  useEffect(() => {
    const shouldUpdateInitialState =
      previousIsShowing !== isShowing && isShowing
    if (shouldUpdateInitialState) {
      setAddingLiquidity(initialActionType !== 'remove')
    }
  }, [initialActionType, previousIsShowing, isShowing])

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-full border border-stack-4 bg-stack-2 px-8 mobile:px-6 pt-6 pb-5"
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      <Row className="justify-between items-center mb-6">
        <div className="text-xl font-semibold text-primary">
          Manage Liquidity
        </div>
        <Icon
          className="text-primary cursor-pointer clickable clickable-mask-offset-2"
          heroIconName="x"
          onClick={onRequestClose}
        />
      </Row>

      {canManageLiquidity && (
        <Row className="gap-2">
          <Button
            type="text"
            size="sm"
            onClick={() => setAddingLiquidity(true)}
            className={isAddingLiquidity ? 'text-default' : 'text-primary'}
          >
            Add
          </Button>
          <Button
            type="text"
            size="sm"
            onClick={() => setAddingLiquidity(false)}
            className={!isAddingLiquidity ? 'text-default' : 'text-primary'}
          >
            Remove
          </Button>
        </Row>
      )}
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 mt-0 mb-4" />

      <div className="text-md text-primary font-medium mb-2">
        Choose how much to {isAddingLiquidity ? 'add' : 'remove'}
      </div>
      {isAddingLiquidity ? (
        <AddLiquidityContent
          isLoading={isLoading}
          tokenASymbol={tokenA?.symbol}
          tokenBSymbol={tokenB?.symbol}
          tokenABalance={tokenABalance}
          tokenBBalance={tokenBBalance}
          maxApplicableBalanceForTokenA={maxApplicableBalanceForTokenA}
          maxApplicableBalanceForTokenB={maxApplicableBalanceForTokenB}
          liquidityPercentage={addLiquidityPercent}
          onChangeLiquidity={setAddLiquidityPercent}
        />
      ) : (
        <RemoveLiquidityContent
          tokenA={tokenA}
          tokenB={tokenB}
          tokenAReserve={tokenAReserve}
          tokenBReserve={tokenBReserve}
          liquidityPercentage={removeLiquidityPercent}
          onChangeLiquidity={setRemoveLiquidityPercent}
        />
      )}
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-4"></div>
      <Row className="gap-2 justify-end">
        <Button size="sm" type="text" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={isLoading ? undefined : handleSubmit}
          className="w-32"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>{isAddingLiquidity ? 'Add' : 'Remove'} liquidity</>
          )}
        </Button>
      </Row>
    </Card>
  )
}

function AddLiquidityContent({
  liquidityPercentage,
  tokenASymbol,
  tokenBSymbol,
  tokenABalance,
  tokenBBalance,
  maxApplicableBalanceForTokenA,
  maxApplicableBalanceForTokenB,
  isLoading,
  onChangeLiquidity,
}: any) {
  const handleTokenAAmountChange = (input: number) => {
    const value = Math.min(input, maxApplicableBalanceForTokenA)
    onChangeLiquidity(protectAgainstNaN(value / maxApplicableBalanceForTokenA))
  }

  const handleTokenBAmountChange = (input: number) => {
    const value = Math.min(input, maxApplicableBalanceForTokenB)
    onChangeLiquidity(protectAgainstNaN(value / maxApplicableBalanceForTokenB))
  }

  const handleApplyMaximumAmount = () =>
    handleTokenAAmountChange(maxApplicableBalanceForTokenA)

  const tokenAAmount = maxApplicableBalanceForTokenA * liquidityPercentage
  const tokenBAmount = maxApplicableBalanceForTokenB * liquidityPercentage

  return (
    <Col className="gap-2">
      <LiquidityInput
        tokenSymbol={tokenASymbol}
        availableAmount={tokenABalance ? tokenABalance : 0}
        maxApplicableAmount={maxApplicableBalanceForTokenA}
        amount={tokenAAmount}
        onAmountChange={handleTokenAAmountChange}
        className="mt-4"
      />
      <LiquidityInput
        tokenSymbol={tokenBSymbol}
        availableAmount={tokenBBalance ? tokenBBalance : 0}
        maxApplicableAmount={maxApplicableBalanceForTokenB}
        amount={tokenBAmount}
        onAmountChange={handleTokenBAmountChange}
        className="my-2"
      />
      <TokenToTokenRates
        tokenASymbol={tokenASymbol}
        tokenBSymbol={tokenBSymbol}
        tokenAAmount={tokenAAmount}
        isLoading={isLoading}
      />
      <div className="inline">
        <Button
          type="text"
          onClick={handleApplyMaximumAmount}
          size="sm"
          className="inline-flex items-center gap-1"
        >
          <Icon heroIconName="plus" size="sm" />
          Provide Max Liquidity
        </Button>
      </div>
    </Col>
  )
}

function RemoveLiquidityContent({
  tokenA,
  tokenB,
  tokenAReserve,
  tokenBReserve,
  liquidityPercentage,
  onChangeLiquidity,
}: any) {
  const [tokenAPrice] = useTokenDollarValue(tokenA.symbol)
  const percentageInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0.1)

  useEffect(() => percentageInputRef.current?.focus(), [])

  const availableLiquidityDollarValue = dollarValueFormatter(
    tokenAReserve * 2 * tokenAPrice
  ) as number

  const liquidityToRemove = availableLiquidityDollarValue * liquidityPercentage

  const handleChangeLiquidity = (value: number) => {
    onChangeLiquidity(value / availableLiquidityDollarValue)
  }

  return (
    <Col className="gap-1">
      <LiquidityInputSelect
        inputRef={percentageInputRef}
        maxLiquidity={availableLiquidityDollarValue}
        liquidity={liquidityToRemove}
        onChangeLiquidity={handleChangeLiquidity}
      />
      <Row className="gap-2 justify-between">
        <div className="text-secondary text-xs font-bold">
          Available liquidity: $
          {dollarValueFormatterWithDecimals(availableLiquidityDollarValue, {
            includeCommaSeparation: true,
          })}
        </div>
        <div className="text-secondary text-xs font-bold">
          ≈ ${' '}
          {dollarValueFormatterWithDecimals(liquidityToRemove, {
            includeCommaSeparation: true,
          })}
        </div>
      </Row>
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
              handleChangeLiquidity(
                valueForStep * availableLiquidityDollarValue
              )
            }}
          >
            {valueForStep * 100}%
          </Button>
        ))}
      </Row>
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 mb-2"></div>
      <Col>
        <div className="text-md text-primary font-medium mb-4">Removing</div>
        <Row className="gap-2 items-center">
          <CoinAvatar src={tokenA.logoURI} />
          <div className="text-disabled text-sm">
            {formatTokenBalance(tokenAReserve * liquidityPercentage)}{' '}
            {tokenA.symbol}
          </div>
          <CoinAvatar src={tokenB.logoURI} className="ml-8" />
          <div className="text-disabled text-sm">
            {formatTokenBalance(tokenBReserve * liquidityPercentage)}{' '}
            {tokenB.symbol}
          </div>
        </Row>
      </Col>
    </Col>
  )
}
