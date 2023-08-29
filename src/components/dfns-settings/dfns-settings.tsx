import { DeactivateCredentialRequest } from "@dfns/sdk/codegen/Auth";
import { CredentialInfo } from "@dfns/sdk/codegen/datamodel/Auth";
import { Component, Event, EventEmitter, JSX, Prop, State, Watch, h } from "@stencil/core";
import { getDfnsDelegatedClient } from "../../utils/dfns";
import { EAlertVariant } from "../../utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { ThemeMode } from "../../utils/theme-modes";
import { sign } from "../../utils/webauthn";
import { SettingsAction } from "../../utils/enums/actions-enum";
import langState from "../../services/store/language-store";

@Component({
	tag: "dfns-settings",
	styleUrl: "dfns-settings.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsSettings {
	private themeMode = ThemeMode.getInstance();

	@Prop() dfnsHost: string;
	@Prop() walletId: string;
	@Prop() appId: string;
	@Prop() rpId: string;
	@Prop() dfnsUserToken: string;
	@Prop() visible: string;
	@Event() action: EventEmitter<SettingsAction>;
	@State() passkeys: CredentialInfo[] = [];
	@Prop() confirmationImgSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg";

	async componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
		if (this.dfnsUserToken) {
			this.fetchPasskeys();
		}
	}

	@Watch("dfnsUserToken")
	watchUserTokenHandler() {
		this.fetchPasskeys();
	}

	@Watch("visible")
	watchVisibleHandler() {
		this.visible && this.fetchPasskeys();
	}

	async fetchPasskeys() {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(this.dfnsHost, this.appId, this.dfnsUserToken);
			this.passkeys = (await dfnsDelegated.auth.listUserCredentials()).items;
		} catch (error) {
			console.error(error);
		}
	}

	async desactivatePasskey(passkey: CredentialInfo) {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(this.dfnsHost, this.appId, this.dfnsUserToken);
			const request: DeactivateCredentialRequest = { body: { credentialUuid: passkey.credentialUuid } };
			const challenge = await dfnsDelegated.auth.deactivateCredentialInit(request);
			const signedChallenge = await sign(this.rpId, challenge.challenge, challenge.allowCredentials);
			await dfnsDelegated.auth.deactivateCredentialComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: signedChallenge,
			});
		} catch (err) {
			console.error(err);
		}
	}

	async activatePasskey(passkey: CredentialInfo) {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(this.dfnsHost, this.appId, this.dfnsUserToken);
			const request: DeactivateCredentialRequest = { body: { credentialUuid: passkey.credentialUuid } };
			const challenge = await dfnsDelegated.auth.activateCredentialInit(request);
			const signedChallenge = await sign(this.rpId, challenge.challenge, challenge.allowCredentials);
			await dfnsDelegated.auth.activateCredentialComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: signedChallenge,
			});
		} catch (error) {
			console.error(error);
		}
	}

	async onClickToggle(passkey: CredentialInfo) {
		if (passkey.isActive) {
			await this.desactivatePasskey(passkey);
		} else {
			await this.activatePasskey(passkey);
		}
		this.fetchPasskeys();
	}

	async closeBtn() {
		this.action.emit(SettingsAction.CLOSE);
	}

	render() {
		const iconAdd: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M10.75 4.75C10.75 4.33579 10.4142 4 10 4C9.58579 4 9.25 4.33579 9.25 4.75V9.25H4.75C4.33579 9.25 4 9.58579 4 10C4 10.4142 4.33579 10.75 4.75 10.75L9.25 10.75V15.25C9.25 15.6642 9.58579 16 10 16C10.4142 16 10.75 15.6642 10.75 15.25V10.75L15.25 10.75C15.6642 10.75 16 10.4142 16 10C16 9.58579 15.6642 9.25 15.25 9.25H10.75V4.75Z"
					fill="#0D0D0D"
				/>
			</svg>
		);
		/* const iconError: JSX.Element = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
				/>
			</svg>
		); */

		const key = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M15.75 1.5C12.0221 1.5 9 4.52208 9 8.25C9 8.64372 9.03379 9.03016 9.0988 9.40639C9.16599 9.79527 9.06678 10.1226 8.87767 10.3117L2.37868 16.8107C1.81607 17.3733 1.5 18.1363 1.5 18.932V21.75C1.5 22.1642 1.83579 22.5 2.25 22.5H6C6.41421 22.5 6.75 22.1642 6.75 21.75V20.25H8.25C8.66421 20.25 9 19.9142 9 19.5V18H10.5C10.6989 18 10.8897 17.921 11.0303 17.7803L13.6883 15.1223C13.8774 14.9332 14.2047 14.834 14.5936 14.9012C14.9698 14.9662 15.3563 15 15.75 15C19.4779 15 22.5 11.9779 22.5 8.25C22.5 4.52208 19.4779 1.5 15.75 1.5ZM15.75 4.5C15.3358 4.5 15 4.83579 15 5.25C15 5.66421 15.3358 6 15.75 6C16.9926 6 18 7.00736 18 8.25C18 8.66421 18.3358 9 18.75 9C19.1642 9 19.5 8.66421 19.5 8.25C19.5 6.17893 17.8211 4.5 15.75 4.5Z"
					fill="#0D0D0D"
				/>
			</svg>
		);
		return (
			<div class={this.visible ? "container visible" : "container"}>
				<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							{langState.values.header.settings}
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<div class="first-section">
							<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
								{this.passkeys.length} {langState.values.pages.settings.passkeys}
							</dfns-typography>
							<dfns-button
								content={langState.values.pages.settings.button_create_passkey}
								variant={EButtonVariant.SECONDARY}
								sizing={EButtonSize.SMALL}
								iconposition="left"
								icon={iconAdd}
								onClick={() => this.action.emit(SettingsAction.CREATE_PASSKEY)}
							/>
						</div>
						<div class="credentials-container">
							<drop-down-container
								dropdownContent={this.passkeys.map((passkey) => {
									return {
										children:
											this.passkeys.length === 1 ? (
												key
											) : (
												<toggle-switch
													checked={passkey.isActive}
													onClick={() => this.passkeys.length > 1 && this.onClickToggle(passkey)}
												/>
											),
										title: passkey.name,
										content: (
											<div class="content-dropdown">
												{/* CSS class <content-dropdown> applied within the children  */}
												<div class="flexbox-row">
													<div class="flexbox-column">
														<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.SECONDARY}>
															{langState.values.pages.settings.type_credentials}
														</dfns-typography>
													</div>
													<div class="flexbox-column-2">
														<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
															{passkey.kind}
														</dfns-typography>
													</div>
												</div>
												<div class="flexbox-row">
													<div class="flexbox-column">
														<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.SECONDARY}>
															{langState.values.pages.settings.credentials_id}
														</dfns-typography>
													</div>
													<div class="flexbox-column-2">
														<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
															{passkey.credentialUuid}
														</dfns-typography>
													</div>
												</div>
												<div class="flexbox-row">
													<div class="flexbox-column">
														<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.SECONDARY}>
															{langState.values.pages.settings.origin}
														</dfns-typography>
													</div>
													<div class="flexbox-column-2">
														<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
															{passkey.origin}
														</dfns-typography>
													</div>
												</div>
												<div class="flexbox-row">
													<div class="flexbox-column">
														<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.SECONDARY}>
															{langState.values.pages.settings.public_key}
														</dfns-typography>
													</div>
													<div class="flexbox-column-2">
														<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
															{passkey.publicKey}
														</dfns-typography>
													</div>
												</div>
												{/* <div class="flexbox-row">
												<div class="flexbox-column">
													<dfns-button
														content={langState.values.pages.settings.button_delete}
														variant={EButtonVariant.WARNING}
														sizing={EButtonSize.SMALL}
														icon={iconError}
														iconposition="left"
														onClick={() => {}}
													/>
												</div>
											</div> */}
											</div>
										),
									};
								})}></drop-down-container>
						</div>
						<dfns-alert variant={EAlertVariant.INFO}>
							<div slot="content">{langState.values.pages.settings.content_alert}</div>
						</dfns-alert>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={langState.values.buttons.back}
							variant={EButtonVariant.SECONDARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							iconposition="left"
							onClick={() => this.action.emit(SettingsAction.BACK)}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
