import { Component, h, Prop } from "@stencil/core";


@Component({
	tag: "dfns-layout",
	styleUrl: "dfns-layout.scss",
	shadow: true, // Enables Shadow DOM
})
export class DfnsLayout {
	// Prop is used to pass data from one component to another
	@Prop() closeBtn?: boolean;
	@Prop() onClickCloseBtn: () => void
	@Prop() crossIconSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/cross.svg";
	@Prop() molitorLogoSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/images/molitor.svg";
	@Prop() bloomLogoSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/images/bloom.svg";

	render() {
		const style = { display: "flex !important" };
		return (
			<div class="root" theme-mode="accor" style={style}>
				<div class="top-section">
					<slot name="topSection" />
					{this.closeBtn && (
						<div class="cross" onClick={this.onClickCloseBtn}>
							<img alt="Unplugged" src={this.crossIconSrc} class="close-icon" />
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
					<img src={this.molitorLogoSrc} alt="Molitor logo" width={47} height={16} />
					{/* <dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.BLACK}>
						powered by
					</dfns-typography>
					<img src={this.bloomLogoSrc} alt="bloom logo" width={43} height={14} /> */}
				</div>
			</div>
		);
	}
}
