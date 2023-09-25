import { RecoveryKeyAttestation } from "@dfns/sdk";
import { CredentialKind, PublicKeyOptions } from "@dfns/sdk/codegen/datamodel/Auth";
import { Component, Event, EventEmitter, Fragment, JSX, State, h } from "@stencil/core";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import router from "../../../stores/RouterStore";
import { getDfnsDelegatedClient } from "../../../utils/dfns";
import { CreatePasskeyAction } from "../../../common/enums/actions-enum";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { CopyClipboard } from "../../Elements/CopyClipboard";

@Component({
	tag: "dfns-recovery-setup",
	styleUrl: "dfns-recovery-setup.scss",
	shadow: true,
})
export class DfnsRecoverySetup {
	@State() isLoading: boolean = false;
	@State() step = 2;
	@State() passkeyName?: string;
	@State() newPasskeyAttestation: RecoveryKeyAttestation;
	@State() newPasskeyChallenge: PublicKeyOptions;
	@Event() action: EventEmitter<CreatePasskeyAction>;

	async initPasskeyCreation() {
		this.isLoading = true;
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
			this.newPasskeyChallenge = (await dfnsDelegated.auth.createUserCredentialChallenge({
				body: { kind: CredentialKind.RecoveryKey },
			})) as PublicKeyOptions;

			// const privateKey = await generateRsaKey();
			// this.newPasskeyAttestation = await create(this.newPasskeyChallenge);
			// this.step = 2;
		} catch (err) {
			console.error(err);
			this.isLoading = false;
		}

		this.isLoading = false;
	}

	// async completePasskeyCreation() {
	// 	this.isLoading = true;
	// 	try {
	// 		const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
	// 		const request = {
	// 			body: {
	// 				...this.newPasskeyAttestation,
	// 				credentialName: this.passkeyName,
	// 				//@ts-ignore
	// 				challengeIdentifier: this.newPasskeyChallenge.temporaryAuthenticationToken,
	// 			},
	// 		};
	// 		//@ts-ignore
	// 		const addCredentialInitChallenge = await dfnsDelegated.auth.createUserCredentialInit(request);
	// 		const assertion = await sign(dfnsStore.state.rpId, addCredentialInitChallenge.challenge, addCredentialInitChallenge.allowCredentials);

	// 		//@ts-ignore
	// 		await dfnsDelegated.auth.createUserCredentialComplete(request, {
	// 			challengeIdentifier: addCredentialInitChallenge.challengeIdentifier,
	// 			firstFactor: assertion,
	// 		});
	// 		this.action.emit(CreatePasskeyAction.BACK);
	// 		this.isLoading = false;
	// 		this.step = 1;
	// 		this.passkeyName = undefined;
	// 	} catch (err) {
	// 		this.isLoading = false;
	// 		console.error(err);
	// 	}
	// }

	handleBackClick() {
		router.goBack();
	}

	render() {
		const iconTools: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M16 9C16 5.13401 19.134 2 23 2C23.7055 2 24.3884 2.10469 25.033 2.30006C25.3693 2.40201 25.6275 2.67305 25.7129 3.01398C25.7984 3.3549 25.6986 3.71565 25.45 3.96418L21.0251 8.38911C21.1074 9.02322 21.3918 9.63442 21.8787 10.1213C22.3656 10.6082 22.9768 10.8926 23.6109 10.9749L28.0358 6.54996C28.2843 6.30144 28.6451 6.20163 28.986 6.28707C29.3269 6.37251 29.598 6.63065 29.6999 6.96701C29.8953 7.61161 30 8.29448 30 9C30 12.866 26.866 16 23 16C22.7993 16 22.6004 15.9915 22.4036 15.9749C21.0473 15.8602 19.9117 16.1088 19.3259 16.8202L9.79102 28.3982C8.95579 29.4124 7.71077 30 6.39691 30C3.96857 30 2 28.0314 2 25.6031C2 24.2892 2.58755 23.0442 3.60176 22.209L15.1798 12.6741C15.8912 12.0883 16.1398 10.9527 16.0251 9.59638C16.0085 9.39957 16 9.20066 16 9ZM5.48965 25.5001C5.48965 24.9478 5.93736 24.5001 6.48965 24.5001H6.49965C7.05193 24.5001 7.49965 24.9478 7.49965 25.5001V25.5101C7.49965 26.0623 7.05193 26.5101 6.49965 26.5101H6.48965C5.93736 26.5101 5.48965 26.0623 5.48965 25.5101V25.5001Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M13.4346 11.5204L10.5 8.58581V6.50002C10.5 6.14876 10.3157 5.82325 10.0145 5.64253L5.01452 2.64253C4.62104 2.40644 4.11738 2.46845 3.79292 2.79292L2.79292 3.79292C2.46845 4.11738 2.40644 4.62104 2.64253 5.01452L5.64253 10.0145C5.82325 10.3157 6.14876 10.5 6.50002 10.5H8.58581L11.3352 13.2494L13.4346 11.5204Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M16.7412 23.1049L22.3182 28.6819C24.0755 30.4393 26.9248 30.4393 28.6821 28.6819C30.4395 26.9245 30.4395 24.0753 28.6821 22.3179L24.2746 17.9104C23.8583 17.9694 23.4328 17.9999 23.0001 17.9999C22.7432 17.9999 22.4881 17.9891 22.2353 17.9677C21.7095 17.9233 21.3253 17.9595 21.0785 18.0236C20.9404 18.0594 20.8766 18.095 20.8559 18.1086L16.7412 23.1049ZM21.293 21.2929C21.6835 20.9024 22.3167 20.9024 22.7072 21.2929L25.2072 23.7929C25.5978 24.1834 25.5978 24.8166 25.2072 25.2071C24.8167 25.5976 24.1835 25.5976 23.793 25.2071L21.293 22.7071C20.9025 22.3166 20.9025 21.6834 21.293 21.2929Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		const iconCopy: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg"  width="32" height="32" viewBox="0 0 32 32"  fill="none">
				<path
					d="M7 3.5C7 2.67157 7.67157 2 8.5 2H12.3787C12.7765 2 13.158 2.15804 13.4393 2.43934L16.5607 5.56066C16.842 5.84197 17 6.2235 17 6.62132V12.5C17 13.3284 16.3284 14 15.5 14H14.5V10.6213C14.5 9.82567 14.1839 9.06261 13.6213 8.5L10.5 5.37868C9.93739 4.81607 9.17433 4.5 8.37868 4.5H7V3.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M4.5 6C3.67157 6 3 6.67157 3 7.5V16.5C3 17.3284 3.67157 18 4.5 18H11.5C12.3284 18 13 17.3284 13 16.5V10.6213C13 10.2235 12.842 9.84197 12.5607 9.56066L9.43934 6.43934C9.15804 6.15804 8.7765 6 8.37868 6H4.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		return (
			<dfns-layout closeBtn onClickCloseBtn={() => this.action.emit(CreatePasskeyAction.CLOSE)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.recovery_setup}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="content-container">
						{this.step === 1 && (
							<Fragment>
								{iconTools}
								<div class="title">
									<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
										{langState.values.pages.recovery_setup.title}
									</dfns-typography>
								</div>
								<div class="description">
									<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
										{langState.values.pages.recovery_setup.description}
									</dfns-typography>
								</div>
							</Fragment>
						)}
						{this.step === 2 && (
							<Fragment>
								<div class="container-textfields">
									<div class="wrapper-inputs">
										<div class="input-field">
											<dfns-input-field placeholder={""} onChange={(value) => {}} isPasswordVisible={false}>
												<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
													{langState.values.pages.recovery_setup.recovery_code}
												</dfns-typography>
											</dfns-input-field>
										</div>
										<div class="copy-icon">
											<CopyClipboard value={""} openToaster={true}>
												{iconCopy}
											</CopyClipboard>
										</div>
									</div>
									<div class="input-field">
										<dfns-input-field placeholder={""} onChange={(value) => {}} errors={[]} isPasswordVisible={false}>
											<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
												{langState.values.pages.recovery_setup.recovery_key}
											</dfns-typography>
										</dfns-input-field>
									</div>
								</div>
							</Fragment>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					{this.step === 1 && (
						<Fragment>
							<dfns-button
								content={langState.values.pages.recovery_setup.button_generate}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								onClick={() => {}}
							/>
							<dfns-button
								content={langState.values.pages.recovery_setup.button_later}
								variant={EButtonVariant.NEUTRAL}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								iconposition="left"
								onClick={() => this.handleBackClick()}
							/>
						</Fragment>
					)}
					{this.step === 2 && (
						<Fragment>
							<dfns-button
								content={langState.values.pages.create_passkey.button_save}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								iconposition="left"
								disabled={!this.passkeyName}
								onClick={() => {}}
								isloading={this.isLoading}
							/>
						</Fragment>
					)}
				</div>
			</dfns-layout>
		);
	}
}
