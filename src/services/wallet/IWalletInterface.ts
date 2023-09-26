export interface IWalletData {
	userAddress: string | null;
	publicKey: string | null;
	balance: unknown;
	provider: unknown;
	chainId?: number | null;
}

export enum WalletEvent {
	CONNECTED = "connected",
	DISCONNECTED = "disconnected",
	ROUTE_CHANGED = "routeChanged",
}

export default abstract class IWalletInterface {
	public abstract connect(): Promise<string>;
	public abstract disconnect(): Promise<void>;
	public abstract onChange(event: WalletEvent, callback: (data: any) => void): () => void;
	public abstract signMessage(message: string): Promise<string>;
	public abstract sendTransaction(to: string, value: string, data: string, txNonce?: number): Promise<string>;
	public abstract autoConnect(): Promise<boolean>;
	public abstract getAddress(): string | null;
	public abstract connectWithOAuthToken(oauthToken: string): Promise<string>;
	public abstract showWalletOverview();
	public abstract showSettings();
	public abstract showCreatePasskey();
	public abstract showRecoverySetup();
	public abstract transferTokens(): Promise<string>;
	public abstract isConnected(): Promise<boolean>;
}
