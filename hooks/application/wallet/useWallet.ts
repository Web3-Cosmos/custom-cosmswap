import BN from 'bn.js'
import create from 'zustand'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { WalletInfo } from '../token/constants'
import { SUPPORTED_WALLETS } from '@/hooks/application/token/constants'

export type WalletStore = {
  // account
  account: string | undefined

  wallets: Record<string, WalletInfo>

  connected: boolean
  disconnecting: boolean
  connecting: boolean

  connect(connector: AbstractConnector ): void
  disconnect(): void
  error: any
  
  // just for trigger refresh
  refreshCount: number
  refreshWallet(): void
}

export const useWallet = create<WalletStore>((set, get) => ({
  // account
  account: undefined,

  wallets: SUPPORTED_WALLETS,

  connected: false,
  disconnecting: false,
  connecting: false,

  connect: () => {},
  disconnect: () => {},
  error: {},

  refreshCount: 0,
  async refreshWallet() {}
}))
