
import { DfnsError, Fido2Attestation, UserActionChallengeResponse } from "@dfns/sdk";
// import { SignatureKind } from "@dfns/sdk/codegen/datamodel/Wallets";
// import { CreateWalletRequest, GenerateSignatureRequest } from "@dfns/sdk/codegen/Wallets";
// import CookieStorageService, { DFNS_ACTIVE_WALLET_ID, DFNS_END_USER_TOKEN, OAUTH_TOKEN } from "../services/CookieStorageService";
// import { ethereumRecIdOffset } from "../common/constant";
// import { ethers, Transaction } from "ethers";
import Login from "../services/api/Login";
import Register from "../services/api/Register";
import { WebAuthn } from "@dfns/sdk-webauthn";
import { getDfnsDelegatedClient } from "./dfns";
import { CreateWalletRequest } from "@dfns/sdk/codegen/Wallets";


export async function loginWithOAuth(rpId: string, oauthAccessToken: string) {
	let challenge: UserActionChallengeResponse;
	try {
		challenge = await Login.getInstance().init(oauthAccessToken);
	} catch (error: any) {
		if (error.httpStatus === 401) {
			throw new DfnsError(error.httpStatus, error.message, error.context);
		}
		throw error;
	}
    const dfnsWebAuthn = new WebAuthn({ rpId });

	const assertion = await dfnsWebAuthn.sign(challenge!.challenge, challenge!.allowCredentials);

	return Login.getInstance().complete({
		challengeIdentifier: challenge!.challengeIdentifier,
		firstFactor: assertion,
	});
}
export async function registerWithOAuth(rpId: string, oauthAccessToken: string) {
	const challenge = await Register.getInstance().init(oauthAccessToken);
	let attestation: Fido2Attestation;

    const dfnsWebAuthn = new WebAuthn({ rpId });

	try {
		attestation = await dfnsWebAuthn.create(challenge);
		return Register.getInstance().complete(challenge.temporaryAuthenticationToken, {
			firstFactorCredential: attestation,
		});
	} catch (error: any) {
		throw error;
	}
}

// export async function checkUserHasWallet(dfnsHost: string, endUserAuthToken: string) {
// 	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, endUserAuthToken);
// 	const result = await dfnsDelegated.wallets.listWallets({});
// 	if (result.items.length === 0) return false;
// 	return true;
// }

export async function createWallet(appId: string, rpId: string, dfnsUserToken: string) {
	const dfnsDelegated = getDfnsDelegatedClient(appId, dfnsUserToken);
	const createWalletRequest: CreateWalletRequest = {
		//@ts-ignore
		body: { network: "PolygonMumbai" },
	};

	const challenge = await dfnsDelegated.wallets.createWalletInit(createWalletRequest);

	const dfnsWebAuthn = new WebAuthn({ rpId });

	const assertion = await dfnsWebAuthn.sign(challenge.challenge, challenge.allowCredentials);

	const wallet = await dfnsDelegated.wallets.createWalletComplete(createWalletRequest, {
		challengeIdentifier: challenge.challengeIdentifier,
		firstFactor: assertion,
	});
    
    // TO DO : MOVE TO SDK
	// CookieStorageService.getInstance().items[DFNS_ACTIVE_WALLET_ID].set(wallet.id);
	return wallet;
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
