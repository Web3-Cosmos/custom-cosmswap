import { useMemo } from 'react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { useTokenList } from '@/hooks/application/token/useTokenList'
import {
  getTokenInfoFromTokenList,
  useTokenInfo,
} from '@/hooks/application/token/useTokenInfo'
import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '@/util/constants'
import { convertMicroDenomToDenom } from '@/util/conversion'
import { CW20 } from '@/services/cw20'

async function fetchTokenBalance({
  client,
  token,
  address,
}: {
  client: SigningCosmWasmClient | null
  token:
    | {
        denom?: string
        token_address?: string
        native?: boolean
        decimals?: number
      }
    | undefined
  address: string
}) {
  if (!token) return 0

  const { denom, native, token_address, decimals } = token

  if (!denom && !token_address) {
    throw new Error(
      `No denom or token_address were provided to fetch the balance.`
    )
  }

  /*
   * if this is a native asset or an ibc asset that has juno_denom
   *  */
  if (native) {
    const coin = await client?.getBalance(address, denom ?? '')
    const amount = coin ? Number(coin.amount) : 0
    return convertMicroDenomToDenom(amount, decimals ?? 0)
  }

  /*
   * everything else
   *  */
  if (token_address) {
    const balance = await CW20(client!).use(token_address).balance(address)
    return convertMicroDenomToDenom(Number(balance), decimals ?? 0)
  }

  return 0
}

export const useTokenBalance = (tokenSymbol: string) => {
  const { address, status, client } = useRecoilValue(walletState)

  const tokenInfo = useTokenInfo(tokenSymbol)

  const { data: balance = 0, isLoading } = useQuery(
    ['tokenBalance', tokenSymbol, address],
    async ({ queryKey: [, symbol] }) => {
      if (symbol && client && tokenInfo) {
        return await fetchTokenBalance({
          client,
          address,
          token: tokenInfo,
        })
      }
    },
    {
      enabled: Boolean(tokenSymbol && status === WalletStatusType.connected),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { balance, isLoading }
}

export const useMultipleTokenBalance = (tokenSymbols?: Array<string>) => {
  const { address, status, client } = useRecoilValue(walletState)
  const [tokenList] = useTokenList()

  const queryKey = useMemo(
    () => `multipleTokenBalances/${tokenSymbols?.join('+')}`,
    [tokenSymbols]
  )

  const { data, isLoading } = useQuery(
    [queryKey, address],
    async () => {
      const balances = await Promise.all(
        tokenSymbols!.map((tokenSymbol) =>
          fetchTokenBalance({
            client,
            address,
            token: getTokenInfoFromTokenList(tokenSymbol, tokenList!.tokens),
          })
        )
      )

      return tokenSymbols!.map((tokenSymbol, index) => ({
        tokenSymbol,
        balance: balances[index],
      }))
    },
    {
      enabled: Boolean(
        status === WalletStatusType.connected &&
          tokenSymbols?.length &&
          tokenList?.tokens
      ),

      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,

      onError(error) {
        console.error('Cannot fetch token balance bc:', error)
      },
    }
  )

  return [data, isLoading] as const
}
