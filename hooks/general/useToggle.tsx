import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'

type MayFunc<T, Params extends any[] = any[]> = T | ((...params: Params) => T)
export interface ToggleSyncFunction {
  on(): void
  off(): void
  toggle(): void
  set(b: boolean): void
}
export type UseToggleReturn = [
  boolean,
  {
    delayOn(): void
    delayOff(): void
    delayToggle(): void
    delaySet(): void
    cancelDelayAction(): void
    on(): void
    off(): void
    toggle(): void
    set(b: boolean): void
  }
]

/**
 * it too widely use that there should be a hook
 * @param initValue
 */
export function useToggle(
  initValue: MayFunc<boolean> = false,
  options: {
    /**only affact delay-* and canelDelayAction */
    delay?: number
    /* usually it is for debug */
    onOff?(): void
    /* usually it is for debug */
    onOn?(): void
    /* usually it is for debug */
    onToggle?(): void
  } = {}
): UseToggleReturn {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const opts = { ...{ delay: 800 }, ...options }
  const [isOn, _setIsOn] = useState(initValue)
  // eslint-disable-next-line no-undef
  const [delayActionId, setDelayActionId] = useState<number | NodeJS.Timeout>(0)
  const setIsOn = (...params: any[]) => {
    //@ts-expect-error temp
    _setIsOn(...params)
  }
  const cancelDelayAction = useCallback(() => {
    // @ts-expect-error clearTimeout is not type-safe between browser and nodejs
    // eslint-disable-next-line no-undef
    globalThis.clearTimeout(delayActionId)
  }, [delayActionId])
  const on = useCallback(() => {
    cancelDelayAction()
    setIsOn(true)
    opts.onOn?.()
  }, [cancelDelayAction, opts])
  const off = useCallback(() => {
    cancelDelayAction()
    setIsOn(false)
    opts.onOff?.()
  }, [cancelDelayAction, opts])
  const toggle = useCallback(() => {
    cancelDelayAction()
    setIsOn((b: any) => {
      if (b) opts.onOff?.()
      if (!b) opts.onOn?.()
      return !b
    })
    opts.onToggle?.()
  }, [cancelDelayAction, opts])

  const delayOn = useCallback(() => {
    cancelDelayAction()
    // eslint-disable-next-line no-undef
    const actionId = globalThis.setTimeout(on, opts.delay)
    setDelayActionId(actionId)
  }, [cancelDelayAction, on, opts.delay])
  const delayOff = useCallback(() => {
    cancelDelayAction()
    // eslint-disable-next-line no-undef
    const actionId = globalThis.setTimeout(off, opts.delay)
    setDelayActionId(actionId)
  }, [cancelDelayAction, off, opts.delay])
  const delayToggle = useCallback(() => {
    cancelDelayAction()
    // eslint-disable-next-line no-undef
    const actionId = globalThis.setTimeout(toggle, opts.delay)
    setDelayActionId(actionId)
  }, [cancelDelayAction, opts.delay, toggle])
  const delaySet = useCallback(() => {
    cancelDelayAction()
    // eslint-disable-next-line no-undef
    const actionId = globalThis.setTimeout(setIsOn, opts.delay)
    setDelayActionId(actionId)
  }, [cancelDelayAction, opts.delay])

  const controller = useMemo(
    () => ({
      cancelDelayAction,
      delayOn,
      delayOff,
      delayToggle,
      delaySet,

      on,
      off,
      toggle,
      set: setIsOn,
    }),
    [
      cancelDelayAction,
      delayOn,
      delayOff,
      delayToggle,
      delaySet,
      on,
      off,
      toggle,
    ]
  )
  return [isOn, controller]
}

export function createToggleController<T extends Dispatch<SetStateAction<any>>>(
  setState: T
) {
  return {
    on: () => setState(true),
    off: () => setState(false),
    toggle: () => setState((b: any) => !b),
    set: (newState: any) => setState(newState),
  }
}
