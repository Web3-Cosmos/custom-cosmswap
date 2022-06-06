import parseNumberInfo from '@/functions/numberish/parseNumberInfo'
import { Numberish } from '@/types/constants'

export default function toFraction(value: Numberish): Numberish {
  //  to complete math format(may have decimal), not int
  // if (value instanceof Percent) return new Fraction(value.numerator, value.denominator)

  // if (value instanceof Price) return value.adjusted

  // to complete math format(may have decimal), not BN
  // if (value instanceof TokenAmount) return toFraction(value.toExact())

  // do not ideal with other fraction value
  // if (value instanceof Fraction) return value

  // wrap to Fraction
  // const n = value instanceof Decimal ? String(value.toString()) : String(value)
  // const details = parseNumberInfo(n)
  // return new Fraction(details.numerator, details.denominator)
  return value
}
