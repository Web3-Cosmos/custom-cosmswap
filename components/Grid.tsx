import { CSSProperties, ReactNode, RefObject, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useClick } from '@/hooks/general/useClick'
import mergeRef from '@/functions/react/mergeRef'

export interface GridProps {
  className?: string
  children?: ReactNode
  style?: CSSProperties
  domRef?: RefObject<HTMLDivElement | HTMLElement>
  onClick?: () => void
}

/**
 * actually, it's just a `<div>` with grid
 */
export default function Grid({
  className,
  children,
  style,
  domRef,
  onClick,
}: GridProps) {
  const ref = useRef<HTMLDivElement>()

  useClick(ref, { onClick, disable: !onClick })

  return (
    <div
      ref={mergeRef(domRef, ref) as RefObject<HTMLDivElement>}
      className={twMerge('grid', className)}
      style={style}
    >
      {children}
    </div>
  )
}
