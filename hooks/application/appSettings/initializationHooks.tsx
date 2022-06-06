import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from '@/components/Link'

import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useNotification } from '@/hooks/application/notification/useNotification'

import { useDevice } from '@/hooks/general/useDevice'
import { useIsomorphicLayoutEffect } from '@/hooks/general/useIsomorphicLayoutEffect '
import { useLocalStorageItem } from '@/hooks/general/useLocalStorage'
import { useRecordedEffect } from '@/hooks/general/useRecordedEffect'

export function useThemeModeSync() {
  const themeMode = useAppSettings(s => s.themeMode)

  useEffect(() => {
    globalThis.document?.documentElement.classList.remove('dark', 'light')
    globalThis.document?.documentElement.classList.add(themeMode)
  }, [themeMode])
}

export function useDeviceInfoSync() {
  const { isMobile, isPc, isTablet } = useDevice()
  useIsomorphicLayoutEffect(() => {
    useAppSettings.setState({ isMobile, isTablet, isPc})
  }, [isMobile, isTablet, isPc])
}

export function useWelcomeDialog(options?: { force?: boolean }) {
  const [haveReadWelcomeDialog, setHaveReadWelcomeDialog] = useLocalStorageItem<boolean>('HAVE_READ_WELCOME_DIALOG')
  const { pathname } = useRouter()

  useRecordedEffect(([prevPathname]) => {
    if (haveReadWelcomeDialog) return

    if (!haveReadWelcomeDialog && (prevPathname === '/' || !prevPathname) && pathname !== '/') {
      setTimeout(() => {
        // popWelcomeDialogFn({ onConfirm: () => setHaveReadWelcomDialog(true) })
      }, 700) // TODO: when done callback delay invoke, don't need setTimeout any more
    }
  }, [pathname])
}

export function popupWelcomeDialogFn(cb?: { onConfirm: () => void }) {
  useNotification.getState().popupWelcomeDialog(
    <div>
      <div className="text-2xl text-white text-center m-4 mb-8">
        Welcome to Autonomy Cosm Swap
      </div>
      <div className="text-[#c4d6ff] mb-4">
        Autonomy Cosm Swap is built for a faster, more streamlined experience. However, it is{' '}
        <span className="text-[#39D0D8] font-bold">still under development</span>.
      </div>
      <div className="text-[#C4D6FF] mb-4 ">
        You can still use <Link href="https://v1.raydium.io/swap">V1</Link> for full features.
      </div>
      <div className="text-[#C4D6FF] mb-4 ">
        Help Autonomy improve by reporting bugs <Link href="https://forms.gle/DvUS4YknduBgu2D7A">here</Link>, or in{' '}
        <Link href="https://discord.gg/raydium">Discord.</Link>
      </div>
    </div>,
    {
      onConfirm: () => cb?.onConfirm?.()
    }
  )
}