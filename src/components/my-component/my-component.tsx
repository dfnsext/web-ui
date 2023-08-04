import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  render() {
    return (
      <div>
        <dfns-layout topSection="top" contentSection="content" bottomSection="bottom" closeBtn={true} closeBtnShouldDisconnect={true}></dfns-layout>
        </div>
    );
  }
}
