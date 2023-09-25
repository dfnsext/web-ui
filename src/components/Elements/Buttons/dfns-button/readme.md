# dfns-button



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type                                                                                                                            | Default                  |
| -------------- | -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `classCss`     | `class-css`    |             | `string`                                                                                                                        | `undefined`              |
| `content`      | `content`      |             | `string`                                                                                                                        | `undefined`              |
| `disabled`     | `disabled`     |             | `boolean`                                                                                                                       | `false`                  |
| `fullwidth`    | `fullwidth`    |             | `boolean`                                                                                                                       | `false`                  |
| `icon`         | --             |             | `Element`                                                                                                                       | `undefined`              |
| `iconUrl`      | `icon-url`     |             | `string`                                                                                                                        | `undefined`              |
| `iconposition` | `iconposition` |             | `"left" \| "right"`                                                                                                             | `"right"`                |
| `iconstyle`    | `iconstyle`    |             | `any`                                                                                                                           | `undefined`              |
| `isloading`    | `isloading`    |             | `boolean`                                                                                                                       | `false`                  |
| `onClick`      | --             |             | `() => any`                                                                                                                     | `undefined`              |
| `sizing`       | `sizing`       |             | `EButtonSize.LARGE \| EButtonSize.MEDIUM \| EButtonSize.SMALL`                                                                  | `EButtonSize.LARGE`      |
| `type`         | `type`         |             | `"button" \| "submit"`                                                                                                          | `"button"`               |
| `variant`      | `variant`      |             | `EButtonVariant.NEUTRAL \| EButtonVariant.PRIMARY \| EButtonVariant.SECONDARY \| EButtonVariant.TEXT \| EButtonVariant.WARNING` | `EButtonVariant.PRIMARY` |


## Events

| Event         | Description | Type                |
| ------------- | ----------- | ------------------- |
| `buttonClick` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [dfns-confirm-transaction](../../../Pages/dfns-confirm-transaction)
 - [dfns-create-account](../../../Pages/dfns-create-account)
 - [dfns-create-passkey](../../../Pages/dfns-create-passkey)
 - [dfns-login](../../../Pages/dfns-login)
 - [dfns-receive-tokens](../../../Pages/dfns-receive-tokens)
 - [dfns-recovery-setup](../../../Pages/dfns-recovery-setup)
 - [dfns-settings](../../../Pages/dfns-settings)
 - [dfns-sign-message](../../../Pages/dfns-sign-message)
 - [dfns-transfer-tokens](../../../Pages/dfns-transfer-tokens)
 - [dfns-validate-wallet](../../../Pages/dfns-validate-wallet)
 - [dfns-wallet-overview](../../../Pages/dfns-wallet-overview)
 - [dfns-wallet-validation](../../../Pages/dfns-wallet-validation)

### Depends on

- [dfns-typography](../../Typography/dfns-typography)
- [dfns-loader](../../LoaderDfns/dfns-loader)

### Graph
```mermaid
graph TD;
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-confirm-transaction --> dfns-button
  dfns-create-account --> dfns-button
  dfns-create-passkey --> dfns-button
  dfns-login --> dfns-button
  dfns-receive-tokens --> dfns-button
  dfns-recovery-setup --> dfns-button
  dfns-settings --> dfns-button
  dfns-sign-message --> dfns-button
  dfns-transfer-tokens --> dfns-button
  dfns-validate-wallet --> dfns-button
  dfns-wallet-overview --> dfns-button
  dfns-wallet-validation --> dfns-button
  style dfns-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
