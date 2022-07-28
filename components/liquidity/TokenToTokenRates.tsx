import { Row } from '@/components'

import { usePriceForOneToken } from '@/hooks/application/token/usePriceForOneToken'
import { useTxRates } from '@/hooks/application/transaction/useTxRates'

import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from '@/util/conversion'

export const TokenToTokenRates = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAAmount,
  isLoading,
}: {
  tokenASymbol: string
  tokenBSymbol: string
  tokenAAmount: number
  isLoading: boolean
}) => {
  const [oneTokenToTokenPrice] = usePriceForOneToken({
    tokenASymbol,
    tokenBSymbol,
  })

  const { isShowing, conversionRate, conversionRateInDollar, dollarValue } =
    useTxRates({
      tokenASymbol,
      tokenBSymbol,
      tokenAAmount,
      tokenToTokenPrice: oneTokenToTokenPrice! * tokenAAmount,
      isLoading,
    })

  return (
    <Row className={`justify-between ${isShowing ? '' : 'invisible'}`}>
      <div className="text-secondary text-xs">
        1 {tokenASymbol} ≈ {formatTokenBalance(conversionRate!)} {tokenBSymbol}
        {' ≈ '}$
        {dollarValueFormatterWithDecimals(conversionRateInDollar!, {
          includeCommaSeparation: true,
        })}
      </div>
      <div className="text-secondary text-xs text-right">
        $
        {dollarValueFormatterWithDecimals(dollarValue * 2, {
          includeCommaSeparation: true,
        })}
      </div>
    </Row>
  )
}
