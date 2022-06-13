import React, { useCallback, useMemo, useRef, useState } from 'react'

import {
  Button,
  Card,
  CoinAvatar,
  Row,
  Col,
  Icon,
  Image,
  Input,
  List,
  ListFast,
  ResponsiveDialogDrawer,
  Switch,
} from '@/components'

import { useToggle } from '@/hooks/general/useToggle'
import { useAppSettings } from '@/hooks/application/appSettings/useAppSettings'
import { useToken } from '@/hooks/application/token/useToken'

export default function TokenSelectDialog(props: Parameters<typeof TokenSelectDialogContent>[0]) {
  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={props.open}
      onClose={props.close}
    >
      {({ close: closePanel }) => <TokenSelectDialogContent {...props} close={closePanel} />}
    </ResponsiveDialogDrawer>
  )
}

function TokenSelectDialogContent({
  open,
  close: closePanel,
  onSelectToken,
}: {
  open: boolean
  close: () => void
  onSelectToken?: () => unknown
}) {
  
  const [searchText, setSearchText] = useState('')
  // some keyboard (arrow up/down / mouse hover) will change the selected index
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(0)
  const userCustomizedTokenSymbol = useRef('')
  
  const isMobile = useAppSettings((s) => s.isMobile)

  // used for if panel is not tokenList but tokenlistList
  const [currentTabIsTokenList, { on, off }] = useToggle()

  const { availableTokens, filteredTokens, availableTokenListSettings } = useToken()

  const searchedTokens = useMemo(
    () =>
      searchText
        ? firstFullMatched(
          availableTokens
            .filter(availableToken => availableTokenListSettings[availableToken.tokenListSettings].isOn)
            .filter((token) =>
              searchText
                .split(' ')
                .every(
                  (keyWord) => new RegExp(`^.*${keyWord.toLowerCase()}.*$`).test(token.symbol?.toLowerCase() ?? '')
                )
            ),
            searchText
          )
        : availableTokens.filter(availableToken => availableTokenListSettings[availableToken.tokenListSettings].isOn),
    [searchText, availableTokens]
  )
  function firstFullMatched(tokens: any[], searchText: string): any[] {
    return tokens.filter(token => token.symbol?.toLowerCase().includes(searchText.toLowerCase()))
  }

  const closeAndClean = useCallback(() => {
    setSearchText('')
    closePanel?.()
  }, [])

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-[min(680px,100vh)] mobile:h-screen border border-stack-4 bg-stack-2"
      size="lg"
      style={{ boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)' }}
      htmlProps={{
        onKeyDown: (e) => {
          if (e.key === 'ArrowUp') {
            setSelectedTokenIdx((s) => Math.max(s - 1, 0))
          } else if (e.key === 'ArrowDown') {
            setSelectedTokenIdx((s) => Math.min(s + 1, 10))
          } else if (e.key === 'Enter') {
            // onSelectCoin?.(searchedTokens[selectedTokenIdx])
            setTimeout(() => {
              closeAndClean()
            }, 200) // delay: give user some time to reflect the change
          }
        }
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
            <div className="text-xl font-semibold text-primary">Token List Settings</div>
            <Icon
              className="text-primary cursor-pointer clickable clickable-mask-offset-2"
              heroIconName="x"
              onClick={closeAndClean}
            />
          </Row>
          <List className="p-2 grid mt-2 overflow-auto">
            {Object.keys(availableTokenListSettings).map((key: string) => (
              <List.Item key={`token_list_${availableTokenListSettings[key].logoURI}`}>
                <TokenSelectorDialogTokenListItem token={availableTokenListSettings[key]} />
              </List.Item>
            ))}
          </List>
        </div>
      ) : (
        <>
          {/* header */}
          <div className="px-8 mobile:px-6 pt-6 pb-5">
            {/* label - select a token */}
            <Row className="justify-between items-center mb-6">
              <div className="text-xl font-semibold text-primary">Select a token</div>
              <Icon
                className="text-primary cursor-pointer clickable clickable-mask-offset-2"
                heroIconName="x"
                onClick={closeAndClean}
              />
            </Row>

            {/* search input box */}
            <Input
              value={searchText}
              placeholder="Search name or address"
              onUserInput={(text) => {
                setSearchText(text)
                setSelectedTokenIdx(0)
              }}
              className="py-3 px-4 rounded-lg bg-stack-4"
              inputClassName="placeholder-[#7a7a7a] text-sm text-disabled"
              labelText="input for searching coins"
              suffix={<Icon heroIconName="search" size="sm" className="text-disabled" />}
            />

            {/* label - popular tokens */}
            <div className="text-xs font-medium text-secondary my-3">Popular tokens</div>

            {/* popular tokens */}
            <Row type="grid" className="grid-cols-4 gap-x-3 gap-y-1">
              {([...Array(4).keys()].map((index) => {
                return (
                  <Row
                    key={`row_${index}`}
                    className="py-1 px-2 mobile:py-1.5 mobile:px-2.5 rounded ring-1 ring-inset ring-primary items-center flex-wrap clickable clickable-filter-effect"
                    onClick={() => {
                      closeAndClean()
                    }}
                  >
                    <CoinAvatar size="lg" src="/coins/solarmy.png" />
                    <div className="text-base sm:text-sm font-normal text-secondary">{'BNB' ?? '--'}</div>
                  </Row>
                )
              }))}
            </Row>
          </div>

          {/* body - divider */}
          <div className="mobile:mx-6 border-t-[1.5px] border-stack-4"></div>

          {/* all available tokens */}
          <Col className="flex-1 overflow-hidden border-b-[1.5px] py-3 border-stack-4">
            <Row className="px-8 mobile:px-6 justify-between">
              <div className="text-xs font-medium text-secondary">Token</div>
              <Row className="text-xs font-medium text-secondary items-center gap-1">Balance</Row>
            </Row>
            <ListFast
              className="flex-grow flex flex-col px-4 mobile:px-2 mx-2 gap-2 overflow-auto my-2"
              sourceData={searchedTokens}
              getKey={(token: any, idx) => token.address ?? idx}
              renderItem={(token, idx) => (
                <div>
                  <Row
                    className={`${
                      selectedTokenIdx === idx
                        ? 'clickable no-clickable-transform-effect clickable-mask-offset-2 before:bg-[rgba(0,0,0,0.2)]'
                        : ''
                    }`}
                    onHoverChange={({ is: hoverStatus }) => {
                      if (hoverStatus === 'start') {
                        setSelectedTokenIdx(idx)
                      }
                    }}
                  >
                    <TokenSelectDialogTokenItem
                      onClick={() => {
                        closeAndClean()
                      }}
                      token={token}
                    />
                  </Row>
                </div>
              )}
            />
          </Col>

          {/* footer - button - view token list */}
          <Button type="text" className="w-full py-3 rounded-none font-bold text-sm text-default" onClick={on}>
            View Token List
          </Button>
        </>
      )}
    </Card>
  )
}

function TokenSelectDialogTokenItem({ token, onClick }: { token: any; onClick?(): void }) {
  return (
    <Row onClick={onClick} className="group w-full gap-4 justify-between items-center p-2 ">
      <Row>
        <CoinAvatar className="mr-4" src={token.logoURI} />
        <Col className="mr-2">
          <div className="text-base font-medium text-primary">{token.symbol}</div>
          <div className="text-xs font-semibold text-secondary">{token.name}</div>
        </Col>
      </Row>
      <div className="text-sm text-primary justify-self-end">123</div>
    </Row>
  )
}

function TokenSelectorDialogTokenListItem({ token }: { token: any }) {

  const { availableTokenListSettings } = useToken()

  const tokenListSetting = availableTokenListSettings[token.name]
  const isOn = tokenListSetting.isOn

  const toggleTokenListSettings = () => {
    useToken.setState((s) => ({
      availableTokenListSettings: {
        ...s.availableTokenListSettings,
        [token.name]: {
          ...s.availableTokenListSettings[token.name],
          isOn: !s.availableTokenListSettings[token.name].isOn,
        }
      },
    }))
  }

  return (
    <Row className="my-4 items-center">
      <CoinAvatar className="mr-4" src={token.logoURI} />

      <Col>
        <div className="text-base font-medium text-primary">{token.name}</div>
        <div className="text-xs font-semibold text-secondary">{token.length} tokens</div>
      </Col>

      <Switch className="ml-auto" defaultChecked={isOn} onToggle={toggleTokenListSettings} />
    </Row>
  )
}
