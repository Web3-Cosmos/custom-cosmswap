import create from 'zustand'

export type TokenStore = {
  availableTokens: any[]
  filteredTokens: any[]
  availableTokenListSettings: Record<string, any>
  tokens: Record<any, any>
}

export const useToken = create<TokenStore>((set, get) => ({
  availableTokens: [],
  filteredTokens: [],
  availableTokenListSettings: {},
  tokens: {}
}))
