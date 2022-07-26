// @ts-nocheck
import { useQuery } from 'react-query'
import { useChainInfo } from '@/hooks/application/chain-pool/useChainInfo'
import {
  PoolEntityType,
  usePoolFromListQueryById,
} from '@/hooks/application/chain-pool/usePoolsListQuery'
import { WalletStatusType } from '@/hooks/application/atoms/walletAtoms'
import { getUnstakingDuration } from '@/services/staking'
import { cosmWasmClientRouter } from '@/services/cosmWasmClientRouter'

type UseUnstakingDurationArgs = {
  poolId: PoolEntityType['pool_id']
}

export const useUnstakingDuration = ({ poolId }: UseUnstakingDurationArgs) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const [chainInfo] = useChainInfo()

  const { data = 0, isLoading } = useQuery(
    `unstakingDuration/${poolId}`,
    async () => {
      const client = await cosmWasmClientRouter.connect(chainInfo.rpc)
      return getUnstakingDuration(pool?.staking_address, client)
    },
    {
      enabled: Boolean(
        pool?.staking_address && status === WalletStatusType.connected
      ),
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  )

  return [data, isLoading] as const
}
