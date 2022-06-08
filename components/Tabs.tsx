import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { RadioGroup, RadioGroupProps } from '@/components'

import { useIsomorphicLayoutEffect } from '@/hooks/general/useIsomorphicLayoutEffect'

import toPercentString from '@/functions/format/toPercentString'
import { shrinkToValue } from '@/functions/shrinkToValue'

export interface TabProps<T extends string = string> extends RadioGroupProps<T> {
  affectUrlHash?: boolean
}

/**
 * Just inherit from `<StyledRadioGroup>` with ability to affect UrlHash
 * @returns
 */
export default function Tabs<T extends string = string>({ affectUrlHash, className, ...restProps }: TabProps<T>) {
  useIsomorphicLayoutEffect(() => {
    if (!affectUrlHash) return
    function onHashChange() {
      const currentHashName = window.location.hash.replace('#', '') as T
      restProps.onChange?.(currentHashName)
    }
    onHashChange() // affect url hash to props in init
    // change url hash to props if user change hash
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!affectUrlHash) return
    if (restProps.currentValue) {
      // change url hash on props
      window.location.hash = `#${restProps.currentValue}`
    }
  }, [restProps.currentValue])

  return (
    <RadioGroup
      {...restProps}
      className={twMerge('rounded-full p-1 bg-stack-3', className)}
      itemClassName={(checked) =>
        twMerge(
          `grid min-w-[96px] mobile:min-w-[72px] px-4 h-9 mobile:h-7 rounded-full place-items-center text-sm mobile:text-xs font-medium ${
            checked ? 'text-primary' : 'text-secondary'
          }`,
          shrinkToValue(restProps.itemClassName, [checked])
        )
      }
      itemStyle={(checked, idx, values) =>
        checked
          ? {
              background: 'var(--primary)',
              backgroundSize: '400% 100%',
              backgroundPosition: toPercentString((1 / (values.length - 1)) * idx)
            }
          : {}
      }
    />
  )
}
