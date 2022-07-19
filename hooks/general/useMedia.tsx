import { useState } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * @see https://usehooks.com/useMedia/
 */
export function useMedia<T>(
  queries: string[] | string,
  values: T[],
  defaultValue: T
): T
// eslint-disable-next-line no-redeclare
export function useMedia<T>(
  queries: string[] | string,
  values: T[],
  defaultValue?: undefined
): T | undefined
// eslint-disable-next-line no-redeclare
export function useMedia<T>(
  queries: string[] | string,
  values: T[],
  defaultValue?: T
) {
  const [value, setValue] = useState(defaultValue)
  useIsomorphicLayoutEffect(() => {
    const mediaQueryLists = [queries]
      .flat()
      // eslint-disable-next-line no-undef
      .map((q) => globalThis.matchMedia?.(q))
      .filter(Boolean)
    const getValue = () =>
      values[mediaQueryLists.findIndex((mql) => mql.matches)] ?? defaultValue
    setValue(getValue)

    const handler = () => setValue(getValue)
    mediaQueryLists.forEach((mql) => mql.addEventListener('change', handler)) // as it's a event callback, function may be invoked after init useEffect of React.
    return () =>
      mediaQueryLists.forEach((mql) =>
        mql.removeEventListener('change', handler)
      )
  }, [])
  return value
}
