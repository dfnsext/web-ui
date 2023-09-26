import { Component, Event, EventEmitter, Fragment, JSX, Prop, State, h } from "@stencil/core";

import DfnsWallet from "../../../services/wallet/DfnsWallet";
import WalletConnectWallet from "../../../services/wallet/WalletConnectWallet";
import dfnsStore from "../../../stores/DfnsStore";
import GoogleStore from "../../../stores/GoogleStore";
import langState from "../../../stores/LanguageStore";
import router from "../../../stores/RouterStore";
import LocalStorageService, { CACHED_WALLET_PROVIDER, WalletProvider } from "../../../services/LocalStorageService";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
@Component({
	tag: "dfns-login",
	styleUrl: "dfns-login.scss",
	shadow: true,
})
export class DfnsLogin {
	private googleButton: HTMLDivElement;
	@Event() walletConnected: EventEmitter<string>;
	@State() isLoading: boolean = false;

	async componentDidRender() {
		dfnsStore.state.googleEnabled &&
			GoogleStore.deferred.promise.then((google) => {
				google.accounts.id.initialize({
					client_id: dfnsStore.state.googleClientId,
					callback: this.handleCredentialResponse.bind(this),
				});
				google.accounts.id.renderButton(this.googleButton, {
					locale: dfnsStore.state.lang,
					size: "large",
					theme: "outline",
					text: "signin_with",
				});
			});
	}

	async handleCredentialResponse(response) {
		const walletInstance = DfnsWallet.getInstance();
		await walletInstance.connectWithOAuthToken(response.credential);
		router.close();
	}

	async closeBtn() {
		this.walletConnected.emit(null);
	}

	render() {
		const iconWallet: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M1 4.24973C1.62675 3.77896 2.4058 3.5 3.25 3.5H16.75C17.5942 3.5 18.3733 3.77896 19 4.24973C18.9999 3.00721 17.9926 2 16.75 2H3.25C2.00745 2 1.00015 3.00721 1 4.24973Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M1 7.24973C1.62675 6.77896 2.4058 6.5 3.25 6.5H16.75C17.5942 6.5 18.3733 6.77896 19 7.24973C18.9999 6.00721 17.9926 5 16.75 5H3.25C2.00745 5 1.00015 6.00721 1 7.24973Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M7 8C7.55228 8 8 8.44772 8 9C8 10.1046 8.89543 11 10 11C11.1046 11 12 10.1046 12 9C12 8.44772 12.4477 8 13 8H16.75C17.9926 8 19 9.00736 19 10.25V15.75C19 16.9926 17.9926 18 16.75 18H3.25C2.00736 18 1 16.9926 1 15.75V10.25C1 9.00736 2.00736 8 3.25 8H7Z"
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
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);

		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.login}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="content-container">
						{dfnsStore.state.googleEnabled && <div ref={(el) => (this.googleButton = el)}></div>}
						{dfnsStore.state.customButtonEnabled && (
							<dfns-button
								content={dfnsStore.state.customButtonText}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.SMALL}
								fullwidth
								icon={dfnsStore.state.customButtonIcon}
								iconposition="left"
								onClick={async () => {
									router.close();
									dfnsStore.state.customButtonCallback();
								}}
							/>
						)}
						{/* <div class="recover-account">
							<dfns-button
								content={langState.values.pages.login.recover_account}
								variant={EButtonVariant.TEXT}
								sizing={EButtonSize.SMALL}
								onClick={async () => {}}
								iconposition="right"
								icon={iconArrowLeft}
							/>
						</div> */}
						{dfnsStore.state.walletConnectEnabled && (
							<Fragment>
								<div class="separator">
									<span>
										<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
											{langState.values.pages.login.or}
										</dfns-typography>
									</span>
								</div>

								<dfns-button
									content={langState.values.pages.login.wallet}
									variant={EButtonVariant.NEUTRAL}
									sizing={EButtonSize.MEDIUM}
									fullwidth
									// icon={dfnsStore.state.customButtonIcon}
									iconposition="left"
									icon={iconWallet}
									onClick={async () => {
										const web3modalInstance = WalletConnectWallet.getInstance(
											dfnsStore.state.walletConnectProjectId,
											dfnsStore.state.network,
										);
										await web3modalInstance.disconnect();
										const walletAddress = await web3modalInstance.connect();
										dfnsStore.setValue("walletService", web3modalInstance);
										LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].set(WalletProvider.WALLET_CONNECT);
										this.walletConnected.emit(walletAddress);
										router.close();
									}}
								/>
							</Fragment>
						)}
					</div>
				</div>
				<div slot="bottomSection"></div>
			</dfns-layout>
		);
	}
}
