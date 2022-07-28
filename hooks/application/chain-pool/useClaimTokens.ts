// @ts-nocheck
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { usePoolFromListQueryById } from '@/hooks/application/chain-pool/usePoolsListQuery'
import { walletState } from '@/hooks/application/atoms/walletAtoms'
import { claimTokens } from '@/services/staking'

type UseClaimTokensMutationArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useClaimTokens = ({
  poolId,
  ...mutationArgs
}: UseClaimTokensMutationArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const [pool] = usePoolFromListQueryById({ poolId })

  return useMutation(
    `claimTokens/${poolId}`,
    async () => {
      return claimTokens(address, pool.staking_address, client)
    },
    mutationArgs
  )
}
