import React, { CSSProperties, RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

import { Image } from '@/components'

export interface CoinAvatarProps {
  haveAnime?: boolean
  src?: string
  domRef?: RefObject<any>
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  style?: CSSProperties
  onClick?(): void
}

export default function CoinAvatar({
  haveAnime,
  src,
  domRef,
  className,
  size = 'lg',
  style,
  onClick,
}: CoinAvatarProps) {
  const iconSrc = src ?? '/coins/dollar.svg'
  const hasOpacity = true
  const iconSize =
    size === '2xl'
      ? 'h-20 w-20'
      : size === 'xl'
      ? 'h-12 w-12'
      : size === 'lg'
      ? 'h-8 w-8'
      : size === 'md'
      ? 'h-6 w-6'
      : size === 'sm'
      ? 'h-5 w-5'
      : size === 'xs'
      ? 'w-4 h-4'
      : 'h-12 w-12'

  return (
    <div
      ref={domRef}
      className="flex items-center gap-2"
      style={style}
      onClick={onClick}
    >
      {!haveAnime ? (
        <div className={twMerge(`${iconSize} rounded-full overflow-hidden`, className)}>
          <Image
            className={`${iconSize} rounded-full overflow-hidden transition-transform transform ${
              hasOpacity ? 'scale-[.7]' : ''
            }`}
            src={iconSrc}
            fallbackSrc="/coins/unknown.svg"
          />
        </div>
      ) : (
        <div
          className={twMerge(`${iconSize} rounded-full swap-coin`, className)}
          suppressHydrationWarning // @see https://reactjs.org/docs/react-dom.html#hydrate
          style={{ ['--delay' as string]: `${(Math.random() * 1000).toFixed(2)}ms` }}
        >
          <Image
            className={`front-face overflow-hidden transition-transform transform ${hasOpacity ? 'scale-[.7]' : ''}`}
            src={iconSrc}
            fallbackSrc="/coins/unknown.svg"
          />
          <div className="line-group">
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
            <div className="line-out">
              <div className="line-inner" />
            </div>
          </div>
          <Image
            className={`back-face overflow-hidden transition-transform transform ${hasOpacity ? 'scale-[.7]' : ''}`}
            src={iconSrc}
            fallbackSrc="/coins/unknown.svg"
          />
        </div>
      )}
    </div>
  )
}
