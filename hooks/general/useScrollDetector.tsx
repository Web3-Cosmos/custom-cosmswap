import { RefObject, useEffect, useRef, useState } from 'react'

import isClientSide from '@/functions/judgers/isSSR'

/**
 * auto-add --is-scrolling, which will be used by frosted-glass
 */
export function useDocumentScrollDetector() {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (!('document' in globalThis)) return
    let timeoutId: any
    document.addEventListener(
      'scroll',
      () => {
        // eslint-disable-next-line no-undef
        globalThis.document.body.style.setProperty('--is-scrolling', '1')
        // eslint-disable-next-line no-undef
        globalThis.clearTimeout(timeoutId)
        // eslint-disable-next-line no-undef
        timeoutId = globalThis.setTimeout(() => {
          // eslint-disable-next-line no-undef
          globalThis.document.body.style.setProperty('--is-scrolling', '0')
        }, 500)
      },
      { passive: true }
    )
  }, [])
}

export function useScrollDetector(
  /** if not specified , it will be document by default  */
  elRef: RefObject<HTMLElement | null>
) {
  if (!isClientSide) return

  // --is-scrolling
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let timeoutId: any

    const scrollingDetector = () => {
      elRef.current?.style.setProperty('--is-scrolling', '1')
      // eslint-disable-next-line no-undef
      globalThis.clearTimeout(timeoutId)
      // eslint-disable-next-line no-undef
      timeoutId = globalThis.setTimeout(() => {
        elRef.current?.style.setProperty('--is-scrolling', '0')
      }, 500)
    }
    elRef.current?.addEventListener('scroll', scrollingDetector, {
      passive: true,
    })
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      elRef.current?.removeEventListener('scroll', scrollingDetector)
      // eslint-disable-next-line no-undef
      globalThis.clearTimeout(timeoutId)
    }
  }, [elRef])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [refreshDetector, updateScrollDetector] = useState(0)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resizeObserver = useRef<ResizeObserver | undefined>(
    // eslint-disable-next-line no-undef
    'ResizeObserver' in globalThis
      ? // eslint-disable-next-line no-undef
        new globalThis.ResizeObserver(() => {
          updateScrollDetector((n) => n + 1)
        })
      : undefined
  )

  // observe the element if it load more and more children
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!elRef.current) return () => {}
    resizeObserver.current?.observe(elRef.current)
    return () =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      elRef.current && resizeObserver.current?.unobserve(elRef.current)
  }, [elRef])

  // --scroll-top & --scroll-height & --client-eight
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const scrollingPropertyDetector = () => {
      const { scrollTop, scrollHeight, clientHeight } = elRef.current!
      elRef.current?.style.setProperty('--scroll-top', `${scrollTop}`)
      elRef.current?.style.setProperty('--scroll-height', `${scrollHeight}`)
      elRef.current?.style.setProperty('--client-height', `${clientHeight}`)
    }
    elRef.current?.addEventListener('scroll', scrollingPropertyDetector, {
      passive: true,
    })
    return () =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      elRef.current?.removeEventListener('scroll', scrollingPropertyDetector)
  }, [elRef, refreshDetector])
}
