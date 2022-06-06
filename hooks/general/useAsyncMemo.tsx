import { useRef, useState } from 'react'

import { shrinkToValue } from '@/functions/shrinkToValue'
import { MayFunction, MayPromise } from '@/types/constants'

import { useAsyncEffect } from './useAsyncEffect'

export function useAsyncMemo<V, F = never>(
  asyncGetValue: MayFunction<MayPromise<V>>,
  dependencies?: any[],
  fallbackValue?: undefined
): V | undefined
export function useAsyncMemo<V, F = never>(
  asyncGetValue: MayFunction<MayPromise<V>>,
  dependencies: any[],
  fallbackValue: MayFunction<F>
): V | F
export function useAsyncMemo<V, F = never>(
  asyncGetValue: MayFunction<MayPromise<V>>,
  dependencies?: any[],
  fallbackValue?: MayFunction<F>
): V | F | undefined {
  const [valueState, setValueState] = useState(fallbackValue)
  const activeAsyncSetterNumber = useRef(0)
  const asyncSetterNumber = useRef(0)
  useAsyncEffect(async () => {
    // update async setter number
    const actionNumber = asyncSetterNumber.current
    asyncSetterNumber.current += 1
    activeAsyncSetterNumber.current = actionNumber

    const syncValue = await shrinkToValue(asyncGetValue)

    if (actionNumber == activeAsyncSetterNumber.current) {
      //@ts-expect-error force
      return setValueState(syncValue)
    } else {
      // it means: there should be a newer setAsyncState
      return undefined
    }
  }, dependencies ?? [])
  return valueState
}
