import { LinkAddress } from '@/types/constants'

/**
 * very simular to window.open, but use new Tab instead of new window
 */
export default function linkTo(href: LinkAddress) {
  // eslint-disable-next-line no-undef
  if (!('document' in globalThis)) return
  // eslint-disable-next-line no-undef
  Object.assign(globalThis.document.createElement('a'), {
    target: '_blank',
    href,
    rel: 'nofollow noopener noreferrer',
  }).click()
}
