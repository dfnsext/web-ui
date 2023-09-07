function ab2str(buf) {
	return String.fromCharCode.apply(null, new Uint8Array(buf));
}

async function exportPrivateKey(key: CryptoKey) {
	const exported = await window.crypto.subtle.exportKey("pkcs8", key);
	const exportedAsString = ab2str(exported);
	const exportedAsBase64 = window.btoa(exportedAsString);
	return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
}

async function exportPublicKey(key: CryptoKey) {
	const exported = await window.crypto.subtle.exportKey("spki", key);
	const exportedAsString = ab2str(exported);
	const exportedAsBase64 = window.btoa(exportedAsString);
	return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}

export async function generateEcdsaKey() {
	const ecdsaKey = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
	const ecdsaPublicKey = await exportPublicKey(ecdsaKey.publicKey);
	const ecdsaPrivateKey = await exportPrivateKey(ecdsaKey.privateKey);
	return { publicKey: ecdsaPublicKey, privateKey: ecdsaPrivateKey };
}

export async function generateRsaKey() {
	const rsaKey = await window.crypto.subtle.generateKey(
		{
			name: "RSA-PSS",
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		},
		true,
		["sign", "verify"],
	);
	
	const rsaPublicKey = await exportPublicKey(rsaKey.publicKey);
	const rsaPrivateKey = await exportPrivateKey(rsaKey.privateKey);
	return { publicKey: rsaPublicKey, privateKey: rsaPrivateKey };
}

