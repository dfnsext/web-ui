# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description | Type     | Default                                                                         |
| -------------------- | ---------------------- | ----------- | -------- | ------------------------------------------------------------------------------- |
| `confirmationImgSrc` | `confirmation-img-src` |             | `string` | `"https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg"` |


## Events

| Event    | Description | Type                                                                                        |
| -------- | ----------- | ------------------------------------------------------------------------------------------- |
| `action` |             | `CustomEvent<SettingsAction.BACK \| SettingsAction.CLOSE \| SettingsAction.CREATE_PASSKEY>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)
- [dfns-button](../../Elements/Buttons/dfns-button)
- [toggle-switch](../../Elements/ToggleSwitch/toggle-switch)
- [dfns-alert](../../Elements/Alerts/dfns-alert)

### Graph
```mermaid
graph TD;
  dfns-settings --> dfns-layout
  dfns-settings --> dfns-typography
  dfns-settings --> dfns-button
  dfns-settings --> toggle-switch
  dfns-settings --> dfns-alert
  dfns-layout --> dfns-typography
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-alert --> dfns-typography
  dfns-main --> dfns-settings
  style dfns-settings fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
