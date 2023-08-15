
import { Wallet } from "../components";


export const DFNS_END_USER_TOKEN = 'dfnsEndUserToken'
export const DFNS_ACTIVE_WALLET = 'dfnsActiveWallet'
export const OAUTH_ACCESS_TOKEN = 'oauthAccessToken'

export default class LocalStorageService {
	private static instance: LocalStorageService;

	private constructor() {
		LocalStorageService.instance = this;
	}

	public static getInstance(reset?: boolean) {
		if (!LocalStorageService.instance || reset) return new this();
		return LocalStorageService.instance;
	}

	public items = {
		[DFNS_END_USER_TOKEN]: {
			get: () => this.getValue<string>(DFNS_END_USER_TOKEN),
			set: (item: string) => this.setValue(DFNS_END_USER_TOKEN, item),
			delete: () => this.delete(DFNS_END_USER_TOKEN),
		},
		[DFNS_ACTIVE_WALLET]: {
			get: () => this.getValue<Wallet>(DFNS_ACTIVE_WALLET),
			set: (item: Wallet) => this.setValue(DFNS_ACTIVE_WALLET, item),
			delete: () => this.delete(DFNS_ACTIVE_WALLET),
		},
		[OAUTH_ACCESS_TOKEN]: {
			get: () => this.getValue<string>(OAUTH_ACCESS_TOKEN),
			set: (item: string) => this.setValue(OAUTH_ACCESS_TOKEN, item),
			delete: () => this.delete(OAUTH_ACCESS_TOKEN),
		},
	};

	private getValue<T>(key: keyof typeof this.items): T | null {
		const item = localStorage.getItem(key);
		if (!item) {
			return null;
		}

		const isArrayOrObject = item.match(/[{[]/);

		return (isArrayOrObject ? JSON.parse(item) : item) as T;
	}

	private setValue<T>(key: keyof typeof this.items, item: T) {
		localStorage.setItem(key, typeof item === "string" ? item : JSON.stringify(item));
		const event = new Event('localStorageChanged');
		window.dispatchEvent(event)
	}

	private delete(key: keyof typeof this.items) {
		localStorage.removeItem(key);
	}
}
