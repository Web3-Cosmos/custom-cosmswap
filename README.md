## Autonomy Cosmswap

An open-source interface for a Autonomy CosmWasm decentralized exchange.

Run the app in dev mode locally.

```bash
npm run dev
# or
yarn dev
```

Access the app on `http://localhost:3000/`.

## Configuration

The app configuration, feature flags, etc., is located in the .env config file.

### Chain configuration

Swap our main chain and test chain info example with your configuration to suggest your chain for Keplr and allow the wallet to be used in the app. It expects to receive data in the `ChainInfo` format. Refer to [Keplr documentation](https://docs.keplr.app/api/suggest-chain.html) for more information.

> Keplr's 'suggest chain' feature allows front-ends to add new Cosmos-SDK based blockchains that are not natively supported.

Use this `env` variable to update the chain info path. The app will dynamically load the configuration so that the path can point to a local file in `/public` or a url.

```
Testnet

NEXT_PUBLIC_CHAIN_INFO_TESTNET_URL=/chain_info.testnet.json
```

```
Mainnet

NEXT_PUBLIC_CHAIN_INFO_MAINNET_URL=/chain_info.mainnet.json
```

### Provide token configuration

The app currently fetches tokens based on the content of [pools list](https://github.com/Top-Dev-Ops/autonomy-cosm/blob/main/public/pools_list.mainnet.json) and you will need to provide another pools list json in case that you need to show more tokens.

Similarly to `NEXT_PUBLIC_CHAIN_INFO_MAINNET_URL` variable, the config will be loaded dynamically.

```
Testnet

NEXT_PUBLIC_POOLS_LIST_TESTNET_URL=/pools_list.testnet.json
```

```
Mainnet

NEXT_PUBLIC_POOLS_LIST_MAINNET_URL=/pools_list.mainnet.json
```

### Provide IBC assets configuration

By default, the platform only renders the example IBC assets. To allow for interchain asset transfers you will need to provide your ibc tokens lists. Refer to the ibc asset configuration [example](https://github.com/Top-Dev-Ops/autonomy-cosm/blob/main/public/ibc_assets.json) for more information.

Similarly to `NEXT_PUBLIC_CHAIN_INFO_MAINNET_URL` & `NEXT_PUBLIC_TOKEN_LIST_MAINNET_URL` variables, the config will be loaded dynamically.

```
IBC Assets

NEXT_PUBLIC_IBC_ASSETS_URL=/ibc_assets.json
```

## Branding configuration

### App name

By default, the app uses the `Autonomy Cosmswap` name. To update the app name, go to the `.env` file and change the following variable:

```
NEXT_PUBLIC_SITE_TITLE=Autonomy Cosmswap
```

That will change the site title and update the footer.

### Demo mode

By default, the app runs in a mainnet mode, but if you'd like to test the app in a testnet mode, please update the env variable:

```
NEXT_PUBLIC_TESTNET_MODE=true
```

### App version

Update this variable if you choose to run a different version.

```
NEXT_PUBLIC_APP_VERSION=1.2.7
```

### Branding

We rcommend vector graphics for your project's logo and name. Go to `/logo` and swap `logo-only-icon.svg` with yours to update the app logo while keeping the file name.

## How to deploy

The app is currently deployed on Vercel and available [Autonomy Cosmswap](https://autonomy-cosmswap.vercel.app).

## License

Licensed under Apache 2.0.
