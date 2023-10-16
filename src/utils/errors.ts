export type DfnsContextError =
	| {
			name: string;
			errorName: string;
			serviceName: string;
			message: string;
			causes: any[];
			shouldTriggerInvestigation: boolean;
	  }
	| {
			id: string;
			message: string;
			status: number;
	  };
export type DfnsHttpError = {
	error: DfnsContextError;
};

export class DfnsError extends Error {
	httpStatus: number;
	error: DfnsHttpError;
	context: DfnsContextError;
	constructor(httpStatus: number, context: DfnsContextError) {
		const message = context.message ?? "Dfns Error";

		super(message);
		this.httpStatus = httpStatus;
		this.context = context;
	}
}

export function isDfnsError(err: unknown): err is DfnsError {
	if (err instanceof DfnsError) {
		return true;
	}
	if (typeof err === "object") {
		if ("httpStatus" in err && "context" in err) {
			return true;
		}
	}
	return false;
}

export class TokenExpiredError extends Error {
	constructor() {
		super("Token Expired");
	}
}

export function isTokenExpiredError(err: unknown): err is TokenExpiredError {
	if (err instanceof TokenExpiredError) {
		return true;
	}
	return false;
}

export class WalletDisconnectedError extends Error {
	constructor() {
		super("Wallet Disconnected");
	}
}

export function isWalletDisconnectedError(err: unknown): err is WalletDisconnectedError {
	if (err instanceof WalletDisconnectedError) {
		return true;
	}
	return false;
}
