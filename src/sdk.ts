import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";

import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import LocalStorageService, { DFNS_ACTIVE_WALLET, DFNS_CREDENTIALS, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "./services/LocalStorageService";
import { RegisterCompleteResponse } from "./services/api/Register";
import dfnsStore from "./stores/DfnsStore";
import { setActiveLanguage } from "./stores/LanguageStore";
import router, { RouteType } from "./stores/RouterStore";
import { getDfnsDelegatedClient, isDfnsError } from "./utils/dfns";
import { loginWithOAuth } from "./utils/helper";

export const DEFAULT_API_URL = "https://app.dfns.smart-chain.fr";
export const DEFAULT_DFNS_HOST = "https://api.dfns.io";
export const DEFAULT_LANG = "en";

export interface JwtPayload {
	[key: string]: any;
	iss?: string;
	sub?: string;
	aud?: string | string[];
	exp?: number;
	nbf?: number;
	iat?: number;
	jti?: string;
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
	network: string;
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

const overlayStyles: Partial<CSSStyleDeclaration> = {
    position: "fixed",
    top: "0",
    right: "0",
    width: "100%",
    height: "100%",
    borderRadius: "0",
    border: "none",
    zIndex: "2147483647",
};

function applyOverlayStyles(elem: HTMLElement) {
    for (const [cssProperty, value] of Object.entries(overlayStyles)) {
        (elem.style as any)[cssProperty as any] = value;
    }
}

export class DfnsSDK {
	public static instance: DfnsSDK | null = null;

	public dfnsContainer: HTMLElement | null = null;
	private options: Options;

	constructor(sdkOptions: DfnsSDKOptions, reset?: boolean) {
		if (reset) {
			DfnsSDK.instance = null;
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
		applyOverlayStyles(this.dfnsContainer);
		document.body.appendChild(this.dfnsContainer);

		dfnsStore.setValue("apiUrl", this.options.apiUrl);
		dfnsStore.setValue("appName", this.options.appName);
		dfnsStore.setValue("dfnsHost", this.options.dfnsHost);
		dfnsStore.setValue("appId", this.options.appId);
		dfnsStore.setValue("rpId", this.options.rpId);
		dfnsStore.setValue("appLogoUrl", this.options.appLogoUrl);
		dfnsStore.setValue("apiUrl", this.options.apiUrl);
		dfnsStore.setValue("dfnsUserToken", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get() ?? null);
		dfnsStore.setValue("oauthAccessToken", LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get() ?? null);
		dfnsStore.setValue("wallet", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get() ?? null);
		dfnsStore.setValue("credentials", LocalStorageService.getInstance().items[DFNS_CREDENTIALS].get() ?? []);
	}

	public async connectWithOAuthToken(oauthToken: string): Promise<any> {
		let wallet: Wallet | null = null;
		try {
			dfnsStore.setValue("oauthAccessToken", oauthToken);
			const response = await loginWithOAuth(this.options.apiUrl, this.options.appId, this.options.rpId, oauthToken);
			dfnsStore.setValue("dfnsUserToken", response.userAuthToken);
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
				throw error;
			}
		}
		dfnsStore.setValue("wallet", wallet);
		return wallet;
	}

	public async createAccount() {
		this.dfnsContainer.setAttribute("user-creation-authenticator-attachment", this.options.userCreationAuthenticatorAttachment);
		router.navigate(RouteType.CREATE_ACCOUNT);
		const response = await this.waitForEvent<RegisterCompleteResponse>(this.dfnsContainer, "passkeyCreated");
		router.close();
		if (!response) throw new Error("User cancelled connection");
		dfnsStore.setValue("dfnsUserToken", response.userAuthToken);
		return response;
	}

	public async validateWallet(): Promise<Wallet> {
		router.navigate(RouteType.VALIDATE_WALLET);
		this.dfnsContainer.setAttribute("network", this.options.network);
		const response = await this.waitForEvent<Wallet>(this.dfnsContainer, "walletValidated");
		router.close();
		if (!response) throw new Error("User cancelled connection");
		dfnsStore.setValue("wallet", response);
		return response;
	}

	public async waitForWalletValidation(): Promise<any> {
		router.navigate(RouteType.WALLET_VALIDATION);
		const response = await this.waitForEvent(this.dfnsContainer, "walletValidated");
		router.close();
		if (!response) throw new Error("User cancelled connection");
		return response;
	}

	public async signMessage(message: string) {
		router.navigate(RouteType.SIGN_MESSAGE);
		this.dfnsContainer.setAttribute("message-to-sign", message);
		const response = await this.waitForEvent<GetSignatureResponse>(this.dfnsContainer, "signedMessage");
		router.close();
		if (!response) throw new Error("User cancelled signature");
		return response;
	}

	public async showWalletOverview() {
		router.navigate(RouteType.WALLET_OVERVIEW);
	}

	public async showSettings() {
		router.navigate(RouteType.SETTINGS);
	}

	// public async showRecoverySetup() {
	// 	router.navigate(RouteType.RECOVERY_SETUP);
	// }

	public async showCreatePasskey() {
		router.navigate(RouteType.CREATE_PASSKEY);
	}

	public setLanguage(lang: "fr" | "en") {
		setActiveLanguage(lang);
	}

	public disconnect() {
		dfnsStore.disconnect();
	}

	protected waitForEvent<T>(element: HTMLElement, eventName: string): Promise<T> {
		return new Promise((resolve) => {
			element.addEventListener(eventName, (event: any) => {
				resolve(event.detail as T);
			});
		});
	}
}
