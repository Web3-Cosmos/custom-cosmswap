// @ts-nocheck
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { usePoolFromListQueryById } from '@/hooks/application/chain-pool/usePoolsListQuery'
import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'
import { getProvidedStakedAmount } from '@/services/staking'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '@/util/constants'

export const useStakedTokenBalance = ({ poolId, enabled = true }) => {
  const { address, status, client } = useRecoilValue(walletState)

  const [pool] = usePoolFromListQueryById({ poolId })

  const { data = 0, isLoading } = useQuery<number>(
    `stakedTokenBalance/${poolId}/${address}`,
    async () => {
      return Number(
        await getProvidedStakedAmount(address, pool.staking_address, client)
      )
    },
    {
      enabled: Boolean(
        pool?.staking_address &&
          status === WalletStatusType.connected &&
          enabled
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}
