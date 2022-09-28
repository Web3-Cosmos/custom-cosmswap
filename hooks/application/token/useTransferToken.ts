import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import {
  Coin,
  DeliverTxResponse,
  MsgTransferEncodeObject,
} from '@cosmjs/stargate'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { Height } from 'cosmjs-types/ibc/core/client/v1/client'
import Long from 'long'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { IbcAssetInfo } from '@/hooks/application/token/useIbcAssetList'
import {
  ibcWalletState,
  walletState,
} from '@/hooks/application/atoms/walletAtoms'
import { convertDenomToMicroDenom } from '@/util/conversion'
import { TransactionKind } from '@/types/constants'

type useTransferTokenArgs = {
  transactionKind: TransactionKind
  tokenAmount: number
  tokenInfo: IbcAssetInfo
} & Parameters<typeof useMutation>[2]

const sendIbcTokens = (
  senderAddress: string,
  recipientAddress: string,
  transferAmount: Coin,
  sourcePort: string,
  sourceChannel: string,
  timeoutHeight: Height | undefined,
  /** timeout in seconds */
  timeoutTimestamp: number | undefined,
  memo = '',
  client: SigningCosmWasmClient
): Promise<DeliverTxResponse> => {
  const timeoutTimestampNanoseconds = timeoutTimestamp
    ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
    : undefined
  const transferMsg: MsgTransferEncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: sourcePort,
      sourceChannel: sourceChannel,
      sender: senderAddress,
      receiver: recipientAddress,
      token: transferAmount,
      timeoutHeight: timeoutHeight,
      timeoutTimestamp: timeoutTimestampNanoseconds,
    }),
  }
  return client.signAndBroadcast(senderAddress, [transferMsg], 'auto', memo)
}

export const useTransferToken = ({
  transactionKind,
  tokenAmount,
  tokenInfo,
  ...mutationArgs
}: useTransferTokenArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const { address: ibcAddress, client: ibcClient } =
    useRecoilValue(ibcWalletState)

  return useMutation(async () => {
    const timeout = Math.floor(new Date().getTime() / 1000) + 600

    if (transactionKind == 'deposit') {
      return await ibcClient?.sendIbcTokens(
        ibcAddress,
        address,
        {
          amount: convertDenomToMicroDenom(
            tokenAmount,
            tokenInfo.decimals
          ).toString(),
          denom: tokenInfo.denom,
        },
        'transfer',
        tokenInfo.channel,
        undefined,
        timeout,
        'auto'
      )
    }

    if (transactionKind == 'withdraw') {
      return await sendIbcTokens(
        address,
        ibcAddress,
        {
          amount: convertDenomToMicroDenom(
            tokenAmount,
            tokenInfo.decimals
          ).toString(),
          denom: tokenInfo.juno_denom,
        },
        'transfer',
        tokenInfo.juno_channel,
        undefined,
        timeout,
        '',
        client!
      )
    }
  }, mutationArgs)
}