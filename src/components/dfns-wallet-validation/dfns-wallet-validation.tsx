import { Wallet, WalletStatus } from "@dfns/sdk/codegen/datamodel/Wallets";
import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";
import { LanguageService } from "../../services/language-services";
import { waitForWalletActive } from "../../utils/dfns";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { ThemeMode } from "../../utils/theme-modes";

// ** Signup or sign in popup*/
@Component({
	tag: "dfns-wallet-validation",
	styleUrl: "dfns-wallet-validation.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsWalletValidation {
	private themeMode = ThemeMode.getInstance();

	@Prop({ mutable: true }) walletId: string;
	@Prop({ mutable: true }) appId: string;
	@Prop({ mutable: true }) rpId: string;
	@Prop({ mutable: true }) dfnsUserToken: string;
	@Prop({ mutable: true }) visible: string;
	@Event() walletValidated: EventEmitter<Wallet>;
	@State() wallet: Wallet;
	@Prop() confirmationImgSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg";
	@State() isLoading = true;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	async componentDidUpdate() {
		if (this.visible) {
			const wallet = await waitForWalletActive(this.appId, this.dfnsUserToken, this.walletId);
			this.isLoading = false;
			if (this.wallet !== wallet) {
				this.wallet = wallet;
			}
		}
	}

	async validateWallet() {
		this.walletValidated.emit(this.wallet);
	}

	async closeBtn() {
		this.walletValidated.emit(null);
	}

	render() {
		return (
			<div class={this.visible ? "container visible" : "container"}>
				<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							Create account
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<div class="contentContainer">
							<img alt="Confirmation" src={this.confirmationImgSrc} width={48} height={48} />
							<div class="title">
								<dfns-typography typo={ITypo.H6_TITLE}>
									{LanguageService.getContent("pages.validation_success.title")}
								</dfns-typography>
							</div>
							<div class="content">
								<dfns-typography typo={ITypo.TEXTE_MD_REGULAR}>
									{LanguageService.getContent("pages.validation_success.description")}
								</dfns-typography>
							</div>
							{this.isLoading ? (
								<div class="loading-wallet">
									<dfns-loader />
									<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.SECONDARY}>
										{LanguageService.getContent("pages.validation_success.loading_message")}
									</dfns-typography>
								</div>
							) : (
								<div class="wallet">
									<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
										{LanguageService.getContent("pages.validation_success.wallet_address")}
									</dfns-typography>
									<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}>{this.wallet && this.wallet.address}</dfns-typography>
								</div>
							)}
						</div>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={LanguageService.getContent("buttons.done")}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							disabled={this.wallet?.status !== WalletStatus.Active}
							fullwidth
							iconposition="left"
							onClick={this.validateWallet.bind(this)}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
