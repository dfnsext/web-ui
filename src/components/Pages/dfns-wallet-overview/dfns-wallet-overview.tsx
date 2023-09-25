import { Component, Event, EventEmitter, JSX, State, h } from "@stencil/core";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import router, { RouteType } from "../../../stores/RouterStore";
import { getDfnsDelegatedClient } from "../../../utils/dfns";

import { CopyClipboard } from "../../Elements/CopyClipboard";
import LocalStorageService, { CACHED_WALLET_PROVIDER } from "../../../services/LocalStorageService";
import { fetchAssets } from "../../../utils/helper";
import { ITokenInfo } from "../../../common/interfaces/ITokenInfo";
import { WalletOverviewAction } from "../../../common/enums/actions-enum";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { formatWalletAddress } from "../../../common/helpers/formatWalletAddress";

@Component({
	tag: "dfns-wallet-overview",
	styleUrl: "dfns-wallet-overview.scss",
	shadow: true,
})
export class DfnsWalletOverview {
	@State() isLoading: boolean = false;
	@State() tokenList: ITokenInfo[] = [];

	@Event() action: EventEmitter<WalletOverviewAction>;

	async componentWillLoad() {
		this.tokenList = [];
		this.isLoading = true;
		this.fetchPasskeys();
	}

	async componentDidLoad() {
		await this.getAssets();
		this.isLoading = false;
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

	async getAssets() {
		this.tokenList = (await fetchAssets(
			dfnsStore.state.dfnsHost,
			dfnsStore.state.appId,
			dfnsStore.state.dfnsUserToken,
			dfnsStore.state.wallet.id,
			dfnsStore.state.lang,
			dfnsStore.state.network,
		)) as ITokenInfo[];
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
		const iconSettings: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M7.83922 1.80388C7.9327 1.33646 8.34312 1 8.8198 1H11.1802C11.6569 1 12.0673 1.33646 12.1608 1.80388L12.4913 3.45629C13.1956 3.72458 13.8454 4.10332 14.4196 4.57133L16.0179 4.03065C16.4694 3.8779 16.966 4.06509 17.2043 4.47791L18.3845 6.52207C18.6229 6.93489 18.5367 7.45855 18.1786 7.77322L16.9119 8.88645C16.9699 9.24909 17 9.62103 17 10C17 10.379 16.9699 10.7509 16.9119 11.1135L18.1786 12.2268C18.5367 12.5414 18.6229 13.0651 18.3845 13.4779L17.2043 15.5221C16.966 15.9349 16.4694 16.1221 16.0179 15.9693L14.4196 15.4287C13.8454 15.8967 13.1956 16.2754 12.4913 16.5437L12.1608 18.1961C12.0673 18.6635 11.6569 19 11.1802 19H8.8198C8.34312 19 7.9327 18.6635 7.83922 18.1961L7.50874 16.5437C6.80442 16.2754 6.1546 15.8967 5.58042 15.4287L3.98213 15.9694C3.53059 16.1221 3.034 15.9349 2.79566 15.5221L1.61546 13.4779C1.37712 13.0651 1.4633 12.5415 1.82136 12.2268L3.08808 11.1135C3.03011 10.7509 2.99999 10.379 2.99999 10C2.99999 9.62103 3.03011 9.2491 3.08808 8.88647L1.82136 7.77324C1.4633 7.45857 1.37712 6.93491 1.61546 6.52209L2.79566 4.47793C3.034 4.06511 3.53059 3.87791 3.98213 4.03066L5.58041 4.57134C6.15459 4.10332 6.80442 3.72459 7.50874 3.45629L7.83922 1.80388ZM9.99999 13C11.6568 13 13 11.6569 13 10C13 8.34315 11.6568 7 9.99999 7C8.34314 7 6.99999 8.34315 6.99999 10C6.99999 11.6569 8.34314 13 9.99999 13Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		const iconSend: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M3.10525 2.28844C2.85361 2.25277 2.60103 2.34697 2.4342 2.5387C2.26737 2.73044 2.20899 2.99361 2.2791 3.2379L3.69275 8.16378C3.87731 8.80688 4.46548 9.25 5.13455 9.25H11.25C11.6642 9.25 12 9.58579 12 10C12 10.4142 11.6642 10.75 11.25 10.75H5.13456C4.46549 10.75 3.87732 11.1931 3.69276 11.8362L2.2791 16.7621C2.20899 17.0064 2.26737 17.2696 2.4342 17.4613C2.60103 17.6531 2.85361 17.7473 3.10525 17.7116C8.94302 16.8842 14.2209 14.3187 18.3983 10.5574C18.5563 10.4151 18.6465 10.2126 18.6465 10C18.6465 9.78746 18.5563 9.58489 18.3983 9.44266C14.2209 5.68129 8.94302 3.11585 3.10525 2.28844Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		const iconReceive: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
				<path
					d="M5.99023 4.5C5.43795 4.5 4.99023 4.94772 4.99023 5.5V5.51C4.99023 6.06228 5.43795 6.51 5.99023 6.51H6.00023C6.55252 6.51 7.00023 6.06228 7.00023 5.51V5.5C7.00023 4.94772 6.55252 4.5 6.00023 4.5H5.99023Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4.25 2C3.2835 2 2.5 2.7835 2.5 3.75V7.25C2.5 8.2165 3.2835 9 4.25 9H7.75C8.7165 9 9.5 8.2165 9.5 7.25V3.75C9.5 2.7835 8.7165 2 7.75 2H4.25ZM4 3.75C4 3.61193 4.11193 3.5 4.25 3.5H7.75C7.88807 3.5 8 3.61193 8 3.75V7.25C8 7.38807 7.88807 7.5 7.75 7.5H4.25C4.11193 7.5 4 7.38807 4 7.25V3.75Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M5.99023 13.5C5.43795 13.5 4.99023 13.9477 4.99023 14.5V14.51C4.99023 15.0623 5.43795 15.51 5.99023 15.51H6.00023C6.55252 15.51 7.00023 15.0623 7.00023 14.51V14.5C7.00023 13.9477 6.55252 13.5 6.00023 13.5H5.99023Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4.25 11C3.2835 11 2.5 11.7835 2.5 12.75V16.25C2.5 17.2165 3.2835 18 4.25 18H7.75C8.7165 18 9.5 17.2165 9.5 16.25V12.75C9.5 11.7835 8.7165 11 7.75 11H4.25ZM4 12.75C4 12.6119 4.11193 12.5 4.25 12.5H7.75C7.88807 12.5 8 12.6119 8 12.75V16.25C8 16.3881 7.88807 16.5 7.75 16.5H4.25C4.11193 16.5 4 16.3881 4 16.25V12.75Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M14.9902 4.5C14.4379 4.5 13.9902 4.94772 13.9902 5.5V5.51C13.9902 6.06228 14.4379 6.51 14.9902 6.51H15.0002C15.5525 6.51 16.0002 6.06228 16.0002 5.51V5.5C16.0002 4.94772 15.5525 4.5 15.0002 4.5H14.9902Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M11.5 3.75C11.5 2.7835 12.2835 2 13.25 2H16.75C17.7165 2 18.5 2.7835 18.5 3.75V7.25C18.5 8.2165 17.7165 9 16.75 9H13.25C12.2835 9 11.5 8.2165 11.5 7.25V3.75ZM13.25 3.5C13.1119 3.5 13 3.61193 13 3.75V7.25C13 7.38807 13.1119 7.5 13.25 7.5H16.75C16.8881 7.5 17 7.38807 17 7.25V3.75C17 3.61193 16.8881 3.5 16.75 3.5H13.25Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M14.9902 13.5C14.4379 13.5 13.9902 13.9477 13.9902 14.5V14.51C13.9902 15.0623 14.4379 15.51 14.9902 15.51H15.0002C15.5525 15.51 16.0002 15.0623 16.0002 14.51V14.5C16.0002 13.9477 15.5525 13.5 15.0002 13.5H14.9902Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M11.4902 12C11.4902 11.4477 11.9379 11 12.4902 11H12.5002C13.0525 11 13.5002 11.4477 13.5002 12V12.01C13.5002 12.5623 13.0525 13.01 12.5002 13.01H12.4902C11.9379 13.01 11.4902 12.5623 11.4902 12.01V12Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M17.4902 11C16.9379 11 16.4902 11.4477 16.4902 12V12.01C16.4902 12.5623 16.9379 13.01 17.4902 13.01H17.5002C18.0525 13.01 18.5002 12.5623 18.5002 12.01V12C18.5002 11.4477 18.0525 11 17.5002 11H17.4902Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M16.4902 17C16.4902 16.4477 16.9379 16 17.4902 16H17.5002C18.0525 16 18.5002 16.4477 18.5002 17V17.01C18.5002 17.5623 18.0525 18.01 17.5002 18.01H17.4902C16.9379 18.01 16.4902 17.5623 16.4902 17.01V17Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M12.4902 16C11.9379 16 11.4902 16.4477 11.4902 17V17.01C11.4902 17.5623 11.9379 18.01 12.4902 18.01H12.5002C13.0525 18.01 13.5002 17.5623 13.5002 17.01V17C13.5002 16.4477 13.0525 16 12.5002 16H12.4902Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		const iconArrowLeft: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M5 10C5 9.58579 5.33579 9.25 5.75 9.25H12.3879L10.2302 7.29063C9.93159 7.00353 9.92228 6.52875 10.2094 6.23017C10.4965 5.93159 10.9713 5.92228 11.2698 6.20938L14.7698 9.45938C14.9169 9.60078 15 9.79599 15 10C15 10.204 14.9169 10.3992 14.7698 10.5406L11.2698 13.7906C10.9713 14.0777 10.4965 14.0684 10.2094 13.7698C9.92228 13.4713 9.93159 12.9965 10.2302 12.7094L12.3879 10.75H5.75C5.33579 10.75 5 10.4142 5 10Z"
					fill={dfnsStore.state.colors.primary_400}
				/>
			</svg>
		);
		const iconLogout: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M3 4.25C3 3.00736 4.00736 2 5.25 2H10.75C11.9926 2 13 3.00736 13 4.25V6.25C13 6.66421 12.6642 7 12.25 7C11.8358 7 11.5 6.66421 11.5 6.25V4.25C11.5 3.83579 11.1642 3.5 10.75 3.5H5.25C4.83579 3.5 4.5 3.83579 4.5 4.25V15.75C4.5 16.1642 4.83579 16.5 5.25 16.5H10.75C11.1642 16.5 11.5 16.1642 11.5 15.75V13.75C11.5 13.3358 11.8358 13 12.25 13C12.6642 13 13 13.3358 13 13.75V15.75C13 16.9926 11.9926 18 10.75 18H5.25C4.00736 18 3 16.9926 3 15.75V4.25Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M6 10C6 9.58579 6.33579 9.25 6.75 9.25H16.2955L15.2483 8.30747C14.9404 8.03038 14.9154 7.55616 15.1925 7.24828C15.4696 6.94039 15.9438 6.91543 16.2517 7.19253L18.7517 9.44253C18.9098 9.58476 19 9.78738 19 10C19 10.2126 18.9098 10.4152 18.7517 10.5575L16.2517 12.8075C15.9438 13.0846 15.4696 13.0596 15.1925 12.7517C14.9154 12.4438 14.9404 11.9696 15.2483 11.6925L16.2955 10.75H6.75C6.33579 10.75 6 10.4142 6 10Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);

		const formattedWalletAddress = dfnsStore.state.wallet?.address ? formatWalletAddress(dfnsStore.state.wallet.address, 5, 4) : "...";
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
							<CopyClipboard value={dfnsStore.state.wallet?.address} openToaster={true}>
								<dfns-button
									content={formattedWalletAddress}
									variant={EButtonVariant.NEUTRAL}
									sizing={EButtonSize.SMALL}
									fullwidth
									icon={iconCopy}
									iconposition="right"
								/>
							</CopyClipboard>
						</div>
						{dfnsStore.state.credentials.length < 2 && (
							<div class="content">
								<div class="transfert-buttons">
									<div>
										<dfns-button
											content={langState.values.pages.wallet_overview.button_send}
											variant={EButtonVariant.NEUTRAL}
											sizing={EButtonSize.MEDIUM}
											fullwidth
											icon={iconSend}
											iconposition="left"
											onClick={() => {
												router.navigate(RouteType.TRANSFER_TOKENS);
											}}
										/>
									</div>
									<div>
										<dfns-button
											content={langState.values.pages.wallet_overview.button_receive}
											variant={EButtonVariant.NEUTRAL}
											sizing={EButtonSize.MEDIUM}
											fullwidth
											icon={iconReceive}
											iconposition="left"
											onClick={() => {
												router.navigate(RouteType.RECEIVE_TOKENS);
											}}
										/>
									</div>
								</div>
								{this.isLoading && <dfns-loader size="large" />}
								<div class="tab-container">
									{!this.isLoading &&
										this.tokenList.length !== 0 &&
										this.tokenList.map((asset) => {
											return (
												<div class="row">
													<div class="key">
														<div class="token-logo">
															<img src={asset.icon} alt={asset.symbol} width={20} height={20} />
														</div>
														<div class="symbol">
															<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
																{asset.symbol}
															</dfns-typography>
															<div class="sub-value">
																<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.NEUTRAL}>
																	{asset.balance.slice(0, 5)} {asset.symbol}
																</dfns-typography>
															</div>
														</div>
													</div>
													<div class="value">
														<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
															{asset.fiatValue}
														</dfns-typography>
													</div>
												</div>
											);
										})}
								</div>

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
						variant={EButtonVariant.NEUTRAL}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						icon={iconSettings}
						iconposition="left"
						onClick={() => router.navigate(RouteType.SETTINGS)}
					/>
					<dfns-button
						content={langState.values.pages.wallet_overview.button_logout}
						variant={EButtonVariant.NEUTRAL}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						icon={iconLogout}
						iconposition="left"
						onClick={() => {
							router.close();
							dfnsStore.state.walletService.disconnect();
							LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].delete();
						}}
					/>
				</div>
			</dfns-layout>
		);
	}
}
