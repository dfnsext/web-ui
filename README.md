# DfnsSDK

Embark on your web3 journey with seamless onboarding that takes just a few moments.

## 📄 Description
This web component based SDK aims to offer a Wallet-as-a-Service (WaaS) solution built on top of DFNS's MPC solution.
Checkout the official [DFNS Documentation](https://docs.dfns.co/dfns-docs/) to get started!

## ⚡ Quick Start

### Installation

Incorporating your application with DfnsSDK necessitates the use of our client-side NPM package:

```shell
npm install @dfns/web-ui
```

### Get your App ID from DFNS Dashboard

Please visit the [DFNS Dashboard](https://docs.dfns.co/dfns-docs/getting-started/gettingstarted) and register. Begin your integration by utilizing the application's Client ID.

![Dfns Dashboard](https://1738750162-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FtnSPOZGQ2hBmgoVWX5H6%2Fuploads%2FYsciNnSjfRPBK1Gs6j4i%2FScreenshot%202023-06-29%20at%205.34.41%20PM.png?alt=media&token=256b5cd9-dc20-4861-8a9e-b53737d59d64)


### Usage
Following installation, the next action required to utilize DFNS is initializing the SDK.

#### Initialize DfnsSDFK 

DfnsSDK needs to initialize as soon as your app loads up to enable the user to log in. 
the following implemtation is a use case based on a singleton pattern to ensure there is only one instance of `CustomClass` throughout the application. This instance can be retrieved using the `getInstance` method:


```ts
import { DfnsSDK } from "@dfns/web-ui";

const dfnsSdkOptions = {
	rpId: 'YOUR_RELYING_PARTY_ID',
	appId: 'YOUR_APP_ID',
	apiUrl: 'YOUR_API_URL',
	lang: 'en',
	network: 'PolygonMumbai',
	dfnsHost: 'https://api.dfns.ninja',//(testnet)
	defaultDevice: "desktop",
	autoConnect: true,
};

export default class CustomClass {
	private static ctx: CustomClass;
	public dfnsSdk: DfnsSDK;

	public constructor() {
		CustomClass.ctx = this;
		const { DfnsSDK } = require("@dfns/web-ui");
		this.dfnsSdk = new DfnsSDK(dfnsSdkOptions);
	}

	public static getInstance() {
		if (!CustomClass.ctx) return new this();
		return CustomClass.ctx;
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
| `loginOptions`       | LoginOption[]     | (Optional) An array of login options, which can be both "social" or "web3".                   |
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
| `showRecoverySetupAtWalletCreation`    | boolean           | (Optional) shows recovery setup after the wallet creation                                                  |
| `activateRecovery`    | boolean           | (Optional) Whether to enable the link to the recover account                                                |
| `showRecoverySetupAfterRecoverAccount`    | boolean           | (Optional) Whether to show the recover setup after recovering the account.                                                     |

#### LoginOption

| Option               | Type              | Description                                                                                      |
|----------------------|-------------------|--------------------------------------------------------------------------------------------------|
| `type`               | "social" \| "web3" | Required. The type of login option, either "social" or "web3".                                  |
| `name`               | ESocialLogin      | Required. The name of the social login provider (e.g., "google" or "other").                    |

#### DfnsSDK Functions

| Function             | Description                             | Parameters                                | Return Type                   |
|----------------------|-----------------------------------------|--------------------------------------------|--------------------------------|
| `connect`            | Connects to the DFNS SDK.               | None                                       | `Promise<string>`                |
| `connectWithOAuthToken`| Connects to the DFNS SDK with an OAuth token. | `oauthToken: string`                | `Promise<string>`          |
| `signMessage`        | Signs a message using the DFNS wallet.  | `message: string`                         | `Promise<string>`                |
| `transferTokens`     | Transfers tokens.                       | None                                       | `Promise<string>`                |
| `sendTransaction`    | Sends a transaction.                     | `to: string, value: string, data?: string, nonce?: number` | `Promise<string>`        |
| `setLanguage`        | Sets the language of the SDK.           | `lang: "fr" \| "en"`                      | void                           |
| `disconnect`         | Disconnects from the DFNS SDK.           | None                                       | void                           |
| `onChange`           | Registers an event listener for wallet events. | `event: WalletEvent, callback: (data: any) => void` | () => void                 |
| `isConnected`        | Checks if the SDK is connected.          | None                                       | `Promise<boolean>`               |
| `getAddress`         | Retrieves the wallet address.            | None                                       | `Promise<string>`                |
| `getWalletProvider`  | Gets the wallet provider.                | None                                       | WalletProvider                 |
| `getProvider`        | Gets DFNS wallet provider.               | None                                       | any                 |
| `refreshToken`       | Refreshes the token. works only with `connectWithOAuthToken`  | None                    | `Promise<void>`                    |



## ⏪ Requirements

- Node 20+

## 🧳 Bundling

This module is distributed in es6 format

- `esm` build `@dfns/web-ui/dist/dfns-web-component/dfns-web-component.esm` 

### Usage in a react component
This code snippet demonstrates how to initialize a custom component using the `@dfns/web-ui/loader` library.


```ts
import { defineCustomElements } from "@dfns/web-ui/loader";
import { DfnsSDK } from "@dfns/web-ui";

export default async function CustomComponent() {
    // Initialize custom elements
    defineCustomElements();

    // Connect with OAuth token
    await DfnsSDK.connectWithOAuthToken('YOUR_OAUTH_TOKEN');

    // Connect with a social provider
    await DfnsSDK.connect();
}
```
### Usage in a web page

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

