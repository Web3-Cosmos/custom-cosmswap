import { HexAddress, SrcAddress } from '@/types/constants'

export interface Token {
  symbol: string
  name: string
  mint: HexAddress
  decimals: string
  icon: string
}
