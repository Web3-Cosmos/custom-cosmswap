import React from 'react'
import { twMerge } from 'tailwind-merge'
import Row from '@/components/Row'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'

export interface BadgeProps {
  className?: string
  children: React.ReactNode
  cssColor?: string
  noOutline?: boolean
  /** default: outline */
  type?: 'solid' | 'outline'
  /** default 'md' */
  size?: 'md' | 'sm'
}

export default function Badge({
  className,
  children,
  cssColor,
  noOutline,
  type,
  size,
}: BadgeProps) {
  const isMobile = useAppSettings((s) => s.isMobile)
  const defaultSize = size ?? (isMobile ? 'sm' : 'md')
  return (
    <Row
      className={twMerge(
        `inline text-center items-center ${defaultSize === 'sm' ? 'p-1 text-xs' : 'p-1 px-2 text-sm'} ${
          type === 'solid'
            ? 'bg-primary'
            : `${noOutline ? '' : 'border'} border-primary`
        } rounded-full text-primary`,
        className
      )}
      style={{
        color: cssColor ?? ''
      }}
    >
      {children}
    </Row>
  )
}
