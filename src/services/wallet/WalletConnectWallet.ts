import { BigNumber, ethers } from "ethers";

import { Web3Modal } from "@web3modal/html";

import { BlockchainNetwork } from "@dfns/sdk/codegen/datamodel/Wallets";
import { GetAccountResult, PublicClient, configureChains, createConfig } from "@wagmi/core";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { networkInfo } from "../../common/constant";
import { EventEmitter } from "../EventEmitter";
import IWalletInterface, { WalletEvent } from "./IWalletInterface";
import { networkMapping } from "../../utils/helper";
import { UserRecoveryChallenge } from "@dfns/sdk/codegen/datamodel/Auth";

export interface IWallet {
	userAddress: string | null;
	balance: BigNumber | null;
	chainId: number | null;
	provider: ethers.providers.Web3Provider | null;
}

export default class WalletConnectWallet implements IWalletInterface {
	private static ctx: WalletConnectWallet;
	private removeEvents = () => {};

	private ethereumClient: EthereumClient | null = null;
	private ethersProvider: ethers.providers.Web3Provider | null = null;

	private _web3WalletData: IWallet | null = null;
	private readonly event = new EventEmitter();
	private web3modal: Web3Modal;

	private constructor(
		private projectId: string,
		private network: BlockchainNetwork,
	) {
		const chains = [networkMapping[this.network]];
		const { publicClient } = configureChains(chains, [w3mProvider({ projectId: this.projectId })]);

		const wagmiConfig = createConfig({
			autoConnect: true,
			connectors: w3mConnectors({ projectId: this.projectId, chains }),
			publicClient,
		});

		const ethereumClient = new EthereumClient(wagmiConfig, chains);
		this.ethereumClient = ethereumClient;
		ethereumClient.watchAccount((account) => this.updateProvider(account));
		ethereumClient.watchNetwork((network) => {
			const account = ethereumClient.getAccount();
			if (!account) return;
			this.updateProvider(account);
		});

		this.web3modal = new Web3Modal(
			{
				projectId: this.projectId,
				// explorerRecommendedWalletIds: ["3fecad5e2f0a30aba97edea69ebf015884a9b8a9aec93e66d4b4b695fee1f010"],
			},
			this.ethereumClient,
		);

		WalletConnectWallet.ctx = this;
	}

	public async isConnected(): Promise<boolean> {
		let account = this.ethereumClient?.getAccount();
		do {
			const promise = new Promise((resolve) =>
				setTimeout(() => {
					account = this.ethereumClient?.getAccount();
					resolve(account);
				}, 1000),
			);

			await promise;
		} while (account.status === "reconnecting");
		return this.ethereumClient?.getAccount()?.isConnected ?? false;
	}

	public static getInstance(projectId: string, network: BlockchainNetwork) {
		if (!WalletConnectWallet.ctx) new this(projectId, network);
		if (WalletConnectWallet.ctx.projectId !== projectId || WalletConnectWallet.ctx.network !== network) {
			new this(projectId, network);
		}
		return WalletConnectWallet.ctx;
	}

	private async updateProvider(account: GetAccountResult<PublicClient>) {
		if (!account.isConnected) {
			this.ethersProvider = null;
			await this.updateWalletData();
			return;
		}

		let provider = await account.connector?.getProvider();
		if (!provider) {
			this.disconnect();
		}

		this.ethersProvider = new ethers.providers.Web3Provider(provider);

		// this.initEvents();
		await this.updateWalletData();
	}

	public onChange(event: WalletEvent, callback: (web3WalletData: IWallet) => void) {
		this.event.on(event, callback);
		return () => {
			this.event.off(event, callback);
		};
	}

	public connect() {
		const promise = new Promise<string>(async (resolve) => {
			const autoConnect = await this.autoConnect();
			if (autoConnect) {
				resolve(this.getAddress());
			}
			this.web3modal.openModal();
			this.ethereumClient.watchAccount(async (account) => {
				if (account.address) {
					await this.updateProvider(account);
					resolve(account.address);
				}
			});
		});
		return promise;
	}

	public async disconnect() {
		try {
			await this.ethereumClient?.disconnect();
			this._web3WalletData = null;
		} catch (e) {
			console.warn(e);
		}
	}

	private async switchNetwork(depth: number = 0): Promise<void> {
		const requester = this.ethersProvider?.provider.request;
		if (!requester) return;
		try {
			await requester({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: networkInfo[this.network].chainId }],
			});
		} catch (e) {
			if (depth > 0) return;
			await this.addNetwork();
			return this.switchNetwork(depth + 1);
		}
	}

	private async addNetwork(): Promise<void> {
		const requester = this.ethersProvider?.provider.request;
		if (!requester) return;
		try {
			await requester({
				method: "wallet_addEthereumChain",
				params: [networkInfo[this.network]],
			});
		} catch (e) {
			// Nothing to do, either the user wallet does not support this method or the user rejected the request
		}
	}

	public getAddress(): string {
		return this._web3WalletData.userAddress;
	}

	public signMessage(message: string): Promise<string> {
		return this.ethersProvider.getSigner().signMessage(message);
	}
	public async sendTransaction(to: string, value: string, data: string, txNonce?: number): Promise<string> {
		const signer = this.ethersProvider.getSigner();
		return (await signer.sendTransaction({ to, value, data, nonce: txNonce })).hash;
	}
	public async autoConnect() {
		let account = this.ethereumClient?.getAccount();
		do {
			const promise = new Promise((resolve) =>
				setTimeout(() => {
					account = this.ethereumClient?.getAccount();
					resolve(account);
				}, 1000),
			);

			await promise;
		} while (account.status === "reconnecting");

		if (account.isConnected && account.address) {
			await this.updateProvider(account);
		}
		if (!account.isConnected) {
			return false;
		}
		return true;
	}

	public connectWithOAuthToken(oauthToken: string): Promise<any> {
		throw new Error("Method not implemented.");
	}
	public showWalletOverview() {
		throw new Error("Method not implemented.");
	}
	public showSettings() {
		throw new Error("Method not implemented.");
	}
	public showCreatePasskey() {
		throw new Error("Method not implemented.");
	}
	public showRecoverySetup() {
		throw new Error("Method not implemented.");
	}

	public transferTokens(): Promise<string> {
		throw new Error("Method not implemented.");
	}

	private async updateWalletData() {
		const userAddress: string | null = (await this.ethersProvider?.listAccounts())?.[0] ?? null;
		const balance: BigNumber | null = userAddress ? (await this.ethersProvider?.getBalance(userAddress)) ?? null : null;
		const web3Event: IWallet = {
			userAddress: userAddress,
			chainId: (await this.ethersProvider?.getNetwork())?.chainId ?? null,
			balance: balance,
			provider: this.ethersProvider,
		};
		this._web3WalletData = web3Event;
		this.event.emit("web3modal-change", web3Event);
	}

	public async getProvider() {
		let account = this.ethereumClient?.getAccount();
		let provider = await account.connector?.getProvider();
		return provider;
	}

	public close(): void {
		this.web3modal.closeModal();
	}

	public recoverAccount(apiUrl: string, dfnsHost: string, appId: string, oauthAccessToken: string, challenge: UserRecoveryChallenge, recoveryCode: string, recoveryCredId: string) {
		throw new Error("Method not implemented.");
	}

	// private initEvents(): void {
	// 	this.removeEvents();
	// 	const anyChanged = () => {
	// 		console.log("anyChanged");
	// 		this.updateWalletData();
	// 	};

	// 	this.ethersProvider?.on("accountsChanged", anyChanged);
	// 	this.ethersProvider?.on("chainChanged", anyChanged);
	// 	this.ethersProvider?.on("connect", anyChanged);
	// 	this.ethersProvider?.on("disconnect", anyChanged);

	// 	this.removeEvents = () => {
	// 		if (this.ethersProvider?.removeAllListeners) {
	// 			this.ethersProvider?.removeAllListeners();
	// 		}
	// 	};
	// }
}
