import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import { Component, Event, EventEmitter, JSX, Prop, h } from "@stencil/core";
import { LanguageService } from "../../services/language-services";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { signMessage } from "../../utils/helper";
import { ThemeMode } from "../../utils/theme-modes";


// ** Signup or sign in popup*/
@Component({
	tag: "dfns-sign-message",
	styleUrl: "dfns-sign-message.scss",
	shadow: true,
})
export class DfnsSignMessage {
	private themeMode = ThemeMode.getInstance();

	@Prop() walletId: string;
	@Prop() appId : string;
	@Prop() rpId : string;
	@Prop() dfnsUserToken : string;
	@Prop() message : string;
	@Prop({mutable: true}) visible : string;
	@Event() signedMessage: EventEmitter<GetSignatureResponse>
	

	componentWillLoad() {
		// Manually set the theme mode to DARK or LIGHT as desired
		this.themeMode.switch(EThemeModeType.ACCOR); // Replace EThemeModeType.DARK with EThemeModeType.LIGHT if you want to set it to light mode
	}

	async signMessage() {
		const signedMessage = await signMessage(this.appId, this.rpId, this.dfnsUserToken, this.walletId, this.message);
		this.signedMessage.emit(signedMessage);
	}

	render() {
		const icon: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
				<path
					fill-rule="evenodd"
					d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
					clip-rule="evenodd"
				/>
			</svg>
		);
		return (
			<div class={this.visible ? "container visible" : "container"}>
				<dfns-layout closeBtn>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						Sign Message
						</dfns-typography>
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{this.message}
						</dfns-typography>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={LanguageService.getContent('common.connect_wallet')}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.LARGE}
							fullwidth
							icon={icon}
							iconposition="left"
							onClick={this.signMessage.bind(this)}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
