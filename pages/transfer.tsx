import React, { useReducer, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { Layout, Card, AssetsList, TransferDialog } from '@/components'
import { useNotification } from '@/hooks/application/notification/useNotification'
import { useConnectIbcWallet } from '@/hooks/application/wallet/useConnectIbcWallet'
import { useConnectWallet } from '@/hooks/application/wallet/useConnectWallet'
import {
  walletState,
  WalletStatusType,
} from '@/hooks/application/atoms/walletAtoms'

const Transfer: NextPage = () => {
  const [
    { transactionKind, isTransferDialogShowing, selectedToken },
    updateState,
  ] = useReducer(
    (store: any, updatedStore: any) => ({ ...store, ...updatedStore }),
    {
      transactionKind: 'deposit',
      isTransferDialogShowing: false,
      selectedToken: null,
    }
  )

  const router = useRouter()

  const { logError } = useNotification()

  function handleAssetClick({
    actionType,
    symbol,
  }: {
    actionType: string
    symbol: string
  }) {
    updateState({
      transactionKind: actionType,
      selectedToken: symbol,
      isTransferDialogShowing: true,
    })
  }

  const { mutate: connectExternalWallet } = useConnectIbcWallet(selectedToken, {
    onError(error) {
      logError('Error', `Cannot get wallet address for ${selectedToken}`)
    },
  })

  const { mutate: connectInternalWallet } = useConnectWallet({
    onError(error) {
      logError('Error', `Cannot connect to your wallet ${selectedToken}`)
    },
  })

  const { status } = useRecoilValue(walletState)
  useEffect(() => {
    async function connectInternalAndExternalWallets() {
      if (status !== WalletStatusType.connected) {
        console.log('going to connect internal wallet first')
        await connectInternalWallet(null)
      }

      connectExternalWallet(null)
    }

    // connect wallet as soon as a token is selected
    if (selectedToken) {
      connectInternalAndExternalWallets()
    }
  }, [connectExternalWallet, connectInternalWallet, selectedToken, status])

  return (
    <Layout>
      <Card className="bg-stack-2 p-5 mb-4">
        <AssetsList onActionClick={handleAssetClick} />
      </Card>
      {selectedToken && (
        <TransferDialog
          tokenSymbol={selectedToken}
          transactionKind={transactionKind}
          open={isTransferDialogShowing}
          onClose={() => updateState({ isTransferDialogShowing: false })}
          onTokenSelect={(tokenSymbol: string) =>
            updateState({ selectedToken: tokenSymbol })
          }
        />
      )}
    </Layout>
  )
}

export default Transfer
