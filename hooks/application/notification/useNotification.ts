import { ReactNode } from 'react'
import create from 'zustand'

export interface NotificationItemInfo {
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
}

export interface ConfirmDialogInfo {
  cardWidth?: 'md' | 'lg'
  type?: 'success' | 'warning' | 'error' | 'info' | 'no-head-icon'
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  additionalContent?: ReactNode
  onlyConfirmButton?: boolean
  confirmButtonText?: ReactNode
  cancelButtonText?: ReactNode
  onCancel?(): void
  onConfirm?(): void
}

export interface NotificationStore {
  log(info: NotificationItemInfo): void
  logTxid(txid: string, title: string, options?: { isSuccess: boolean }): void
  logError(title: unknown, description?: ReactNode): void
  logWarning(title: string, description?: ReactNode): void
  logSuccess(title: string, description?: ReactNode): void
  logInfo(title: string, description?: ReactNode): void
  popConfirm(info: ConfirmDialogInfo): void
  popupWelcomeDialog(renderContent: ReactNode, cb?: { onConfirm?: () => void }): void
}

/** zustand store hooks */
export const useNotification = create<NotificationStore>(() => ({
  log: () => {},
  logTxid: () => {},
  logError: () => {},
  logWarning: () => {},
  logSuccess: () => {},
  logInfo: () => {},
  popConfirm: () => {},
  popupWelcomeDialog: () => {}
}))

