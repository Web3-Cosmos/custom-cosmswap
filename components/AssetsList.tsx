import { AssetCard, AssetCardState, ListFast, Row, Card } from '@/components'

import { useWalletConnectionStatus } from '@/hooks/application/wallet/useWalletConnectionStatus'
import { useGetSupportedAssetsBalancesOnChain } from '@/hooks/application/token/useGetSupportedAssetsBalancesOnChain'
import { useDelayedAppearanceFlag } from '@/hooks/general/useDelayedAppearanceFlag'
import { walletState } from '@/hooks/application/atoms/walletAtoms'

import { __TRANSFERS_ENABLED__ } from '@/util/constants'

export const AssetsList = ({ onActionClick }: any) => {
  const [loadingBalances, [myTokens, allTokens]] =
    useGetSupportedAssetsBalancesOnChain()

  const { isConnecting, isConnected } = useWalletConnectionStatus(walletState)

  /* isLoading state is true if either we connect the wallet or loading balances */
  const isLoading = isConnecting || loadingBalances
  /* check if the user has any of the assets transferred on the chain */
  const hasTransferredAssets =
    isConnected && !loadingBalances && myTokens!.length > 0

  const isLoadingStateShowing = useDelayedAppearanceFlag(isLoading, 650)

  /* don't show the fetching state just yet */
  if (isLoading && !isLoadingStateShowing) {
    return null
  }

  return (
    <>
      {__TRANSFERS_ENABLED__ && (
        <>
          <div className="text-primary font-semibold mb-4">My Assets</div>
          {hasTransferredAssets &&
            myTokens?.map(({ tokenSymbol, balance }) => (
              <AssetCard
                key={`asset_${tokenSymbol}`}
                state={AssetCardState.active}
                tokenSymbol={tokenSymbol}
                balance={balance}
                onActionClick={onActionClick}
              />
            ))}
          {isConnected && !hasTransferredAssets && (
            <div className="text-primary">No IBC assets yet...!</div>
          )}
          {!isConnected && !isLoading && (
            <>
              <div className="text-disabled text-sm">
                Connect your wallet to see your tokens.
              </div>
              <AssetCard className="invisible" />
            </>
          )}
        </>
      )}
      <div className="text-primary font-semibold mt-8 mb-4">
        {__TRANSFERS_ENABLED__ ? 'Other Assets' : 'Soon Available to Transfer'}
      </div>
      {__TRANSFERS_ENABLED__ && isLoading ? (
        <ListFast
          className="flex-grow flex flex-col px-2 gap-2"
          sourceData={[0]}
          getKey={(allToken: any) => allToken}
          renderItem={(allToken: any) => (
            <Row className="clickable no-clickable-transform-effect clickable-mask-offset-2">
              <AssetCard
                state={AssetCardState.fetching}
                key={`loading_asset_${allToken}`}
              />
            </Row>
          )}
        />
      ) : (
        <Card
          className="flex flex-col shadow-xl rounded-xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-[min(600px,100vh)] border border-stack-4 bg-stack-2"
          size="lg"
          style={{
            boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
          }}
        >
          <ListFast
            className="flex-grow flex flex-col px-2 gap-2 rounded-xl"
            sourceData={allTokens ?? []}
            getKey={({ tokenSymbol }) => tokenSymbol}
            renderItem={({ tokenSymbol, balance }) => (
              <Row className="clickable no-clickable-transform-effect clickable-mask-offset-2">
                <AssetCard
                  state={AssetCardState.active}
                  key={`all_asset_${tokenSymbol}`}
                  tokenSymbol={tokenSymbol}
                  balance={balance}
                  onActionClick={onActionClick}
                />
              </Row>
            )}
          />
        </Card>
      )}
    </>
  )
}
