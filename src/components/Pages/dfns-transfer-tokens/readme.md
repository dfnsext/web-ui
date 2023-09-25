# dfns-create-account



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type                  |
| ----------------- | ----------- | --------------------- |
| `transferRequest` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-confirm-transaction](../dfns-confirm-transaction)
- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-loader](../../Elements/LoaderDfns/dfns-loader)
- [dfns-input-field](../../Elements/Forms/InputField/dfns-input-field)
- [dfns-alert](../../Elements/Alerts/dfns-alert)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-transfer-tokens --> dfns-confirm-transaction
  dfns-transfer-tokens --> dfns-layout
  dfns-transfer-tokens --> dfns-typography
  dfns-transfer-tokens --> dfns-loader
  dfns-transfer-tokens --> dfns-input-field
  dfns-transfer-tokens --> dfns-alert
  dfns-transfer-tokens --> dfns-button
  dfns-confirm-transaction --> dfns-layout
  dfns-confirm-transaction --> dfns-typography
  dfns-confirm-transaction --> dfns-alert
  dfns-confirm-transaction --> dfns-loader
  dfns-confirm-transaction --> dfns-button
  dfns-alert --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-input-field --> dfns-typography
  dfns-main --> dfns-transfer-tokens
  style dfns-transfer-tokens fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
