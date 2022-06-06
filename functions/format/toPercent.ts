import BN from 'bn.js'

import { Numberish } from '@/types/constants'

/**
 * @example
 * toPercent(3.14) // => Percent { 314.00% }
 * toPercent(3.14, { alreadyDecimaled: true }) // => Percent {3.14%}
 */
export function toPercent(n: Numberish, options?: { /* usually used for backend data */ alreadyDecimaled?: boolean }) {
  // const { numerator, denominator } = parseNumberInfo(n)
  // return new Percent(new BN(numerator), new BN(denominator).mul(options?.alreadyDecimaled ? new BN(100) : new BN(1)))
  if (options?.alreadyDecimaled) {
    return n
  } else {
    return Number(n) * 100
  }
}
