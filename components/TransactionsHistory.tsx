// @ts-nocheck
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { useTokenList } from '@/hooks/application/token/useTokenList'
import { useRegistryCancel } from '@/hooks/application/swap/useRegistry'
import { walletState } from '@/hooks/application/atoms/walletAtoms'
import { Tabs, TransactionHistory } from '@/components'
import { convertMicroDenomToDenom } from '@/util/conversion'

export default function TransactionsHistory() {
  const [activeTab, setActiveTab] = useState('created')
  const { transactions } = useRecoilValue(walletState)
  const [tokenList] = useTokenList()
  const { pathname } = useRouter()

  const requests = useMemo(() => {
    if (!tokenList || !transactions) return []
    return transactions
      .filter((transaction: any) => pathname.includes(transaction.type))
      .map((transaction) => {
        const inputToken = tokenList.tokens.find(
          (token) =>
            transaction.inputToken.denom === token.denom ||
            transaction.inputToken.denom === token.token_address
        )
        const {
          logoURI: inputLogo,
          symbol: inputSymbol,
          decimals: inputDecimals,
        } = inputToken
        const outputToken = tokenList.tokens.find(
          (token) =>
            transaction.outputToken.denom === token.denom ||
            transaction.outputToken.denom === token.token_address
        )
        const {
          logoURI: outputLogo,
          symbol: outputSymbol,
          decimals: outputDecimals,
        } = outputToken

        return {
          ...transaction,
          inputToken: {
            ...transaction.inputToken,
            logoURI: inputLogo,
            symbol: inputSymbol,
            decimals: inputDecimals,
          },
          outputToken: {
            ...transaction.outputToken,
            logoURI: outputLogo,
            symbol: outputSymbol,
            decimals: outputDecimals,
          },
        }
      })
      .filter((transaction) => transaction.status === activeTab)
  }, [tokenList, transactions, pathname, activeTab])

  return (
    <>
      <Tabs
        className="w-full grid grid-cols-3"
        currentValue={
          activeTab === 'created'
            ? 'OPEN'
            : activeTab === 'executed'
            ? 'CLOSED'
            : 'CANCELLED'
        }
        values={['OPEN', 'CLOSED', 'CANCELLED']}
        onChange={(newTab) => {
          setActiveTab(
            newTab === 'OPEN'
              ? 'created'
              : newTab === 'CLOSED'
              ? 'executed'
              : 'canceled'
          )
        }}
      />
      {requests.map((request) => (
        <TransactionHistory
          key={`transaction_${request.id}`}
          className="my-5"
          status={activeTab}
          transaction={request}
        />
      ))}
    </>
  )
}
