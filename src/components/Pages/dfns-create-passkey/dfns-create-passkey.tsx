import { Fido2Attestation } from "@dfns/sdk";
import { CredentialKind, Fido2Options } from "@dfns/sdk/codegen/datamodel/Auth";
import { Component, Event, EventEmitter, Fragment, State, h } from "@stencil/core";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import router from "../../../stores/RouterStore";
import { getDfnsDelegatedClient } from "../../../utils/dfns";
import { create, sign } from "../../../utils/webauthn";
import { CreatePasskeyAction } from "../../../common/enums/actions-enum";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";


@Component({
	tag: "dfns-create-passkey",
	styleUrl: "dfns-create-passkey.scss",
	shadow: true,
})
export class DfnsCreatePasskey {
	@State() isLoading: boolean = false;
	@State() step = 1;
	@State() passkeyName?: string;
	@State() newPasskeyAttestation: Fido2Attestation;
	@State() newPasskeyChallenge: Fido2Options;
	@Event() action: EventEmitter<CreatePasskeyAction>;

	async initPasskeyCreation() {
		this.isLoading = true;
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
			this.newPasskeyChallenge = (await dfnsDelegated.auth.createUserCredentialChallenge({
				body: { kind: CredentialKind.Fido2 },
			})) as Fido2Options;
			this.newPasskeyAttestation = await create(this.newPasskeyChallenge);
			this.step = 2;
		} catch (err) {
			console.error(err);
			this.isLoading = false;
		}

		this.isLoading = false;
	}

	async completePasskeyCreation() {
		this.isLoading = true;
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, dfnsStore.state.dfnsUserToken);
			const request = {
				body: {
					...this.newPasskeyAttestation,
					credentialName: this.passkeyName,
					//@ts-ignore
					challengeIdentifier: this.newPasskeyChallenge.temporaryAuthenticationToken,
				},
			};
			//@ts-ignore
			const addCredentialInitChallenge = await dfnsDelegated.auth.createUserCredentialInit(request);
			const assertion = await sign(dfnsStore.state.rpId, addCredentialInitChallenge.challenge, addCredentialInitChallenge.allowCredentials);

			//@ts-ignore
			await dfnsDelegated.auth.createUserCredentialComplete(request, {
				challengeIdentifier: addCredentialInitChallenge.challengeIdentifier,
				firstFactor: assertion,
			});
			router.goBack();
			this.isLoading = false;
			this.step = 1;
			this.passkeyName = undefined;
		} catch (err) {
			this.isLoading = false;
			console.error(err);
		}
	}

	render() {
		return (
			<dfns-layout closeBtn>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.create_passkey}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="contentContainer">
						{this.step === 1 && (
							<Fragment>
								<dfns-input-field
									placeholder={langState.values.pages.create_passkey.input_placeholder}
									value={this.passkeyName}
									onChange={(value) => (this.passkeyName = value)}>
									<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
										{langState.values.pages.create_passkey.passkey_name_label}
									</dfns-typography>
								</dfns-input-field>
								<dfns-alert variant={EAlertVariant.WARNING} hasTitle>
									<div slot="title">{langState.values.pages.create_passkey.alert_title}</div>
									<div slot="content">{langState.values.pages.create_passkey.alert_description}</div>
								</dfns-alert>
							</Fragment>
						)}
						{this.step === 2 && (
							<Fragment>
								<dfns-typography typo={ITypo.TEXTE_LG_SEMIBOLD} color={ITypoColor.PRIMARY}>
									{langState.values.pages.create_passkey.save_title}
								</dfns-typography>

								<div class="content">
									<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
										{langState.values.pages.create_passkey.save_description}
									</dfns-typography>
								</div>
							</Fragment>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					{this.step === 1 && (
						<Fragment>
							<dfns-button
								content={langState.values.pages.create_passkey.button_create}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								iconposition="left"
								disabled={!this.passkeyName}
								onClick={() => this.initPasskeyCreation()}
								isloading={this.isLoading}
							/>
							<dfns-button
								content={langState.values.buttons.back}
								variant={EButtonVariant.NEUTRAL}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								iconposition="left"
								onClick={() => router.goBack()}
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
								onClick={() => this.completePasskeyCreation()}
								isloading={this.isLoading}
							/>
						</Fragment>
					)}
				</div>
			</dfns-layout>
		);
	}
}
