import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";

import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import jwt_decode from "jwt-decode";
import LocalStorageService, { DFNS_ACTIVE_WALLET, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "./services/LocalStorageService";
import { RegisterCompleteResponse } from "./services/api/Register";
import { getDfnsDelegatedClient, isDfnsError } from "./utils/dfns";
import { CreatePasskeyAction, SettingsAction, WalletOverviewAction } from "./utils/enums/actions-enum";
import { loginWithOAuth } from "./utils/helper";
import { setActiveLanguage } from "./services/store/language-store";

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
	zIndex: "214",
};

function applyOverlayStyles(elem: HTMLElement) {
	for (const [cssProperty, value] of Object.entries(overlayStyles)) {
		(elem.style as any)[cssProperty as any] = value;
	}
}

export class DfnsSDK {
	public static instance: DfnsSDK | null = null;
	public dfnsCreateAccountElement: HTMLElement | null = null;
	public dfnsValidateWalletElement: HTMLElement | null = null;
	public dfnsWalletValidationElement: HTMLElement | null = null;
	public dfnsSignMessageElement: HTMLElement | null = null;
	public dfnsSettingsElement: HTMLElement | null = null;
	public dfnsCreatePasskeyElement: HTMLElement | null = null;
	public dfnsWalletOverviewElement: HTMLElement | null = null;
	public dfnsContainer: HTMLElement | null = null;
	private removeOnLocalStorageChanged: () => void = () => {};
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
		applyOverlayStyles(this.dfnsContainer);

		/** Init Create Account Element */
		this.dfnsCreateAccountElement = document.createElement("dfns-create-account");
		this.dfnsContainer.setAttribute("assets-path", this.options.assetsPath);
		this.dfnsCreateAccountElement.setAttribute("oauth-access-token", LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get());
		this.dfnsCreateAccountElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsCreateAccountElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsCreateAccountElement.setAttribute("app-id", this.options.appId);
		this.dfnsCreateAccountElement.setAttribute("rp-id", this.options.rpId);
		this.dfnsContainer.appendChild(this.dfnsCreateAccountElement);

		/** Init Vailidate Wallet Element */
		this.dfnsValidateWalletElement = document.createElement("dfns-validate-wallet");
		this.dfnsValidateWalletElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
		this.dfnsValidateWalletElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsValidateWalletElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsValidateWalletElement.setAttribute("app-id", this.options.appId);
		this.dfnsValidateWalletElement.setAttribute("rp-id", this.options.rpId);
		this.dfnsContainer.appendChild(this.dfnsValidateWalletElement);

		/** Init Wallet Validation Element */
		this.dfnsWalletValidationElement = document.createElement("dfns-wallet-validation");
		this.dfnsWalletValidationElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsWalletValidationElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsWalletValidationElement.setAttribute("app-id", this.options.appId);
		this.dfnsWalletValidationElement.setAttribute("rp-id", this.options.rpId);

		this.dfnsWalletValidationElement.setAttribute(
			"dfns-user-token",
			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
		);
		this.dfnsWalletValidationElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id);

		this.dfnsContainer.appendChild(this.dfnsWalletValidationElement);

		/** Init Sign Message Element */
		this.dfnsSignMessageElement = document.createElement("dfns-sign-message");
		this.dfnsSignMessageElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsSignMessageElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsSignMessageElement.setAttribute("app-id", this.options.appId);
		this.dfnsSignMessageElement.setAttribute("rp-id", this.options.rpId);
		this.dfnsSignMessageElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
		this.dfnsSignMessageElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id);

		this.dfnsContainer.appendChild(this.dfnsSignMessageElement);

		/** Init Settings Element */
		this.dfnsSettingsElement = document.createElement("dfns-settings");
		this.dfnsSettingsElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
		this.dfnsSettingsElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsSettingsElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsSettingsElement.setAttribute("app-id", this.options.appId);
		this.dfnsSettingsElement.setAttribute("rp-id", this.options.rpId);
		this.dfnsContainer.appendChild(this.dfnsSettingsElement);

		/** Init Create passkey Element */
		this.dfnsCreatePasskeyElement = document.createElement("dfns-create-passkey");
		this.dfnsCreatePasskeyElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
		this.dfnsCreatePasskeyElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsCreatePasskeyElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsCreatePasskeyElement.setAttribute("app-id", this.options.appId);
		this.dfnsCreatePasskeyElement.setAttribute("rp-id", this.options.rpId);
		this.dfnsContainer.appendChild(this.dfnsCreatePasskeyElement);

		/** Init Wallet Overview Element */
		this.dfnsWalletOverviewElement = document.createElement("dfns-wallet-overview");
		this.dfnsWalletOverviewElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
		this.dfnsWalletOverviewElement.setAttribute("api-url", this.options.apiUrl);
		this.dfnsWalletOverviewElement.setAttribute("dfns-host", this.options.dfnsHost);
		this.dfnsWalletOverviewElement.setAttribute("app-id", this.options.appId);
		this.dfnsWalletOverviewElement.setAttribute("rp-id", this.options.rpId);
		this.dfnsWalletOverviewElement.setAttribute(
			"wallet-address",
			LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.address,
		);
		this.dfnsContainer.appendChild(this.dfnsWalletOverviewElement);

		document.body.appendChild(this.dfnsContainer);

		this.listenToChanges();
	}

	public async connectWithOAuthToken(oauthToken: string): Promise<any> {
		let wallet: Wallet | null = null;
		try {
			LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].set(oauthToken);
			const response = await loginWithOAuth(this.options.apiUrl, this.options.appId, this.options.rpId, oauthToken);
			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
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
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(wallet);
		return wallet;
	}

	public async isConnected() {
		const dfnsUserToken = LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get();
		let wallet = LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get();
		const oauthToken = LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();

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
		let wallet = LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get();
		const oauthToken = LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();
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
				LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
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
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsCreateAccountElement.setAttribute("visible", "true");
		const response = await this.waitForEvent<RegisterCompleteResponse>(this.dfnsCreateAccountElement, "passkeyCreated");
		this.dfnsCreateAccountElement.removeAttribute("visible");
		this.dfnsContainer.removeAttribute("visible");
		this.dfnsContainer.style.display = "none";
		if (!response) throw new Error("User cancelled connection");
		LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
		return response;
	}

	public async validateWallet(): Promise<Wallet> {
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsValidateWalletElement.setAttribute("visible", "true");
		const response = await this.waitForEvent<Wallet>(this.dfnsValidateWalletElement, "walletValidated");
		this.dfnsValidateWalletElement.removeAttribute("visible");
		this.dfnsContainer.removeAttribute("visible");
		this.dfnsContainer.style.display = "none";
		if (!response) throw new Error("User cancelled connection");
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(response);

		return response;
	}

	public async waitForWalletValidation(): Promise<any> {
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsWalletValidationElement.setAttribute("visible", "true");
		const response = await this.waitForEvent(this.dfnsWalletValidationElement, "walletValidated");
		this.dfnsWalletValidationElement.removeAttribute("visible");
		this.dfnsContainer.removeAttribute("visible");
		this.dfnsContainer.style.display = "none";
		if (!response) throw new Error("User cancelled connection");
		return response;
	}

	public async signMessage(message: string) {
		// await this.autoConnect();
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsSignMessageElement.setAttribute("visible", "true");
		this.dfnsSignMessageElement.setAttribute("message", message);
		const response = await this.waitForEvent<GetSignatureResponse>(this.dfnsSignMessageElement, "signedMessage");
		this.dfnsSignMessageElement.removeAttribute("visible");
		this.dfnsContainer.removeAttribute("visible");
		this.dfnsContainer.style.display = "none";
		if (!response) throw new Error("User cancelled signature");
		return response;
	}

	public async showMenu() {
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsWalletOverviewElement.setAttribute("visible", "true");
		const action = await this.waitForEvent<WalletOverviewAction>(this.dfnsWalletOverviewElement, "action");

		switch (action) {
			case WalletOverviewAction.CREATE_PASSKEY:
				this.dfnsWalletOverviewElement.removeAttribute("visible");
				await this.showCreatePasskey();
				break;
			case WalletOverviewAction.SETTINGS:
				this.dfnsWalletOverviewElement.removeAttribute("visible");
				await this.showSettings();
				break;
			case WalletOverviewAction.CLOSE:
				this.dfnsWalletOverviewElement.removeAttribute("visible");
				this.dfnsContainer.removeAttribute("visible");
				this.dfnsContainer.style.display = "none";
				break;
		}
	}

	public async showSettings() {
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsSettingsElement.setAttribute("visible", "true");
		const action = await this.waitForEvent<SettingsAction>(this.dfnsSettingsElement, "action");

		switch (action) {
			case SettingsAction.CREATE_PASSKEY:
				this.dfnsSettingsElement.removeAttribute("visible");
				await this.showCreatePasskey();
				break;

			case SettingsAction.BACK:
				this.dfnsSettingsElement.removeAttribute("visible");
				await this.showMenu();
				break;
			case SettingsAction.CLOSE:
				this.dfnsSettingsElement.removeAttribute("visible");
				this.dfnsContainer.removeAttribute("visible");
				this.dfnsContainer.style.display = "none";
		}
	}

	public async showCreatePasskey() {
		this.dfnsContainer.style.display = "block";
		this.dfnsContainer.setAttribute("visible", "true");
		this.dfnsCreatePasskeyElement.setAttribute("visible", "true");
		const action = await this.waitForEvent<CreatePasskeyAction>(this.dfnsCreatePasskeyElement, "action");

		switch (action) {
			case CreatePasskeyAction.BACK:
				this.dfnsCreatePasskeyElement.removeAttribute("visible");
				await this.showSettings();
				break;
			case CreatePasskeyAction.CLOSE:
				this.dfnsCreatePasskeyElement.removeAttribute("visible");
				this.dfnsContainer.removeAttribute("visible");
				this.dfnsContainer.style.display = "none";
				break;
		}
	}

	public setLanguage(lang: "fr" | "en") {
		setActiveLanguage(lang);
	}

	public disconnect() {
		LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].delete();
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].delete();
		LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].delete();
	}

	protected waitForEvent<T>(element: HTMLElement, eventName: string): Promise<T> {
		return new Promise((resolve) => {
			element.addEventListener(eventName, (event: any) => {
				resolve(event.detail as T);
			});
		});
	}

	private listenToChanges() {
		this.removeOnLocalStorageChanged = () => {
			this.dfnsCreateAccountElement.setAttribute(
				"oauth-access-token",
				LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get(),
			);
			this.dfnsValidateWalletElement.setAttribute(
				"dfns-user-token",
				LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
			);
			this.dfnsWalletValidationElement.setAttribute(
				"dfns-user-token",
				LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
			);
			this.dfnsWalletValidationElement.setAttribute(
				"wallet-id",
				LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id,
			);

			this.dfnsCreatePasskeyElement.setAttribute(
				"dfns-user-token",
				LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
			);

			this.dfnsSignMessageElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());

			this.dfnsSettingsElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());

			this.dfnsWalletOverviewElement.setAttribute(
				"dfns-user-token",
				LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
			);

			this.dfnsWalletOverviewElement.setAttribute(
				"wallet-address",
				LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.address,
			);
		};
		window.addEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
	}
}
