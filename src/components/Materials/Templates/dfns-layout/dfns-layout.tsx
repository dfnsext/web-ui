import { Component, h, Prop } from "@stencil/core";
import router from "../../../../stores/RouterStore";
import dfnsStore from "../../../../stores/DfnsStore";

@Component({
	tag: "dfns-layout",
	styleUrl: "dfns-layout.scss",
	shadow: true, // Enables Shadow DOM
})
export class DfnsLayout {
	// Prop is used to pass data from one component to another
	@Prop() closeBtn?: boolean;
	@Prop() onClickCloseBtn: () => void;
	@Prop() crossIconSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/cross.svg";
	@Prop() bloomLogoSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/images/bloom.svg";

	render() {
		const style = { display: "flex !important" };
		return (
			<div class="root" style={style}>
				<div class="top-section">
					<slot name="topSection" />
					{this.closeBtn && (
						<div
							class="cross"
							onClick={() => {
								router.goBack();
								if (this.onClickCloseBtn) {
									this.onClickCloseBtn();
								}
							}}>
							<img alt="Unplugged" src={this.crossIconSrc} class="close-icon" />
						</div>
					)}
				</div>
				<div class="content-section">
					<slot name="contentSection" />
				</div>
				<div class="bottom-section">
					<slot name="bottomSection" />
				</div>
				<div class="logos-section">
					<img src={dfnsStore.state.appLogoUrl} alt={`${dfnsStore.state.appName} logo`} width={47} height={16} />
					{/* <dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.BLACK}>
						powered by
					</dfns-typography>
					<img src={this.bloomLogoSrc} alt="bloom logo" width={43} height={14} /> */}
				</div>
			</div>
		);
	}
}
