# dfns-layout



<!-- Auto Generated Below -->


## Properties

| Property                              | Attribute                                | Description | Type                             | Default     |
| ------------------------------------- | ---------------------------------------- | ----------- | -------------------------------- | ----------- |
| `messageToSign`                       | `message-to-sign`                        |             | `string`                         | `undefined` |
| `userCreationAuthenticatorAttachment` | `user-creation-authenticator-attachment` |             | `"cross-platform" \| "platform"` | `undefined` |


## Dependencies

### Depends on

- [dfns-create-account](../dfns-create-account)
- [dfns-validate-wallet](../dfns-validate-wallet)
- [dfns-wallet-validation](../dfns-wallet-validation)
- [dfns-sign-message](../dfns-sign-message)
- [dfns-settings](../dfns-settings)
- [dfns-create-passkey](../dfns-create-passkey)
- [dfns-wallet-overview](../dfns-wallet-overview)

### Graph
```mermaid
graph TD;
  dfns-main --> dfns-create-account
  dfns-main --> dfns-validate-wallet
  dfns-main --> dfns-wallet-validation
  dfns-main --> dfns-sign-message
  dfns-main --> dfns-settings
  dfns-main --> dfns-create-passkey
  dfns-main --> dfns-wallet-overview
  dfns-create-account --> dfns-layout
  dfns-create-account --> dfns-typography
  dfns-create-account --> dfns-stepper
  dfns-create-account --> dfns-button
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-validate-wallet --> dfns-layout
  dfns-validate-wallet --> dfns-typography
  dfns-validate-wallet --> dfns-stepper
  dfns-validate-wallet --> dfns-button
  dfns-wallet-validation --> dfns-layout
  dfns-wallet-validation --> dfns-typography
  dfns-wallet-validation --> dfns-loader
  dfns-wallet-validation --> dfns-button
  dfns-sign-message --> dfns-layout
  dfns-sign-message --> dfns-typography
  dfns-sign-message --> dfns-button
  dfns-sign-message --> dfns-alert
  dfns-alert --> dfns-typography
  dfns-settings --> dfns-layout
  dfns-settings --> dfns-typography
  dfns-settings --> dfns-button
  dfns-settings --> drop-down-container
  dfns-settings --> toggle-switch
  dfns-settings --> dfns-alert
  drop-down-container --> drop-down
  drop-down-container --> dfns-typography
  dfns-create-passkey --> dfns-layout
  dfns-create-passkey --> dfns-typography
  dfns-create-passkey --> dfns-input-field
  dfns-create-passkey --> dfns-alert
  dfns-create-passkey --> dfns-button
  dfns-input-field --> dfns-typography
  dfns-wallet-overview --> dfns-layout
  dfns-wallet-overview --> dfns-typography
  dfns-wallet-overview --> dfns-button
  dfns-wallet-overview --> dfns-alert
  style dfns-main fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
