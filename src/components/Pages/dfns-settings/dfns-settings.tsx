import { DeactivateCredentialRequest } from "@dfns/sdk/codegen/Auth";
import { CredentialInfo } from "@dfns/sdk/codegen/datamodel/Auth";
import { Component, Event, EventEmitter, JSX, Prop, h } from "@stencil/core";
import dfnsState from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { getDfnsDelegatedClient } from "../../../utils/dfns";
import { SettingsAction } from "../../../utils/enums/actions-enum";
import { EAlertVariant } from "../../../utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { ThemeMode } from "../../../utils/theme-modes";
import { sign } from "../../../utils/webauthn";
import  { goBack } from "../../../stores/RouteStore";

@Component({
	tag: "dfns-settings",
	styleUrl: "dfns-settings.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsSettings {
	private themeMode = ThemeMode.getInstance();

	@Event() action: EventEmitter<SettingsAction>;
	@Prop() confirmationImgSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg";

	async componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
		this.fetchPasskeys();
	}

	async fetchPasskeys() {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsState.dfnsHost, dfnsState.appId, dfnsState.dfnsUserToken);
			dfnsState.credentials = (await dfnsDelegated.auth.listUserCredentials()).items;
		} catch (error) {
			console.error(error);
		}
	}

	async desactivatePasskey(passkey: CredentialInfo) {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsState.dfnsHost, dfnsState.appId, dfnsState.dfnsUserToken);
			const request: DeactivateCredentialRequest = { body: { credentialUuid: passkey.credentialUuid } };
			const challenge = await dfnsDelegated.auth.deactivateCredentialInit(request);
			const signedChallenge = await sign(dfnsState.rpId, challenge.challenge, challenge.allowCredentials);
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
			const dfnsDelegated = getDfnsDelegatedClient(dfnsState.dfnsHost, dfnsState.appId, dfnsState.dfnsUserToken);
			const request: DeactivateCredentialRequest = { body: { credentialUuid: passkey.credentialUuid } };
			const challenge = await dfnsDelegated.auth.activateCredentialInit(request);
			const signedChallenge = await sign(dfnsState.rpId, challenge.challenge, challenge.allowCredentials);
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

	handleBackClick() {
		goBack();
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
		const iconDelete: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M8.75 1C7.23122 1 6 2.23122 6 3.75V4.1927C5.20472 4.26972 4.41602 4.36947 3.63458 4.49129C3.22531 4.5551 2.94525 4.9386 3.00906 5.34787C3.07286 5.75714 3.45637 6.0372 3.86564 5.97339L4.01355 5.95062L4.85504 16.4693C4.96938 17.8985 6.16254 19 7.59629 19H12.4035C13.8372 19 15.0304 17.8985 15.1447 16.4693L15.9862 5.95055L16.1346 5.97339C16.5438 6.0372 16.9274 5.75714 16.9912 5.34787C17.055 4.9386 16.7749 4.5551 16.3656 4.49129C15.5841 4.36946 14.7954 4.2697 14 4.19268V3.75C14 2.23122 12.7688 1 11.25 1H8.75ZM10.0001 4C10.8395 4 11.673 4.02523 12.5 4.07499V3.75C12.5 3.05964 11.9404 2.5 11.25 2.5H8.75C8.05964 2.5 7.5 3.05964 7.5 3.75V4.075C8.32707 4.02524 9.16068 4 10.0001 4ZM8.57948 7.72002C8.56292 7.30614 8.21398 6.98404 7.8001 7.0006C7.38622 7.01716 7.06412 7.36609 7.08068 7.77998L7.38069 15.28C7.39725 15.6939 7.74619 16.016 8.16007 15.9994C8.57395 15.9828 8.89605 15.6339 8.87949 15.22L8.57948 7.72002ZM12.9195 7.77998C12.936 7.36609 12.614 7.01715 12.2001 7.0006C11.7862 6.98404 11.4372 7.30614 11.4207 7.72002L11.1207 15.22C11.1041 15.6339 11.4262 15.9828 11.8401 15.9994C12.254 16.016 12.6029 15.6939 12.6195 15.28L12.9195 7.77998Z"
					fill="#111827"
				/>
			</svg>
		);

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
		const arrowRight = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M5 10C5 9.58579 5.33579 9.25 5.75 9.25H12.3879L10.2302 7.29063C9.93159 7.00353 9.92228 6.52875 10.2094 6.23017C10.4965 5.93159 10.9713 5.92228 11.2698 6.20938L14.7698 9.45938C14.9169 9.60078 15 9.79599 15 10C15 10.204 14.9169 10.3992 14.7698 10.5406L11.2698 13.7906C10.9713 14.0777 10.4965 14.0684 10.2094 13.7698C9.92228 13.4713 9.93159 12.9965 10.2302 12.7094L12.3879 10.75H5.75C5.33579 10.75 5 10.4142 5 10Z"
					fill="#4B5563"
				/>
			</svg>
		);

		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.settings}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="first-section">
						<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
							{dfnsState.credentials.length} {langState.values.pages.settings.passkeys}
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
					<div slot="contentSection">
						<div class="first-section">
							<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
								{dfnsState.credentials.length} {langState.values.pages.settings.passkeys}
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
							{dfnsState.credentials.map((passkey) => {
								return (
									<div key={passkey.credentialUuid} class="tab-container">
										<div class="row">
											<div class="toggle">
												{dfnsState.credentials.length === 1 ? (
													key
												) : (
													<toggle-switch
														checked={passkey.isActive}
														onClick={() => dfnsState.credentials.length > 1 && this.onClickToggle(passkey)}
													/>
												)}
											</div>
											<div class="title">
												<dfns-typography typo={ITypo.TEXTE_MD_SEMIBOLD} color={ITypoColor.PRIMARY}>
													{passkey.name}
												</dfns-typography>
											</div>
											<div class="icon-delete" onClick={() => {}}>
												{iconDelete}
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<div class="recovery-kit">
							<dfns-button
								content={langState.values.pages.settings.button_recovery_kit}
								variant={EButtonVariant.SECONDARY}
								sizing={EButtonSize.SMALL}
								iconposition="right"
								icon={arrowRight}
								onClick={() => {}}
							/>
						</div>

						<dfns-alert variant={EAlertVariant.INFO}>
							<div slot="content">{langState.values.pages.settings.content_alert}</div>
						</dfns-alert>
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
						//onClick={() => this.action.emit(SettingsAction.BACK)}
						onClick={() => this.handleBackClick()}
					/>
				</div>
			</dfns-layout>
		);
	}
}
