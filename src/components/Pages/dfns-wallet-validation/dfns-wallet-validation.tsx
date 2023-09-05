import { Wallet, WalletStatus } from "@dfns/sdk/codegen/datamodel/Wallets";
import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";
import dfnsState from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { waitForWalletActive } from "../../../utils/dfns";
import { EButtonSize, EButtonVariant } from "../../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { ThemeMode } from "../../../utils/theme-modes";

@Component({
	tag: "dfns-wallet-validation",
	styleUrl: "dfns-wallet-validation.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsWalletValidation {
	private themeMode = ThemeMode.getInstance();

	@Event() walletValidated: EventEmitter<Wallet>;
	@Prop() confirmationImgSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg";
	@State() isLoading = true;

	async componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
		dfnsState.wallet = await waitForWalletActive(dfnsState.dfnsHost, dfnsState.appId, dfnsState.dfnsUserToken, dfnsState.wallet.id);
		this.isLoading = false;
	}

	async validateWallet() {
		this.walletValidated.emit(dfnsState.wallet);
	}

	async closeBtn() {
		this.walletValidated.emit(null);
	}

	render() {
		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.create_wallet}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="contentContainer">
						<img alt="Confirmation" src={this.confirmationImgSrc} width={48} height={48} />
						<div class="title">
							<dfns-typography typo={ITypo.H6_TITLE}>{langState.values.pages.validation_success.title}</dfns-typography>
						</div>
						<div class="content">
							<dfns-typography typo={ITypo.TEXTE_MD_REGULAR}>
								{langState.values.pages.validation_success.description}
							</dfns-typography>
						</div>
						{this.isLoading ? (
							<div class="loading-wallet">
								<dfns-loader />
								<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.SECONDARY}>
									{langState.values.pages.validation_success.loading_message}
								</dfns-typography>
							</div>
						) : (
							<div class="wallet">
								<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
									{langState.values.pages.validation_success.wallet_address}
								</dfns-typography>
								<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}>
									{dfnsState.wallet && dfnsState.wallet.address}
								</dfns-typography>
							</div>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.buttons.done}
						variant={EButtonVariant.PRIMARY}
						sizing={EButtonSize.MEDIUM}
						disabled={dfnsState.wallet?.status !== WalletStatus.Active}
						fullwidth
						iconposition="left"
						onClick={this.validateWallet.bind(this)}
					/>
				</div>
			</dfns-layout>
		);
	}
}
