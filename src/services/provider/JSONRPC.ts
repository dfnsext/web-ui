export enum JSONRPCMethod {
	dfns_autoConnect = "dfns_autoConnect",
	dfns_connectWithOAuthToken = "dfns_connectWithOAuthToken",
	dfns_disconnect = "dfns_disconnect",
	dfns_getAddress = "dfns_getAddress", // eth_accounts
	dfns_isConnected = "dfns_isConnected",
	dfns_sendTransaction = "dfns_sendTransaction", //  eth_sendTransaction
	dfns_showCreatePasskey = "dfns_showCreatePasskey",
	dfns_showRecoverySetup = "dfns_showRecoverySetup",
	dfns_showSettings = "dfns_showSettings",
	dfns_showWalletOverview = "dfns_showWalletOverview",
	dfns_signMessage = "dfns_signMessage", // eth_sign
	dfns_transferTokens = "dfns_transferTokens",
	eth_accounts = "eth_accounts",
	eth_chainId = "eth_chainId",
	eth_sendTransaction = "eth_sendTransaction",
	eth_sign = "eth_sign",
	personal_sign = "personal_sign",
}

export interface JSONRPCRequest<T = any> {
	jsonrpc: "2.0";
	id: string;
	method: string;
	params: T;
}

export interface JSONRPCResponseError<T = any> {
	code: number;
	message: string;
	data?: T;
}

export interface JSONRPCResponse<T = any, U = any> {
	jsonrpc: "2.0";
	id: string | null;
	result?: T;
	error?: JSONRPCResponseError<U> | null;
}
