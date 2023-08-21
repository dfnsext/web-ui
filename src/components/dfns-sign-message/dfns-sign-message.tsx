import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import { Component, Event, EventEmitter, JSX, Prop, h } from "@stencil/core";
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

	@Prop() walletId: string;
	@Prop() appId: string;
	@Prop() rpId: string;
	@Prop() dfnsUserToken: string;
	@Prop() message: string;
	@Prop({ mutable: true }) visible: string;
	@Event() signedMessage: EventEmitter<GetSignatureResponse>;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	async signMessage() {
		const signedMessage = await signMessage(this.appId, this.rpId, this.dfnsUserToken, this.walletId, this.message);
		this.signedMessage.emit(signedMessage);
	}

	render() {
		const icon: JSX.Element = (
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
		console.log(icon);
		return (
			<div class={this.visible ? "container visible" : "container"}>
				<dfns-layout closeBtn>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							Signature request
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<div class="contentContainer">
							<div class="title">
								<dfns-button
									content={"https://3loom.io"}
									variant={EButtonVariant.SECONDARY}
									sizing={EButtonSize.SMALL}
									fullwidth
									icon={icon}
									iconposition="left"
								/>
							</div>
							<div class="content">
								<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD}>
									{LanguageService.getContent("pages.signature_request.title")}
								</dfns-typography>
								{/* <dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
									{this.message}
								</dfns-typography> */}
								<dfns-textarea appName="Bloom" tosLink="https://3loom.io/tos" privacyLink="https://3loom.io/privacy" walletAddress="0x7a13d0a66298f170ee43740ad9a47653ba8f12f0" nonceValue="6a0444f4-bb68-437a-b96d-e8b03d55eadd" />
								<dfns-alert variant={EAlertVariant.WARNING}>
									<div slot="content">{LanguageService.getContent("pages.signature_request.warning_content")}</div>
								</dfns-alert>
								<dfns-alert variant={EAlertVariant.ERROR} hasTitle={true}>
									<div slot="title">{LanguageService.getContent("pages.signature_request.error_title")}</div>
									<div slot="content">Reason for failure</div>
								</dfns-alert>
							</div>
						</div>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={LanguageService.getContent("pages.signature_request.button_signing")}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							onClick={this.signMessage.bind(this)}
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
