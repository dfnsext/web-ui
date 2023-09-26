import { Component, h, JSX, Prop } from "@stencil/core";
import dfnsStore from "../../../../stores/DfnsStore";
import router from "../../../../stores/RouterStore";
import { ITypo, ITypoColor } from "../../../../common/enums/typography-enums";

@Component({
	tag: "dfns-layout",
	styleUrl: "dfns-layout.scss",
	shadow: true, // Enables Shadow DOM
})
export class DfnsLayout {
	// Prop is used to pass data from one component to another
	@Prop() closeBtn?: boolean;
	@Prop() onClickCloseBtn: () => void;

	render() {
		const style = { display: "flex !important" };
		const crossIconSrc: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
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
							{crossIconSrc}
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
					{/* {dfnsStore.state.appLogoUrl && (
						<img src={dfnsStore.state.appLogoUrl} alt={`${dfnsStore.state.appName} logo`} width={47} height={16} />
					)} */}
					<dfns-typography typo={ITypo.TEXTE_XS_SEMIBOLD} color={ITypoColor.PRIMARY}>
						powered by DFNS
					</dfns-typography>
				</div>
			</div>
		);
	}
}
