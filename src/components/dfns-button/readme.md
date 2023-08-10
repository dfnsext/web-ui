# dfns-button



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description | Type                                                                                                  | Default                  |
| -------------- | -------------- | ----------- | ----------------------------------------------------------------------------------------------------- | ------------------------ |
| `classCss`     | `class-css`    |             | `string`                                                                                              | `undefined`              |
| `content`      | `content`      |             | `string`                                                                                              | `undefined`              |
| `disabled`     | `disabled`     |             | `boolean`                                                                                             | `false`                  |
| `fullwidth`    | `fullwidth`    |             | `boolean`                                                                                             | `false`                  |
| `icon`         | --             |             | `Element`                                                                                             | `undefined`              |
| `iconposition` | `iconposition` |             | `"left" \| "right"`                                                                                   | `"right"`                |
| `iconstyle`    | `iconstyle`    |             | `any`                                                                                                 | `undefined`              |
| `isloading`    | `isloading`    |             | `boolean`                                                                                             | `false`                  |
| `sizing`       | `sizing`       |             | `EButtonSize.LARGE \| EButtonSize.MEDIUM \| EButtonSize.SMALL`                                        | `EButtonSize.LARGE`      |
| `type`         | `type`         |             | `"button" \| "submit"`                                                                                | `"button"`               |
| `variant`      | `variant`      |             | `EButtonVariant.NEUTRAL \| EButtonVariant.PRIMARY \| EButtonVariant.SECONDARY \| EButtonVariant.TEXT` | `EButtonVariant.PRIMARY` |


## Events

| Event         | Description | Type                |
| ------------- | ----------- | ------------------- |
| `buttonClick` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [dfns-design-system](../dfns-design-system)

### Depends on

- [dfns-typography](../dfns-typography)
- [dfns-loader](../dfns-loader)

### Graph
```mermaid
graph TD;
  dfns-button --> dfns-typography
  dfns-button --> dfns-loader
  dfns-design-system --> dfns-button
  style dfns-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
