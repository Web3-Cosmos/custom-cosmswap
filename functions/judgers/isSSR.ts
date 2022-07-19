export default function isClientSide() {
  return (
    // eslint-disable-next-line no-undef
    'document' in globalThis &&
    // eslint-disable-next-line no-undef
    'window' in globalThis &&
    // eslint-disable-next-line no-undef
    'history' in globalThis
  )
}
export function isServerSide() {
  return !isClientSide()
}

export const inClient = isClientSide()

export const inServer = isServerSide()

export const isInLocalhost =
  // eslint-disable-next-line no-undef
  inClient && globalThis.location.hostname === 'localhost'
// export const isInBonsaiTest = inClient && /bonsai-.*\.vercel\.app/.test(globalThis.location.hostname)
