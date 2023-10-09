import { Fido2Attestation, UserRegistrationChallenge } from "@dfns/sdk";
import { Fido2Options } from "@dfns/sdk/codegen/datamodel/Auth";
import { AllowCredential, Fido2Assertion } from "@dfns/sdk/signer";
import { fromBase64Url, toBase64Url } from "@dfns/sdk/utils/base64";
import { Buffer } from "buffer";

export const DEFAULT_WAIT_TIMEOUT = 60000;

export async function sign(
	rpId: string,
	challenge: string,
	allowCredentials: { key: AllowCredential[]; webauthn: AllowCredential[] },
	timeout: number = DEFAULT_WAIT_TIMEOUT,
): Promise<Fido2Assertion> {

	const credential = (await navigator.credentials.get({
		mediation: "required",
		publicKey: {
			challenge: Buffer.from(challenge),
			allowCredentials: allowCredentials.webauthn.map(({ id, type, transports }) => ({
				id: fromBase64Url(id),
				type,
				transports: transports ?? ["ble", "hybrid", "internal", "nfc"],
			})),
			rpId,
			userVerification: "required",
			timeout,
		},
	})) as PublicKeyCredential | null;

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
	challenge: UserRegistrationChallenge | Fido2Options,
	authenticatorAttachment?: AuthenticatorAttachment,
	timeout: number = DEFAULT_WAIT_TIMEOUT,
): Promise<Fido2Attestation> {
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

	console.log(options)

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
