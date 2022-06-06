import { Numberish } from '@/types/constants'
import { BN } from 'bn.js'

import toBN from './toBN'
import toFraction from './toFraction'

export function lt(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator).lt(new BN(0))
}

export function gt(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator).gt(new BN(0))
}

export function lte(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator).lte(new BN(0))
}

export function gte(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator).gte(new BN(0))
}

export function eq(a: Numberish | undefined, b: Numberish | undefined): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator).eq(new BN(0))
}

export function isMeaningfulNumber(n: Numberish | undefined): n is Numberish {
  if (n == null) return false
  return !eq(n, 0)
}

export function isMeaninglessNumber(n: Numberish | undefined): n is Numberish {
  if (n == null) return true
  return eq(n, 0)
}

export default function compare(
  mode: 'lt' | 'gt' | 'lte' | 'gte' | 'eq' | 'lessThan' | 'greatThan' | 'lessThanEqual' | 'greatThanEqual' | 'equal',
  a: Numberish,
  b: Numberish
): boolean {
  switch (mode) {
    case 'lessThan':
    case 'lt':
      return lt(a, b)

    case 'greatThan':
    case 'gt':
      return gt(a, b)

    case 'lessThanEqual':
    case 'lte':
      return lte(a, b)

    case 'greatThanEqual':
    case 'gte':
      return gte(a, b)

    case 'equal':
    case 'eq':
      return eq(a, b)
  }
}
