import React, { useMemo } from 'react'

import {
  Row,
  Col,
  UnbondingLiquidityCard,
  CoinAvatar,
  Button,
} from '@/components'

import { useClaimTokens } from '@/hooks/application/chain-pool/useClaimTokens'
import { usePoolPairTokenAmount } from '@/hooks/application/chain-pool/usePoolPairTokenAmount'
import { usePoolTokensDollarValue } from '@/hooks/application/chain-pool/usePoolTokensDollarValue'
import { useStakingClaims } from '@/hooks/application/chain-pool/useStakingClaims'
import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'
import { useRefetchQueries } from '@/hooks/application/token/useRefetchQueries'

import { useNotification } from '@/hooks/application/notification/useNotification'

import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from '@/util/conversion'

type UnbondingLiquidityStatusListProps = {
  poolId: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  size?: 'lg' | 'sm'
}

export const UnbondingLiquidityStatusList = ({
  poolId,
  tokenA,
  tokenB,
  size = 'lg',
}: UnbondingLiquidityStatusListProps) => {
  const { logSuccess, logError } = useNotification()

  /* mocks for getting the amount of tokens that can be redeemed  */
  const { amount, claims, canRedeem, hasUnstakingTokens, isLoading } =
    useRedeemableTokensBalance({
      poolId,
    })

  const [tokenAAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount,
    tokenPairIndex: 0,
  })

  const formattedTokenAAmount = formatTokenBalance(tokenAAmount, {
    includeCommaSeparation: true,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount,
    tokenPairIndex: 1,
  })

  const formattedTokenBAmount = formatTokenBalance(tokenBAmount, {
    includeCommaSeparation: true,
  })

  const [redeemableTokenDollarValue] = usePoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: amount,
  })

  const formattedRedeemableTokenDollarValue =
    typeof redeemableTokenDollarValue === 'number'
      ? dollarValueFormatterWithDecimals(redeemableTokenDollarValue, {
          includeCommaSeparation: true,
        })
      : '0.00'

  const refetchQueries = useRefetchQueries(
    ['tokenBalance', 'myLiquidity', 'stakedTokenBalance', 'claimTokens'],
    3500
  )

  const { mutate: claimTokens } = useClaimTokens({
    poolId,
    onSuccess() {
      refetchQueries()
      logSuccess(
        'SUCCESS',
        `Successfully claimed your tokens in the amount of $${formattedRedeemableTokenDollarValue}`
      )
    },
    onError(error) {
      logError(
        'ERROR',
        `Cannot claim your tokens in the amount of $${formattedRedeemableTokenDollarValue}`
      )
    },
  })

  if (!hasUnstakingTokens && !isLoading) {
    return null
  }

  const renderedListForClaims = (
    <>
      <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-2" />
      <Col className="gap-1">
        {claims?.map(({ amount, release_at }, idx) => (
          <UnbondingLiquidityCard
            key={idx}
            tokenA={tokenA}
            tokenB={tokenB}
            size={size}
            poolId={poolId}
            amount={amount}
            releaseAt={release_at}
          />
        ))}
      </Col>
    </>
  )

  return (
    <>
      <div className="text-primary text-md my-4">Unbonding Tokens</div>
      <Row className="justify-between gap-1 mb-4">
        <Row className="gap-1 items-center">
          <div className="text-primary text-lg font-semibold mr-4">
            ${formattedRedeemableTokenDollarValue}
          </div>
          <Row className="items-center gap-2 mx-4">
            <CoinAvatar size="md" src={tokenA.logoURI} />
            <div className="text-primary text-xs">{formattedTokenAAmount}</div>
          </Row>
          <Row className="items-center gap-2 mx-4">
            <CoinAvatar size="md" src={tokenB.logoURI} />
            <div className="text-primary text-xs">{formattedTokenBAmount}</div>
          </Row>
        </Row>
        <Button onClick={claimTokens} disabled={!canRedeem}>
          Redeem
        </Button>
      </Row>

      {renderedListForClaims}
    </>
  )
}

const useRedeemableTokensBalance = ({ poolId }: { poolId: string }) => {
  const [{ redeemableClaims, allClaims }, isLoading] = useStakingClaims({
    poolId,
  })

  const totalRedeemableAmount = useMemo(() => {
    if (!redeemableClaims?.length) return 0
    return redeemableClaims.reduce((value, { amount }) => value + amount, 0)
  }, [redeemableClaims])

  return {
    amount: totalRedeemableAmount,
    claims: allClaims,
    canRedeem: totalRedeemableAmount > 0,
    hasUnstakingTokens: Boolean(allClaims?.length),
    isLoading,
  }
}
