import { EventEmitter } from "eventemitter3";
import { RequestArguments, Web3Provider } from "./Web3Provider";
import { standardErrors } from "./Errors";
import { JSONRPCMethod, JSONRPCRequest, JSONRPCResponse, JSONRPCResponseError } from "./JSONRPC";
import DfnsWallet from "../wallet/DfnsWallet";
import dfnsStore from "../../stores/DfnsStore";
import { networkInfo } from "../../common/constant";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";

export class DfnsWalletProvider extends EventEmitter implements Web3Provider {
	private static walletInstance: DfnsWallet;
	private static jsonRpcProvider: ethers.providers.JsonRpcProvider;

	public constructor(dfnsWalletInstance: DfnsWallet) {
		super();
		DfnsWalletProvider.walletInstance = dfnsWalletInstance;
		DfnsWalletProvider.jsonRpcProvider = new ethers.providers.JsonRpcProvider(networkInfo[dfnsStore.state.network].rpcUrls[0]);
	}

	public async request<T>(args: RequestArguments): Promise<T> {
		if (!args || typeof args !== "object" || Array.isArray(args)) {
			throw standardErrors.rpc.invalidRequest({
				message: "Expected a single, non-array, object argument.",
				data: args,
			});
		}

		const { method, params } = args;

		if (typeof method !== "string" || method.length === 0) {
			throw standardErrors.rpc.invalidRequest({
				message: "args.method must be a non-empty string.",
				data: args,
			});
		}

		if (params !== undefined && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
			throw standardErrors.rpc.invalidRequest({
				message: "'args.params' must be an object or array if provided.",
				data: args,
			});
		}

		const newParams = params === undefined ? [] : params;

		const result = await this._sendRequest({
			jsonrpc: "2.0",
			id: uuidv4(),
			method,
			params: newParams,
		});

		return result.result as T;
	}

	private async _sendRequest(request: JSONRPCRequest): Promise<JSONRPCResponse> {
		const response: JSONRPCResponse = {
			jsonrpc: "2.0",
			id: request.id ?? null,
		};

		try {
			response.result = await this._handleMethods(request);
		} catch (error) {
			response.error = error as JSONRPCResponseError;
		}

		if (response.result === undefined && !response.error) {
			const message = `The method ${request.method} is not supported.`;
			response.error = standardErrors.rpc.methodNotSupported({ message });
		}

		return response;
	}

	private async _handleMethods(request: JSONRPCRequest): Promise<any> {
		const { method } = request;
		const params = request.params || [];

		switch (method) {
			case JSONRPCMethod.dfns_autoConnect:
				return this._dfns_autoConnect();
			case JSONRPCMethod.dfns_connectWithOAuthToken:
				return this._dfns_connectWithOAuthToken(params[0]);
			case JSONRPCMethod.dfns_disconnect:
				return this._dfns_disconnect();
			case JSONRPCMethod.dfns_getAddress:
				return this._dfns_getAddress();
			case JSONRPCMethod.dfns_isConnected:
				return this._dfns_isConnected();
			case JSONRPCMethod.dfns_sendTransaction:
				return this._dfns_sendTransaction(params[0], params[1], params[2], params[3]);
			case JSONRPCMethod.dfns_showCreatePasskey:
				return this._dfns_showCreatePasskey();
			case JSONRPCMethod.dfns_showRecoverySetup:
				return this._dfns_showRecoverySetup();
			case JSONRPCMethod.dfns_showSettings:
				return this._dfns_showSettings();
			case JSONRPCMethod.dfns_showWalletOverview:
				return this._dfns_showWalletOverview();
			case JSONRPCMethod.dfns_signMessage:
				return this._dfns_signMessage(params[0]);
			case JSONRPCMethod.dfns_transferTokens:
				return this._dfns_transferTokens();
			case JSONRPCMethod.eth_accounts:
				return this._eth_accounts();
			case JSONRPCMethod.eth_sendTransaction:
				return this._dfns_sendTransaction(params[0], params[1], params[2], params[3]);
			case JSONRPCMethod.eth_sign:
				return this._eth_sign(params[0], params[1]);
			case JSONRPCMethod.personal_sign:
				return this._eth_sign(params[1], params[0]);
			case JSONRPCMethod.eth_chainId:
				return this._eth_chainId();
			default:
				return this._jsonRpcProviderRequest(request);
		}
	}

	private static _getChainId(): string | null {
		const network = dfnsStore.state.network;

		if (network === null) return null;

		return networkInfo[network]?.chainId ?? null;
	}

	private async _dfns_autoConnect(): Promise<boolean> {
		const result = await DfnsWalletProvider.walletInstance.autoConnect();

		if (result === true) {
			const chainId = DfnsWalletProvider._getChainId();
			this.emit("connect", { chainId });
		}

		return result;
	}

	private async _dfns_connectWithOAuthToken(token: string): Promise<string> {
		const result = await DfnsWalletProvider.walletInstance.connectWithOAuthToken(token);

		if (result) {
			const chainId = DfnsWalletProvider._getChainId();
			this.emit("connect", { chainId });
		}

		return result;
	}

	private async _dfns_disconnect(): Promise<true> {
		await DfnsWalletProvider.walletInstance.disconnect();
		this.emit("disconnect", { error: standardErrors.provider.disconnected });
		return true;
	}

	private async _dfns_getAddress(): Promise<string | null> {
		return DfnsWalletProvider.walletInstance.getAddress();
	}

	private async _dfns_isConnected(): Promise<boolean> {
		return DfnsWalletProvider.walletInstance.isConnected();
	}

	private async _dfns_sendTransaction(to: string, value: string, data: string, txNonce?: number): Promise<string> {
		return DfnsWalletProvider.walletInstance.sendTransaction(to, value, data, txNonce);
	}

	private async _dfns_showCreatePasskey(): Promise<true> {
		await DfnsWalletProvider.walletInstance.showCreatePasskey();
		return true;
	}

	private async _dfns_showRecoverySetup(): Promise<true> {
		await DfnsWalletProvider.walletInstance.showRecoverySetup();
		return true;
	}

	private async _dfns_showSettings(): Promise<true> {
		await DfnsWalletProvider.walletInstance.showSettings();
		return true;
	}

	private async _dfns_showWalletOverview(): Promise<true> {
		await DfnsWalletProvider.walletInstance.showWalletOverview();
		return true;
	}

	private async _dfns_signMessage(message: string): Promise<string> {
		return DfnsWalletProvider.walletInstance.signMessage(message);
	}

	private async _dfns_transferTokens(): Promise<string> {
		return DfnsWalletProvider.walletInstance.transferTokens();
	}

	private async _eth_accounts(): Promise<string[]> {
		const address = DfnsWalletProvider.walletInstance.getAddress();
		return address ? [address] : [];
	}

	private async _eth_chainId(): Promise<string | undefined> {
		return DfnsWalletProvider._getChainId() ?? undefined;
	}

	private async _eth_sign(address: string, message: string): Promise<string> {
		const ownAddress = DfnsWalletProvider.walletInstance.getAddress();
		console.log("address", address)
		console.log("message", message)
		if (address !== ownAddress) {
			throw standardErrors.provider.unauthorized({
				message: `The address ${address} cannot be used to sign messages.`,
			});
		}

		return DfnsWalletProvider.walletInstance.signMessage(message);
	}

	private async _jsonRpcProviderRequest(request: JSONRPCRequest): Promise<any> {
		const result = await DfnsWalletProvider.jsonRpcProvider.send(request.method, request.params);
		return result;
	}
}
