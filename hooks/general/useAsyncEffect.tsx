import { useEffect } from 'react'

import { isFunction } from '@/functions/judgers/dateType'

export function useAsyncEffect<V>(asyncEffect: () => Promise<V>, dependencies?: any[]): void
export function useAsyncEffect<V>(
  asyncEffect: () => Promise<V>,
  cleanFunction: () => any,
  dependencies?: any[]
): void

export function useAsyncEffect<V>(asyncEffect: () => Promise<V>, param2?: any, param3?: any): void {
  const cleanFunction = isFunction(param2) ? param2 : undefined
  const dependencies = isFunction(param2) ? param3 : param2
  useEffect(() => {
    asyncEffect()
    return cleanFunction
  }, dependencies)
}
