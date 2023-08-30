# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description | Type     | Default     |
| --------------- | ----------------- | ----------- | -------- | ----------- |
| `appId`         | `app-id`          |             | `string` | `undefined` |
| `dfnsHost`      | `dfns-host`       |             | `string` | `undefined` |
| `dfnsUserToken` | `dfns-user-token` |             | `string` | `undefined` |
| `message`       | `message`         |             | `string` | `undefined` |
| `rpId`          | `rp-id`           |             | `string` | `undefined` |
| `visible`       | `visible`         |             | `string` | `undefined` |
| `walletId`      | `wallet-id`       |             | `string` | `undefined` |


## Events

| Event           | Description | Type                                                                                                                                                                                                                                                                                                                                             |
| --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `signedMessage` |             | `CustomEvent<{ id: string; walletId: string; network: BlockchainNetwork; requester: RequesterIdentity; requestBody: GenerateSignatureBody; signature?: Signature; status: SignatureStatus; txHash?: string; fee?: string; dateRequested: string; datePolicyEvaluated?: string; dateSigned?: string; dateConfirmed?: string; reason?: string; }>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../ Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-button](../../Elements/Buttons/dfns-button)
- [dfns-alert](../../Elements/Alerts/dfns-alert)

### Graph
```mermaid
graph TD;
  dfns-sign-message --> dfns-layout
  dfns-sign-message --> dfns-typography
  dfns-sign-message --> dfns-button
  dfns-sign-message --> dfns-alert
  dfns-button --> dfns-typography
  dfns-alert --> dfns-typography
  dfns-main --> dfns-sign-message
  style dfns-sign-message fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
