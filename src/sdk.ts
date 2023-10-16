import chroma from "chroma-js";
import LocalStorageService, {
	CACHED_WALLET_PROVIDER,
	DFNS_ACTIVE_WALLET,
	DFNS_CREDENTIALS,
	DFNS_END_USER_TOKEN,
	OAUTH_ACCESS_TOKEN,
	WalletProvider,
} from "./services/LocalStorageService";

import { BlockchainNetwork } from "@dfns/sdk/codegen/datamodel/Wallets";
import { EThemeModeType } from "./common/enums/themes-enums";
import { IColors } from "./common/interfaces/IColors";
import Login from "./services/api/Login";
import DfnsWallet from "./services/wallet/DfnsWallet";
import { WalletEvent } from "./services/wallet/IWalletInterface";
import WalletConnectWallet from "./services/wallet/WalletConnectWallet";
import dfnsStore from "./stores/DfnsStore";
import { setActiveLanguage } from "./stores/LanguageStore";
import router, { RouteType } from "./stores/RouterStore";
import { waitForEvent } from "./utils/helper";
import { WalletDisconnectedError } from "./utils/errors";

export const DEFAULT_API_URL = "https://app.dfns.smart-chain.fr";
export const DEFAULT_DFNS_HOST = "https://api.dfns.io";
export const DEFAULT_LANG = "en";

export interface DfnsSDKOptions {
	appName?: string;
	rpId: string;
	appId: string;
	dfnsHost?: string;
	apiUrl?: string;
	loginOptions?: LoginOption[];
	appLogoUrl?: string | null;
	darkMode?: boolean;
	assetsPath?: string;
	showWalletValidation?: boolean;
	defaultDevice?: "mobile" | "desktop" | null;
	network: BlockchainNetwork;
	googleClientId?: string;
	googleEnabled?: boolean;
	lang?: "fr" | "en";
	customButtonEnabled?: boolean;
	customButtonText?: string;
	customButtonIcon?: string;
	customButtonCallback?: () => any;
	primaryColor?: string;
	walletConnectEnabled?: boolean;
	walletConnectProjectId?: string;
	autoConnect?: boolean;
	/**
	 * @description Disable logout UI
	 * @default false
	 */
	disableLogoutUI?: boolean;
	activateRecovery?: boolean;
	showRecoverySetupAtWalletCreation?: boolean;
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

	private dfnsContainer: HTMLElement | null = null;
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
		this.init();
	}

	private init() {
		const existingContainers = document.getElementsByTagName("dfns-main");
		for (let i = 0; i < existingContainers.length; i++) {
			existingContainers[i].remove();
		}

		setActiveLanguage(this.options.lang);
		this.dfnsContainer = document.createElement("dfns-main");
		this.generateColorPalette(this.dfnsContainer);
		this.dfnsContainer.classList.add("dfns-container");
		document.body.appendChild(this.dfnsContainer);

		dfnsStore.setValue("appName", this.options.appName);
		dfnsStore.setValue("dfnsHost", this.options.dfnsHost);
		dfnsStore.setValue("appId", this.options.appId);
		dfnsStore.setValue("rpId", this.options.rpId);
		dfnsStore.setValue("appLogoUrl", this.options.appLogoUrl);
		dfnsStore.setValue("apiUrl", this.options.apiUrl);
		dfnsStore.setValue("googleEnabled", this.options.googleEnabled);
		dfnsStore.setValue("googleClientId", this.options.googleClientId ?? "");
		dfnsStore.setValue("network", this.options.network);
		dfnsStore.setValue("defaultDevice", this.options.defaultDevice);
		dfnsStore.setValue("dfnsUserToken", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get() ?? null);
		dfnsStore.setValue("oauthAccessToken", LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get() ?? null);
		dfnsStore.setValue("wallet", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get() ?? null);
		dfnsStore.setValue("credentials", LocalStorageService.getInstance().items[DFNS_CREDENTIALS].get() ?? []);
		dfnsStore.setValue("customButtonEnabled", this.options.customButtonEnabled ?? false);
		dfnsStore.setValue("customButtonText", this.options.customButtonText ?? "");
		dfnsStore.setValue("customButtonIcon", this.options.customButtonIcon ?? "");
		dfnsStore.setValue("customButtonCallback", this.options.customButtonCallback ?? null);
		dfnsStore.setValue("theme", this.options.darkMode ? EThemeModeType.DARK : EThemeModeType.LIGHT);
		dfnsStore.setValue("lang", this.options.lang);
		dfnsStore.setValue("walletConnectEnabled", this.options.walletConnectEnabled);
		dfnsStore.setValue("walletConnectProjectId", this.options.walletConnectProjectId ?? null);
		dfnsStore.setValue("showWalletValidation", this.options.showWalletValidation ?? false);
		dfnsStore.setValue("disableLogoutUI", this.options.disableLogoutUI ?? false);
		dfnsStore.setValue("activateRecovery", this.options.activateRecovery ?? false);
		dfnsStore.setValue("showRecoverySetupAtWalletCreation", this.options.showRecoverySetupAtWalletCreation ?? false);

		const walletProvider = LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].get();
		if (walletProvider === WalletProvider.DFNS) {
			const walletInstance = DfnsWallet.getInstance();
			dfnsStore.setValue("walletService", walletInstance);
			if (this.options.autoConnect) {
				walletInstance.autoConnect();
			}
		}

		if (walletProvider === WalletProvider.WALLET_CONNECT) {
			const web3modalInstance = WalletConnectWallet.getInstance(dfnsStore.state.walletConnectProjectId, dfnsStore.state.network);
			dfnsStore.setValue("walletService", web3modalInstance);
			if (this.options.autoConnect) {
				web3modalInstance.autoConnect();
			}
		}
	}

	public async connect() {
		router.navigate(RouteType.LOGIN);
		const walletAddress = await waitForEvent<string>(this.dfnsContainer, "walletConnected");
		if (!walletAddress) {
			throw new Error("Wallet not connected");
		}
		return walletAddress;
	}

	public async connectWithOAuthToken(oauthToken: string) {
		const dfnsWalletInstance = DfnsWallet.getInstance();
		dfnsStore.setValue("walletService", dfnsWalletInstance);
		return dfnsStore.state.walletService.connectWithOAuthToken(oauthToken);
	}

	public async signMessage(message: string) {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		return dfnsStore.state.walletService.signMessage(message);
	}

	public async transferTokens() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		return dfnsStore.state.walletService.transferTokens();
	}

	public async showWalletOverview() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		dfnsStore.state.walletService.showWalletOverview();
	}

	public async showSettings() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		dfnsStore.state.walletService.showSettings();
	}

	public async showReceiveTokens() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		router.navigate(RouteType.RECEIVE_TOKENS);
	}

	public async showRecoverySetup() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		router.navigate(RouteType.RECOVERY_SETUP);
	}

	public async showRecoverAccount() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		router.navigate(RouteType.RECOVER_ACCOUNT);
	}

	public async sendTransaction(to: string, value: string, data?: string, nonce?: number) {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		return dfnsStore.state.walletService.sendTransaction(to, value, data, nonce);
	}

	public async showCreatePasskey() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		dfnsStore.state.walletService.showCreatePasskey();
	}

	public async showConfirmTransaction() {
		if (!(await this.isConnected())) {
			throw new WalletDisconnectedError();
		}
		router.navigate(RouteType.CONFIRM_TRANSACTION);
	}

	public setLanguage(lang: "fr" | "en") {
		setActiveLanguage(lang);
	}

	public disconnect() {
		dfnsStore.state.walletService.disconnect();
		LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].delete();
	}

	public onChange(event: WalletEvent, callback: (data: any) => void) {
		return dfnsStore.state.walletService.onChange(event, callback);
	}

	public async isConnected(): Promise<boolean> {
		if (!dfnsStore.state.walletService) return false;
		return dfnsStore.state.walletService.isConnected();
	}

	public async getAddress() {
		const isConnected = await this.isConnected();
		if (isConnected) {
			return dfnsStore.state.walletService.getAddress();
		}
	}

	public getProvider() {
		return dfnsStore.state.walletService.getProvider();
	}

	public getWalletProvider() {
		return LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].get();
	}

	private async generateColorPalette(container: HTMLElement) {
		const baseColor = chroma(this.options.primaryColor ?? "#000000");
		const variableName = `--color-primary-900`;
		const colors: IColors = {
			primary_50: null,
			primary_100: null,
			primary_200: null,
			primary_300: null,
			primary_400: null,
			primary_500: null,
			primary_600: null,
			primary_700: null,
			primary_800: null,
			primary_900: null,
		};
		colors.primary_900 = baseColor.hex();
		container.style.setProperty(variableName, this.options.primaryColor);

		// Convert the baseColor to HSL
		const baseColorHSL = baseColor.hsl();

		for (let i = 800; i >= 500; i -= 100) {
			// Adjust the HSL lightness value
			baseColorHSL[2] = Math.min(1, baseColorHSL[2] + 10 / 100);
			// Convert the modified HSL back to hex
			let color = chroma(baseColorHSL, "hsl").hex();

			switch (i) {
				case 800:
					colors.primary_800 = color;
					break;
				case 700:
					colors.primary_700 = color;
					break;
				case 600:
					colors.primary_600 = color;
					break;
				case 500:
					colors.primary_500 = color;
					break;
			}

			// Set the CSS custom property
			const variableName = `--color-primary-${i}`;
			container.style.setProperty(variableName, color);
		}

		for (let i = 400; i >= 50; i -= 100) {
			// Adjust the HSL lightness value
			baseColorHSL[2] = Math.min(1, baseColorHSL[2] + 6 / 100);
			// Convert the modified HSL back to hex
			let color = chroma(baseColorHSL, "hsl").hex();

			switch (i) {
				case 400:
					colors.primary_400 = color;
					break;
				case 300:
					colors.primary_300 = color;
					break;
				case 200:
					colors.primary_200 = color;
					break;
				case 100:
					colors.primary_100 = color;
					break;
			}

			// Set the CSS custom property
			const variableName = `--color-primary-${i}`;
			container.style.setProperty(variableName, color);
			if (i === 100) {
				baseColorHSL[2] = Math.min(1, baseColorHSL[2] + 6 / 100);
				color = chroma(baseColorHSL, "hsl").hex();
				colors.primary_50 = color;
				const variableName = `--color-primary-50`;
				container.style.setProperty(variableName, color);
			}
		}
		dfnsStore.setValue("colors", colors);
	}

	public async refreshToken() {
		try {
			const response = await Login.getInstance(dfnsStore.state.apiUrl, dfnsStore.state.appId).delegated(
				dfnsStore.state.oauthAccessToken,
			);
			dfnsStore.setValue("dfnsUserToken", response.token);
		} catch (err) {
			console.log(err);
		}
	}
}
