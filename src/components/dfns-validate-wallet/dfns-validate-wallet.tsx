import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";
import { LanguageService } from "../../services/language-services";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { createWallet } from "../../utils/helper";
import { ThemeMode } from "../../utils/theme-modes";
import { waitForWalletActive } from "../../utils/dfns";

// ** Signup or sign in popup*/
@Component({
	tag: "dfns-validate-wallet",
	styleUrl: "dfns-validate-wallet.scss",
	shadow: true,
})
export class DfnsValidateWallet {
	private themeMode = ThemeMode.getInstance();

	@Prop({ mutable: true }) appId: string;
	@Prop({ mutable: true }) rpId: string;
	@Prop({ mutable: true }) dfnsUserToken: string;
	@Prop({ mutable: true }) visible: string;
	@Event() walletValidated: EventEmitter<Wallet>;
	@State() isLoading: boolean = false;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	async validateWallet() {
		try {
			this.isLoading = true;
			const response = await createWallet(this.appId, this.rpId, this.dfnsUserToken);
			const wallet = await waitForWalletActive(this.appId, this.dfnsUserToken, response.id);
			this.isLoading = false;
			this.walletValidated.emit(wallet);
			return response;
		} catch (err) {
			this.isLoading = false;
		}
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
							{LanguageService.getContent("header.create_wallet")}
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<dfns-stepper
							steps={[
								LanguageService.getContent("pages.identification.title"),
								LanguageService.getContent("pages.create_account.title"),
								LanguageService.getContent("pages.validate_wallet.title"),
							]}
							activeIndices={[0, 1]}
						/>
						<div class="contentContainer">
							<div class="title">
								<dfns-typography typo={ITypo.TEXTE_LG_SEMIBOLD}>
									{LanguageService.getContent("pages.validate_wallet.description")}
								</dfns-typography>
							</div>
							{/* <div class="content">
								<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
								{LanguageService.getContent("pages.validate_wallet.description")}
								</dfns-typography>
							</div> */}
						</div>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={LanguageService.getContent("pages.validate_wallet.button_validate")}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							iconposition="left"
							onClick={this.validateWallet.bind(this)}
							isloading={this.isLoading}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
