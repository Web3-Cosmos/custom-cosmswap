import { useQuery } from 'react-query'

import { useCosmWasmClient } from '@/hooks/application/client/useCosmWasmClient'
import { getUnstakingDuration } from '@/services/staking'
import {
  PoolEntityType,
  usePoolFromListQueryById,
} from '@/hooks/application/chain-pool/usePoolsListQuery'

type UseQueryPoolUnstakingDurationArgs = {
  poolId: PoolEntityType['pool_id']
}

export const useQueryPoolUnstakingDuration = ({
  poolId,
}: UseQueryPoolUnstakingDurationArgs) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const client = useCosmWasmClient()
  return useQuery(
    `@unstaking-duration/${poolId}`,
    async () => {
      const seconds = await getUnstakingDuration(pool!.staking_address, client!)
      const minutes = seconds / 60
      const hours = minutes / 60
      const days = Math.round(hours / 24)
      return { seconds, minutes, hours, days }
    },
    {
      enabled: Boolean(pool?.staking_address && client),
      refetchOnMount: false,
    }
  )
}
