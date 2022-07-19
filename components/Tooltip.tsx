import { CSSProperties, ReactNode, RefObject, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import mergeRef from '@/functions/react/mergeRef'
import { useHover, UseHoverOptions } from '@/hooks/general/useHover'

export interface TooltipProps {
  className?: string
  children?: ReactNode
  tooltip?: ReactNode
  style?: CSSProperties
  domRef?: RefObject<any>
  onClick?: void
}

export default function Tooltip({
  className,
  children,
  tooltip,
  style,
  domRef,
  onClick,
}: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  useHover(ref, { onHoverStart, onHoverEnd })

  function onHoverStart() {
    tipRef.current!.style.display = 'flex'
  }

  function onHoverEnd() {
    tipRef.current!.style.display = 'none'
  }

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <div
        className="absolute -left-4 bottom-10 bg-stack-2 text-primary px-4 py-2 rounded-lg items-center transition-all duration-150 hidden min-w-[400px]"
        ref={tipRef}
        style={{
          filter:
            'drop-shadow(0px 100px 80px rgba(48, 30, 21, 0.07)) drop-shadow(0px 41.7776px 33.4221px rgba(48, 30, 21, 0.0503198)) drop-shadow(0px 22.3363px 17.869px rgba(48, 30, 21, 0.0417275)) drop-shadow(0px 12.5216px 10.0172px rgba(48, 30, 21, 0.035)) drop-shadow(0px 6.6501px 5.32008px rgba(48, 30, 21, 0.0282725)) drop-shadow(0px 2.76726px 2.21381px rgba(48, 30, 21, 0.0196802))',
        }}
      >
        <div className="absolute h-3 w-3 -bottom-1.5 left-5 bg-stack-2 text-primary rotate-45" />
        {tooltip}
      </div>

      {children}
    </div>
  )
}
