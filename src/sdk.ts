
import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { GetSignatureResponse } from "./components";
import LocalStorageService, { DFNS_ACTIVE_WALLET, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "./services/LocalStorageService";
import { RegisterCompleteResponse } from "./services/api/Register";
import { getDfnsDelegatedClient, isDfnsError } from "./utils/dfns";
import { loginWithOAuth } from "./utils/helper";


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
    public dfnsSignMessageElement: HTMLElement | null = null;
    public dfnsContainer: HTMLElement | null = null;
	private removeOnLocalStorageChanged: () => void = () => {}; 

	constructor(protected options: DfnsSDKOptions, reset?: boolean) {
        if(reset){
            DfnsSDK.instance = null;
			window.removeEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
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

		/** Init Create Account Element */
        this.dfnsCreateAccountElement = document.createElement("dfns-create-account");
		this.dfnsCreateAccountElement.setAttribute("oauth-access-token", LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get())
        this.dfnsCreateAccountElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsContainer.appendChild(this.dfnsCreateAccountElement);

		/** Init Vailidate Wallet Element */
		this.dfnsValidateWalletElement = document.createElement("dfns-validate-wallet");
		this.dfnsValidateWalletElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())
        this.dfnsValidateWalletElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsValidateWalletElement.setAttribute("app-id", this.options.appId);
        

        this.dfnsContainer.appendChild(this.dfnsValidateWalletElement);

		/** Init Wallet Validation Element */
		this.dfnsWalletValidationElement = document.createElement("dfns-wallet-validation");

        this.dfnsWalletValidationElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsWalletValidationElement.setAttribute("app-id", this.options.appId);
        this.dfnsWalletValidationElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())	
        this.dfnsWalletValidationElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id)

        this.dfnsContainer.appendChild(this.dfnsWalletValidationElement);


		/** Init Sign Message Element */
		this.dfnsSignMessageElement = document.createElement("dfns-sign-message");

        this.dfnsSignMessageElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsSignMessageElement.setAttribute("app-id", this.options.appId);
        this.dfnsSignMessageElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())	
        this.dfnsSignMessageElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id)

        this.dfnsContainer.appendChild(this.dfnsSignMessageElement);



		/** Init Sign Message Element */


		document.body.appendChild(this.dfnsContainer);

		this.listenToChanges();
    }


	public connect(): Promise<any> {
		return 
	}

    public async connectAccorSocial(oauthToken?: string): Promise<Wallet> {
		let wallet : Wallet | null = null;
        try {
			LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].set(oauthToken)
			const response = await loginWithOAuth(this.options.rpId, oauthToken)
			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
			const dfnsDelegated = getDfnsDelegatedClient(this.options.appId, response.userAuthToken);
			const wallets = await dfnsDelegated.wallets.listWallets({});
			wallet = wallets.items[0];
			if (!wallet) {
				await this.validateWallet();
				wallet = await this.waitForWalletValidation();
			}
		}catch(error){
			if (isDfnsError(error) && error.httpStatus === 401) {
				await this.createAccount();
				await this.validateWallet();
				wallet = await this.waitForWalletValidation();
			} else {
				throw error;
			}
		}
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(wallet);
		return wallet;
	}


	public async createAccount(){
		this.dfnsCreateAccountElement.setAttribute("visible", "true");
        const response = await this.waitForEvent<RegisterCompleteResponse>(this.dfnsCreateAccountElement, "passkeyCreated");
		LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
        this.dfnsCreateAccountElement.removeAttribute("visible");
		return response
	}

	public async validateWallet(): Promise<Wallet> {
        this.dfnsValidateWalletElement.setAttribute("visible", "true");
        const response = await this.waitForEvent<Wallet>(this.dfnsValidateWalletElement, "walletValidated");
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(response);
        this.dfnsValidateWalletElement.removeAttribute("visible");
		return response
	}

	public async waitForWalletValidation(): Promise<any> {
		this.dfnsWalletValidationElement.setAttribute("visible", "true");
        const response = await this.waitForEvent(this.dfnsWalletValidationElement, "walletValidated");
        this.dfnsWalletValidationElement.removeAttribute("visible");
		return response
	}

	public async signMessage(message: string) {
		this.dfnsSignMessageElement.setAttribute("visible", "true");
		this.dfnsSignMessageElement.setAttribute("message", message);
        const response = await this.waitForEvent<GetSignatureResponse>(this.dfnsSignMessageElement, "signedMessage");
        this.dfnsSignMessageElement.removeAttribute("visible");
		return response
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
            })
        });
    }

	public testLocalStorage() {
		LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set("test");
	}

	private listenToChanges() {
		this.removeOnLocalStorageChanged = () => {
			this.dfnsCreateAccountElement.setAttribute("oauth-access-token", LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get())
			this.dfnsValidateWalletElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())
			this.dfnsWalletValidationElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get())
			this.dfnsWalletValidationElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id)

		}
		window.addEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
	}



}