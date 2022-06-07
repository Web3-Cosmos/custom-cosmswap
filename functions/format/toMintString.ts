import { isString } from '../judgers/dateType'

// const mintCache = new WeakMap<string, string>()

//TODO: no token
export default function toPubString(mint: string | undefined): string {
  if (!mint) return ''
  if (isString(mint)) return mint
  // if (mintCache.has(mint)) {
  //   return mintCache.get(mint)!
  // } else {
  //   const mintString = mint.toBase58()
  //   mintCache.set(mint, mintString)
  //   return mintString
  // }
  return mint
}

export function recordPubString(...args: Parameters<typeof toPubString>): void {
  toPubString(...args)
}
