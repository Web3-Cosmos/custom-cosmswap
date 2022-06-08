import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

import {
  Dialog,
  DialogProps,
  Drawer,
  DrawerProps,
} from '@/components'

export default function ResponsiveDialogDrawer(props: DrawerProps | DialogProps) {
  const isMobile = useAppSettings((s) => s.isMobile)
  return isMobile ? <Drawer {...props}>{props.children}</Drawer> : <Dialog {...props}>{props.children}</Dialog>
}
