import { useQuery } from 'react-query'

import { cosmWasmClientRouter } from '@/services/cosmWasmClientRouter'
import { useChainInfo } from '@/hooks/application/chain-pool/useChainInfo'

export const useCosmWasmClient = () => {
  const [chainInfo] = useChainInfo()

  const { data } = useQuery(
    '@cosmwasm-client',
    () => cosmWasmClientRouter.connect(chainInfo!.rpc),
    { enabled: Boolean(chainInfo?.rpc) }
  )

  return data
}
