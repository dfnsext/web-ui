import { Component, h, Prop, getAssetPath } from "@stencil/core";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";


@Component({
	tag: "dfns-layout",
	styleUrl: "dfns-layout.scss",
	shadow: true, // Enables Shadow DOM
	assetsDirs: ["assets"], 
})
export class DfnsLayout {
	// Prop is used to pass data from one component to another
	@Prop() closeBtn?: boolean;
	@Prop() closeBtnShouldDisconnect?: boolean;
	@Prop() crossIconSrc = "icons/cross.svg";
	@Prop() molitorLogoSrc = "images/molitor.svg";
	@Prop() bloomLogoSrc = "images/bloom.svg";

	render() {
		const style = { display: "flex !important" };
		return (
			<div class="root" theme-mode="accor" style={style}>
				<div class="top-section">
					<slot name="topSection" />
					{this.closeBtn && (
						<div class="cross" onClick={this.handleCrossClick.bind(this)}>
							<img alt="Unplugged" src={getAssetPath(`./assets/${this.crossIconSrc}`)} class="close-icon" />
						</div>
					)}
				</div>
				<div class="content-section">
					<slot name="contentSection" />
				</div>
				<div class="bottom-section">
					<slot name="bottomSection"  />
				</div>
				<div class="logos-section">
					<img src={getAssetPath(`./assets/${this.molitorLogoSrc}`)} alt="Molitor logo" width={47} height={16} />
					<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.BLACK}>
						powered by
					</dfns-typography>
					<img src={getAssetPath(`./assets/${this.bloomLogoSrc}`)} alt="bloom logo" width={43} height={14} />
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
