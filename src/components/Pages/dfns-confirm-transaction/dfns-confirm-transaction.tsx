import { Component, Event, EventEmitter, Fragment, JSX, Prop, State, h } from "@stencil/core";
import { Amount, BlockchainAddress } from "@dfns/sdk/codegen/datamodel/Foundations";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { sign } from "../../../utils/webauthn";
import { convertCryptoToFiat } from "../../../utils/binance";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { getDfnsDelegatedClient, timeout } from "../../../utils/dfns";
import { BroadcastTransactionRequest, TransferAssetRequest } from "@dfns/sdk/codegen/Wallets";
import { TransactionKind, TransactionStatus, TransferKind, TransferStatus } from "@dfns/sdk/codegen/datamodel/Wallets";
import router from "../../../stores/RouterStore";
import { networkMapping } from "../../../utils/helper";
import { formatUnits } from "ethers/lib/utils";
import { ITokenInfo } from "../../../common/interfaces/ITokenInfo";

@Component({
	tag: "dfns-confirm-transaction",
	styleUrl: "dfns-confirm-transaction.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsConfirmTransaction {
	@Prop() backButtonCallback: () => void;
	@Prop() dfnsTransfer: boolean = false;
	@Prop() dfnsTransferSelectedToken: ITokenInfo;
	@Prop() to: BlockchainAddress;
	@Prop() value: Amount;
	@Prop() decimals: number;
	@Prop() tokenSymbol: string = networkMapping[dfnsStore.state.network].nativeCurrency.symbol;
	@Prop() data?: string;
	@Prop() txNonce?: number;
	@Prop() confirmationImgSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg";
	@Event() transactionSent: EventEmitter<string>;
	@State() hasErrors: boolean = false;
	@State() errorMessage: string = "";
	@State() isLoading: boolean = false;
	@State() step: number = 1;
	@State() priceValue: string = "";
	@State() txHash: string | null = null;

	async sendTransaction() {
		try {
			this.isLoading = true;

			this.step = 2;

			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
			const request: BroadcastTransactionRequest = {
				walletId: dfnsStore.state.wallet.id,
				body: {
					kind: TransactionKind.Evm,
					to: this.to,
					value: this.value,
					data: this.data,
				},
			};

			if (this.txNonce) {
				request.body.nonce = this.txNonce;
			}
			const challenge = await dfnsDelegated.wallets.broadcastTransactionInit(request);

			const assertion = await sign(dfnsStore.state.rpId, challenge.challenge, challenge.allowCredentials);

			let transaction = await dfnsDelegated.wallets.broadcastTransactionComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: assertion,
			});

			do {
				await timeout(1000);
				transaction = await dfnsDelegated.wallets.getTransaction({
					walletId: dfnsStore.state.wallet.id,
					transactionId: transaction.id,
				});
				//@ts-ignore
			} while (transaction.status === TransactionStatus.Pending || transaction.status === "Executing");
			if (transaction.status === TransactionStatus.Failed || transaction.status === TransactionStatus.Rejected) {
				throw new Error(transaction.reason);
			}

			this.txHash = transaction.txHash;

			this.isLoading = false;

			// this.transactionSent.emit(this.txHash);
		} catch (error) {
			this.handleError(error);
		}
	}

	async transferTokens() {
		try {
			this.isLoading = true;

			this.step = 2;

			const kind = this.dfnsTransferSelectedToken.contract ? TransferKind.Erc20 : TransferKind.Native;
			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
			let request: TransferAssetRequest;

			if (kind === TransferKind.Erc20) {
				request = {
					walletId: dfnsStore.state.wallet.id,
					body: {
						kind: TransferKind.Erc20,
						to: this.to,
						amount: this.value,
						contract: this.dfnsTransferSelectedToken.contract,
					},
				};
			}

			if (kind === TransferKind.Native) {
				request = {
					walletId: dfnsStore.state.wallet.id,
					body: {
						kind: TransferKind.Native,
						to: this.to,
						amount: this.value,
					},
				};
			}

			const challenge = await dfnsDelegated.wallets.transferAssetInit(request);

			const assertion = await sign(dfnsStore.state.rpId, challenge.challenge, challenge.allowCredentials);

			let transfer = await dfnsDelegated.wallets.transferAssetComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: assertion,
			});

			do {
				await timeout(1000);
				transfer = await dfnsDelegated.wallets.getTransfer({
					walletId: dfnsStore.state.wallet.id,
					transferId: transfer.id,
				});
			} while (
				transfer.status === TransferStatus.Pending ||
				//@ts-ignore
				transfer.status === "Executing"
			);
			this.isLoading = false;
			if (transfer.status === TransferStatus.Failed || transfer.status === TransferStatus.Rejected) {
				throw new Error(transfer.reason);
			}
			this.txHash = transfer.txHash;
			this.isLoading = false;
		} catch (error) {
			this.handleError(error);
		}
	}

	private handleError(error: any) {
		this.isLoading = false;
		this.hasErrors = true;
		this.step = 1;

		if (typeof error === "string") {
			this.errorMessage = error;
		} else if (error instanceof Error) {
			this.errorMessage = error.message;
		} else {
			this.errorMessage = "An unknown error occurred.";
		}
	}

	async closeBtn() {
		this.transactionSent.emit(this.txHash);
		router.close();
	}

	async componentDidLoad() {
		await this.getFiatValue();
	}

	private async getFiatValue() {
		const fiatValue = await convertCryptoToFiat(
			formatUnits(this.value, this.decimals),
			dfnsStore.state.lang,
			this.tokenSymbol.toLowerCase(),
		);
		if (fiatValue) this.priceValue = fiatValue;
	}

	render() {
		const iconLink: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4.25 5.5C3.83579 5.5 3.5 5.83579 3.5 6.25V14.75C3.5 15.1642 3.83579 15.5 4.25 15.5H12.75C13.1642 15.5 13.5 15.1642 13.5 14.75V10.75C13.5 10.3358 13.8358 10 14.25 10C14.6642 10 15 10.3358 15 10.75V14.75C15 15.9926 13.9926 17 12.75 17H4.25C3.00736 17 2 15.9926 2 14.75V6.25C2 5.00736 3.00736 4 4.25 4H9.25C9.66421 4 10 4.33579 10 4.75C10 5.16421 9.66421 5.5 9.25 5.5H4.25Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M6.19385 12.7532C6.47175 13.0603 6.94603 13.0841 7.25319 12.8062L16.5 4.43999V7.25C16.5 7.66421 16.8358 8 17.25 8C17.6642 8 18 7.66421 18 7.25V2.75C18 2.33579 17.6642 2 17.25 2H12.75C12.3358 2 12 2.33579 12 2.75C12 3.16421 12.3358 3.5 12.75 3.5H15.3032L6.24682 11.6938C5.93966 11.9717 5.91595 12.446 6.19385 12.7532Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		const confirmationImgSrc: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4.5 24C4.5 13.2304 13.2304 4.5 24 4.5C34.7696 4.5 43.5 13.2304 43.5 24C43.5 34.7696 34.7696 43.5 24 43.5C13.2304 43.5 4.5 34.7696 4.5 24ZM31.2206 20.3719C31.7021 19.6977 31.546 18.7609 30.8719 18.2794C30.1977 17.7979 29.2609 17.954 28.7794 18.6281L22.3086 27.6873L19.0607 24.4393C18.4749 23.8536 17.5251 23.8536 16.9393 24.4393C16.3536 25.0251 16.3536 25.9749 16.9393 26.5607L21.4393 31.0607C21.7511 31.3724 22.1843 31.5313 22.6237 31.4949C23.0631 31.4585 23.4643 31.2307 23.7206 30.8719L31.2206 20.3719Z"
					fill={dfnsStore.state.colors.primary_500}
				/>
			</svg>
		);
		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.confirm_transaction}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="content-container">
						{this.step === 1 && (
							<Fragment>
								<div class="tab-container">
									<div class="row">
										<div class="key">
											<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.NEUTRAL}>
												{langState.values.pages.confirm_transaction.from}
											</dfns-typography>
										</div>
										<div class="value">
											<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
												{dfnsStore.state.wallet.address}
											</dfns-typography>
										</div>
									</div>
									<div class="row">
										<div class="key">
											<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.NEUTRAL}>
												{langState.values.pages.confirm_transaction.to}
											</dfns-typography>
										</div>
										<div class="value">
											<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
												{this.to}
											</dfns-typography>
										</div>
									</div>
									<div class="row">
										<div class="key">
											<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.NEUTRAL}>
												{langState.values.pages.confirm_transaction.amount}
											</dfns-typography>
										</div>
										<div class="value">
											<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
												{formatUnits(this.value, this.decimals)} {this.tokenSymbol.toUpperCase()}
											</dfns-typography>
										</div>
										<div class="sub-value">
											<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.NEUTRAL}>
												{this.priceValue}
											</dfns-typography>
										</div>
									</div>
									<div class="row">
										<div class="key">
											<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.NEUTRAL}>
												{langState.values.pages.confirm_transaction.fee}
											</dfns-typography>
										</div>
										<div class="value">
											<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY}>
												{langState.values.pages.confirm_transaction.fee_message}
											</dfns-typography>
										</div>
									</div>
								</div>
								<div class="total-container">
									<div class="total-row">
										<div class="key">
											<dfns-typography typo={ITypo.TEXTE_MD_SEMIBOLD} color={ITypoColor.NEUTRAL}>
												{langState.values.pages.confirm_transaction.total}
											</dfns-typography>
										</div>
										<div class="value">
											<dfns-typography typo={ITypo.TEXTE_MD_SEMIBOLD} color={ITypoColor.PRIMARY}>
												{formatUnits(this.value, this.decimals)} {this.tokenSymbol.toUpperCase()}
												{" + "}
												{langState.values.pages.confirm_transaction.gas_fees}
											</dfns-typography>
										</div>
										<div class="sub-value">
											<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.PRIMARY}>
												{this.priceValue} + {langState.values.pages.confirm_transaction.gas_fees}
											</dfns-typography>
										</div>
									</div>
								</div>
								{this.hasErrors && (
									<dfns-alert variant={EAlertVariant.ERROR} hasTitle={true}>
										<div slot="title">{langState.values.pages.confirm_transaction.error_title}</div>
										<div slot="content">{this.errorMessage}</div>
									</dfns-alert>
								)}
							</Fragment>
						)}
						{this.step === 2 && (
							<Fragment>
								<div class="confirmation-container">
									{this.isLoading ? (
										<div class="loading-transaction">
											<div class="pending-title">
												<dfns-loader size="large" />
												<dfns-typography typo={ITypo.H6_TITLE} color={ITypoColor.PRIMARY}>
													{langState.values.pages.confirm_transaction.pending_message}
												</dfns-typography>
												<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.PRIMARY}>
													{langState.values.pages.confirm_transaction.sub_title_pending}
												</dfns-typography>
											</div>
										</div>
									) : (
										<Fragment>
											{confirmationImgSrc}
											<div class="confirmation-title">
												<dfns-typography typo={ITypo.H6_TITLE} color={ITypoColor.PRIMARY}>
													{langState.values.pages.confirm_transaction.transaction_confirmed}
												</dfns-typography>
												<div
													class="link"
													onClick={() =>
														window.open(
															`${networkMapping[dfnsStore.state.network].blockExplorers.default.url}/tx/${
																this.txHash
															}`,
														)
													}>
													{iconLink}
												</div>
											</div>
										</Fragment>
									)}
								</div>
							</Fragment>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					{this.step === 1 && (
						<dfns-button
							content={langState.values.buttons.confirm}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							iconposition="left"
							onClick={() => {
								if (this.dfnsTransfer) {
									this.transferTokens();
									return;
								}
								this.sendTransaction();
							}}
							isloading={this.isLoading}
						/>
					)}
					<dfns-button
						content={this.step === 1 ? langState.values.buttons.back : langState.values.buttons.close}
						variant={EButtonVariant.NEUTRAL}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						onClick={() => {
							if (this.step === 2) {
								this.transactionSent.emit(this.txHash);
								this.closeBtn();
								return;
							}
							if (this.dfnsTransfer) {
								this.transactionSent.emit(this.txHash);
								this.backButtonCallback();
								return;
							}
							this.transactionSent.emit(this.txHash);
							router.goBack();
						}}
					/>
				</div>
			</dfns-layout>
		);
	}
}
