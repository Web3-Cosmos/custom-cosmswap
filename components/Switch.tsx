import { CSSProperties, RefObject, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { Switch as Swi } from '@headlessui/react'

/**
 * @baseUI
 */

export interface SwitchProps {
  defaultChecked?: boolean
  disabled?: boolean
  domRef?: RefObject<HTMLButtonElement>
  className?: string
  thumbClassName?: string
  style?: CSSProperties
  onToggle?: (checked: boolean) => void
}

export default function Switch({
  defaultChecked,
  disabled,
  domRef,
  className = '',
  thumbClassName = '',
  style,
  onToggle
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(Boolean(defaultChecked))
  return (
    <Swi
      ref={domRef}
      checked={isChecked}
      onChange={
        ((checked) => {
          if (disabled) return
          setIsChecked((b) => !b)
          onToggle?.(checked)
        }) ?? (() => {})
      }
      className={twMerge(
        `Switch ${
          isChecked ? (disabled ? 'bg-primary opacity-50' : 'bg-primary') : 'bg-stack-3'
        } relative flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full ${
          disabled ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'
        } transition-all ease-in-out duration-200 focus:outline-none`,
        className
      )}
      style={style}
    >
      <span
        className={`${isChecked ? 'left-full -translate-x-full' : 'left-0'}
          pointer-events-none absolute top-1/2 h-4 w-4  rounded-full ${
            isChecked ? 'bg-white' : 'bg-primary opacity-50'
          } shadow-lg transform -translate-y-1/2 transition-all duration-200 ${thumbClassName}
        `}
      />
    </Swi>
  )
}

// TODO: dev it!
// export function UncontolledSwitcher(props: ComponentProps<typeof Switcher>){
//   return null
// }
