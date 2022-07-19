import create from 'zustand'

import { getPlatformInfo } from '@/functions/dom/getPlatformInfo'

export type AppSettingsStore = {
  themeMode: 'dark' | 'light'
  isBetaBubbleOn: boolean // temp for beta

  // detect device
  isMobile: boolean
  isTablet: boolean
  isPc: boolean

  /** sould block any update when approve panel shows on  */
  isApprovePanelShown: boolean

  /** (ui panel controller) ui dialog open flag */
  isWalletSelectShown: boolean

  // <RefreshCircle /> needs a place to store state across app
  refreshCircleLastTimestamp: {
    [key: string]: {
      endProcessPercent: number
      endTimestamp: number
    }
  }
}

export const useAppSettings = create<AppSettingsStore>(() => ({
  themeMode: 'dark',
  isBetaBubbleOn: true,
  isMobile: getPlatformInfo()?.isMobile ?? false,
  isTablet: getPlatformInfo()?.isMobile ?? false,
  isPc: getPlatformInfo()?.isPc ?? false,
  isApprovePanelShown: false,
  isWalletSelectShown: false,
  refreshCircleLastTimestamp: {},
}))
