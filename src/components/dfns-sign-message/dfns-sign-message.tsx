import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import { Component, Event, EventEmitter, JSX, Prop, State, h } from "@stencil/core";
import { LanguageService } from "../../services/language-services";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { signMessage } from "../../utils/helper";
import { ThemeMode } from "../../utils/theme-modes";
import { EAlertVariant } from "../../utils/enums/alerts-enums";

// ** Signup or sign in popup*/
@Component({
	tag: "dfns-sign-message",
	styleUrl: "dfns-sign-message.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsSignMessage {
	private themeMode = ThemeMode.getInstance();
	@Prop() dfnsHost: string;
	@Prop() walletId: string;
	@Prop() appId: string;
	@Prop() rpId: string;
	@Prop() dfnsUserToken: string;
	@Prop() message: string;
	@Prop({ mutable: true }) visible: string;
	@Event() signedMessage: EventEmitter<GetSignatureResponse>;
	@State() hasErrors: boolean = false;
	@State() errorMessage: string = "";
	@State() isLoading: boolean = false;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	async signMessage() {
		try {
			this.isLoading = true;
			const signedMessage = await signMessage(this.dfnsHost, this.appId, this.rpId, this.dfnsUserToken, this.walletId, this.message);
			this.isLoading = false;

			if (signedMessage.status !== "Signed") {
				this.handleError(signedMessage.reason);
				return;
			}

			this.hasErrors = false;
			this.errorMessage = "";
			this.signedMessage.emit(signedMessage);
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

	async closeBtn() {
		this.signedMessage.emit(null);
	}

	render() {
		const iconBloom: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M10.1148 8.40105C10.6601 8.22504 11.2408 8.12976 11.8446 8.12976C12.8701 8.12976 13.8314 8.40541 14.662 8.88543C13.4718 6.78498 12.3054 4.73254 11.2581 2.9092C11.1245 2.67646 10.9736 2.44518 10.7916 2.25026C9.71834 1.10258 8.41977 0.748387 6.91392 1.17386C6.66186 1.24513 6.42208 1.35423 6.19385 1.49896C6.20974 1.53024 6.22274 1.55715 6.23719 1.58333C7.42237 3.65104 8.76066 6.01114 10.1148 8.40105Z"
					fill="#FC5922"
				/>
				<path
					d="M19.9401 18.1753C19.1817 16.8523 18.3605 15.4093 17.5126 13.9147C17.4924 15.4828 16.8446 16.8981 15.8103 17.9178C16.9168 18.8175 18.1677 19.0095 19.558 18.4916C19.7075 18.4356 19.8469 18.3535 20 18.2793C19.974 18.2334 19.9574 18.2044 19.9408 18.176L19.9401 18.1753Z"
					fill="#FC5922"
				/>
				<path
					d="M10.0491 8.35159C9.4381 8.70797 8.91882 9.16326 8.49704 9.68401C7.35591 7.70211 6.21912 5.72895 5.06572 3.72887C4.93139 3.49613 4.78044 3.26558 4.59772 3.07139C3.52376 1.92444 2.22447 1.57315 0.719341 2.00007C0.467283 2.07135 0.228225 2.1819 0 2.32591C0.0158891 2.35718 0.0288892 2.38409 0.044056 2.41027C2.69825 7.02281 5.35317 11.6354 8.00736 16.2479C8.17203 16.5345 8.36053 16.8036 8.60031 17.029C8.61042 17.0385 8.62054 17.0465 8.62993 17.0552C10.3792 19.0669 13.3511 19.6211 15.7352 18.2298C18.4443 16.6486 19.3673 13.1554 17.7972 10.4273C16.2271 7.6992 12.7582 6.76971 10.0491 8.35086V8.35159ZM14.2315 15.5781C12.9785 16.3097 11.3737 15.8792 10.6471 14.6173C9.92055 13.3554 10.3481 11.7394 11.6012 11.0077C12.8542 10.276 14.459 10.7066 15.1856 11.9685C15.9122 13.2303 15.4846 14.8464 14.2315 15.5781Z"
					fill="#50565E"
				/>
			</svg>
		);
		const iconRety: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M15.3125 11.4236C14.5263 14.3576 11.5104 16.0988 8.57636 15.3127C7.60734 15.053 6.7703 14.5514 6.11058 13.8904L5.79904 13.5789L8.23227 13.5785C8.64649 13.5784 8.98221 13.2425 8.98214 12.8283C8.98206 12.4141 8.64622 12.0784 8.232 12.0785L3.98857 12.0792C3.78965 12.0792 3.5989 12.1583 3.45827 12.299C3.31764 12.4397 3.23866 12.6305 3.23871 12.8294L3.2396 17.0712C3.23968 17.4854 3.57554 17.8211 3.98975 17.821C4.40397 17.821 4.73968 17.4851 4.7396 17.0709L4.73909 14.6403L5.04894 14.9501C5.88997 15.7926 6.95765 16.4318 8.18814 16.7615C11.9224 17.7621 15.7608 15.5461 16.7613 11.8118C16.8686 11.4117 16.6311 11.0005 16.231 10.8932C15.8309 10.786 15.4197 11.0235 15.3125 11.4236ZM16.5414 7.70119C16.682 7.56051 16.761 7.36971 16.761 7.17078L16.7603 2.92883C16.7602 2.51462 16.4244 2.17889 16.0102 2.17896C15.596 2.17902 15.2602 2.51487 15.2603 2.92908L15.2607 5.35995L14.9509 5.05013C14.1099 4.20771 13.042 3.56827 11.8116 3.23859C8.07734 2.238 4.23898 4.45407 3.23839 8.18834C3.13118 8.58844 3.36862 8.99969 3.76872 9.1069C4.16882 9.2141 4.58007 8.97667 4.68728 8.57657C5.47346 5.6425 8.48931 3.9013 11.4234 4.68748C12.3924 4.94714 13.2295 5.44881 13.8892 6.10979L14.2003 6.4209L11.7684 6.4209C11.3542 6.4209 11.0184 6.75669 11.0184 7.1709C11.0184 7.58512 11.3542 7.9209 11.7684 7.9209H16.011C16.2099 7.9209 16.4007 7.84187 16.5414 7.70119Z"
					fill="#FAFAFA"
				/>
			</svg>
		);

		return (
			<div class={this.visible ? "container visible" : "container"}>
				<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							Signature request
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<div class="contentContainer">
							<div class="title">
								<dfns-button
									content={this.rpId}
									variant={EButtonVariant.SECONDARY}
									sizing={EButtonSize.SMALL}
									fullwidth
									icon={iconBloom}
									iconposition="left"
								/>
							</div>
							<div class="content">
								<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD}>
									{LanguageService.getContent("pages.signature_request.title")}
								</dfns-typography>
								<div class="textarea">
									<div class="sub-container">
										<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY} class="custom-class">
											{this.message}
										</dfns-typography>
									</div>
								</div>

								<dfns-alert variant={EAlertVariant.WARNING}>
									<div slot="content">{LanguageService.getContent("pages.signature_request.warning_content")}</div>
								</dfns-alert>
								{this.hasErrors && (
									<dfns-alert variant={EAlertVariant.ERROR} hasTitle={true}>
										<div slot="title">{LanguageService.getContent("pages.signature_request.error_title")}</div>
										<div slot="content">{this.errorMessage}</div>
									</dfns-alert>
								)}
							</div>
						</div>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={
								this.hasErrors
									? LanguageService.getContent("pages.signature_request.button_retry")
									: LanguageService.getContent("pages.signature_request.button_signing")
							}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							icon={this.hasErrors ? iconRety : undefined}
							iconposition="left"
							onClick={this.signMessage.bind(this)}
							isloading={this.isLoading}
						/>
						<dfns-button
							content={LanguageService.getContent("pages.signature_request.button_reject")}
							variant={EButtonVariant.SECONDARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
