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
- [drop-down-container](../../Elements/DropDown/drop-down-container)
- [toggle-switch](../../Elements/ToggleSwitch/toggle-switch)
- [dfns-alert](../../Elements/Alerts/dfns-alert)

### Graph
```mermaid
graph TD;
  dfns-settings --> dfns-layout
  dfns-settings --> dfns-typography
  dfns-settings --> dfns-button
  dfns-settings --> drop-down-container
  dfns-settings --> toggle-switch
  dfns-settings --> dfns-alert
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  drop-down-container --> drop-down
  drop-down-container --> dfns-typography
  dfns-alert --> dfns-typography
  dfns-main --> dfns-settings
  style dfns-settings fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
