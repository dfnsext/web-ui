import { DfnsError, UserActionChallengeResponse } from "@dfns/sdk";
// import { SignatureKind } from "@dfns/sdk/codegen/datamodel/Wallets";
// import { CreateWalletRequest, GenerateSignatureRequest } from "@dfns/sdk/codegen/Wallets";
// import CookieStorageService, { DFNS_ACTIVE_WALLET_ID, DFNS_END_USER_TOKEN, OAUTH_TOKEN } from "../services/CookieStorageService";
// import { ethereumRecIdOffset } from "../common/constant";


import { CreateWalletRequest, GenerateSignatureRequest } from "@dfns/sdk/codegen/Wallets";
import { BlockchainNetwork, SignatureKind } from "@dfns/sdk/codegen/datamodel/Wallets";

import Login from "../services/api/Login";
import Register from "../services/api/Register";
import { getDfnsDelegatedClient, waitSignatureSigned } from "./dfns";
import { ethers } from "ethers";
import { create, sign } from "./webauthn";


export async function loginWithOAuth(apiUrl: string, appId: string, rpId: string, oauthAccessToken: string) {
	let challenge: UserActionChallengeResponse;
	try {
		challenge = await Login.getInstance(apiUrl, appId).init(oauthAccessToken);
	} catch (error: any) {
		if (error.httpStatus === 401) {
			throw new DfnsError(error.httpStatus, error.message, error.context);
		}
		throw error;
	}

	const assertion = await sign(rpId, challenge!.challenge, challenge!.allowCredentials);

	return Login.getInstance(apiUrl, appId).complete({
		challengeIdentifier: challenge!.challengeIdentifier,
		firstFactor: assertion,
	});
}
export async function registerWithOAuth(apiUrl: string, appId: string, oauthAccessToken: string) {
	let challenge;
	try {
		challenge = await Register.getInstance(apiUrl, appId).init(oauthAccessToken);
	} catch (error) {
		if (error.httpStatus === 401 && error.context?.message === "User already exists.") {
			challenge = await Register.getInstance(apiUrl, appId).restart(oauthAccessToken);
		}
	}
	try {

		const attestation = await create(challenge);
		return Register.getInstance(apiUrl, appId).complete(challenge.temporaryAuthenticationToken, {
			firstFactorCredential: attestation,
			// secondFactorCredential: {
			// 	...secondAttestation,
			// 	credentialKind: "Key"

			// },
			// recoveryCredential: {
			// 	credentialKind: "RecoveryKey",
			// 	credentialInfo: {
			// 		credId: "GMkW0zlmcoMxI1OX0Z96LL_Mz7dgeu6vOH5_TOeGyNk",
			// 		clientData:
			// 			"eyJ0eXBlIjoia2V5LmNyZWF0ZSIsImNoYWxsZW5nZSI6Ik1XTTBNbVk1WVRRME1EUmlOemRoTlRGaE56WTVPRFF3TldJNVpUUTRZMlJoT0RaaU5EazNaVFl6T1RFNU9HWXlNRGN4WmpCall6azRNbVE1WXpZMU1BIiwib3JpZ2luIjoiaHR0cHM6Ly9hcHAuZGZucy5uaW5qYSIsImNyb3NzT3JpZ2luIjpmYWxzZX0",
			// 		attestationData: "Wsdz5810zjVJEyEtx9jYU0dizfhIkdu9AOGl2kYtcBusAPsfjdncE6zKW8ms_VkhJ6Hw4HDfcYj5FHcdM-C4CA",
			// 	},
			// 	encryptedPrivateKey:
			// 		"LsXVskHYqqrKKxBC9KvqStLEmxak5Y7NaboDDlRSIW7evUJpQTT1AYvx0EsFskmriaVb3AjTCGEv7gqUKokml1USL7+dVmrUVhV+cNWtS5AorvRuZr1FMGVKFkW1pKJhFNH2e2O661UhpyXsRXzcmksA7ZN/V37ZK7ITue0gs6I=",
			// },
		});
	} catch (error: any) {
		throw error;
	}
}

export async function createWallet(dfnsHost: string, appId: string, rpId: string, dfnsUserToken: string) {
	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
	const createWalletRequest: CreateWalletRequest = {
		body: { network: BlockchainNetwork.PolygonMumbai },
	};

	const challenge = await dfnsDelegated.wallets.createWalletInit(createWalletRequest);

	const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials);

	const wallet = await dfnsDelegated.wallets.createWalletComplete(createWalletRequest, {
		challengeIdentifier: challenge.challengeIdentifier,
		firstFactor: assertion,
	});

	return wallet;
}

export async function signMessage(dfnsHost: string, appId: string, rpId: string, dfnsUserToken: string, walletId: string, message: string) {
	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
	const hexMessage = ethers.utils.hashMessage(message)
	const request: GenerateSignatureRequest = {
		walletId: walletId,
		body: { kind: SignatureKind.Hash, hash: hexMessage },
	};

	const challenge = await dfnsDelegated.wallets.generateSignatureInit(request);

	const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials);

	const signatureInit = await dfnsDelegated.wallets.generateSignatureComplete(request, {
		challengeIdentifier: challenge.challengeIdentifier,
		firstFactor: assertion,
	});

	const signature = await waitSignatureSigned(dfnsHost, appId, dfnsUserToken, walletId, signatureInit.id);

	return signature;
}

// export async function transfer(dfnsHost: string, endUserAuthToken: string, walletId: string, from: string, to: string, amount: string) {
// 	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, endUserAuthToken!);
// 	const provider = new ethers.JsonRpcProvider(
// 		"https://quick-aged-glade.matic-testnet.quiknode.pro/ae21f553cba2d4b2560acd824a029a5f4f721397/",
// 	);

// 	const feeData = await provider.getFeeData();

// 	let tx: ethers.TransactionLike = {
// 		to,
// 		value: ethers.parseEther("0.03"),
// 		nonce: await provider.getTransactionCount(from, "latest"),
// 		maxFeePerGas: feeData.maxFeePerGas, // 1 Gwei
// 		maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, // 1 Gwei
// 		chainId: 80001,
// 	};

// 	const gasLimit = await provider.estimateGas(tx);

// 	tx = { ...tx, gasLimit: gasLimit };

// 	const hashedTx = ethers.keccak256(Transaction.from(tx).unsignedSerialized);

// 	const createWalletRequest: GenerateSignatureRequest = {
// 		walletId: walletId,
// 		body: { hash: hashedTx, kind: SignatureKind.Hash },
// 	};

// 	const challenge = await dfnsDelegated.wallets.generateSignatureInit(createWalletRequest);

// 	const assertion = await dfnsWebAuthn.sign(challenge.challenge, challenge.allowCredentials);

// 	const signature = await dfnsDelegated.wallets.generateSignatureComplete(createWalletRequest, {
// 		challengeIdentifier: challenge.challengeIdentifier,
// 		firstFactor: assertion,
// 	});

// 	await waitSignatureSigned(dfnsHost, endUserAuthToken, walletId, signature.id);

// 	const signatureResult = await dfnsDelegated.wallets.getSignature({ walletId, signatureId: signature.id });

// 	const signedTx = Transaction.from({
// 		...tx,
// 		signature: {
// 			r: signatureResult.signature!.r,
// 			s: signatureResult.signature!.s,
// 			v: ethereumRecIdOffset + signatureResult.signature!.recid!,
// 		},
// 	});

// 	let sentTx: ethers.TransactionResponse | null = await provider.broadcastTransaction(signedTx.serialized);

// 	return provider.waitForTransaction(sentTx.hash!);
// }

// export function removeAllCookies() {
// 	CookieStorageService.getInstance().items[DFNS_END_USER_TOKEN].delete();
// 	CookieStorageService.getInstance().items[DFNS_ACTIVE_WALLET_ID].delete();
// 	CookieStorageService.getInstance().items[OAUTH_TOKEN].delete();
// 	return true;
// }

