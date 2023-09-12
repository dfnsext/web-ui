# dfns-create-passkey



<!-- Auto Generated Below -->


## Events

| Event    | Description | Type                                                                 |
| -------- | ----------- | -------------------------------------------------------------------- |
| `action` |             | `CustomEvent<CreatePasskeyAction.BACK \| CreatePasskeyAction.CLOSE>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-input-field](../../Elements/Forms/InputField/dfns-input-field)
- [dfns-alert](../../Elements/Alerts/dfns-alert)
- [dfns-button](../../Elements/Buttons/dfns-button)

### Graph
```mermaid
graph TD;
  dfns-create-passkey --> dfns-layout
  dfns-create-passkey --> dfns-typography
  dfns-create-passkey --> dfns-input-field
  dfns-create-passkey --> dfns-alert
  dfns-create-passkey --> dfns-button
  dfns-input-field --> dfns-typography
  dfns-alert --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-main --> dfns-create-passkey
  style dfns-create-passkey fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
