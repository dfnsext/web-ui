
import Cookies from "js-cookie";


export const DFNS_END_USER_TOKEN = 'dfnsEndUserToken'
export const DFNS_ACTIVE_WALLET_ID = 'dfnsActiveWalletId'
export const OAUTH_ACCESS_TOKEN = 'oauthAccessToken'

export default class CookieStorageService {
	private static instance: CookieStorageService;

	private constructor() {
		CookieStorageService.instance = this;
	}

	public static getInstance(reset?: boolean) {
		if (!CookieStorageService.instance || reset) return new this();
		return CookieStorageService.instance;
	}

	public items = {
		[DFNS_END_USER_TOKEN]: {
			get: () => this.getValue<string>(DFNS_END_USER_TOKEN),
			set: (item: string) => this.setValue(DFNS_END_USER_TOKEN, item),
			delete: () => this.delete(DFNS_END_USER_TOKEN),
		},
		[DFNS_ACTIVE_WALLET_ID]: {
			get: () => this.getValue<string>(DFNS_ACTIVE_WALLET_ID),
			set: (item: string) => this.setValue(DFNS_ACTIVE_WALLET_ID, item),
			delete: () => this.delete(DFNS_ACTIVE_WALLET_ID),
		},
		[OAUTH_ACCESS_TOKEN]: {
			get: () => this.getValue<string>(OAUTH_ACCESS_TOKEN),
			set: (item: string) => this.setValue(OAUTH_ACCESS_TOKEN, item),
			delete: () => this.delete(OAUTH_ACCESS_TOKEN),
		},
	};

	private getValue<T>(key: keyof typeof this.items): T | null {
		const item = Cookies.get(key);
		if (!item) {
			return null;
		}

		const isArrayOrObject = item.match(/[{[]/);

		return (isArrayOrObject ? JSON.parse(item) : item) as T;
	}

	private setValue<T>(key: keyof typeof this.items, item: T) {
		Cookies.set(key, typeof item === "string" ? item : JSON.stringify(item));
	}

	private delete(key: keyof typeof this.items) {
		Cookies.remove(key);
	}
}
