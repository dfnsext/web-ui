import { Component, h, Prop } from '@stencil/core';
import { ITypoColor, ITypo } from '../../utils/enums/typography-enums';


@Component({
  tag: 'dfns-typography',
  styleUrl: 'dfns-typography.scss', // If you have separate CSS styles, create typography.scss file
  shadow: true,
})
export class DfnsTypography {
  @Prop() typo: ITypo;
  @Prop() color?: ITypoColor;
  @Prop() classCss?: string;

  render() {
    const style = { color: this.color };

    return (
      <span class={`container ${this.typo} ${this.classCss}`} style={style}>
        <slot></slot>
      </span>
    );
  }
}
