class RPCError<T> extends Error {
	public code: number;
	public data?: T;

	constructor(code: number, message: string, data?: T) {
		if (!Number.isInteger(code)) {
			throw new Error('"code" must be an integer.');
		}

		if (!message || typeof message !== "string") {
			throw new Error('"message" must be a nonempty string.');
		}

		super(message);
		this.code = code;
		if (data !== undefined) {
			this.data = data;
		}
	}
}

class ProviderError<T> extends RPCError<T> {
	constructor(code: number, message: string, data?: T) {
		super(code, message, data);
	}
}

export const standardErrorCodes = {
	rpc: {
		invalidInput: -32000,
		resourceNotFound: -32001,
		resourceUnavailable: -32002,
		transactionRejected: -32003,
		methodNotSupported: -32004,
		limitExceeded: -32005,
		parse: -32700,
		invalidRequest: -32600,
		methodNotFound: -32601,
		invalidParams: -32602,
		internal: -32603,
	},
	provider: {
		userRejectedRequest: 4001,
		unauthorized: 4100,
		unsupportedMethod: 4200,
		disconnected: 4900,
		chainDisconnected: 4901,
		unsupportedChain: 4902,
	},
};

export interface ErrorOptions<T> {
	message: string;
	data?: T;
}

export const standardErrors = {
	rpc: {
		invalidInput: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.invalidInput, args.message, args.data),
		resourceNotFound: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.resourceNotFound, args.message, args.data),
		resourceUnavailable: <T>(args: ErrorOptions<T>) =>
			new RPCError(standardErrorCodes.rpc.resourceUnavailable, args.message, args.data),
		transactionRejected: <T>(args: ErrorOptions<T>) =>
			new RPCError(standardErrorCodes.rpc.transactionRejected, args.message, args.data),
		methodNotSupported: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.methodNotSupported, args.message, args.data),
		limitExceeded: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.limitExceeded, args.message, args.data),
		parse: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.parse, args.message, args.data),
		invalidRequest: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.invalidRequest, args.message, args.data),
		methodNotFound: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.methodNotFound, args.message, args.data),
		invalidParams: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.invalidParams, args.message, args.data),
		internal: <T>(args: ErrorOptions<T>) => new RPCError(standardErrorCodes.rpc.internal, args.message, args.data),
	},
	provider: {
		userRejectedRequest: <T>(args: ErrorOptions<T>) =>
			new ProviderError(standardErrorCodes.provider.userRejectedRequest, args.message, args.data),
		unauthorized: <T>(args: ErrorOptions<T>) => new ProviderError(standardErrorCodes.provider.unauthorized, args.message, args.data),
		unsupportedMethod: <T>(args: ErrorOptions<T>) =>
			new ProviderError(standardErrorCodes.provider.unsupportedMethod, args.message, args.data),
		disconnected: <T>(args: ErrorOptions<T>) => new ProviderError(standardErrorCodes.provider.disconnected, args.message, args.data),
		chainDisconnected: <T>(args: ErrorOptions<T>) =>
			new ProviderError(standardErrorCodes.provider.chainDisconnected, args.message, args.data),
		unsupportedChain: <T>(args: ErrorOptions<T>) =>
			new ProviderError(standardErrorCodes.provider.unsupportedChain, args.message, args.data),
	},
};
