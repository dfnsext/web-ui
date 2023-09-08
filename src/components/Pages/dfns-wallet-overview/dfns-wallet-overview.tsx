import { Component, Event, EventEmitter, JSX, State, h } from "@stencil/core";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import router, { RouteType } from "../../../stores/RouterStore";
import { getDfnsDelegatedClient } from "../../../utils/dfns";
import { WalletOverviewAction } from "../../../utils/enums/actions-enum";
import { EAlertVariant } from "../../../utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../utils/enums/buttons-enums";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { CopyClipboard } from "../../Elements/CopyClipboard";

@Component({
	tag: "dfns-wallet-overview",
	styleUrl: "dfns-wallet-overview.scss",
	shadow: true,
})
export class DfnsWalletOverview {
	
	@State() isLoading: boolean = false;

	@Event() action: EventEmitter<WalletOverviewAction>;

	async componentWillLoad() {
		this.fetchPasskeys();
	}

	async fetchPasskeys() {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
			const credentials = (await dfnsDelegated.auth.listUserCredentials()).items;
			dfnsStore.setValue("credentials", credentials);
		} catch (error) {
			console.error(error);
		}
	}

	private formatWalletAddress(address: string, startChars: number, endChars: number): string {
		const length = address.length;
		const truncatedStart = address.substring(0, startChars);
		const truncatedEnd = address.substring(length - endChars, length);
		return `${truncatedStart}...${truncatedEnd}`;
	}

	render() {
		const iconCopy: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M7 3.5C7 2.67157 7.67157 2 8.5 2H12.3787C12.7765 2 13.158 2.15804 13.4393 2.43934L16.5607 5.56066C16.842 5.84197 17 6.2235 17 6.62132V12.5C17 13.3284 16.3284 14 15.5 14H14.5V10.6213C14.5 9.82567 14.1839 9.06261 13.6213 8.5L10.5 5.37868C9.93739 4.81607 9.17433 4.5 8.37868 4.5H7V3.5Z"
					fill="#50565E"
				/>
				<path
					d="M4.5 6C3.67157 6 3 6.67157 3 7.5V16.5C3 17.3284 3.67157 18 4.5 18H11.5C12.3284 18 13 17.3284 13 16.5V10.6213C13 10.2235 12.842 9.84197 12.5607 9.56066L9.43934 6.43934C9.15804 6.15804 8.7765 6 8.37868 6H4.5Z"
					fill="#50565E"
				/>
			</svg>
		);
		const iconSettings: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M7.83922 1.80388C7.9327 1.33646 8.34312 1 8.8198 1H11.1802C11.6569 1 12.0673 1.33646 12.1608 1.80388L12.4913 3.45629C13.1956 3.72458 13.8454 4.10332 14.4196 4.57133L16.0179 4.03065C16.4694 3.8779 16.966 4.06509 17.2043 4.47791L18.3845 6.52207C18.6229 6.93489 18.5367 7.45855 18.1786 7.77322L16.9119 8.88645C16.9699 9.24909 17 9.62103 17 10C17 10.379 16.9699 10.7509 16.9119 11.1135L18.1786 12.2268C18.5367 12.5414 18.6229 13.0651 18.3845 13.4779L17.2043 15.5221C16.966 15.9349 16.4694 16.1221 16.0179 15.9693L14.4196 15.4287C13.8454 15.8967 13.1956 16.2754 12.4913 16.5437L12.1608 18.1961C12.0673 18.6635 11.6569 19 11.1802 19H8.8198C8.34312 19 7.9327 18.6635 7.83922 18.1961L7.50874 16.5437C6.80442 16.2754 6.1546 15.8967 5.58042 15.4287L3.98213 15.9694C3.53059 16.1221 3.034 15.9349 2.79566 15.5221L1.61546 13.4779C1.37712 13.0651 1.4633 12.5415 1.82136 12.2268L3.08808 11.1135C3.03011 10.7509 2.99999 10.379 2.99999 10C2.99999 9.62103 3.03011 9.2491 3.08808 8.88647L1.82136 7.77324C1.4633 7.45857 1.37712 6.93491 1.61546 6.52209L2.79566 4.47793C3.034 4.06511 3.53059 3.87791 3.98213 4.03066L5.58041 4.57134C6.15459 4.10332 6.80442 3.72459 7.50874 3.45629L7.83922 1.80388ZM9.99999 13C11.6568 13 13 11.6569 13 10C13 8.34315 11.6568 7 9.99999 7C8.34314 7 6.99999 8.34315 6.99999 10C6.99999 11.6569 8.34314 13 9.99999 13Z"
					fill="#50565E"
				/>
			</svg>
		);
		const iconArrowLeft: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M5 10C5 9.58579 5.33579 9.25 5.75 9.25H12.3879L10.2302 7.29063C9.93159 7.00353 9.92228 6.52875 10.2094 6.23017C10.4965 5.93159 10.9713 5.92228 11.2698 6.20938L14.7698 9.45938C14.9169 9.60078 15 9.79599 15 10C15 10.204 14.9169 10.3992 14.7698 10.5406L11.2698 13.7906C10.9713 14.0777 10.4965 14.0684 10.2094 13.7698C9.92228 13.4713 9.93159 12.9965 10.2302 12.7094L12.3879 10.75H5.75C5.33579 10.75 5 10.4142 5 10Z"
					fill="#0D0D0D"
				/>
			</svg>
		);
		const iconLogout: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M3 4.25C3 3.00736 4.00736 2 5.25 2H10.75C11.9926 2 13 3.00736 13 4.25V6.25C13 6.66421 12.6642 7 12.25 7C11.8358 7 11.5 6.66421 11.5 6.25V4.25C11.5 3.83579 11.1642 3.5 10.75 3.5H5.25C4.83579 3.5 4.5 3.83579 4.5 4.25V15.75C4.5 16.1642 4.83579 16.5 5.25 16.5H10.75C11.1642 16.5 11.5 16.1642 11.5 15.75V13.75C11.5 13.3358 11.8358 13 12.25 13C12.6642 13 13 13.3358 13 13.75V15.75C13 16.9926 11.9926 18 10.75 18H5.25C4.00736 18 3 16.9926 3 15.75V4.25Z"
					fill="#50565E"
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M6 10C6 9.58579 6.33579 9.25 6.75 9.25H16.2955L15.2483 8.30747C14.9404 8.03038 14.9154 7.55616 15.1925 7.24828C15.4696 6.94039 15.9438 6.91543 16.2517 7.19253L18.7517 9.44253C18.9098 9.58476 19 9.78738 19 10C19 10.2126 18.9098 10.4152 18.7517 10.5575L16.2517 12.8075C15.9438 13.0846 15.4696 13.0596 15.1925 12.7517C14.9154 12.4438 14.9404 11.9696 15.2483 11.6925L16.2955 10.75H6.75C6.33579 10.75 6 10.4142 6 10Z"
					fill="#50565E"
				/>
			</svg>
		);

		const formattedWalletAddress = this.formatWalletAddress(dfnsStore.state.wallet.address, 5, 4); // Adjust startChars and endChars as needed
		return (
			<dfns-layout closeBtn>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY}>
						{langState.values.header.my_wallet}
					</dfns-typography>
					

				</div>
				
				<div slot="contentSection">
					<div class="content-container">
						<div class="title">
							<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
								{langState.values.pages.wallet_overview.wallet_address}
							</dfns-typography>
							<CopyClipboard value={dfnsStore.state.wallet.address} openToaster={true}>
								<dfns-button
									content={formattedWalletAddress}
									variant={EButtonVariant.SECONDARY}
									sizing={EButtonSize.SMALL}
									fullwidth
									icon={iconCopy}
									iconposition="right"
								/>
							</CopyClipboard>
						</div>
						{dfnsStore.state.credentials.length < 2 && (
							<div class="content">
								<dfns-alert variant={EAlertVariant.INFO} hasTitle>
									<div slot="title">{langState.values.pages.wallet_overview.title_alert}</div>
									<div slot="content">
										<p> {langState.values.pages.wallet_overview.content_alert}</p>
										<div class="button_container">
											<dfns-button
												content={langState.values.pages.wallet_overview.button_create_passkey}
												variant={EButtonVariant.SECONDARY}
												sizing={EButtonSize.SMALL}
												icon={iconArrowLeft}
												iconposition="right"
												onClick={() => router.navigate(RouteType.CREATE_PASSKEY)}
											/>
										</div>
									</div>
								</dfns-alert>
							</div>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.pages.wallet_overview.button_settings}
						variant={EButtonVariant.SECONDARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						icon={iconSettings}
						iconposition="left"
						onClick={() => router.navigate(RouteType.SETTINGS)}
					/>
					<dfns-button
						content={langState.values.pages.wallet_overview.button_logout}
						variant={EButtonVariant.SECONDARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						icon={iconLogout}
						iconposition="left"
						onClick={() => {
							dfnsStore.disconnect();
							router.close();
						}}
					/>
				</div>
			</dfns-layout>
		);
	}
}
