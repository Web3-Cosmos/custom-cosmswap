export const protectAgainstNaN = (value: number) => (isNaN(value) ? 0 : value)

export function convertMicroDenomToDenom(
  value: number | string,
  decimals: number
): number {
  if (decimals === 0) return Number(value)

  return protectAgainstNaN(Number(value) / Math.pow(10, decimals))
}

export function convertDenomToMicroDenom(
  value: number | string,
  decimals: number
): number {
  if (decimals === 0) return Number(value)

  return protectAgainstNaN(
    parseInt(String(Number(value) * Math.pow(10, decimals)), 10)
  )
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function convertToFixedDecimals(value: number | string): string {
  const amount = Number(value)
  return amount > 0.01 ? amount.toFixed(2) : String(amount)
}

export const formatTokenName = (name: string) => {
  if (name) {
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase()
  }
  return ''
}

export const createBalanceFormatter = ({
  maximumFractionDigits = 6,
  ...options
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
    ...options,
    style: 'currency',
    currency: 'USD',
  })

  return (
    value: string | number,
    { includeCommaSeparation = false, applyNumberConversion = true } = {}
  ) => {
    const formattedValue = formatter.format(value as number).replace(/\$/g, '')

    if (includeCommaSeparation) {
      return formattedValue
    }

    const rawValue = formattedValue.replace(/,/g, '')
    if (applyNumberConversion) {
      return Number(rawValue)
    }

    return rawValue
  }
}

export const formatTokenBalance = createBalanceFormatter({
  maximumFractionDigits: 6,
})

export const dollarValueFormatterWithDecimals = createBalanceFormatter({
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const dollarValueFormatter = createBalanceFormatter({
  maximumFractionDigits: 2,
})

const formatWithOneDecimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

const oneMillion = 1000000
const hundredMillions = 100 * oneMillion

export const formatCompactNumber = (
  value: number,
  kind: 'tokenAmount' | 'dollarValue' = 'dollarValue'
) => {
  if (value > hundredMillions) {
    return `${Math.round(value / hundredMillions)}M`
  }
  if (value > oneMillion) {
    return `${formatWithOneDecimal.format(value / oneMillion)}M`
  }
  if (value > 10000) {
    return `${formatWithOneDecimal.format(Math.round(value / 1000))}K`
  }
  if (value > 1000) {
    return dollarValueFormatter(Math.round(value), {
      includeCommaSeparation: true,
    })
  }
  if (kind === 'dollarValue') {
    return dollarValueFormatter(value, {
      includeCommaSeparation: true,
    })
  }
  return formatTokenBalance(value)
}
