import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";

import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import jwt_decode from "jwt-decode";
import LocalStorageService, { DFNS_ACTIVE_WALLET, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "./services/LocalStorageService";
import { RegisterCompleteResponse } from "./services/api/Register";
import { setActiveLanguage } from "./stores/LanguageStore";
import { setRoute } from "./stores/RouteStore";
import { getDfnsDelegatedClient, isDfnsError } from "./utils/dfns";
import { loginWithOAuth } from "./utils/helper";
import dfnsState from "./stores/DfnsStore";

export const DEFAULT_API_URL = "https://app.stg.dfns-frame.smart-chain.fr/";
export const DEFAULT_DFNS_HOST = "https://api.dfns.ninja";
export const DEFAULT_LANG = "en";

export interface JwtPayload {
	[key: string]: any;
	iss?: string | undefined;
	sub?: string | undefined;
	aud?: string | string[] | undefined;
	exp?: number | undefined;
	nbf?: number | undefined;
	iat?: number | undefined;
	jti?: string | undefined;
}

export interface DfnsSDKOptions {
	appName: string;
	rpId: string;
	appId: string;
	dfnsHost?: string;
	apiUrl?: string;
	loginOptions?: LoginOption[];
	appLogoUrl?: string | null;
	darkMode?: boolean;
	assetsPath?: string;
	shouldShowWalletValidation?: boolean;
	userCreationAuthenticatorAttachment?: AuthenticatorAttachment;
	lang?: "fr" | "en";
}

type Options = NonNullable<DfnsSDKOptions>;

export interface LoginOption {
	type: "social" | "web3";
	name: ESocialLogin;
}

export enum ESocialLogin {
	GOOGLE = "google",
	ACCOR = "accor",
}


export class DfnsSDK {
	public static instance: DfnsSDK | null = null;

	public dfnsContainer: HTMLElement | null = null;
	private removeOnLocalStorageChanged: () => void = () => { };
	private options: Options;

	constructor(sdkOptions: DfnsSDKOptions, reset?: boolean) {
		if (reset) {
			DfnsSDK.instance = null;
			window.removeEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
		}
		if (DfnsSDK.instance) {
			return DfnsSDK.instance;
		}

		this.options = sdkOptions;
		if (!this.options.dfnsHost) {
			this.options.dfnsHost = DEFAULT_DFNS_HOST;
		}
		if (!this.options.apiUrl) {
			this.options.apiUrl = DEFAULT_API_URL;
		}
		if (!this.options.lang) {
			this.options.lang = DEFAULT_LANG;
		}
		DfnsSDK.instance = this;
	}

	public init() {
		setActiveLanguage(this.options.lang);
		this.dfnsContainer = document.createElement("dfns-main");
		this.dfnsContainer.classList.add("dfns-container");
		document.body.appendChild(this.dfnsContainer);

		// this.listenToChanges();
		dfnsState.apiUrl = this.options.apiUrl;
		dfnsState.appId = this.options.appId;
		dfnsState.appName = this.options.appName;
		dfnsState.dfnsHost = this.options.dfnsHost;
		dfnsState.rpId = this.options.rpId;
		dfnsState.dfnsUserToken = LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get() ?? null;
		dfnsState.oauthAccessToken = LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get() ?? null;
		dfnsState.wallet = LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get() ?? null;
	}

	public async connectWithOAuthToken(oauthToken: string): Promise<any> {
		let wallet: Wallet | null = null;
		try {
			dfnsState.oauthAccessToken = oauthToken;
			//LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].set(oauthToken);
			const response = await loginWithOAuth(this.options.apiUrl, this.options.appId, this.options.rpId, oauthToken);
			dfnsState.dfnsUserToken = response.userAuthToken;
			//LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
			const dfnsDelegated = getDfnsDelegatedClient(this.options.dfnsHost, this.options.appId, response.userAuthToken);
			const wallets = await dfnsDelegated.wallets.listWallets({});
			wallet = wallets.items[0];
			if (!wallet) {
				wallet = await this.validateWallet();
				if (this.options.shouldShowWalletValidation) {
					wallet = await this.waitForWalletValidation();
				}
			}
		} catch (error) {
			if (isDfnsError(error) && error.httpStatus === 401) {
				await this.createAccount();
				wallet = await this.validateWallet();
				if (this.options.shouldShowWalletValidation) {
					wallet = await this.waitForWalletValidation();
				}
			} else {
				this.dfnsContainer.style.display = "none";
				throw error;
			}
		}
		this.dfnsContainer.style.display = "none";
		dfnsState.wallet = wallet;
		//LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(wallet);
		return wallet;
	}

	public async isConnected() {
		const dfnsUserToken = dfnsState.dfnsUserToken //LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get();
		let wallet = dfnsState.wallet; //LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get();
		const oauthToken = dfnsState.oauthAccessToken //LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();

		if (!dfnsUserToken || !oauthToken || !wallet) {
			return false;
		}

		const decodedToken = jwt_decode(dfnsUserToken) as JwtPayload;

		const issuedAt = new Date(decodedToken?.iat! * 1000);
		const expiresAt = new Date(decodedToken?.exp! * 1000);
		const now = new Date();

		if (issuedAt < now && now < expiresAt) {
			return true;
		}
		return false;
	}

	public async autoConnect() {
		let wallet = dfnsState.wallet; //LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get();
		const oauthToken = dfnsState.oauthAccessToken;//LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();
		const now = new Date();

		const isConnected = await this.isConnected();
		if (isConnected) {
			return wallet;
		}
		if (!oauthToken) {
			throw new Error("Not connected");
		}

		const decodedOAuthToken = jwt_decode(oauthToken) as JwtPayload;

		const oauthIssuedAt = new Date(decodedOAuthToken?.iat! * 1000);
		const oauthExpiresAt = new Date(decodedOAuthToken?.exp! * 1000);

		if (oauthIssuedAt < now && now < oauthExpiresAt) {
			try {
				const response = await loginWithOAuth(this.options.apiUrl, this.options.appId, this.options.rpId, oauthToken);
				dfnsState.dfnsUserToken = response.userAuthToken; //LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
				if (!wallet) {
					await this.validateWallet();
					if (this.options.shouldShowWalletValidation) {
						wallet = await this.waitForWalletValidation();
					}
				}
				return wallet;
			} catch (err) {
				console.error(err);
			}
		}

		throw new Error("Not connected");
	}

	public async createAccount() {
		this.dfnsContainer.setAttribute("user-creation-authenticator-attachment", this.options.userCreationAuthenticatorAttachment);
		setRoute("create-account");
		const response = await this.waitForEvent<RegisterCompleteResponse>(this.dfnsContainer, "passkeyCreated");
		setRoute(null);
		if (!response) throw new Error("User cancelled connection");
		dfnsState.dfnsUserToken = response.userAuthToken;
		//LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
		return response;
	}

	public async validateWallet(): Promise<Wallet> {
		setRoute("validate-wallet");
		const response = await this.waitForEvent<Wallet>(this.dfnsContainer, "walletValidated");
		setRoute(null);
		if (!response) throw new Error("User cancelled connection");
		dfnsState.wallet = response;
		//LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(response);

		return response;
	}

	public async waitForWalletValidation(): Promise<any> {
		setRoute("wallet-validation");
		const response = await this.waitForEvent(this.dfnsContainer, "walletValidated");
		setRoute(null);
		this.dfnsContainer.removeAttribute("visible");
		this.dfnsContainer.style.display = "none";
		if (!response) throw new Error("User cancelled connection");
		return response;
	}

	public async signMessage(message: string) {
		// await this.autoConnect();
		setRoute("sign-message");
		this.dfnsContainer.setAttribute("message-to-sign", message);
		const response = await this.waitForEvent<GetSignatureResponse>(this.dfnsContainer, "signedMessage");
		setRoute(null);
		if (!response) throw new Error("User cancelled signature");
		return response;
	}

	public async showMenu() {
		setRoute("wallet-overview");
	}

	public async showSettings() {
		setRoute("settings");
	}

	public async showCreatePasskey() {
		setRoute("create-passkey");
	}

	public setLanguage(lang: "fr" | "en") {
		setActiveLanguage(lang);
	}

	public disconnect() {
		dfnsState.dfnsUserToken = null;
		dfnsState.wallet = null;
		dfnsState.oauthAccessToken = null;
		/* 	LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].delete();
			LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].delete();
			LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].delete(); */
	}

	protected waitForEvent<T>(element: HTMLElement, eventName: string): Promise<T> {
		return new Promise((resolve) => {
			element.addEventListener(eventName, (event: any) => {
				resolve(event.detail as T);
			});
		});
	}

	// private listenToChanges() {
	// 	this.removeOnLocalStorageChanged = () => {
	// 		this.dfnsCreateAccountElement.setAttribute(
	// 			"oauth-access-token",
	// 			LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get(),
	// 		);
	// 		this.dfnsValidateWalletElement.setAttribute(
	// 			"dfns-user-token",
	// 			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
	// 		);
	// 		this.dfnsWalletValidationElement.setAttribute(
	// 			"dfns-user-token",
	// 			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
	// 		);
	// 		this.dfnsWalletValidationElement.setAttribute(
	// 			"wallet-id",
	// 			LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id,
	// 		);

	// 		this.dfnsSignMessageElement.setAttribute(
	// 			"wallet-id",
	// 			LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id,
	// 		);

	// 		this.dfnsCreatePasskeyElement.setAttribute(
	// 			"dfns-user-token",
	// 			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
	// 		);

	// 		this.dfnsSignMessageElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());

	// 		this.dfnsSettingsElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());

	// 		this.dfnsWalletOverviewElement.setAttribute(
	// 			"dfns-user-token",
	// 			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
	// 		);

	// 		this.dfnsWalletOverviewElement.setAttribute(
	// 			"wallet-address",
	// 			LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.address,
	// 		);
	// 	};
	// 	window.addEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
	// }
}
