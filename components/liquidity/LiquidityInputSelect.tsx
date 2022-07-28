import { MouseEvent, Ref, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { useAmountChangeController } from '@/hooks/application/token/useAmountChangeController'

import { dollarValueFormatter } from '@/util/conversion'
import { calculateCharactersLength } from '@/util/messages'

type LiquidityInputSelectProps = {
  inputRef?: Ref<HTMLInputElement>
  className?: string
  maxLiquidity: number
  liquidity: number
  onChangeLiquidity: (liquidity: number) => void
}

export const LiquidityInputSelect = ({
  inputRef,
  maxLiquidity,
  liquidity,
  onChangeLiquidity,
}: LiquidityInputSelectProps) => {
  const { value, setValue } = useAmountChangeController({
    amount: (dollarValueFormatter(liquidity / maxLiquidity) as number) * 100,
    minimumValue: 0,
    maximumValue: 100,
    maximumFractionDigits: 2,
    onAmountChange(updateValue) {
      onChangeLiquidity((updateValue / 100) * maxLiquidity)
    },
  })

  const refForInputWrapper = useRef<HTMLDivElement>(null)
  const { bind, isDragging } = useDrag({
    getIsException(e: any) {
      return refForInputWrapper.current!.contains(e.target)
    },
    onProgressUpdate(progress: number) {
      const value = Math.max(Math.min(progress * maxLiquidity, maxLiquidity), 0)

      onChangeLiquidity(value)
    },
  })

  return (
    <div
      {...(bind as any)}
      className="bg-stack-4 py-5 relative flex justify-center items-center cursor-col-resize overflow-hidden rounded-lg"
    >
      <div
        ref={refForInputWrapper}
        className="flex justify-center items-center relative z-10"
      >
        <input
          ref={inputRef}
          placeholder="0.0"
          max="100"
          type="number"
          lang="en-US"
          value={value}
          style={{
            width: `${calculateCharactersLength(value)}ch`,
            background: 'transparent',
          }}
          className="outline-none"
          onChange={({ target: { value } }) => setValue(value)}
        />
        <div>%</div>
      </div>
      <div
        className="bg-stack-3 absolute inset-y-0 left-0 w-full h-full"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

const useDrag = ({ getIsException, onProgressUpdate }: any) => {
  const ref = useRef<HTMLElement>()
  const dragging = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  function handleMouseMove(e: MouseEvent<HTMLDivElement, MouseEvent>) {
    if (dragging.current) {
      const { clientX } = e
      // @ts-ignore
      const { left, width } = ref.current.getBoundingClientRect()
      const progress = Math.max((clientX - left) / width, 0)
      onProgressUpdate(
        Math.min(progress > 0.99 ? 1 : Number(progress.toFixed(2)), 1)
      )
    }
  }

  function handleMouseDown(e: any) {
    if (!getIsException(e)) {
      /* detach mouse up listener on global mouse up event */
      window.addEventListener('mouseup', handleMouseUp)

      dragging.current = true
      setIsDragging(true)
      handleMouseMove(e)
    }
  }

  function handleMouseUp() {
    dragging.current = false
    setIsDragging(false)
  }

  return {
    isDragging,
    bind: {
      ref,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      style: {
        userSelect: isDragging ? 'none' : 'unset',
      },
    },
  }
}
