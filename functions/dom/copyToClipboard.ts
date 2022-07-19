export default function copyToClipboard(content: string) {
  // eslint-disable-next-line no-undef
  if (globalThis?.navigator?.clipboard) {
    // eslint-disable-next-line no-console, no-undef
    return globalThis.navigator.clipboard
      .writeText(content)
      .then(() => console.info('Text copied'))
  } else {
    throw new Error('current context has no clipboard')
  }
}
