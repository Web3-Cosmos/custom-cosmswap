import {
  RefObject,
  useRef,
  useImperativeHandle,
  CSSProperties
} from 'react'
import {
  Row,
  CoinAvatar,
} from '@/components'
import { twMerge } from 'tailwind-merge'

export interface CoinInputBoxHandle {
  focusInput?: () => void
  selectToken?: () => void
}

export interface CoinInputBoxProps {
  className?: string
  style?: CSSProperties
  domRef?: RefObject<any>,
  componentRef?: RefObject<any>
  disabled?: boolean
  disabledInput?: boolean
  disabledTokenSelect?: boolean
  canSelect?: boolean
}

export default function CoinInputBox({
  className,
  style,
  domRef,
  componentRef,
  disabled,
  disabledInput: innerDisabledInput,
  disabledTokenSelect: innerDisabledTokenSelect,
  canSelect,
}: CoinInputBoxProps) {

  const disabledInput = disabled || innerDisabledInput
  const disabledTokenSelect = disabled || innerDisabledTokenSelect

  const inputRef = useRef<HTMLInputElement>(null)
  const focusInput = () => inputRef.current?.focus()

  useImperativeHandle(componentRef, () => ({
    focusInput: () => focusInput(),
    selectToken: () => {}
  } as CoinInputBoxHandle))

  return (
    <Row
      className={twMerge(`flex-col bg-[#141041] cursor-text rounded-xl py-3 px-6 mobile:px-4`, className)}
      style={style}
      htmlProps={{tabIndex: 0}}
      onClick={({ target }) => {
        const isClickSelf = target === domRef?.current
        if (isClickSelf) focusInput()
      }}
    >
      <Row className="justify-between mb-2 mobile:mb-4">
        <div
          className={`text-xs mobile:text-2xs justify-self-end text-[rgba(171,196,255,.5)] ${
            disabledInput ? '' : 'clickable no-clicable-transform-effect clickable-filter-effect'
          }`}
          onClick={() => {
            if (disabled) return
          }}
        >
          Wallet not connected
        </div>
      </Row>

      <Row className="col-span-full items-center">
        <Row
          className={`items-center gap-1.5 ${
            canSelect && !disabledTokenSelect ? 'clickable clickable-mask-offset-2' : ''
          }`}
          onClick={(ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            if (disabledTokenSelect) return
          }}
        >
          <CoinAvatar  />
        </Row>
      </Row>
    </Row>
  )
}