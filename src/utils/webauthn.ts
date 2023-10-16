import { Fido2Attestation, UserRegistrationChallenge } from "@dfns/sdk";
import { Fido2Options, FidoCredentialsTransportKind, RegistrationConfirmationFido2, UserRecoveryChallenge } from "@dfns/sdk/codegen/datamodel/Auth";
import { AllowCredential, Fido2Assertion } from "@dfns/sdk/signer";
import { fromBase64Url, toBase64Url } from "@dfns/sdk/utils/base64";
import { Buffer } from "buffer";

export const DEFAULT_WAIT_TIMEOUT = 60000;

export async function sign(
	rpId: string,
	challenge: string,
	allowCredentials: { key: AllowCredential[]; webauthn: AllowCredential[] },
	defaultTransports?: AuthenticatorTransport[],
	timeout: number = DEFAULT_WAIT_TIMEOUT,
): Promise<Fido2Assertion> {
	const options: CredentialRequestOptions = {
		mediation: "required",
		publicKey: {
			challenge: Buffer.from(challenge),
			allowCredentials: allowCredentials.webauthn.map(({ id, type, transports }) => ({
				id: fromBase64Url(id),
				type,
				transports: transports ?? defaultTransports ?? [],
			})),
			rpId,
			userVerification: "required",
			timeout,
		},
	};
	const credential = (await navigator.credentials.get(options)) as PublicKeyCredential | null;

	if (!credential) {
		throw new Error("Failed to sign with WebAuthn credential");
	}

	const assertion = <AuthenticatorAssertionResponse>credential.response;

	return {
		kind: "Fido2",
		credentialAssertion: {
			credId: credential.id,
			clientData: toBase64Url(Buffer.from(assertion.clientDataJSON)),
			authenticatorData: toBase64Url(Buffer.from(assertion.authenticatorData)),
			signature: toBase64Url(Buffer.from(assertion.signature)),
			userHandle: assertion.userHandle ? toBase64Url(Buffer.from(assertion.userHandle)) : "",
		},
	};
}

export async function create(
	challenge: UserRegistrationChallenge | Fido2Options | UserRecoveryChallenge,
	authenticatorAttachment?: AuthenticatorAttachment,
	timeout: number = DEFAULT_WAIT_TIMEOUT,
): Promise<Fido2Attestation | RegistrationConfirmationFido2> {
	const options: CredentialCreationOptions = {
		publicKey: {
			challenge: Buffer.from(challenge.challenge),
			//@ts-ignore
			pubKeyCredParams: challenge.pubKeyCredParams,
			rp: challenge.rp,
			user: {
				displayName: challenge.user.displayName,
				id: Buffer.from(challenge.user.id),
				name: challenge.user.name,
			},
			attestation: challenge.attestation,
			excludeCredentials: challenge.excludeCredentials.map((cred) => ({
				id: fromBase64Url(cred.id),
				type: cred.type,
			})),
			//@ts-ignore
			authenticatorSelection: { ...challenge.authenticatorSelection, authenticatorAttachment },
			timeout,
		},
	};

	const response = await navigator.credentials.create(options);

	if (response === null) {
		throw Error(`Failed to create and sign with WebAuthn credential`);
	}

	const credential = response as PublicKeyCredential;
	const attestation = <AuthenticatorAttestationResponse>credential.response;

	return {
		credentialKind: "Fido2",
		credentialInfo: {
			credId: credential.id,
			attestationData: toBase64Url(Buffer.from(attestation.attestationObject)),
			clientData: toBase64Url(Buffer.from(attestation.clientDataJSON)),
		},
	};
}
