import { useState, useEffect, useCallback } from 'react'
import { TokenList } from '@uniswap/token-lists'
import schema from '@uniswap/token-lists/src/tokenlist.schema.json'
import Ajv from 'ajv'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@uniswap/sdk'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { injected, NetworkContextName, NETWORK_CHAIN_ID, getNetworkLibrary } from './constants'
import resolveENSContentHash from './resolveENSContentHash'

import { useToken } from '@/hooks/application/token/useToken'

import { DEFAULT_LIST_OF_TOKENS } from './constants'
import jFetch from '@/functions/dom/jFetch'

export function useTokenLists() {
  useEffect(() => {
    loadTokens()
  }, [])
}

async function loadTokens() {
  let _tokens: any[] = []
  let _tokenListSettings: Record<string, boolean> = {}

  for (const list of DEFAULT_LIST_OF_TOKENS) {
    const response = await jFetch(list)
    if (response) {
      _tokenListSettings = {
        ..._tokenListSettings,
        [response.name] : {
          name: response.name,
          logoURI: response.logoURI,
          length: response.tokens.length,
          isOn: true,
        }
      }
      _tokens = [ ..._tokens, ...response.tokens.map(((tempToken: any) => ({...tempToken, tokenListSettings: response.name}))) ]
    }
  }
  useToken.setState({
    availableTokens: _tokens,
    filteredTokens: _tokens,
    availableTokenListSettings: _tokenListSettings,
  })
}
