import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";

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
	@Prop() shouldShowWalletValidation: boolean;
	@Event() walletConnected: EventEmitter<string>;
	@State() isLoading: boolean = false;

	async componentDidRender() {
		dfnsStore.state.googleEnabled &&
			GoogleStore.deferred.promise.then((google) => {
				google.accounts.id.initialize({
					client_id: dfnsStore.state.googleClientId,
					callback: this.handleCredentialResponse.bind(this),
				});
				google.accounts.id.renderButton(this.googleButton, { theme: "filled_blue" });
			});
	}

	async handleCredentialResponse(response) {
		const walletInstance = DfnsWallet.getInstance(this.shouldShowWalletValidation);
		const wallet = await walletInstance.connectWithOAuthToken(response.credential);
		LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].set(WalletProvider.DFNS);
		dfnsStore.setValue("walletService", walletInstance);
		this.walletConnected.emit(wallet.address);
		router.close();
	}

	async closeBtn() {
		this.walletConnected.emit(null);
	}

	render() {
		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						Login
					</dfns-typography>
				</div>
				<div slot="contentSection">
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
					{dfnsStore.state.walletConnectEnabled && (
						<dfns-button
							content={langState.values.pages.login.wallet}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.SMALL}
							fullwidth
							// icon={dfnsStore.state.customButtonIcon}
							iconposition="left"
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
					)}
				</div>
				<div slot="bottomSection"></div>
			</dfns-layout>
		);
	}
}
