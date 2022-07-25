import React from 'react'

export interface ArrowUpIconProps {
  color?: string
  /** xs: 12px; sm: 16px; md: 20px; lg: 24px; xl: 32px (default: xs) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function ArrowUpIcon({ color, size }: ArrowUpIconProps) {
  const _size =
    size === 'xs'
      ? 12
      : size === 'sm'
      ? 16
      : size === 'md'
      ? 20
      : size === 'lg'
      ? 24
      : size === 'xl'
      ? 32
      : 12

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 7L12 17M12 7L8 11M12 7L16 11"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}
