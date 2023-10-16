# dfns-recover-account



<!-- Auto Generated Below -->


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
- [dfns-input-field](../../Elements/Forms/InputField/dfns-input-field)

### Graph
```mermaid
graph TD;
  dfns-recover-account --> dfns-layout
  dfns-recover-account --> dfns-typography
  dfns-recover-account --> dfns-button
  dfns-recover-account --> dfns-input-field
  dfns-layout --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-input-field --> dfns-typography
  dfns-main --> dfns-recover-account
  style dfns-recover-account fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
