# dfns-wallet-overview



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description | Type     | Default     |
| --------------- | ----------------- | ----------- | -------- | ----------- |
| `appId`         | `app-id`          |             | `string` | `undefined` |
| `dfnsHost`      | `dfns-host`       |             | `string` | `undefined` |
| `dfnsUserToken` | `dfns-user-token` |             | `string` | `undefined` |
| `rpId`          | `rp-id`           |             | `string` | `undefined` |
| `visible`       | `visible`         |             | `string` | `undefined` |
| `walletAddress` | `wallet-address`  |             | `string` | `""`        |


## Events

| Event    | Description | Type                                                                                                              |
| -------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `action` |             | `CustomEvent<WalletOverviewAction.CLOSE \| WalletOverviewAction.CREATE_PASSKEY \| WalletOverviewAction.SETTINGS>` |


## Dependencies

### Depends on

- [dfns-layout](../dfns-layout)
- [dfns-typography](../dfns-typography)
- [dfns-button](../dfns-button)
- [dfns-alert](../dfns-alert)

### Graph
```mermaid
graph TD;
  dfns-wallet-overview --> dfns-layout
  dfns-wallet-overview --> dfns-typography
  dfns-wallet-overview --> dfns-button
  dfns-wallet-overview --> dfns-alert
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-alert --> dfns-typography
  style dfns-wallet-overview fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
