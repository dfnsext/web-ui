import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dfns-button',
  styleUrl: 'dfns-button.css',
  shadow: true,
})
export class DfnsButton {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
