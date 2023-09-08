# dfns-create-account



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                  | Description | Type                             | Default     |
| ------------------------- | -------------------------- | ----------- | -------------------------------- | ----------- |
| `authenticatorAttachment` | `authenticator-attachment` |             | `"cross-platform" \| "platform"` | `undefined` |


## Events

| Event            | Description | Type                                    |
| ---------------- | ----------- | --------------------------------------- |
| `passkeyCreated` |             | `CustomEvent<RegisterCompleteResponse>` |


## Dependencies

### Used by

 - [dfns-main](../dfns-main)

### Depends on

- [dfns-layout](../../Materials/Templates/dfns-layout)
- [dfns-typography](../../Elements/Typography/dfns-typography)

### Graph
```mermaid
graph TD;
  dfns-login --> dfns-layout
  dfns-login --> dfns-typography
  dfns-main --> dfns-login
  style dfns-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
