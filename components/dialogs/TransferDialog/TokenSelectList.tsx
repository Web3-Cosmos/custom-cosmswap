import { Card, Row, Col, ListFast, CoinAvatar, Spinner } from '@/components'
import { useIbcAssetList } from '@/hooks/application/token/useIbcAssetList'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import { useIbcTokenBalance } from '@/hooks/application/token/useIbcTokenBalance'
import { formatTokenBalance } from '@/util/conversion'

export const TokenSelectList = ({
  activeTokenSymbol,
  onSelect,
  fetchingBalanceMode = 'native',
  ...props
}: {
  activeTokenSymbol: any
  onSelect: any
  fetchingBalanceMode: 'native' | 'ibc'
}) => {
  const [tokenList] = useIbcAssetList()

  return (
    <div className="px-8 mobile:px-6">
      <Card
        className="flex flex-col shadow-xl rounded-xl mobile:rounded-none h-[min(200px,100vh)] border border-stack-4 bg-stack-2 mb-4"
        size="lg"
        style={{
          boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
        }}
      >
        <div className="mobile:px-2 h-full">
          <Col className="flex-1 overflow-hidden border-stack-4 h-full">
            <ListFast
              className="py-2 flex-grow flex flex-col px-4 mobile:px-2 mx-2 gap-2 overflow-auto"
              sourceData={tokenList?.tokens ?? []}
              getKey={(token) => token.symbol}
              renderItem={(token) => (
                <div>
                  <Row
                    className={`${
                      activeTokenSymbol === token.symbol
                        ? 'clickable no-clickable-transform-effect clickable-mask-offset-2'
                        : ''
                    }`}
                  >
                    <TokenSelectorDialogTokenItem
                      token={token}
                      onSelect={onSelect}
                      fetchingBalanceMode={fetchingBalanceMode}
                    />
                  </Row>
                </div>
              )}
            />
          </Col>
        </div>
      </Card>
    </div>
  )
}

function TokenSelectorDialogTokenItem({
  token,
  fetchingBalanceMode,
  onSelect,
}: any) {
  return (
    <Row
      className="group w-full gap-4 justify-between items-center p-2"
      onClick={() => onSelect(token.symbol)}
    >
      <Row>
        <CoinAvatar size="lg" className="mr-4" src={token.logoURI} />
        <Col className="mr-2">
          <div className="text-base font-medium text-primary">
            {token.symbol}
          </div>
          <div className="text-xs font-semibold text-secondary">
            {token.name}
          </div>
        </Col>
      </Row>
      <Col className="text-primary text-xs">
        {fetchingBalanceMode === 'native' ? (
          <FetchBalanceTextForNativeTokenSymbol tokenSymbol={token.symbol} />
        ) : (
          <FetchBalanceTextForIbcTokenSymbol tokenSymbol={token.symbol} />
        )}
        available
      </Col>
    </Row>
  )
}

const FetchBalanceTextForNativeTokenSymbol = ({
  tokenSymbol,
}: {
  tokenSymbol: string
}) => {
  const { balance, isLoading } = useTokenBalance(tokenSymbol)
  return (
    <div className="text-right">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="text-primary text-xs text-right">
          {formatTokenBalance(balance || 0)}
        </div>
      )}
    </div>
  )
}

const FetchBalanceTextForIbcTokenSymbol = ({
  tokenSymbol,
}: {
  tokenSymbol: string
}) => {
  const { balance, isLoading } = useIbcTokenBalance(tokenSymbol)
  return (
    <div className="text-right">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="text-primary text-xs text-right">
          {formatTokenBalance(balance || 0)}
        </div>
      )}
    </div>
  )
}
