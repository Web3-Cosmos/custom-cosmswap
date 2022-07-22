import { useCallback, useMemo } from 'react'

import {
  IbcAssetInfo,
  useIbcAssetList,
} from '@/hooks/application/token/useIbcAssetList'

export const getIbcAssetInfoFromList = (
  assetSymbol: string,
  assetList: Array<IbcAssetInfo>
): IbcAssetInfo | undefined => assetList?.find((x) => x.symbol === assetSymbol)

export const useGetMultipleIbcAssetInfo = () => {
  const [assetList] = useIbcAssetList()
  return useCallback(
    function getMultipleIbcAssetInfo(assetSymbols: Array<string>) {
      return assetSymbols?.map((assetSymbol) =>
        getIbcAssetInfoFromList(assetSymbol, assetList?.tokens ?? [])
      )
    },
    [assetList]
  )
}

export const useIbcAssetInfo = (assetSymbol: string) => {
  const getMultipleIbcAssetInfo = useGetMultipleIbcAssetInfo()
  return useMemo(
    () => getMultipleIbcAssetInfo([assetSymbol])?.[0],
    [assetSymbol, getMultipleIbcAssetInfo]
  )
}
