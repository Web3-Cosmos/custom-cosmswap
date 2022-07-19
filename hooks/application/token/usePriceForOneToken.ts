import { useTokenToTokenPrice } from '@/hooks/application/token/useTokenToTokenPrice'
import { usePersistance } from '@/hooks/general/usePersistance'

export const usePriceForOneToken = ({
  tokenASymbol,
  tokenBSymbol,
}: {
  tokenASymbol: string
  tokenBSymbol: string
}) => {
  const [currentTokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenASymbol,
    tokenBSymbol: tokenBSymbol,
    tokenAmount: 1,
  })

  const persistPrice = usePersistance(
    isPriceLoading ? undefined : currentTokenPrice
  )

  return [persistPrice, isPriceLoading] as const
}
