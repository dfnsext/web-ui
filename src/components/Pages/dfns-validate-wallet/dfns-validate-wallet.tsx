import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { Component, Event, EventEmitter, State, h } from "@stencil/core";
import dfnsState from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { waitForWalletActive } from "../../../utils/dfns";
import { EButtonSize, EButtonVariant } from "../../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { createWallet } from "../../../utils/helper";
import { ThemeMode } from "../../../utils/theme-modes";

@Component({
	tag: "dfns-validate-wallet",
	styleUrl: "dfns-validate-wallet.scss",
	shadow: true,
})
export class DfnsValidateWallet {
	private themeMode = ThemeMode.getInstance();

	@Event() walletValidated: EventEmitter<Wallet>;
	@State() isLoading: boolean = false;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	async validateWallet() {
		try {
			this.isLoading = true;
			const response = await createWallet(dfnsState.dfnsHost, dfnsState.appId, dfnsState.rpId, dfnsState.dfnsUserToken);
			const wallet = await waitForWalletActive(dfnsState.dfnsHost, dfnsState.appId, dfnsState.dfnsUserToken, response.id);
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
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.create_wallet}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<dfns-stepper
						steps={[
							langState.values.pages.identification.title,
							langState.values.pages.create_account.title,
							langState.values.pages.validate_wallet.title,
						]}
						activeIndices={[0, 1]}
					/>
					<div class="contentContainer">
						<div class="title">
							<dfns-typography typo={ITypo.TEXTE_LG_SEMIBOLD}>
								{langState.values.pages.validate_wallet.description}
							</dfns-typography>
						</div>
						{/* <div class="content">
								<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
								{langState.values.pages.validate_wallet.description}
								</dfns-typography>
							</div> */}
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.pages.validate_wallet.button_validate}
						variant={EButtonVariant.PRIMARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						iconposition="left"
						onClick={this.validateWallet.bind(this)}
						isloading={this.isLoading}
					/>
				</div>
			</dfns-layout>
		);
	}
}
