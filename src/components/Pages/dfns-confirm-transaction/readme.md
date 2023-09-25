# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute              | Description | Type         | Default                                                                         |
| --------------------------- | ---------------------- | ----------- | ------------ | ------------------------------------------------------------------------------- |
| `backButtonCallback`        | --                     |             | `() => void` | `undefined`                                                                     |
| `confirmationImgSrc`        | `confirmation-img-src` |             | `string`     | `"https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg"` |
| `data`                      | `data`                 |             | `string`     | `undefined`                                                                     |
| `decimals`                  | `decimals`             |             | `number`     | `undefined`                                                                     |
| `dfnsTransfer`              | `dfns-transfer`        |             | `boolean`    | `false`                                                                         |
| `dfnsTransferSelectedToken` | --                     |             | `ITokenInfo` | `undefined`                                                                     |
| `to`                        | `to`                   |             | `string`     | `undefined`                                                                     |
| `tokenSymbol`               | `token-symbol`         |             | `string`     | `networkMapping[dfnsStore.state.network].nativeCurrency.symbol`                 |
| `txNonce`                   | `tx-nonce`             |             | `number`     | `undefined`                                                                     |
| `value`                     | `value`                |             | `string`     | `undefined`                                                                     |


## Events

| Event             | Description | Type                  |
| ----------------- | ----------- | --------------------- |
| `transactionSent` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)
 - [dfns-transfer-tokens](../dfns-transfer-tokens)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-alert](../../Elements/Alerts/dfns-alert)
- [dfns-loader](../../Elements/LoaderDfns/dfns-loader)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-confirm-transaction --> dfns-layout
  dfns-confirm-transaction --> dfns-typography
  dfns-confirm-transaction --> dfns-alert
  dfns-confirm-transaction --> dfns-loader
  dfns-confirm-transaction --> dfns-button
  dfns-alert --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-main --> dfns-confirm-transaction
  dfns-transfer-tokens --> dfns-confirm-transaction
  style dfns-confirm-transaction fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
