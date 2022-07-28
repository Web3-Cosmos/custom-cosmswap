import React from 'react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { Card, Button, Row, Grid, Icon } from '@/components'

import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'

type LiquidityHeaderArgs = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  size?: 'sm' | 'lg'
  className?: string
}

export const LiquidityHeader = ({
  tokenA,
  tokenB,
  size = 'lg',
  className,
}: LiquidityHeaderArgs) => {
  return (
    <Grid className={twMerge('items-center grid-cols-3', className)}>
      <div className="inline-flex">
        <Link href="/liquidity">
          <a className="inline-flex flex-row justify-start">
            <Icon heroIconName="chevron-left" />
            Back
          </a>
        </Link>
      </div>
      <div className="text-primary text-center text-lg font-semibold">
        Pool {tokenA.name} + {tokenB.name}
      </div>
      <div className="text-primary text-lg font-semibold invisible">
        Pool {tokenA.name} + {tokenB.name}
      </div>
    </Grid>
  )
}
