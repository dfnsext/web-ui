import { Signature, TypedDataDomain, TypedDataField } from "ethers";

export interface IWalletData {
	userAddress: string | null;
	publicKey: string | null;
	balance: unknown;
	provider: unknown;
	chainId?: number | null;
}

export default interface IWalletInterface {
	getWalletData(): IWalletData;

	connect(): Promise<any>;

	connectTo(walletName: string, idpHint?: string): Promise<any>;

	disconnect(): Promise<void>;

	onChange(callback: (data: any) => void): () => void;

	autoConnect(): Promise<boolean>;

	signMessage(message: string): Promise<string>;

	signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<Signature>;

	sendTransaction(tx: any): Promise<any>;
}
