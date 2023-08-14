import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import CookieStorageService, { DFNS_ACTIVE_WALLET_ID, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "./services/CookieStorageService";
import { RegisterCompleteResponse } from "./services/api/Register";

export interface DfnsSDKOptions {
	rpId: string;
    appId: string;
	loginOptions: LoginOption[]
	dfnsHost?: string;
	appName?: string;
	appLogoUrl?: string | null;
	darkMode?: boolean;
}

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
    public dfnsCreateAccountElement: HTMLElement | null = null;
    public dfnsValidateWalletElement: HTMLElement | null = null;
    public dfnsWalletValidationElement: HTMLElement | null = null;
    public dfnsContainer: HTMLElement | null = null;

	constructor(protected options: DfnsSDKOptions, reset?: boolean) {
        if(reset){
            DfnsSDK.instance = null;
        }
		if (DfnsSDK.instance) {
			return DfnsSDK.instance;
		}
		DfnsSDK.instance = this;
	}

    protected init() {
        this.dfnsContainer = document.createElement("div");
		this.dfnsContainer.classList.add("dfns-container");
		this.dfnsContainer.title = "DFNS";
		applyOverlayStyles(this.dfnsContainer);
        this.dfnsCreateAccountElement = document.createElement("dfns-create-account");

        this.dfnsCreateAccountElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsCreateAccountElement.setAttribute("oauth-access-token", CookieStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get())

        this.dfnsContainer.appendChild(this.dfnsCreateAccountElement);
		document.body.appendChild(this.dfnsContainer);

		this.dfnsValidateWalletElement = document.createElement("dfns-validate-wallet");

        this.dfnsValidateWalletElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsValidateWalletElement.setAttribute("app-id", this.options.appId);
        this.dfnsValidateWalletElement.setAttribute("dfns-user-token", CookieStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())

        this.dfnsContainer.appendChild(this.dfnsValidateWalletElement);

		this.dfnsWalletValidationElement = document.createElement("dfns-wallet-validation");

        this.dfnsWalletValidationElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsWalletValidationElement.setAttribute("app-id", this.options.appId);
        this.dfnsWalletValidationElement.setAttribute("dfns-user-token", CookieStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())
        this.dfnsWalletValidationElement.setAttribute("wallet-id", CookieStorageService.getInstance().items[DFNS_ACTIVE_WALLET_ID].get())

        this.dfnsContainer.appendChild(this.dfnsWalletValidationElement);


		document.body.appendChild(this.dfnsContainer);

    }

	public connect(): Promise<any> {
		return 
	}

    public async connectAccorSocial(oauthToken?: string): Promise<any> {
        await this.createAccount(oauthToken)
		await this.validateWallet();
		await this.waitForWalletValidation();
	}


	protected async createAccount(oauthToken?: string){
		this.dfnsCreateAccountElement.setAttribute("visible", "true");
        this.dfnsCreateAccountElement.setAttribute("oauth-access-token", oauthToken);
        const response = await this.waitForEvent<RegisterCompleteResponse>(this.dfnsCreateAccountElement, "passkeyCreated");
		CookieStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
        this.dfnsCreateAccountElement.removeAttribute("visible");
		return response
	}

	public async validateWallet(): Promise<any> {
        this.dfnsValidateWalletElement.setAttribute("visible", "true");
		this.dfnsValidateWalletElement.setAttribute("dfns-user-token", CookieStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())
        const response = await this.waitForEvent<Wallet>(this.dfnsValidateWalletElement, "walletValidated");
		CookieStorageService.getInstance().items[DFNS_ACTIVE_WALLET_ID].set(response.id);
        this.dfnsValidateWalletElement.removeAttribute("visible");
		return response
	}


	public async waitForWalletValidation(): Promise<any> {
		this.dfnsWalletValidationElement.setAttribute("visible", "true");
		this.dfnsWalletValidationElement.setAttribute("dfns-user-token", CookieStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())
        this.dfnsWalletValidationElement.setAttribute("wallet-id", CookieStorageService.getInstance().items[DFNS_ACTIVE_WALLET_ID].get())
        const response = await this.waitForEvent(this.dfnsWalletValidationElement, "walletValidated");
        this.dfnsWalletValidationElement.removeAttribute("visible");
		return response
	}


	public disconnect(): Promise<Partial<any>> {
		return
	}

    protected waitForEvent<T>(element: HTMLElement, eventName: string): Promise<T> {
        return new Promise((resolve) => {
            element.addEventListener(eventName, (event: any) => {
                resolve(event.detail as T);
            })
        });
    }

}