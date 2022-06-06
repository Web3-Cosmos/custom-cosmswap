import { ReactNode } from 'react'
import _Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { PageRouteName, routeTo } from '@/hooks/application/routeTools'

interface LinkProps {
  href?: string
  className?: string
  noTextStyle?: boolean
  openInNewTab?: boolean
  children?: ReactNode
  onClick?(): void
}

export default function Link({
  href,
  className,
  noTextStyle,
  openInNewTab,
  children,
  onClick,
}: LinkProps) {
  if (!href) return <span className={className}>{children}</span>

  const isInnerLink = openInNewTab ? false : href.startsWith('/')

  return isInnerLink ? (
    <span
      tabIndex={0}
      className={twMerge(
        `clickable ${noTextStyle ? '' : 'text-link-color hover:underline underline-offset-1'}`,
        className
      )}
      onClick={() => {
        onClick?.()
        routeTo(href as PageRouteName)
      }}
    >
      {children}
    </span>
  ) : (
    <a
      href={href}
      tabIndex={0}
      rel="nofollow noopener noreferer"
      className={twMerge(
        `clickable ${noTextStyle ? '' : 'text-link-color hover:underline underline-offset-1'}`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </a>
  )
}