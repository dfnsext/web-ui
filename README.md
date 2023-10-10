# DfnsSDK

Embark on your web3 journey with seamless onboarding that takes just a few moments.

## 📖 Documentation

Checkout the official [DFNS Documentation](https://docs.dfns.co/dfns-docs/) to get started!

## ⚡ Quick Start

### Installation

Incorporating your application with DfnsSDK necessitates the use of our client-side NPM package:

```shell
npm install @smart-chain-fr/dfns-sdk
```

### Get your App ID from DFNS Dashboard

Please visit the [DFNS Dashboard](https://docs.dfns.co/dfns-docs/getting-started/gettingstarted) and register. Begin your integration by utilizing the application's Client ID.

![Dfns Dashboard](https://1738750162-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FtnSPOZGQ2hBmgoVWX5H6%2Fuploads%2FYsciNnSjfRPBK1Gs6j4i%2FScreenshot%202023-06-29%20at%205.34.41%20PM.png?alt=media&token=256b5cd9-dc20-4861-8a9e-b53737d59d64)


### Usage
Following installation, the next action required to utilize DFNS is initializing the SDK.

#### Initialize DfnsSDFK 

DfnsSDK needs to initialise as soon as your app loads up to enable the user to log in. It uses a singleton pattern to ensure there is only one instance of DfnsWallet throughout the application. This instance can be retrieved using the getInstance method and will look like this:


```ts
import { DfnsSDK } from "@smart-chain-fr/dfns-sdk";

const dfnsSdkOptions = {
	rpId: 'YOUR_RELYING_PARTY_ID',
	appId: 'YOUR_APP_ID',
	apiUrl: 'YOUR_API_URL',
	lang: 'en',
	network: 'PolygonMumbai',
	dfnsHost: 'https://api.dfns.ninja' // (testnet),
	defaultDevice: "desktop",
	autoConnect: true,
};

export default class DfnsWallet {
	private static ctx: DfnsWallet;
	public dfnsSdk: DfnsSDK;

	public constructor() {
		DfnsWallet.ctx = this;
		const { DfnsSDK } = require("@smart-chain-fr/dfns-sdk");
		this.dfnsSdk = new DfnsSDK(dfnsSdkOptions);
	}

	public static getInstance() {
		if (!DfnsWallet.ctx) return new this();
		return DfnsWallet.ctx;
	}
}
```
#### DfnsSDKOptions

| Option               | Type              | Description                                                                                      |
|----------------------|-------------------|--------------------------------------------------------------------------------------------------|
| `appName`            | string            | (Optional) The name of your application.                                                        |
| `rpId`               | string            | Required. The relying party ID for your application.                                            |
| `appId`              | string            | Required. The application ID for your application.                                              |
| `dfnsHost`           | string            | (Optional) The DFNS host URL.                                                                   |
| `apiUrl`             | string            | (Optional) The API URL.                                                                         |
| `loginOptions`       | LoginOption[]     | (Optional) An array of login options, which can be either "social" or "web3".                   |
| `appLogoUrl`         | string \| null    | (Optional) URL to the application logo.                                                          |
| `darkMode`           | boolean           | (Optional) Whether to enable dark mode.                                                          |
| `assetsPath`         | string            | (Optional) The path to assets.                                                                  |
| `showWalletValidation`| boolean           | (Optional) Whether to show wallet validation UI.                                                 |
| `defaultDevice`      | "mobile" \| "desktop" \| null | (Optional) The default device type.                       |
| `network`            | BlockchainNetwork | Required. The blockchain network.                                                                |
| `googleClientId`     | string            | (Optional) Google Client ID for authentication.                                                  |
| `googleEnabled`      | boolean           | (Optional) Whether Google authentication is enabled.                                             |
| `lang`               | "fr" \| "en"      | (Optional) The default language.                                                                |
| `customButtonEnabled`| boolean           | (Optional) Whether to enable a custom button.                                                     |
| `customButtonText`   | string            | (Optional) Text for the custom button.                                                           |
| `customButtonIcon`   | string            | (Optional) Icon for the custom button.                                                           |
| `customButtonCallback`| () => any        | (Optional) Callback function for the custom button.                                              |
| `primaryColor`       | string            | (Optional) The primary color for UI elements.                                                    |
| `walletConnectEnabled`| boolean          | (Optional) Whether WalletConnect is enabled.                                                     |
| `walletConnectProjectId`| string         | (Optional) WalletConnect project ID.                                                           |
| `autoConnect`        | boolean           | (Optional) Whether to auto-connect.                                                              |
| `disableLogoutUI`    | boolean           | (Optional) Whether to disable the logout UI.                                                     |

#### LoginOption

| Option               | Type              | Description                                                                                      |
|----------------------|-------------------|--------------------------------------------------------------------------------------------------|
| `type`               | "social" \| "web3" | Required. The type of login option, either "social" or "web3".                                  |
| `name`               | ESocialLogin      | Required. The name of the social login provider (e.g., "google" or "other").                    |

#### DfnsSDK Functions

| Function             | Description                             | Parameters                                | Return Type                   |
|----------------------|-----------------------------------------|--------------------------------------------|--------------------------------|
| `connect`            | Connects to the DFNS SDK.               | None                                       | Promise<string>                |
| `connectWithOAuthToken`| Connects to the DFNS SDK with an OAuth token. | `oauthToken: string`                | Promise<string>          |
| `signMessage`        | Signs a message using the DFNS wallet.  | `message: string`                         | Promise<string>                |
| `transferTokens`     | Transfers tokens.                       | None                                       | Promise<string>                |
| `showWalletOverview` | Shows the wallet overview UI.            | None                                       | Promise<void>                  |
| `showSettings`       | Shows the settings UI.                  | None                                       | Promise<void>                  |
| `showReceiveTokens`  | Shows the receive tokens UI.             | None                                       | Promise<void>                  |
| `showRecoverySetup`  | Shows the recovery setup UI.             | None                                       | Promise<void>                  |
| `showRecoverAccount` | Shows the recover account UI.            | None                                       | Promise<void>                  |
| `sendTransaction`    | Sends a transaction.                     | `to: string, value: string, data?: string, nonce?: number` | Promise<string>        |
| `showCreatePasskey`  | Shows the create passkey UI.            | None                                       | Promise<void>                  |
| `showConfirmTransaction`| Shows the confirm transaction UI.     | None                                       | Promise<void>                  |
| `setLanguage`        | Sets the language of the SDK.           | `lang: "fr" \| "en"`                      | void                           |
| `disconnect`         | Disconnects from the DFNS SDK.           | None                                       | void                           |
| `onChange`           | Registers an event listener for wallet events. | `event: WalletEvent, callback: (data: any) => void` | () => void                 |
| `isConnected`        | Checks if the SDK is connected.          | None                                       | Promise<boolean>               |
| `getAddress`         | Retrieves the wallet address.            | None                                       | Promise<string>                |
| `getWalletProvider`  | Gets the wallet provider.                | None                                       | WalletProvider                 |
| `refreshToken`       | Refreshes the token.                    | None                                       | Promise<void>                  |



## ⏪ Requirements

- Node 20+

## 🧳 Bundling

This module is distributed in es6 format

- `esm` build `@smart-chain-fr/dfns-sdk/dist/dfns-web-component/dfns-web-component.esm` 

### Usage in a react component
This code snippet demonstrates how to initialize a custom component using the `@smart-chain-fr/dfns-sdk/loader` library and connect it with the `DfnsWallet` service.


```ts
import { defineCustomElements } from "@smart-chain-fr/dfns-sdk/loader";
import DfnsWallet from "@Services/wallet/DfnsWallet";

export default async function CustomComponent() {
    // Initialize custom elements
    defineCustomElements();

    // Connect with OAuth token
    await DfnsWallet.getInstance().dfnsSdk.connectWithOAuthToken('YOUR_OAUTH_TOKEN');
}
```
### Directly in Browser

This HTML and JavaScript code demonstrates how to integrate the DFNS Web Component into a web page. The DFNS Web Component allows you to add DFNS authentication and wallet functionality to your web application.

```html
<!doctype html>
<html dir="ltr" lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
    <link rel="stylesheet" href="/build/dfns-web-component.css" />
    <script type="module" src="/build/dfns-web-component.esm.js"></script>
    <script nomodule src="/build/dfns-web-component.js"></script>
</head>
<body></body>
<script type="module">
    import { DfnsSDK } from "/build/index.esm.js";

    // Configure DFNS SDK options
    const dfnsSdkOptions = {
        apiUrl: "YOUR_API_URL",
        rpId: "YOUR_RP_ID",
        appId: "YOUR_APP_ID",
        lang: "en",
        showWalletValidation: true,
        network: "PolygonMumbai",
        dfnsHost: "https://api.dfns.ninja",
        appName: "YOUR_APP_NAME",
        appLogoUrl: "YOUR_LOGO_URL",
        googleEnabled: true,
        googleClientId: "YOUR_GOOGLE_CLIENT_ID",
        customButtonEnabled: true,
        customButtonText: "Custom Button",
        customButtonIcon: null,
        customButtonCallback: () => {
            console.log("Custom button clicked");
        },
        primaryColor: "#2A0650",
        darkMode: false,
        autoConnect: true,
        walletConnectProjectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
        disableLogoutUI: true,
    };

    // Create and initialize DFNS SDK
    const dfnsSDK = new DfnsSDK(dfnsSdkOptions);
    dfnsSDK.init();
    dfnsSDK.connect();
</script>
</html>

```

## 🌐 Demo

Explore the demo folder [demo folder](https://github.com/smart-chain-fr/dfns-test/tree/43b8b93706c0c859ffd88f147007069d9b8c3d61) within this repository for various hosted demonstrations tailored to different scenarios.
