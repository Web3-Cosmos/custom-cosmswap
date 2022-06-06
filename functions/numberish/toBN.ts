import BN from 'bn.js'

import { Numberish } from '@/types/constants'

import toFraction from './toFraction'

/**
 * only int part will become BN
 */
export default function toBN(n: Numberish | BN, decimal: Numberish = 0): BN {
  if (n instanceof BN) return n
  // return new BN(
  //   toFraction(n)
  //     .mul(TEN.pow(new BN(String(decimal))))
  //     .toFixed(0)
  // )
  return new BN(n.toString())
}
