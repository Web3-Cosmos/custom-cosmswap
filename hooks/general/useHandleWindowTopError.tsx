import { useEffect } from 'react'

import { useNotification } from '@/hooks/application/notification/useNotification'

export function useHandleWindowTopError() {
  const { log } = useNotification.getState()
  useEffect(() => {
    globalThis.addEventListener?.('error', (event) => {
      log({ type: 'error', title: String(event.error) })
      console.error(event)
      event.preventDefault()
      event.stopPropagation()
    })
    globalThis.addEventListener?.('unhandledrejection', (event) => {
      log({ type: 'error', title: String(event.reason) })
      console.error(event)
      event.preventDefault()
      event.stopPropagation()
    })
  }, [])
}
