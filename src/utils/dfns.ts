import {
	DfnsDelegatedApiClient, DfnsError
} from "@dfns/sdk";
import { SignatureStatus, WalletStatus } from "@dfns/sdk/codegen/datamodel/Wallets";
import { dfnsHost } from "../common/constant";
import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";


export function isDfnsError(err: unknown): err is DfnsError {
	return err instanceof DfnsError;
}

export const getDfnsDelegatedClient = (appId: string, dnfsUserToken: string) =>
	new DfnsDelegatedApiClient({
		appId: appId,
		baseUrl: dfnsHost,
		authToken: dnfsUserToken,
	});

function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForWalletActive(appId: string, dnfsUserToken: string, walletId: string) {
	let wallet;
	const dfnsDelegated = getDfnsDelegatedClient(appId, dnfsUserToken);
	do {
		await timeout(1000);
		wallet = await dfnsDelegated.wallets.getWallet({ walletId: walletId });
	} while (wallet.status !== WalletStatus.Active);
	return wallet;
}

export async function waitSignatureSigned(appId: string, dnfsUserToken: string, walletId: string, signatureId: string): Promise<GetSignatureResponse> {
	let signature;
	const dfnsDelegated = getDfnsDelegatedClient(appId, dnfsUserToken);
	do {
		await timeout(1000);
		signature = await dfnsDelegated.wallets.getSignature({ walletId, signatureId });
	} while (signature.status !== SignatureStatus.Signed);
	return signature;
}
