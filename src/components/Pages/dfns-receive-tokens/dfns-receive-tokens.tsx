import { Component, JSX, State, Watch, h } from "@stencil/core";
import langState from "../../../stores/LanguageStore";
import router from "../../../stores/RouterStore";

import * as QRCode from "qrcode";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { formatWalletAddress } from "../../../common/helpers/formatWalletAddress";
import dfnsStore from "../../../stores/DfnsStore";
import { CopyClipboard } from "../../Elements/CopyClipboard";

@Component({
	tag: "dfns-receive-tokens",
	styleUrl: "dfns-receive-tokens.scss",
	shadow: true,
})
export class DfnsReceiveTokens {
	@State() qrCodeImage: string;
	@State() isMobile: boolean = window.innerWidth <= 768; // Initial mobile check

	async closeBtn() {
		router.goBack();
	}

	async goBack() {
		router.goBack();
	}

	// Use the @Watch decorator to monitor changes in window width
	@Watch("isMobile")
	onIsMobileChange(newValue: boolean, oldValue: boolean) {
		// Check if the mobile status has changed
		if (newValue !== oldValue) {
			// Trigger a re-render when the mobile status changes
			this.isMobile = newValue;
		}
	}

	async componentDidLoad() {
		this.qrCodeImage = await QRCode.toDataURL(dfnsStore.state.wallet?.address);
	}

	render() {
		const iconCopy: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M7 3.5C7 2.67157 7.67157 2 8.5 2H12.3787C12.7765 2 13.158 2.15804 13.4393 2.43934L16.5607 5.56066C16.842 5.84197 17 6.2235 17 6.62132V12.5C17 13.3284 16.3284 14 15.5 14H14.5V10.6213C14.5 9.82567 14.1839 9.06261 13.6213 8.5L10.5 5.37868C9.93739 4.81607 9.17433 4.5 8.37868 4.5H7V3.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M4.5 6C3.67157 6 3 6.67157 3 7.5V16.5C3 17.3284 3.67157 18 4.5 18H11.5C12.3284 18 13 17.3284 13 16.5V10.6213C13 10.2235 12.842 9.84197 12.5607 9.56066L9.43934 6.43934C9.15804 6.15804 8.7765 6 8.37868 6H4.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);

		const isMobile = window.innerWidth <= 768;

		const formattedWalletAddress = dfnsStore.state.wallet?.address ? formatWalletAddress(dfnsStore.state.wallet.address, 5, 4) : "...";
		const walletAddress = isMobile ? formattedWalletAddress : dfnsStore.state.wallet?.address;

		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY}>
						{langState.values.header.receive_token}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="content-container">
						<div class="content">
							<div class="qr-code">
								<img src={this.qrCodeImage} />
							</div>
							<CopyClipboard value={dfnsStore.state.wallet?.address} openToaster={true}>
								<dfns-button
									content={walletAddress}
									variant={EButtonVariant.NEUTRAL}
									sizing={EButtonSize.SMALL}
									icon={iconCopy}
									iconposition="right"
									fullwidth
								/>
							</CopyClipboard>
							<dfns-alert variant={EAlertVariant.WARNING} hasTitle={true}>
								<div slot="title">{langState.values.pages.receive_tokens.warning_title}</div>
								<div slot="content">{langState.values.pages.receive_tokens.warning_content}</div>
							</dfns-alert>
						</div>
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.buttons.back}
						variant={EButtonVariant.NEUTRAL}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						onClick={this.goBack.bind(this)}
					/>
				</div>
			</dfns-layout>
		);
	}
}
