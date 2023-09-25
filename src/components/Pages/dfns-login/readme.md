# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute                       | Description | Type      | Default     |
| ---------------------------- | ------------------------------- | ----------- | --------- | ----------- |
| `shouldShowWalletValidation` | `should-show-wallet-validation` |             | `boolean` | `undefined` |


## Events

| Event             | Description | Type                  |
| ----------------- | ----------- | --------------------- |
| `walletConnected` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-login --> dfns-layout
  dfns-login --> dfns-typography
  dfns-login --> dfns-button
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-main --> dfns-login
  style dfns-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
