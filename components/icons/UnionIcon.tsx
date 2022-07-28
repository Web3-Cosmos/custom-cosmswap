import React from 'react'

export interface UnionIconProps {
  color?: string
  /** xs: 12px; sm: 16px; md: 20px; lg: 24px; xl: 32px (default: xs) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function UnionIcon({ color, size }: UnionIconProps) {
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
      width={_size}
      height={_size}
      viewBox={`0 0 ${_size} ${_size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.97746 1.90639L9.4194 1.46445L8.53552 0.580566L8.09358 1.02251L4.99998 4.1161L1.90639 1.02251L1.46445 0.580566L0.580566 1.46445L1.02251 1.90639L4.1161 4.99998L1.02251 8.09358L0.580566 8.53552L1.46445 9.4194L1.90639 8.97746L4.99998 5.88387L8.09358 8.97746L8.53552 9.4194L9.4194 8.53552L8.97746 8.09358L5.88387 4.99998L8.97746 1.90639Z"
      />
    </svg>
  )
}
