import { Component, h, Prop, getAssetPath } from '@stencil/core';

@Component({
  tag: 'dfns-layout',
  styleUrl: 'dfns-layout.scss',
  shadow: true, // Enables Shadow DOM
  assetsDirs: ['assets/icons', 'assets/images'],
})
export class DfnsLayout {

  //Prop is used to pass data from one component to another
  @Prop() topSection?: string;
  @Prop() contentSection?: string;
  @Prop() bottomSection?: string;
  @Prop() closeBtn?: boolean;
  @Prop() closeBtnShouldDisconnect?: boolean;
  @Prop() crossIconSrc = 'icons/cross.svg';
  @Prop() molitorLogoSrc = 'images/molitor.svg';
  @Prop() bloomLogoSrc = 'images/bloom.svg';



  render() {
    return (
      <div class="root">
        <div class="top-section">
          {this.topSection}
          {this.closeBtn && (
            <div class="cross" onClick={this.handleCrossClick.bind(this)}>
              <img alt="Unplugged" src={getAssetPath(`./assets/${this.crossIconSrc}`)}  class="close-icon" />
            </div>
          )}
        </div>
        <div class="content-section">{this.contentSection}</div>
        <div class="bottom-section">{this.bottomSection}</div>
        <div class="logos-section">
          <img src={getAssetPath(`./assets/${this.molitorLogoSrc}`)} alt="Molitor logo" width={47} height={16} />
            powered by
          <img src={getAssetPath(`./assets/${this.bloomLogoSrc}`)}  alt="bloom logo" width={43} height={14} />
        </div>
      </div>
    );
  }

  handleCrossClick() {
    if (this.closeBtnShouldDisconnect) {
      window.location.pathname = "/";
    }
  }
}

