import React, { useState } from 'react'
import { useRouter } from 'next/router'

import {
  Layout,
  Card,
  Row,
  Spinner,
  CautionIcon,
  LiquidityHeader,
  LiquidityBreakdown,
  ManageLiquidityCard,
  ManageBondedLiquidityCard,
  LiquidityRewardsCard,
  UnbondingLiquidityStatusList,
  ManagePoolDialog,
  BondLiquidityDialog,
} from '@/components'

import { useRefetchQueries } from '@/hooks/application/token/useRefetchQueries'
import {
  useClaimRewards,
  usePendingRewards,
} from '@/hooks/application/chain-pool/useRewardsQueries'
import { useQueryPoolLiquidity } from '@/hooks/application/chain-pool/useQueryPools'
import { useNotification } from '@/hooks/application/notification/useNotification'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

import {
  __POOL_REWARDS_ENABLED__,
  __POOL_STAKING_ENABLED__,
} from '@/util/constants'

export default function Pool() {
  const {
    query: { pool: poolId },
  } = useRouter()

  const { themeMode } = useAppSettings()

  const [
    { isShowing: isManageLiquidityDialogShowing, actionType },
    setManageLiquidityDialogState,
  ] = useState({ isShowing: false, actionType: 'add' as 'add' | 'remove' })

  const [isBondingDialogShowing, setIsBondingDialogShowing] = useState(false)

  const [pool, isLoading, isError] = useQueryPoolLiquidity({ poolId })

  // @ts-ignore
  const [pendingRewards] = usePendingRewards({ pool })

  const isLoadingInitial = isLoading && !pool

  const supportsIncentives = Boolean(
    __POOL_STAKING_ENABLED__ &&
      __POOL_REWARDS_ENABLED__ &&
      pool?.staking_address
  )

  const refetchQueries = useRefetchQueries(['@liquidity', 'pendingRewards'])

  const { logSuccess, logError } = useNotification()

  const { mutate: mutateClaimRewards, isLoading: isClaimingRewards } =
    useClaimRewards({
      // @ts-ignore
      pool,
      onSuccess() {
        refetchQueries()
        logSuccess('Success', 'Rewards were successfully claimed!')
      },
      onError(e) {
        console.error(e)
        logError('Error', 'Cannot claim your rewards.')
      },
    })

  if (!pool || !poolId) {
    return (
      <Layout>
        <Card className="bg-stack-2 p-5">
          <Row className="text-primary text-sm font-semibold items-center">
            <CautionIcon
              size="md"
              color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
            />
            <div className="text-primary font-normal ml-4">
              {`Oops, we've messed up. Please try again later.`}
            </div>
          </Row>
        </Card>
      </Layout>
    )
  }

  const [tokenA, tokenB] = pool.pool_assets

  return (
    <Layout>
      <ManagePoolDialog
        isShowing={isManageLiquidityDialogShowing}
        initialActionType={actionType}
        onRequestClose={() =>
          setManageLiquidityDialogState({
            isShowing: false,
            actionType: 'add',
          })
        }
        poolId={poolId as string}
      />

      {__POOL_STAKING_ENABLED__ && (
        <BondLiquidityDialog
          isShowing={isBondingDialogShowing}
          onRequestClose={() => setIsBondingDialogShowing(false)}
          poolId={poolId as string}
        />
      )}

      <Card className="shadow-xl rounded-xl mobile:rounded-none bg-stack-1 px-4">
        {/* back button & pool { token + token} */}
        <LiquidityHeader tokenA={tokenA} tokenB={tokenB} className="my-4" />

        {/* divider */}
        <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-2" />

        {isLoadingInitial ? (
          <div className="text-center">
            <Spinner size="md" />
          </div>
        ) : (
          <>
            <LiquidityBreakdown
              poolId={poolId as string}
              tokenA={tokenA}
              tokenB={tokenB}
              totalLiquidity={pool.liquidity.available.total}
              yieldPercentageReturn={
                pool.liquidity.rewards.annualYieldPercentageReturn
              }
              rewardsContracts={pool.liquidity.rewards.contracts ?? []}
            />

            <div className="mobile:mx-6 border-t-[1.5px] border-stack-4 my-2" />

            <Row className="py-4 gap-4">
              <ManageLiquidityCard
                providedLiquidityReserve={pool.liquidity.reserves.provided}
                providedLiquidity={pool.liquidity.available.provided}
                stakedLiquidityReserve={pool.liquidity.reserves.providedStaked}
                providedTotalLiquidity={pool.liquidity.providedTotal}
                stakedLiquidity={pool.liquidity.staked}
                tokenASymbol={tokenA.symbol}
                tokenBSymbol={tokenB.symbol}
                supportsIncentives={supportsIncentives}
                onClick={() =>
                  setManageLiquidityDialogState({
                    isShowing: true,
                    actionType: 'add',
                  })
                }
              />
              <ManageBondedLiquidityCard
                onClick={() => setIsBondingDialogShowing(true)}
                providedLiquidity={pool.liquidity.available.provided}
                stakedLiquidity={pool.liquidity.staked.provided}
                yieldPercentageReturn={
                  pool.liquidity.rewards.annualYieldPercentageReturn
                }
                supportsIncentives={supportsIncentives}
              />
              <LiquidityRewardsCard
                onClick={mutateClaimRewards}
                hasBondedLiquidity={
                  pool.liquidity.staked.provided.tokenAmount > 0
                }
                hasProvidedLiquidity={
                  pool.liquidity.available.provided.tokenAmount > 0
                }
                pendingRewards={pendingRewards}
                loading={isClaimingRewards}
                supportsIncentives={supportsIncentives}
              />
            </Row>

            {supportsIncentives && (
              <UnbondingLiquidityStatusList
                poolId={poolId as string}
                tokenA={tokenA}
                tokenB={tokenB}
              />
            )}
          </>
        )}
      </Card>
    </Layout>
  )
}
