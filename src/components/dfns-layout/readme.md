# dfns-layout



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description | Type      | Default                |
| -------------------------- | ----------------------------- | ----------- | --------- | ---------------------- |
| `bloomLogoSrc`             | `bloom-logo-src`              |             | `string`  | `"images/bloom.svg"`   |
| `closeBtn`                 | `close-btn`                   |             | `boolean` | `undefined`            |
| `closeBtnShouldDisconnect` | `close-btn-should-disconnect` |             | `boolean` | `undefined`            |
| `crossIconSrc`             | `cross-icon-src`              |             | `string`  | `"icons/cross.svg"`    |
| `molitorLogoSrc`           | `molitor-logo-src`            |             | `string`  | `"images/molitor.svg"` |


## Dependencies

### Used by

 - [dfns-create-account](../dfns-create-account)
 - [dfns-design-system](../dfns-design-system)
 - [dfns-validate-wallet](../dfns-validate-wallet)
 - [dfns-wallet-validation](../dfns-wallet-validation)

### Depends on

- [dfns-typography](../dfns-typography)

### Graph
```mermaid
graph TD;
  dfns-layout --> dfns-typography
  dfns-create-account --> dfns-layout
  dfns-design-system --> dfns-layout
  dfns-validate-wallet --> dfns-layout
  dfns-wallet-validation --> dfns-layout
  style dfns-layout fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
