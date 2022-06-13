import React, { ReactNode, useEffect, useRef } from 'react'
import { Transition } from '@headlessui/react'

import { useHover } from '@/hooks/general/useHover'
import { useToggle } from '@/hooks/general/useToggle'

import {
  Card,
  Icon,
  AppHeroIconName,
  Row,
} from '@/components'

export interface NotificationItemInfo {
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
}

const itemExistTime = process.env.NODE_ENV === 'development' ? 7 * 1000 : 3 * 1000 // (ms)

const colors: Record<
  NotificationItemInfo['type'] & string,
  { heroIconName: AppHeroIconName; ring: string; bg: string; text: string }
> = {
  success: {
    heroIconName: 'check-circle',
    ring: 'ring-primary',
    text: 'text-primary',
    bg: 'bg-primary'
  },
  error: {
    heroIconName: 'exclamation-circle',
    ring: 'ring-[#DA2EEF]',
    text: 'text-[#DA2EEF]',
    bg: 'bg-[#e54bf9]'
  },
  info: {
    heroIconName: 'information-circle',
    ring: 'ring-[#2e7cf8]',
    text: 'text-[#2e7cf8]',
    bg: 'bg-stack-4'
  },
  warning: {
    heroIconName: 'exclamation',
    ring: 'ring-[#D8CB39]',
    text: 'text-primary',
    bg: 'bg-primary'
  }
}

export default function NotificationItem({ description, title, subtitle, type = 'info' }: NotificationItemInfo) {
  const [isOpen, { off: close }] = useToggle(true)
  const [nodeExist, { off: destory }] = useToggle(true)
  const [isTimePassing, { off: pauseTimeline, on: resumeTimeline }] = useToggle(true)

  const timeoutController = useRef(spawnTimeoutControllers({ callback: close, totalDuration: itemExistTime }))
  const itemRef = useRef<HTMLDivElement>(null)

  // for transition
  const itemWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    timeoutController.current.start()
  }, [])

  // TODO: just useHoverRef or <Hoverable>
  useHover(itemRef, {
    onHover({ is: now }) {
      if (now === 'start') {
        timeoutController.current.pause()
        pauseTimeline()
      } else {
        timeoutController.current.resume()
        resumeTimeline()
      }
    }
  })

  if (!nodeExist) return null
  return (
    <Transition
      appear
      show={isOpen}
      enter="transition-all duration-500"
      enterFrom="opacity-0 transform pc:origin-right-bottom pc:translate-x-full mobile:-translate-y-full scale-0" // transform direction is controlled by translate-x-full
      enterTo="opacity-100 transform pc:origin-right-bottom pc:translate-x-0 mobile:translate-y-0 scale-100"
      leave="transition-all duration-500"
      leaveFrom="opacity-100 transform pc:origin-right-bottom pc:translate-x-0 mobile:translate-y-0 scale-100"
      leaveTo="opacity-0 transform pc:origin-right-bottom pc:translate-x-full mobile:-translate-y-full scale-0"
      beforeEnter={() => {
        const height = itemWrapperRef.current?.clientHeight
        itemWrapperRef.current?.style.setProperty('height', '0')
        // get a layout property to manually to force the browser to layout the above code.
        // So trick. But have to.🤯🤯🤯🤯
        itemWrapperRef.current?.clientHeight
        itemWrapperRef.current?.style.setProperty('height', `${height}px`)
      }}
      afterEnter={() => {
        itemWrapperRef.current?.style.removeProperty('height')
      }}
      beforeLeave={() => {
        const height = itemWrapperRef.current?.clientHeight
        itemWrapperRef.current?.style.setProperty('height', `${height}px`)
        // get a layout property to manually to force the browser to layout the above code.
        // So trick. But have to.🤯🤯🤯🤯
        itemWrapperRef.current?.clientHeight
        itemWrapperRef.current?.style.setProperty('height', '0')
      }}
      afterLeave={destory}
    >
      {/* U have to gen another <div> to have the gap between <NotificationItem> */}
      <div ref={itemWrapperRef} className={`overflow-hidden mobile:w-screen transition-all duration-500`}>
        <Card
          domRef={itemRef}
          className={`min-w-[260px] relative rounded-xl ring-1.5 ring-inset ${colors[type].ring} bg-stack-2 py-4 pl-5 pr-10 my-2 overflow-hidden pointer-events-auto`}
        >
          {/* timeline */}
          <div className="h-1 absolute top-0 left-0 right-0">
            {/* track */}
            <div className={`opacity-5 ${colors[type].bg} absolute inset-0`} />
            {/* remain-line */}
            <div
              className={`${colors[type].bg} absolute inset-0`}
              style={{
                animation: `shrink ${itemExistTime}ms linear forwards`,
                animationPlayState: isTimePassing ? 'running' : 'paused'
              }}
            />
          </div>

          <Icon
            size="sm"
            heroIconName="x"
            className="absolute right-3 top-3 clickable text-primary"
            onClick={() => {
              timeoutController.current.cancel()
              close()
            }}
          />
          {/* <Icon
            heroIconName="x"
            onClick={close}
            className="rounded-full absolute top-3 right-1 h-5 w-5 text-secondary cursor-pointer"
          /> */}
          <Row className="gap-3">
            <Icon heroIconName={colors[type].heroIconName} className={colors[type].text} />
            <div>
              <div className="font-medium text-base text-primary">{title}</div>
              {subtitle && <div className="font-normal text-base mobile:text-sm text-primary">{subtitle}</div>}
              {description && (
                <div className="font-medium text-sm mobile:text-xs text-primary opacity-50">{description}</div>
              )}
            </div>
          </Row>
        </Card>
      </div>
    </Transition>
  )
}

function spawnTimeoutControllers(options: { callback: () => void; totalDuration: number }) {
  let dead = false
  let startTimestamp: number
  let remainTime = options.totalDuration
  let id: any
  const timeFunction = () => {
    options.callback()
    dead = true
  }
  function start() {
    startTimestamp = globalThis.performance.now()
    if (dead) return
    id = globalThis.setTimeout(timeFunction, remainTime)
  }
  function pause() {
    const endTimestamp = globalThis.performance.now()
    remainTime -= endTimestamp - startTimestamp
    globalThis.clearTimeout(id)
  }
  function resume() {
    start()
  }
  function cancel() {
    globalThis.clearTimeout(id)
    dead = true
  }
  return {
    dead,
    remainTime,
    start,
    pause,
    resume,
    cancel
  }
}
