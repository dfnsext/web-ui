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
import { formatUnits } from "ethers/lib/utils";
import { getTokenIcon } from "./tokensIcons";
import { convertCryptoToFiat } from "./binance";

import dfnsStore from "../stores/DfnsStore";
import { ITokenInfo } from "../common/interfaces/ITokenInfo";
import { arbitrum, bsc, bscTestnet, goerli, mainnet, polygon, polygonMumbai, sepolia } from "@wagmi/core/chains";
import isHexPrefixed from "is-hex-prefixed";

export const networkMapping = {
	[BlockchainNetwork.Polygon]: polygon,
	[BlockchainNetwork.PolygonMumbai]: polygonMumbai,
	[BlockchainNetwork.Ethereum]: mainnet,
	[BlockchainNetwork.EthereumSepolia]: sepolia,
	[BlockchainNetwork.EthereumGoerli]: goerli,
	[BlockchainNetwork.ArbitrumOne]: arbitrum,
	[BlockchainNetwork.Bsc]: bsc,
	[BlockchainNetwork.BscTestnet]: bscTestnet,
};

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

	const defaultTransports = getDefaultTransports();

	const assertion = await sign(rpId, challenge!.challenge, challenge!.allowCredentials, defaultTransports);

	return Login.getInstance(apiUrl, appId).complete({
		challengeIdentifier: challenge!.challengeIdentifier,
		firstFactor: assertion,
	});
}

export async function registerWithOAuth(apiUrl: string, appId: string, oauthAccessToken: string, device?: "desktop" | "mobile") {
	let challenge;
	try {
		challenge = await Register.getInstance(apiUrl, appId).init(oauthAccessToken);
	} catch (error) {
		if (error.httpStatus === 401 && error.context?.message === "User already exists.") {
			challenge = await Register.getInstance(apiUrl, appId).restart(oauthAccessToken);
		}
	}
	try {
		const isMobile = navigator?.userAgent.indexOf("Mobile") !== -1;

		let authenticatorAttachment;

		if (device === "mobile") {
			authenticatorAttachment = isMobile ? "platform" : "cross-platform";
		}

		if (device === "desktop") {
			authenticatorAttachment = !isMobile ? "platform" : "cross-platform";
		}

		const attestation = await create(challenge, authenticatorAttachment as AuthenticatorAttachment);
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

export async function createWallet(dfnsHost: string, appId: string, rpId: string, dfnsUserToken: string, network: BlockchainNetwork) {
	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
	const createWalletRequest: CreateWalletRequest = {
		body: { network },
	};

	const challenge = await dfnsDelegated.wallets.createWalletInit(createWalletRequest);

	const defaultTransports = getDefaultTransports();

	const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);

	const wallet = await dfnsDelegated.wallets.createWalletComplete(createWalletRequest, {
		challengeIdentifier: challenge.challengeIdentifier,
		firstFactor: assertion,
	});

	return wallet;
}

export async function signMessage(dfnsHost: string, appId: string, rpId: string, dfnsUserToken: string, walletId: string, message: string) {
	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
	const hexMessage = ethers.utils.hashMessage(message);
	const request: GenerateSignatureRequest = {
		walletId: walletId,
		body: { kind: SignatureKind.Hash, hash: hexMessage },
	};

	const challenge = await dfnsDelegated.wallets.generateSignatureInit(request);

	const defaultTransports = getDefaultTransports();

	const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);

	const signatureInit = await dfnsDelegated.wallets.generateSignatureComplete(request, {
		challengeIdentifier: challenge.challengeIdentifier,
		firstFactor: assertion,
	});

	const signature = await waitSignatureSigned(dfnsHost, appId, dfnsUserToken, walletId, signatureInit.id);

	return signature;
}

export function waitForEvent<T>(element: HTMLElement, eventName: string): Promise<T> {
	return new Promise((resolve) => {
		element.addEventListener(eventName, (event: any) => {
			resolve(event.detail as T);
		});
	});
}
export async function fetchAssets(dfnsHost: string, appId: string, dfnsUserToken: string, walletId: string, lang: string, chain: string) {
	const tokenList: ITokenInfo[] = [];
	try {
		const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
		const assets = (await dfnsDelegated.wallets.getWalletAssets({ walletId })).assets;
		dfnsStore.setValue("assets", assets);
		for (let i = 0; i < assets.length; i++) {
			const asset = assets[i];
			let symbol = i == 0 ? networkMapping[chain].nativeCurrency.symbol : asset.symbol;
			const balance = formatUnits(asset.balance, asset.decimals);
			const token = await getTokenIcon(asset.contract, chain.toLowerCase());
			tokenList.push({
				balance: balance,
				symbol,
				icon: token,
				fiatValue: await convertCryptoToFiat(balance, lang, symbol),
				contract: asset.contract,
				decimals: asset.decimals,
			});
		}

		return tokenList;
	} catch (error) {
		console.error(error);
	}
}

// export async function transfer(dfnsHost: string, endUserAuthToken: string, walletId: string, from: string, to: string, amount: string) {
// 	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, endUserAuthToken!);
// 	const provider = new ethers.JsonRpcProvider(
// 		"https://quick-aged-glade.matic-testnet.quiknode.pro/ae21f553cba2d4b2560acd824a029a5f4f721397/",
// 	);

// 	const feeData = await provider.getFeeData();

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

function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer);
	return btoa(String.fromCharCode(...bytes));
}

function arrayBufferToBase64Url(buffer) {
	return arrayBufferToBase64(buffer).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function arrayBufferToHex(buffer) {
	const bytes = new Uint8Array(buffer);
	return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function base64ToArrayBuffer(base64) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}

async function usernameToSalt(username) {
	const normalizedUsername = username.toLowerCase().trim();
	const usernameHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalizedUsername));
	return new Uint8Array(usernameHash);
}

function minimizeBigInt(value) {
	if (value.length === 0) {
		return value;
	}
	const minValue = [0, ...value];
	for (let i = 0; i < minValue.length; ++i) {
		if (minValue[i] === 0) {
			continue;
		}
		if (minValue[i] > 0x7f) {
			return minValue.slice(i - 1);
		}
		return minValue.slice(i);
	}
	return new Uint8Array([0]);
}

function rawSignatureToAns1(rawSignature) {
	if (rawSignature.length !== 64) {
		return new Uint8Array([0]);
	}
	const r = rawSignature.slice(0, 32);
	const s = rawSignature.slice(32);

	const minR = minimizeBigInt(r);
	const minS = minimizeBigInt(s);

	return new Uint8Array([0x30, minR.length + minS.length + 4, 0x02, minR.length, ...minR, 0x02, minS.length, ...minS]);
}

async function generateSignature(encryptedPrivateKey, message, password, username, encoding = "hex") {
	const salt = await usernameToSalt(username);
	const { key: base64Key, iv: base64Iv } = JSON.parse(atob(encryptedPrivateKey));
	const iv = base64ToArrayBuffer(base64Iv);
	const key = base64ToArrayBuffer(base64Key);

	const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, [
		"deriveBits",
		"deriveKey",
	]);
	const unwrappingKey = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["wrapKey", "unwrapKey"],
	);

	const privateKey = await crypto.subtle.unwrapKey(
		"pkcs8",
		key,
		unwrappingKey,
		{
			name: "AES-GCM",
			iv: iv,
		},
		{ name: "ECDSA", namedCurve: "P-256" },
		true,
		["sign"],
	);

	const signature = await crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, privateKey, new TextEncoder().encode(message));

	if (encoding === "hex") {
		return arrayBufferToHex(rawSignatureToAns1(new Uint8Array(signature)));
	} else if (encoding === "base64url") {
		return arrayBufferToBase64Url(rawSignatureToAns1(new Uint8Array(signature)));
	}
	throw new Error("encoding not supported.");
}

async function exportPublicKeyInPemFormat(key) {
	const exported = await crypto.subtle.exportKey("spki", key);
	const pem = `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(exported)}\n-----END PUBLIC KEY-----`;
	return pem;
}

async function generateEncryptedPrivateKeyAndPublicKey(password, username) {
	const salt = await usernameToSalt(username);
	const iv = crypto.getRandomValues(new Uint8Array(16));

	const keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);

	const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, [
		"deriveBits",
		"deriveKey",
	]);

	const wrappingKey = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["wrapKey", "unwrapKey"],
	);

	const encryptedPrivateKey = await crypto.subtle.wrapKey("pkcs8", keyPair.privateKey, wrappingKey, {
		name: "AES-GCM",
		iv,
	});
	const pemPublicKey = await exportPublicKeyInPemFormat(keyPair.publicKey);

	const privateKey = btoa(
		JSON.stringify({
			key: arrayBufferToBase64(encryptedPrivateKey),
			iv: arrayBufferToBase64(iv),
		}),
	);

	return {
		encryptedPrivateKey: privateKey,
		pemPublicKey: pemPublicKey,
	};
}

const generateRecoveryKey = () => {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const uuid1 = crypto.randomUUID().replace(/-/g, "");
	const uuid2 = crypto.randomUUID().replace(/-/g, "");

	let password = "";
	for (let i = 0; i < uuid1.length; ++i) {
		const key = parseInt(uuid1[i], 16) + (parseInt(uuid2[i]) < 8 ? 0 : 16);
		password += alphabet[key];
	}
	return (
		"D1-" +
		password.substring(0, 6) +
		"-" +
		password.substring(6, 11) +
		"-" +
		password.substring(11, 16) +
		"-" +
		password.substring(16, 21) +
		"-" +
		password.substring(21, 26) +
		"-" +
		password.substring(26)
	);
};

export const generateRecoveryKeyCredential = async (username, clientData) => {
	const recoveryKey = generateRecoveryKey();
	const { encryptedPrivateKey, pemPublicKey } = await generateEncryptedPrivateKeyAndPublicKey(recoveryKey, username);

	const clientDataHash = arrayBufferToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clientData)));
	const signature = await generateSignature(
		encryptedPrivateKey,
		JSON.stringify({
			clientDataHash: clientDataHash,
			publicKey: pemPublicKey,
		}),
		recoveryKey,
		username,
	);

	const attestationData = JSON.stringify({
		publicKey: pemPublicKey,
		signature: signature,
		algorithm: "SHA256",
	});

	const privateKeyHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(encryptedPrivateKey));

	return {
		type: "encryptedPrivateKeyAndPublicKey",
		encryptedPrivateKey,
		attestationData,
		recoveryKey,
		credentialId: arrayBufferToBase64Url(privateKeyHash),
	};
};

export const msgHexToText = (hex) => {
	try {
		const stripped = stripHexPrefix(hex);
		const buff = Buffer.from(stripped, "hex");
		return buff.length === 32 ? hex : buff.toString("utf8");
	} catch (e) {
		return hex;
	}
};

export function stripHexPrefix(str: string) {
	if (typeof str !== "string") {
		return str;
	}
	return isHexPrefixed(str) ? str.slice(2) : str;
}

export function getDefaultTransports() {
	const isMobile = navigator?.userAgent.indexOf("Mobile") !== -1;

	const defaultTransports = [];

	switch (dfnsStore.state.defaultDevice) {
		case "mobile":
			if (isMobile) {
				defaultTransports.push("internal");
			}
			if (!isMobile) {
				defaultTransports.push("hybrid");
			}
			break;
		case "desktop":
			if (!isMobile) {
				defaultTransports.push("internal");
			}
			if (isMobile) {
				defaultTransports.push("hybrid");
			}
			break;
		case null:
			defaultTransports.push("internal", "hybrid", "ble", "nfc");
			break;
	}
	return defaultTransports
}
