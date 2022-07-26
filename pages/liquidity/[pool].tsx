import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Layout, Card, Row, Col, Button, CautionIcon } from '@/components'

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
  APP_NAME,
} from '@/util/constants'
import { formatSdkErrorMessage } from '@/util/messages'

// import {
//   BondLiquidityDialog,
//   LiquidityBreakdown,
//   LiquidityHeader,
//   LiquidityRewardsCard,
//   ManageBondedLiquidityCard,
//   ManageLiquidityCard,
//   ManagePoolDialog,
//   UnbondingLiquidityStatusList,
// } from 'features/liquidity'
// import {
//   Button,
//   ChevronIcon,
//   Divider,
//   Error,
//   IconWrapper,
//   Inline,
//   media,
//   Spinner,
//   styled,
//   Text,
//   Toast,
//   UpRightArrow,
//   useMedia,
//   Valid,
// } from 'junoblocks'

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

  console.log(poolId)
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
  return <></>
}
