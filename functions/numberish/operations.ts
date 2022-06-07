// @ts-nocheck
import { Numberish } from '@/types/constants'
import { gt, lt } from './compare'

import toFraction from './toFraction'

export function mul(a: Numberish, b: Numberish): Numberish
export function mul(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined
export function mul(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined {
  if (a == null || b == null) return undefined
  const fa = toFraction(a)
  const fb = toFraction(b)
  return fa.mul(fb)
}
export const multiply = mul

export function div(a: Numberish, b: Numberish): Numberish
export function div(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined
export function div(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined {
  if (a == null || b == null) return undefined
  const fa = toFraction(a)
  const fb = toFraction(b)
  try {
    return fa.div(fb) // if fb is zero , operation will throw error
  } catch {
    return fa
  }
}
export const divide = div

export function add(a: Numberish, b: Numberish): Numberish
export function add(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined
export function add(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined {
  if (a == null || b == null) return undefined
  const fa = toFraction(a)
  const fb = toFraction(b)
  return fa.add(fb)
}
export const plus = add

export function sub(a: Numberish, b: Numberish): Numberish
export function sub(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined
export function sub(a: Numberish | undefined, b: Numberish | undefined): Numberish | undefined {
  if (a == null || b == null) return undefined
  const fa = toFraction(a)
  const fb = toFraction(b)
  return fa.sub(fb)
}
export const minus = sub

export function abs(v: Numberish): Numberish {
  if (lt(v, 0)) {
    return mul(v, -1)
  } else return mul(v, 1)
}

export function getMax(a: Numberish, b: Numberish): Numberish {
  return gt(b, a) ? b : a
}

export function getMin(a: Numberish, b: Numberish): Numberish {
  return lt(b, a) ? b : a
}
