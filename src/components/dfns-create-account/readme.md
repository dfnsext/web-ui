# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type     | Default     |
| ------------------ | -------------------- | ----------- | -------- | ----------- |
| `oauthAccessToken` | `oauth-access-token` |             | `string` | `undefined` |
| `rpId`             | `rp-id`              |             | `string` | `undefined` |
| `visible`          | `visible`            |             | `string` | `undefined` |


## Events

| Event            | Description | Type                                    |
| ---------------- | ----------- | --------------------------------------- |
| `passkeyCreated` |             | `CustomEvent<RegisterCompleteResponse>` |


## Dependencies

### Depends on

- [dfns-layout](../dfns-layout)
- [dfns-typography](../dfns-typography)
- [dfns-stepper](../dfns-stepper)
- [dfns-button](../dfns-button)

### Graph
```mermaid
graph TD;
  dfns-create-account --> dfns-layout
  dfns-create-account --> dfns-typography
  dfns-create-account --> dfns-stepper
  dfns-create-account --> dfns-button
  dfns-stepper --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  style dfns-create-account fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
