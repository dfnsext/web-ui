# dfns-create-passkey



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type     | Default     |
| --------- | --------- | ----------- | -------- | ----------- |
| `visible` | `visible` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [dfns-layout](../dfns-layout)
- [dfns-typography](../dfns-typography)
- [dfns-input-field](../dfns-input-field)
- [dfns-alert](../dfns-alert)
- [dfns-button](../dfns-button)

### Graph
```mermaid
graph TD;
  dfns-create-passkey --> dfns-layout
  dfns-create-passkey --> dfns-typography
  dfns-create-passkey --> dfns-input-field
  dfns-create-passkey --> dfns-alert
  dfns-create-passkey --> dfns-button
  dfns-layout --> dfns-typography
  dfns-alert --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  style dfns-create-passkey fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
