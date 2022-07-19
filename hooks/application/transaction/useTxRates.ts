import { useTokenDollarValue } from '@/hooks/application/token/useTokenDollarValue'
import { usePriceForOneToken } from '@/hooks/application/token/usePriceForOneToken'
import { usePersistance } from '@/hooks/general/usePersistance'
import { protectAgainstNaN } from '@/util/conversion'

function calculateTokenToTokenConversionRate({
  tokenAAmount,
  tokenToTokenPrice,
  oneTokenToTokenPrice,
}: {
  tokenAAmount: number
  tokenToTokenPrice: number
  oneTokenToTokenPrice: number | undefined
}) {
  if (tokenAAmount === 0) {
    return oneTokenToTokenPrice ?? 0
  }

  return tokenToTokenPrice / tokenAAmount
}

function calculateTokenToTokenConversionDollarRate({
  conversionRate,
  tokenADollarPrice,
  oneTokenToTokenPrice,
  tokenAAmount,
}: {
  conversionRate: number
  tokenADollarPrice: number
  oneTokenToTokenPrice: number
  tokenAAmount: number
}) {
  if (tokenAAmount === 0) {
    return tokenADollarPrice
  }

  return (tokenADollarPrice * conversionRate) / oneTokenToTokenPrice
}

export const useTxRates = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAAmount,
  tokenToTokenPrice,
  isLoading,
}: {
  tokenASymbol: string
  tokenBSymbol: string
  tokenAAmount: number
  tokenToTokenPrice: number
  isLoading: boolean
}) => {
  const [tokenADollarPrice, fetchingTokenDollarPrice] =
    useTokenDollarValue(tokenASymbol)

  const [oneTokenToTokenPrice] = usePriceForOneToken({
    tokenASymbol: tokenASymbol,
    tokenBSymbol: tokenBSymbol,
  })

  const dollarValue = (tokenADollarPrice || 0) * (tokenAAmount || 0)

  const shouldShowRates =
    (tokenASymbol &&
      tokenBSymbol &&
      tokenToTokenPrice > 0 &&
      typeof tokenAAmount === 'number' &&
      typeof tokenToTokenPrice === 'number') ||
    (oneTokenToTokenPrice && tokenAAmount === 0)

  const conversionRate = usePersistance(
    isLoading || fetchingTokenDollarPrice || !shouldShowRates
      ? undefined
      : protectAgainstNaN(
          calculateTokenToTokenConversionRate({
            tokenAAmount,
            tokenToTokenPrice,
            oneTokenToTokenPrice,
          })
        )
  )

  const conversionRateInDollar = usePersistance(
    isLoading || fetchingTokenDollarPrice || !shouldShowRates
      ? undefined
      : protectAgainstNaN(
          calculateTokenToTokenConversionDollarRate({
            tokenAAmount,
            conversionRate:
              typeof conversionRate === 'undefined' ? 0 : conversionRate,
            tokenADollarPrice,
            oneTokenToTokenPrice:
              typeof oneTokenToTokenPrice === 'undefined'
                ? 0
                : oneTokenToTokenPrice,
          })
        )
  )

  return {
    isShowing: Boolean(shouldShowRates),
    conversionRate,
    conversionRateInDollar,
    dollarValue,
  }
}
