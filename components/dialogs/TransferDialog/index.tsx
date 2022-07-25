import React, { useState } from 'react'
import { useRouter } from 'next/router'

import {
  Button,
  Card,
  Row,
  Col,
  Icon,
  Input,
  ResponsiveDialogDrawer,
  Spinner,
  KeplrWalletInfo,
  AppWalletInfo,
  AssetSelect,
} from '@/components'
import { useTokenBalance } from '@/hooks/application/token/useTokenBalance'
import { useIbcAssetInfo } from '@/hooks/application/token/useIbcAssetInfo'
import { useIbcTokenBalance } from '@/hooks/application/token/useIbcTokenBalance'
import { useRefetchQueries } from '@/hooks/application/token/useRefetchQueries'
import { useTransferToken } from '@/hooks/application/token/useTransferToken'
import { TransactionKind } from '@/types/constants'
import { useNotification } from '@/hooks/application/notification/useNotification'
import { formatTokenBalance } from '@/util/conversion'

export default function TransferDialog(
  props: Parameters<typeof TransferDialogContent>[0]
) {
  return (
    <ResponsiveDialogDrawer
      maskNoBlur
      transitionSpeed="fast"
      placement="from-top"
      open={props.open}
      onClose={props.onClose}
    >
      {({ close: closePanel }) => (
        <TransferDialogContent {...props} onClose={closePanel} />
      )}
    </ResponsiveDialogDrawer>
  )
}

function TransferDialogContent({
  tokenSymbol,
  transactionKind,
  open,
  onClose,
  onTokenSelect,
}: {
  tokenSymbol: string
  transactionKind: TransactionKind
  open: boolean
  onClose: () => void
  onTokenSelect: (symbol: string) => unknown
}) {
  const router = useRouter()

  const tokenInfo = useIbcAssetInfo(tokenSymbol)
  const deposit_gas_fee = tokenInfo?.deposit_gas_fee
    ? tokenInfo.deposit_gas_fee
    : 0.01

  const { balance: externalIbcAssetBalance } = useIbcTokenBalance(tokenSymbol)
  const { balance: nativeAssetBalance } = useTokenBalance(tokenSymbol)

  const [tokenAmount, setTokenAmount] = useState(0)
  const refetchQueries = useRefetchQueries(['tokenBalance', 'ibcTokenBalance'])
  const { logSuccess, logError } = useNotification()

  const { isLoading, mutate: mutateTransferAsset } = useTransferToken({
    transactionKind,
    tokenAmount,
    // @ts-ignore
    tokenInfo,

    onSuccess() {
      // reset cache
      refetchQueries()

      logSuccess(
        transactionKind === 'deposit' ? 'Deposit' : 'Withdrawal',
        'Successfully initiated.'
      )

      // close modal
      requestAnimationFrame(onClose)
    },
    onError(error) {
      logError(
        'Error',
        `Could not ${
          transactionKind === 'deposit' ? 'deposit' : 'withdraw'
        } the asset.`
      )
    },
  })

  const capitalizedTransactionType =
    transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'

  const WalletInfoPerformingActionFrom =
    transactionKind === 'deposit' ? KeplrWalletInfo : AppWalletInfo
  const WalletInfoPerformingActionAgainst =
    transactionKind === 'withdraw' ? KeplrWalletInfo : AppWalletInfo

  const maxApplicableAmount =
    transactionKind === 'deposit'
      ? Math.max(externalIbcAssetBalance - deposit_gas_fee, 0)
      : nativeAssetBalance

  return (
    <Card
      className="flex flex-col shadow-xl rounded-3xl mobile:rounded-none w-[min(468px,100vw)] mobile:w-full h-full border border-stack-4 bg-stack-2"
      size="lg"
      style={{
        boxShadow: '0px 0px 48px rgba(171, 196, 255, 0.24)',
      }}
    >
      <>
        <div className="pt-6">
          <Row className="justify-between items-center mb-6 px-8 mobile:px-6">
            <div className="text-xl font-semibold text-primary">
              {capitalizedTransactionType}
            </div>
            <Icon
              className="text-primary cursor-pointer clickable clickable-mask-offset-2"
              heroIconName="x"
              onClick={onClose}
            />
          </Row>

          <WalletInfoPerformingActionFrom className="pb-4 px-8 mobile:px-6" />
          <AssetSelect
            activeTokenSymbol={tokenSymbol}
            onTokenSymbolSelect={onTokenSelect}
            fetchingBalancesAgainstChain={
              transactionKind === 'deposit' ? 'ibc' : 'native'
            }
          />
          <div className="mobile:mx-6 border-t-[1.5px] border-stack-4" />

          {/* amount input */}
          <Col className="px-8 mobile:px-6 my-4">
            <Row className="text-primary text-sm items-center mb-2">
              Amount
              <Button
                type="text"
                className="bg-stack-3 mx-2"
                size="sm"
                onClick={() =>
                  setTokenAmount(+formatTokenBalance(maxApplicableAmount))
                }
              >
                Max
              </Button>
              <Button
                type="text"
                className="bg-stack-3"
                size="sm"
                onClick={() =>
                  setTokenAmount(+formatTokenBalance(maxApplicableAmount / 2))
                }
              >
                1/2
              </Button>
            </Row>
            <Input
              className="font-extrabold text-lg text-primary flex-grow bg-stack-4 p-8 rounded-xl"
              type="number"
              value={`${tokenAmount}`}
              onUserInput={(amount) => setTokenAmount(+amount)}
              inputClassName="text-left mobile:text-sm font-bold"
            />
          </Col>
          <div className="mobile:mx-6 border-t-[1.5px] border-stack-4" />
          <WalletInfoPerformingActionAgainst
            className="my-4 px-8 mobile:px-6"
            depositing={true}
          />
          <Row className="p-4 justify-end">
            <Button className="mr-2 bg-stack-3" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={
                transactionKind === 'deposit'
                  ? externalIbcAssetBalance <= 0
                  : nativeAssetBalance <= 0
              }
              onClick={() => mutateTransferAsset(null)}
              className="text-center"
            >
              {isLoading ? <Spinner /> : 'Transfer'}
            </Button>
          </Row>
        </div>
      </>
    </Card>
  )
}
