import { TransferAssetRequest } from "@dfns/sdk/codegen/Wallets";
import { Component, Event, EventEmitter, Fragment, State, h } from "@stencil/core";

import { Amount, BlockchainAddress } from "@dfns/sdk/codegen/datamodel/Foundations";
import { TransferKind, TransferRequest, TransferStatus } from "@dfns/sdk/codegen/datamodel/Wallets";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { getDfnsDelegatedClient, timeout } from "../../../utils/dfns";

import { sign } from "../../../utils/webauthn";
import { fetchAssets, waitForEvent } from "../../../utils/helper";
import { ITokenInfo } from "../../../common/interfaces/ITokenInfo";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import router, { RouteType } from "../../../stores/RouterStore";

@Component({
	tag: "dfns-transfer-tokens",
	styleUrl: "dfns-transfer-tokens.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsTransferTokens {
	@State() kind: TransferKind;
	@State() to: BlockchainAddress;
	@State() value: Amount;
	@State() contract?: BlockchainAddress;
	@Event() transferRequest: EventEmitter<string>;
	@State() hasErrors: boolean = false;
	@State() errorMessage: string = "";
	@State() inputErrors: boolean = false;
	@State() inputErrorMessage: string = "";
	@State() isLoading: boolean = false;
	@State() isLoadingAssets: boolean = false;
	@State() tokenList: ITokenInfo[] = [];
	@State() selectedToken: ITokenInfo;
	@State() step: number = 1;

	async componentWillLoad() {
		this.tokenList = [];
		this.isLoadingAssets = true;
	}

	async componentDidLoad() {
		await this.getAssets();
		this.isLoadingAssets = false;
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

	async selectTokenForTransfert(asset: ITokenInfo) {
		this.isLoadingAssets = true;
		this.selectedToken = asset;
		this.step = 2;
		this.isLoadingAssets = false;
	}

	async sendTokens() {
		try {
			if (!ethers.utils.isAddress(this.to)) {
				throw new Error("Invalid address format");
			}

			if (!this.value || isNaN(parseFloat(this.value))) {
				this.inputErrors = true;
				this.inputErrorMessage = "Invalid number format";
				throw new Error(this.inputErrorMessage);
			}

			this.step = 3;
			const txHash = await waitForEvent<string>(document.getElementsByTagName("dfns-main")[0], "transactionSent");
			if (!txHash) {
				this.step = 2;
				return;
			}
			this.transferRequest.emit(txHash);
		} catch (error) {
			this.handleError(error);
		}
	}

	private handleError(error: any) {
		this.isLoading = false;
		this.hasErrors = true;

		if (typeof error === "string") {
			this.errorMessage = error;
		} else if (error instanceof Error) {
			this.errorMessage = error.message;
		} else {
			this.errorMessage = "An unknown error occurred.";
		}
	}

	private handleInputErrors(value: string) {
		this.inputErrors = false;
		this.inputErrorMessage = "";
	}

	async closeBtn() {
		this.transferRequest.emit(null);
	}

	render() {
		if (this.step === 3) {
			return (
				<dfns-confirm-transaction
					to={this.to}
					tokenSymbol={this.selectedToken.symbol}
					dfnsTransfer={true}
					value={parseUnits(this.value, this.selectedToken.decimals).toString()}
					backButtonCallback={() => {
						this.step = 2;
					}}
					decimals={this.selectedToken.decimals}
					dfnsTransferSelectedToken={this.selectedToken}></dfns-confirm-transaction>
			);
		}
		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{this.step === 1 ? langState.values.header.transfert_token : langState.values.header.send_token}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="content-container">
						<div class="content">
							{this.isLoadingAssets && <dfns-loader size="large" />}
							<div class="tab-container">
								{!this.isLoadingAssets &&
									this.step === 1 &&
									this.tokenList.length !== 0 &&
									this.tokenList.map((asset) => {
										return (
											<div
												class="row"
												onClick={() => {
													this.selectTokenForTransfert(asset);
												}}>
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
								{!this.isLoadingAssets && this.step === 2 && (
									<Fragment>
										<div class="row selected">
											<div class="key">
												<div class="token-logo">
													<img
														src={this.selectedToken.icon}
														alt={this.selectedToken.symbol}
														width={20}
														height={20}
													/>
												</div>
												<div class="symbol">
													<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
														{this.selectedToken.symbol}
													</dfns-typography>
													<div class="sub-value">
														<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.NEUTRAL}>
															{this.selectedToken.balance.slice(0, 5)} {this.selectedToken.symbol}
														</dfns-typography>
													</div>
												</div>
											</div>
											<div class="value">
												<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
													{this.selectedToken.fiatValue}
												</dfns-typography>
											</div>
										</div>
									</Fragment>
								)}
							</div>
							{!this.isLoadingAssets && this.step === 2 && (
								<Fragment>
									<div class="container-textfields">
										<div class="input-field">
											<dfns-input-field
												placeholder={langState.values.pages.transfert_tokens.placeholder_wallet}
												onChange={(value) => {
													this.to = value;
												}}>
												<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
													{langState.values.pages.transfert_tokens.send_to}
												</dfns-typography>
											</dfns-input-field>
										</div>
										<div class="input-field">
											<dfns-input-field
												placeholder={"0.00" + " " + this.selectedToken.symbol}
												onChange={(value) => {
													this.value = value;
													this.handleInputErrors(value);
												}}
												errors={this.inputErrors ? [this.inputErrorMessage] : []}>
												<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
													{langState.values.pages.transfert_tokens.amount}
												</dfns-typography>
											</dfns-input-field>
										</div>
									</div>
								</Fragment>
							)}
							{this.hasErrors && this.step === 2 && (
								<dfns-alert variant={EAlertVariant.ERROR} hasTitle={true}>
									<div slot="title">{langState.values.pages.transfert_tokens.error_title}</div>
									<div slot="content">{this.errorMessage}</div>
								</dfns-alert>
							)}
						</div>
					</div>
				</div>
				<div slot="bottomSection">
					{this.step === 2 && (
						<dfns-button
							content={langState.values.buttons.next}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							isloading={this.isLoading}
							onClick={this.sendTokens.bind(this)}
						/>
					)}
					<dfns-button
						content={langState.values.buttons.back}
						variant={EButtonVariant.NEUTRAL}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						onClick={() => {
							if (this.step == 2) {
								this.step = 1;
								return;
							}
							this.transferRequest.emit(null);
							router.goBack();
						}}
					/>
				</div>
			</dfns-layout>
		);
	}
}
