import { useState } from 'react'
import { useIbcAssetInfo } from '@/hooks/application/token/useIbcAssetInfo'
import { useIbcTokenBalance } from '@/hooks/application/token/useIbcTokenBalance'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { Row, CoinAvatar, Button, ArrowUpIcon } from '@/components'
import { formatTokenBalance } from '@/util/conversion'
import { TokenSelectList } from './TokenSelectList'

type AssetSelectProps = {
  activeTokenSymbol: string
  onTokenSymbolSelect: (tokenSymbol: string) => void
  fetchingBalancesAgainstChain: 'ibc' | 'native'
}

export const AssetSelect = ({
  activeTokenSymbol,
  onTokenSymbolSelect,
  fetchingBalancesAgainstChain,
}: AssetSelectProps) => {
  const assetInfo = useIbcAssetInfo(activeTokenSymbol)
  const {
    balance: ibcTokenMaxAvailableBalance,
    isLoading: externalBalanceIsLoading,
  } = useIbcTokenBalance(activeTokenSymbol)
  const {
    balance: nativeMaxAvailableBalance,
    isLoading: nativeBalanceIsLoading,
  } = useTokenBalance(activeTokenSymbol)
  const { themeMode } = useAppSettings()

  const maxBalance =
    fetchingBalancesAgainstChain === 'ibc'
      ? ibcTokenMaxAvailableBalance
      : nativeMaxAvailableBalance
  const isLoading =
    fetchingBalancesAgainstChain === 'ibc'
      ? externalBalanceIsLoading
      : nativeBalanceIsLoading

  const [isTokenListOpen, setIsTokenListOpen] = useState(false)

  const handleToggleSelect = () => setIsTokenListOpen(!isTokenListOpen)

  return (
    <>
      <Row
        className={`items-center gap-1.5 bg-stack-4 p-2 rounded-xl border-stack-4 border-2 clickable clickable-mask-offset-2 mx-8 mobile:mx-6 ${
          isTokenListOpen ? 'mb-0' : 'mb-4'
        }`}
        onClick={handleToggleSelect}
      >
        <CoinAvatar size="lg" src={assetInfo?.logoURI} />
        <div className="text-primary font-extrabold text-base flex-grow mobile:text-sm whitespace-nowrap">
          <div className="text-primary text-sm">
            {activeTokenSymbol ?? '--'}
          </div>
          <div className="text-secondary text-xs">
            {formatTokenBalance(maxBalance)} available
          </div>
        </div>

        <Button onClick={handleToggleSelect} type="text">
          {isTokenListOpen ? (
            <div>
              <ArrowUpIcon
                size="sm"
                color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
              />
            </div>
          ) : (
            <div className="rotate-180">
              <ArrowUpIcon
                size="sm"
                color={themeMode === 'light' ? '#4d4040' : '#ffffff'}
              />
            </div>
          )}
        </Button>
      </Row>
      {isTokenListOpen && (
        <TokenSelectList
          activeTokenSymbol={activeTokenSymbol}
          onSelect={(tokenSymbol: string) => {
            onTokenSymbolSelect(tokenSymbol)
            setIsTokenListOpen(false)
          }}
          fetchingBalanceMode={fetchingBalancesAgainstChain}
        />
      )}
    </>
  )
}
