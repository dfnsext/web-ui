# dfns-alert



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type                                                                                          | Default                            |
| ---------------- | ------------------ | ----------- | --------------------------------------------------------------------------------------------- | ---------------------------------- |
| `classCss`       | `class-css`        |             | `string`                                                                                      | `undefined`                        |
| `errorIconSrc`   | `error-icon-src`   |             | `string`                                                                                      | `"icons/x-circle.svg"`             |
| `infoIconSrc`    | `info-icon-src`    |             | `string`                                                                                      | `"icons/exclamation-circle.svg"`   |
| `variant`        | `variant`          |             | `EAlertVariant.ERROR \| EAlertVariant.INFO \| EAlertVariant.SUCCESS \| EAlertVariant.WARNING` | `EAlertVariant.INFO`               |
| `warningIconSrc` | `warning-icon-src` |             | `string`                                                                                      | `"icons/exclamation-triangle.svg"` |


## Dependencies

### Used by

 - [dfns-design-system](../dfns-design-system)

### Depends on

- [dfns-typography](../dfns-typography)

### Graph
```mermaid
graph TD;
  dfns-alert --> dfns-typography
  dfns-design-system --> dfns-alert
  style dfns-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
