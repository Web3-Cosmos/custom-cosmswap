import {
  RefObject,
  useRef,
  useImperativeHandle,
  CSSProperties,
  ReactNode,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { useRecoilValue } from 'recoil'
import { Row, CoinAvatar, Icon, Button, Input, Badge } from '@/components'
import { useTxRates } from '@/hooks/application/transaction/useTxRates'
import { tokenSwapAtom } from '@/hooks/application/atoms/swapAtoms'
import { isString } from '@/functions/judgers/dateType'

export interface RateInputBoxProps {
  className?: string
  style?: CSSProperties
  domRef?: RefObject<any>
  disabled?: boolean
  disabledInput?: boolean
  disabledTokenSelect?: boolean
  price: number
  isPriceLoading: boolean
  rate: number
  onPriceChange: (amount: number) => void
}

export default function RateInputBox({
  className,
  style,
  domRef,
  disabled,
  disabledInput: innerDisabledInput,
  disabledTokenSelect: innerDisabledTokenSelect,
  price,
  isPriceLoading,
  rate,
  onPriceChange,
}: RateInputBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const isOutsideValueLocked = useRef(false)

  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  const handlePrice = (val: string) => onPriceChange?.(+val)

  return (
    <Row
      className={twMerge(
        `flex bg-stack-3 cursor-text rounded-xl py-3 px-3 mobile:px-4`,
        className
      )}
      style={style}
      htmlProps={{ tabIndex: 0 }}
    >
      <Row className="flex-col flex-1 pr-3">
        {/* rate */}
        <Row className="mb-2 mobile:mb-4 items-center px-2">
          <div className="text-xs font-bold mobile:text-sm text-primary">
            Rate:
          </div>
        </Row>

        <Row className="justify-between mb-2 mobile:mb-4 px-2 invisible">
          <div className="text-xs mobile:text-sm font-medium text-primary">
            Balance: 122.23
          </div>
        </Row>

        {/* input */}
        <Row
          className="items-center justify-between gap-1.5 bg-stack-4 py-2 px-8 rounded-xl h-full border-stack-4 border-2"
          onClick={(ev) => {
            ev.stopPropagation()
            ev.preventDefault()
          }}
        >
          <Input
            className="font-extrabold text-lg text-primary flex-grow h-full"
            // disabled={disabledInput}
            type="number"
            // pattern={validPattern}
            componentRef={inputRef}
            value={`${price}`}
            onUserInput={handlePrice}
            onEnter={() => {}}
            inputClassName="text-left mobile:text-sm font-bold"
            inputHTMLProps={{
              onFocus: () => (isOutsideValueLocked.current = true),
              onBlur: () => (isOutsideValueLocked.current = false),
            }}
          />

          <div className="text-primary opacity-50 text-sm font-medium">
            {tokenB.tokenSymbol}
          </div>
        </Row>
      </Row>

      <Row className="flex-1 flex-col ml-3 text-primary justify-center items-center bg-stack-4 rounded-xl py-2">
        <div className="pl-3">
          <div className="text-xs text-center">
            When <span className="font-bold">{tokenA.tokenSymbol}</span> equals
          </div>
          <div className="text-xs text-center">
            <span className="text-default">{price}</span>
            <span className="text-primary font-bold">
              {' '}
              {tokenB.tokenSymbol},
            </span>
          </div>
          <div className="text-xs text-center">
            <span className="text-default">{tokenA.amount}</span>
            <span className="text-primary font-bold">
              {' '}
              {tokenA.tokenSymbol},
            </span>
          </div>
          <div className="text-xs text-center">will be swapped for</div>
          <div className="text-xs text-center">
            <span className="text-default">
              {(price * tokenA.amount).toFixed(7)}
            </span>
            <span className="text-primary font-bold">
              {' '}
              {tokenB.tokenSymbol}
            </span>
          </div>
        </div>
      </Row>
    </Row>
  )
}
