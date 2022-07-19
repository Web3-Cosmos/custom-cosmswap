import router from 'next/router'

import { ParsedUrlQuery } from 'querystring'

import { objectShakeFalsy } from '@/functions/objectMethods'
import { shrinkToValue } from '@/functions/shrinkToValue'
import { HexAddress, MayFunction } from '@/types/constants'

export type PageRouteConfigs = {
  '/swap': {
    queryProps?: {
      coin1?: any
      coin2?: any
      ammId?: HexAddress
    }
  }
}

export type PageRouteName = keyof PageRouteConfigs

// TODO: parse url query function (can have prevState of zustand store)
export function routeTo<Href extends keyof PageRouteConfigs>(
  href: Href,
  opts?: MayFunction<
    PageRouteConfigs[Href],
    [{ currentPageQuery: ParsedUrlQuery }]
  >
): void {
  const options = shrinkToValue(opts, [{ currentPageQuery: router.query }])
  if (href === '/swap') {
    const coin1 = options?.queryProps?.coin1
    const coin2 = options?.queryProps?.coin2
    const isSwapDirectionReversed = true
    router.push({ pathname: '/swap' }).then(() => {
      const targetState = objectShakeFalsy(
        isSwapDirectionReversed
          ? { coin2: coin1, coin1: coin2 }
          : { coin1, coin2 }
      )
      // useSwap.setState(targetState)
    })
  }
  // } else {
  //   router.push({ pathname: toPage, query: options?.queryProps })
  // }

  return
}
