import React, { useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'
import {
  Layout,
  Card,
  CautionIcon,
  Row,
  Col,
  Grid,
  Spinner,
} from '@/components'

import {
  useSortPools,
  SortDirections,
  SortParameters,
} from '@/hooks/application/chain-pool/useSortPools'
import { useQueriesDataSelector } from '@/hooks/application/chain-pool/useQueriesDataSelector'
import { usePoolsListQuery } from '@/hooks/application/chain-pool/usePoolsListQuery'
import { useQueryMultiplePoolsLiquidity } from '@/hooks/application/chain-pool/useQueryPools'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { PoolCard } from '@/components/liquidity/PoolCard'

const Liquidity: NextPage = () => {
  const { themeMode } = useAppSettings()

  const { data: poolsListResponse } = usePoolsListQuery()
  const [pools, isLoading, isError] = useQueriesDataSelector(
    useQueryMultiplePoolsLiquidity({
      refetchInBackground: false,
      // @ts-ignore
      pools: poolsListResponse?.pools,
    })
  )

  const { sortDirection, sortParameter, setSortDirection, setSortParameter } =
    useSortControllers()

  const [myPools, allPools] = useSortPools({
    // @ts-ignore
    pools,
    sortBy: useMemo(
      () => ({
        parameter: sortParameter,
        direction: sortDirection,
      }),
      [sortParameter, sortDirection]
    ),
  })

  const shouldShowFetchingState = isLoading && !pools?.length
  const shouldRenderPools = Boolean(pools?.length)

  if (isError)
    return (
      <Layout>
        <Card className="bg-stack-2 p-5">
          <Row className="text-primary text-sm font-semibold items-center">
            <CautionIcon
              size="md"
              color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
            />
            <div className="text-primary font-normal ml-4">
              {`Oops, we've messed up querying the pools. Please come back later.`}
            </div>
          </Row>
        </Card>
      </Layout>
    )

  return (
    <Layout>
      <Card className="bg-stack-2 p-5">
        <Col className="mb-6">
          <div className="text-primary text-lg mb-2 font-semibold">
            Liquidity
          </div>
          <div className="text-disabled text-sm">
            Provide liquidity to the market and receive swap fees from each
            trade.
          </div>
        </Col>
        {shouldShowFetchingState && (
          <div className="text-center">
            <Spinner size="md" />
          </div>
        )}
        {shouldRenderPools && (
          <>
            {Boolean(myPools.length) && (
              <>
                <div className="text-primary text-sm">Your Liquidity Pools</div>
                <Grid className="grid-cols-3 gap-2">
                  {myPools.map(
                    ({
                      liquidity,
                      pool_id,
                      pool_assets: [tokenA, tokenB],
                      rewards_tokens,
                    }) => (
                      <PoolCard
                        key={pool_id}
                        poolId={pool_id}
                        tokenASymbol={tokenA.symbol}
                        tokenBSymbol={tokenB.symbol}
                        rewardsTokens={rewards_tokens}
                        providedTotalLiquidity={liquidity.providedTotal}
                        stakedLiquidity={liquidity.staked}
                        availableLiquidity={liquidity.available}
                        aprValue={liquidity.rewards.annualYieldPercentageReturn}
                      />
                    )
                  )}
                </Grid>
                {Boolean(allPools.length) && (
                  <div className="text-primary text-sm">Other Pools</div>
                )}
              </>
            )}
            <Grid className="grid-cols-3 gap-2">
              {allPools.map(
                ({
                  liquidity,
                  pool_id,
                  pool_assets: [tokenA, tokenB],
                  rewards_tokens,
                }) => (
                  <PoolCard
                    key={pool_id}
                    poolId={pool_id}
                    tokenASymbol={tokenA.symbol}
                    tokenBSymbol={tokenB.symbol}
                    rewardsTokens={rewards_tokens}
                    providedTotalLiquidity={liquidity.providedTotal}
                    stakedLiquidity={liquidity.staked}
                    availableLiquidity={liquidity.available}
                    aprValue={liquidity.rewards.annualYieldPercentageReturn}
                  />
                )
              )}
            </Grid>
          </>
        )}
      </Card>
    </Layout>
  )
}

const useSortControllers = () => {
  const storeKeyForParameter = '@pools/sort/parameter'
  const storeKeyForDirection = '@pools/sort/direction'

  const [sortParameter, setSortParameter] = useState<SortParameters>(
    () =>
      (globalThis.localStorage?.getItem(
        storeKeyForParameter
      ) as SortParameters) || 'liquidity'
  )
  const [sortDirection, setSortDirection] = useState<SortDirections>(
    () =>
      (globalThis.localStorage?.getItem(
        storeKeyForDirection
      ) as SortDirections) || 'desc'
  )

  useEffect(() => {
    globalThis.localStorage?.setItem(storeKeyForParameter, sortParameter)
  }, [sortParameter])

  useEffect(() => {
    globalThis.localStorage?.setItem(storeKeyForDirection, sortDirection)
  }, [sortDirection])

  return {
    sortDirection,
    sortParameter,
    setSortDirection,
    setSortParameter,
  }
}

export default Liquidity
