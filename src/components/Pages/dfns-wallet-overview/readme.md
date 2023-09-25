# dfns-wallet-overview



<!-- Auto Generated Below -->


## Events

| Event    | Description | Type                                                                                                              |
| -------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `action` |             | `CustomEvent<WalletOverviewAction.CLOSE \| WalletOverviewAction.CREATE_PASSKEY \| WalletOverviewAction.SETTINGS>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-button](../../Elements/Buttons/dfns-button)
- [dfns-loader](../../Elements/LoaderDfns/dfns-loader)
- [dfns-alert](../../Elements/Alerts/dfns-alert)

### Graph
```mermaid
graph TD;
  dfns-wallet-overview --> dfns-layout
  dfns-wallet-overview --> dfns-typography
  dfns-wallet-overview --> dfns-button
  dfns-wallet-overview --> dfns-loader
  dfns-wallet-overview --> dfns-alert
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-alert --> dfns-typography
  dfns-main --> dfns-wallet-overview
  style dfns-wallet-overview fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
