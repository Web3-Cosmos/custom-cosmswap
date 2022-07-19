import { POOL_TOKENS_DECIMALS } from '../constants'
import { convertMicroDenomToDenom } from './conversion'

export const calcPoolTokenValue = ({
  tokenAmountInMicroDenom,
  tokenSupply,
  tokenReserves,
}: {
  tokenAmountInMicroDenom: number
  tokenSupply: number
  tokenReserves: number
}) => {
  return convertMicroDenomToDenom(
    (tokenAmountInMicroDenom / tokenSupply) * tokenReserves,
    POOL_TOKENS_DECIMALS
  )
}

export const calcPoolTokenDollarValue = ({
  tokenAmountInMicroDenom,
  tokenSupply,
  tokenReserves,
  tokenDollarPrice,
}: {
  tokenAmountInMicroDenom: number
  tokenSupply: number
  tokenReserves: number
  tokenDollarPrice: number
}) => {
  return (
    calcPoolTokenValue({
      tokenAmountInMicroDenom,
      tokenSupply,
      tokenReserves,
    }) *
    tokenDollarPrice *
    2
  )
}
