import { atom } from 'recoil'

export type TokenItemState = {
  tokenSymbol: string | null
  amount: number
}

export const tokenSwapAtom = atom<[TokenItemState, TokenItemState, boolean]>({
  key: 'tokenSwap',
  default: [
    {
      tokenSymbol: null,
      amount: 0,
    },
    {
      tokenSymbol: null,
      amount: 0,
    },
    true,
  ],
  effects_UNSTABLE: [
    function validateIfTokensAreSame({ onSet, setSelf }) {
      onSet((newValue, oldValue) => {
        const [tokenA, tokenB] = newValue
        if (tokenA.tokenSymbol === tokenB.tokenSymbol) {
          requestAnimationFrame(() => {
            // @ts-ignore
            setSelf([oldValue[1], oldValue[0], true])
          })
        }
      })
    },
  ],
})

export const slippageAtom = atom<number>({
  key: 'slippageForSwap',
  default: 0.01,
})
