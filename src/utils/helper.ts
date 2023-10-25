// import { SignatureKind } from "@dfns/sdk/codegen/datamodel/Wallets";
// import { CreateWalletRequest, GenerateSignatureRequest } from "@dfns/sdk/codegen/Wallets";
// import CookieStorageService, { DFNS_ACTIVE_WALLET_ID, DFNS_END_USER_TOKEN, OAUTH_TOKEN } from "../services/CookieStorageService";
// import { ethereumRecIdOffset } from "../common/constant";
import { BlockchainNetwork } from "@dfns/sdk/codegen/datamodel/Wallets";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { arbitrum, bsc, bscTestnet, goerli, mainnet, polygon, polygonMumbai, sepolia } from "@wagmi/core/chains";
import dfnsStore from "../stores/DfnsStore";
import LocalStorageService, { CACHED_WALLET_PROVIDER } from "../services/LocalStorageService";

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

export function waitForEvent<T>(element: HTMLElement, eventName: string): Promise<T> {
	return new Promise((resolve) => {
		element.addEventListener(eventName, (event: any) => {
			resolve(event.detail as T);
		});
	});
}

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

export async function generateSignature(encryptedPrivateKey, message, password, username, encoding = "hex") {
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

	let privateKey;

	try {
		privateKey = await crypto.subtle.unwrapKey(
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
	} catch (e) {
		throw new Error("Invalid password");
	}

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

export function getDefaultTransports(defaultDevice?: "mobile" | "desktop") {
	const isMobile = navigator?.userAgent.indexOf("Mobile") !== -1;

	const defaultTransports = [];

	switch (defaultDevice) {
		case "mobile":
			if (isMobile) {
				defaultTransports.push("internal");
			}
			if (!isMobile) {
				defaultTransports.push("hybrid", "usb", "ble", "nfc");
			}
			break;
		case "desktop":
			if (!isMobile) {
				defaultTransports.push("internal");
			}
			if (isMobile) {
				defaultTransports.push("hybrid", "usb", "ble", "nfc");
			}
			break;
		default:
			defaultTransports.push("internal", "hybrid", "ble", "nfc", "usb");
			break;
	}
	return defaultTransports;
}

export function isHexPrefixed(str: string) {
	return str.slice(0, 2) === "0x";
}

export function getDfnsUsernameFromUserToken(userToken: string) {
	const decodedToken = jwt_decode(userToken) as JwtPayload;
	return decodedToken?.["https://custom/username"];
}

export function disconnectWallet() {
	dfnsStore.state.walletService.close();
	dfnsStore.state.walletService.disconnect();
	LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].delete();
}
