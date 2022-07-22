import React, { useCallback, useMemo, useState } from 'react'

import {
  Button,
  Card,
  CoinAvatar,
  Row,
  Col,
  Icon,
  Input,
  List,
  ListFast,
  ResponsiveDialogDrawer,
  Switch,
} from '@/components'
import { useToggle } from '@/hooks/general/useToggle'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { TokenInfo } from '@/hooks/application/chain-pool/usePoolsListQuery'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'

export default function TokenSelectorDialog(
  props: Parameters<typeof TokenSelectorDialogContent>[0]
) {
  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={props.open}
      onClose={props.close}
    >
      {({ close: closePanel }) => (
        <TokenSelectorDialogContent {...props} close={closePanel} />
      )}
    </ResponsiveDialogDrawer>
  )
}

function isQueryEmpty(query: string) {
  return !query || !query.replace(new RegExp(' ', 'g'), '')
}

function TokenSelectorDialogContent({
  open,
  close: closePanel,
  tokens,
  onSelectToken,
}: {
  open: boolean
  close: () => void
  tokens: Array<TokenInfo>
  onSelectToken?: (symbol: string) => unknown
}) {
  const isMobile = useAppSettings((s) => s.isMobile)

  const [searchText, setSearchText] = useState('')

  // used for if panel is not tokenList but tokenlistList
  const [currentTabIsTokenList, { on, off }] = useToggle()

  const closeAndClean = useCallback(() => {
    setSearchText('')
    closePanel?.()
  }, [closePanel])

  // some keyboard (arrow up/down / mouse hover) will change the selected index
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>('')

  const filteredTokenList = useMemo(() => {
    if (!tokens || isQueryEmpty(searchText)) {
      return tokens
    }

    const lowerCasedQueryFilter = searchText.toLowerCase()
    return tokens
      .filter(({ symbol, name }) => {
        return (
          symbol.toLowerCase().search(lowerCasedQueryFilter) >= 0 ||
          name.toLowerCase().search(lowerCasedQueryFilter) >= 0
        )
      })
      .sort((tokenA, tokenB) => {
        if (
          tokenA.symbol.toLowerCase().startsWith(lowerCasedQueryFilter) ||
          tokenA.name.toLowerCase().startsWith(lowerCasedQueryFilter)
        ) {
          return -1
        }
        if (
          tokenB.symbol.toLowerCase().startsWith(lowerCasedQueryFilter) ||
          tokenB.name.toLowerCase().startsWith(lowerCasedQueryFilter)
        ) {
          return 1
        }
        return 0
      })
  }, [tokens, searchText])

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-[min(680px,100vh)] mobile:h-screen border border-stack-4 bg-stack-2"
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      {currentTabIsTokenList ? (
        <div className="px-8 mobile:px-6 pt-6 pb-5">
          <Row className="justify-between items-center mb-6">
            <Icon
              className="text-primary cursor-pointer clickable clickable-mask-offset-2"
              heroIconName="chevron-left"
              onClick={off}
            />
            <div className="text-xl font-semibold text-primary">
              Token List Settings
            </div>
            <Icon
              className="text-primary cursor-pointer clickable clickable-mask-offset-2"
              heroIconName="x"
              onClick={closeAndClean}
            />
          </Row>
          <List className="p-2 grid mt-2 overflow-auto">
            {[...Array(3).keys()].map((index) => (
              <List.Item key={`list_${index}`}>
                <TokenSelectorDialogTokenListItem tokenListName={index} />
              </List.Item>
            ))}
          </List>
        </div>
      ) : (
        <>
          <div className="px-8 mobile:px-6 pt-6 pb-5">
            <Row className="justify-between items-center mb-6">
              <div className="text-xl font-semibold text-primary">
                Select a token
              </div>
              <Icon
                className="text-primary cursor-pointer clickable clickable-mask-offset-2"
                heroIconName="x"
                onClick={closeAndClean}
              />
            </Row>

            <Input
              value={searchText}
              placeholder="Search name or address"
              onUserInput={(text) => setSearchText(text)}
              className="py-3 px-4 rounded-lg bg-stack-4"
              inputClassName="placeholder-[#7a7a7a] text-sm text-disabled"
              labelText="input for searching coins"
              suffix={
                <Icon
                  heroIconName="search"
                  size="sm"
                  className="text-disabled"
                />
              }
            />

            <div className="text-xs font-medium text-secondary my-3">
              Popular tokens
            </div>

            <Row type="grid" className="grid-cols-4 gap-x-3 gap-y-1">
              {filteredTokenList
                .filter((filteredToken) =>
                  ['JUNO', 'RAW', 'ATOM', 'OSMO'].includes(filteredToken.symbol)
                )
                .map((filteredToken) => (
                  <Row
                    key={`popular_tokens_${filteredToken.symbol}`}
                    className="p-2 mobile:py-1.5 mobile:px-2.5 rounded ring-1 ring-inset ring-primary items-center flex-wrap clickable clickable-filter-effect"
                    onClick={() => {
                      onSelectToken?.(filteredToken.symbol)
                      closeAndClean()
                    }}
                  >
                    <CoinAvatar
                      size="md"
                      className="mr-2"
                      src={filteredToken.logoURI}
                    />
                    <div className="text-base sm:text-sm font-normal text-secondary">
                      {filteredToken.symbol ?? '--'}
                    </div>
                  </Row>
                ))}
            </Row>
          </div>

          <div className="mobile:mx-6 border-t-[1.5px] border-stack-4"></div>

          <Col className="flex-1 overflow-hidden border-b-[1.5px] py-3 border-stack-4">
            <Row className="px-8 mobile:px-6 justify-between">
              <div className="text-xs font-medium text-secondary">Token</div>
              <Row className="text-xs font-medium text-secondary items-center gap-1">
                Balance
              </Row>
            </Row>
            <ListFast
              className="flex-grow flex flex-col px-4 mobile:px-2 mx-2 gap-2 overflow-auto my-2"
              sourceData={filteredTokenList}
              getKey={(filteredToken) => filteredToken.symbol}
              renderItem={(filteredToken) => (
                <div>
                  <Row
                    className={`${
                      selectedTokenSymbol === filteredToken.symbol
                        ? 'clickable no-clickable-transform-effect clickable-mask-offset-2'
                        : ''
                    }`}
                    onHoverChange={({ is: hoverStatus }) => {
                      if (hoverStatus === 'start') {
                        setSelectedTokenSymbol(filteredToken.symbol)
                      }
                    }}
                  >
                    <TokenSelectorDialogTokenItem
                      onClick={() => {
                        onSelectToken?.(filteredToken.symbol)
                        closeAndClean()
                      }}
                      token={filteredToken}
                    />
                  </Row>
                </div>
              )}
            />
          </Col>

          <Button
            type="text"
            className="w-full py-3 rounded-none font-bold text-sm text-default"
            onClick={on}
          >
            View Token List
          </Button>
        </>
      )}
    </Card>
  )
}

const FetchBalanceTextForNativeTokenSymbol = (tokenSymbol: string) => {
  const { balance, isLoading } = useTokenBalance(tokenSymbol)
  return <>{isLoading ? <>{balance}</> : <>{balance}</>}</>
}

function TokenSelectorDialogTokenItem({
  token,
  onClick,
}: {
  token: TokenInfo
  onClick?(): void
}) {
  return (
    <Row
      onClick={onClick}
      className="group w-full gap-4 justify-between items-center p-2 "
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
      <div className="text-sm text-primary justify-self-end">
        {FetchBalanceTextForNativeTokenSymbol(token.symbol)}
      </div>
    </Row>
  )
}

function TokenSelectorDialogTokenListItem({
  tokenListName,
}: {
  tokenListName: number
}) {
  return (
    <Row className="my-4 items-center">
      <CoinAvatar className="mr-4" src="/coins/solarmy.png" />

      <Col>
        <div className="text-base font-medium text-primary">
          {tokenListName}
        </div>
        <div className="text-xs font-semibold text-secondary">
          Ethereum Mainnet
        </div>
      </Col>

      <Switch
        className="ml-auto"
        defaultChecked
        disabled={Math.random() > 0.5 ? true : false}
      />
    </Row>
  )
}
