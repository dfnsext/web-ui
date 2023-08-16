import { Component, Event, EventEmitter, JSX, Prop, h } from "@stencil/core";
import { RegisterCompleteResponse } from "../../components";
import { LanguageService } from "../../services/language-services";
import { EAlertVariant } from "../../utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { registerWithOAuth } from "../../utils/helper";
import { ThemeMode } from "../../utils/theme-modes";


// ** Signup or sign in popup*/
@Component({
	tag: "dfns-create-account",
	styleUrl: "dfns-create-account.scss",
	shadow: true,
})
export class DfnsCreateAccount {
	private themeMode = ThemeMode.getInstance();

	@Prop({mutable: true}) rpId : string;
	@Prop({mutable: true}) oauthAccessToken : string;
	@Prop({mutable: true}) visible : string;
	@Event() passkeyCreated: EventEmitter<RegisterCompleteResponse>

	componentWillLoad() {
		// Manually set the theme mode to DARK or LIGHT as desired
		this.themeMode.switch(EThemeModeType.ACCOR); // Replace EThemeModeType.DARK with EThemeModeType.LIGHT if you want to set it to light mode
	}

	async createPasskey() {
		try {
			const response = await registerWithOAuth(this.rpId, this.oauthAccessToken);
			this.passkeyCreated.emit(response);
			return response;
		} catch (error) {
			console.error(error);
		}
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
							Create Account
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<dfns-stepper steps={["Identification", "Create passkey", "Validate wallet"]} activeIndices={[1]} />
						<dfns-alert variant={EAlertVariant.INFO}>
							<div slot="title">Create a backup passkey</div>
							<div slot="content">
								We strongly recommend to create a backup passkey, as this is the only way to recover your account if you
								lose your current passkey.
							</div>
						</dfns-alert>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={LanguageService.getContent('common.connect_wallet')}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.LARGE}
							fullwidth
							icon={icon}
							iconposition="left"
							onClick={this.createPasskey.bind(this)}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
