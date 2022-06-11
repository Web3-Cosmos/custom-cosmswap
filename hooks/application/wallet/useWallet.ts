import BN from 'bn.js'
import create from 'zustand'

export type WalletStore = {
  // owner
  owner: string | undefined

  wallets: any[]

  connected: boolean
  disconnecting: boolean
  connecting: boolean

  select(walletName: string): void
  disconnect(): Promise<unknown>
  
  // just for trigger refresh
  refreshCount: number
  refreshWallet(): void
}

export const useWallet = create<WalletStore>((set, get) => ({
  // owner
  owner: undefined,

  wallets: [...Array(7).keys()].map(value => ({
    adapter: { name: `Phantom_${value}` },
    readyState: value % 2 === 0 ? 'installed' : 'notInstalled',
  })),

  connected: false,
  disconnecting: false,
  connecting: false,

  select: () => {},
  disconnect: () => Promise.resolve(),

  refreshCount: 0,
  async refreshWallet() {}
}))
