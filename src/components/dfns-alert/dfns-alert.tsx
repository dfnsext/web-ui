import { Component, Prop, h } from '@stencil/core';
import { EAlertVariant } from '../../utils/enums/alerts-variants';

@Component({
  tag: 'dfns-alert',
  styleUrl: 'dfns-alert.scss',
  shadow: true,
})
export class DfnsAlert {
  @Prop() variant: EAlertVariant = EAlertVariant.INFO;
  @Prop() icon?: string | null | false;
  @Prop() iconstyle?: any;
  @Prop() classCss?: string;

  render() {
    return (
      <div class={`root ${this.classCss}`}>
      <div class="icon" style={this.iconstyle}>
        {this.icon}
      </div>
        <slot></slot>
    </div>
    );
  }

}
