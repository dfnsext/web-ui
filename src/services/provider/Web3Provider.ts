export interface Web3Provider {
	request<T>(args: RequestArguments): Promise<T>;
}

export interface RequestArguments {
	method: string; // The RPC method to request
	params?: unknown; // The params of the RPC method, if any
}
