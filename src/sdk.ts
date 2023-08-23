import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";

import LocalStorageService, { DFNS_ACTIVE_WALLET, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "./services/LocalStorageService";
import { RegisterCompleteResponse } from "./services/api/Register";
import { getDfnsDelegatedClient, isDfnsError } from "./utils/dfns";
import { loginWithOAuth } from "./utils/helper";
import jwt_decode from "jwt-decode";
import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";

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
    rpId: string;
    appId: string;
    loginOptions: LoginOption[];
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

    constructor(
        protected options: DfnsSDKOptions,
        reset?: boolean,
    ) {
        if (reset) {
            DfnsSDK.instance = null;
            window.removeEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
        }
        if (DfnsSDK.instance) {
            return DfnsSDK.instance;
        }
        DfnsSDK.instance = this;
    }

    public init() {
        this.dfnsContainer = document.createElement("dfns-main");
        this.dfnsContainer.classList.add("dfns-container");
        this.dfnsContainer.title = "DFNS";
        applyOverlayStyles(this.dfnsContainer);

        /** Init Create Account Element */
        this.dfnsCreateAccountElement = document.createElement("dfns-create-account");
        this.dfnsCreateAccountElement.setAttribute("oauth-access-token", LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get());
        this.dfnsCreateAccountElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsContainer.appendChild(this.dfnsCreateAccountElement);

        /** Init Vailidate Wallet Element */
        this.dfnsValidateWalletElement = document.createElement("dfns-validate-wallet");
        this.dfnsValidateWalletElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
        this.dfnsValidateWalletElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsValidateWalletElement.setAttribute("app-id", this.options.appId);

        this.dfnsContainer.appendChild(this.dfnsValidateWalletElement);

        /** Init Wallet Validation Element */
        this.dfnsWalletValidationElement = document.createElement("dfns-wallet-validation");

        this.dfnsWalletValidationElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsWalletValidationElement.setAttribute("app-id", this.options.appId);
        this.dfnsWalletValidationElement.setAttribute(
            "dfns-user-token",
            LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get(),
        );
        this.dfnsWalletValidationElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id);

        this.dfnsContainer.appendChild(this.dfnsWalletValidationElement);

        /** Init Sign Message Element */
        this.dfnsSignMessageElement = document.createElement("dfns-sign-message");

        this.dfnsSignMessageElement.setAttribute("rp-id", this.options.rpId);
        this.dfnsSignMessageElement.setAttribute("app-id", this.options.appId);
        this.dfnsSignMessageElement.setAttribute("dfns-user-token", LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get());
        this.dfnsSignMessageElement.setAttribute("wallet-id", LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get()?.id);

        this.dfnsContainer.appendChild(this.dfnsSignMessageElement);

        /** Init Sign Message Element */

        document.body.appendChild(this.dfnsContainer);

        this.listenToChanges();
    }

    public async connectWithOAuthToken(oauthToken: string): Promise<any> {
        let wallet: Wallet | null = null;
        try {
            LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].set(oauthToken);
            const response = await loginWithOAuth(this.options.rpId, oauthToken);
            LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
            const dfnsDelegated = getDfnsDelegatedClient(this.options.appId, response.userAuthToken);
            const wallets = await dfnsDelegated.wallets.listWallets({});
            wallet = wallets.items[0];
            if (!wallet) {
                await this.validateWallet();
                wallet = await this.waitForWalletValidation();
            }
        } catch (error) {
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
             const response = await loginWithOAuth(this.options.rpId, oauthToken);
             LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
             if (!wallet) {
                 await this.validateWallet();
                 wallet = await this.waitForWalletValidation();
             }
			 return wallet
         } catch (err) {
             console.error(err);
         }
     }

     throw new Error("Not connected");
    }

    public async createAccount() {
        this.dfnsContainer.setAttribute("visible", "true")
        this.dfnsCreateAccountElement.setAttribute("visible", "true");
        const response = await this.waitForEvent<RegisterCompleteResponse>(this.dfnsCreateAccountElement, "passkeyCreated");
        this.dfnsCreateAccountElement.removeAttribute("visible");
        this.dfnsContainer.removeAttribute("visible")
        if(!response) throw new Error("User cancelled connection")
        LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.userAuthToken);
        return response;
    }

    public async validateWallet(): Promise<Wallet> {
        this.dfnsContainer.setAttribute("visible", "true")
        this.dfnsValidateWalletElement.setAttribute("visible", "true");
        const response = await this.waitForEvent<Wallet>(this.dfnsValidateWalletElement, "walletValidated");
        
        this.dfnsValidateWalletElement.removeAttribute("visible");
        this.dfnsContainer.removeAttribute("visible")
        if(!response) throw new Error("User cancelled connection")
        LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(response);

        return response;
    }

    public async waitForWalletValidation(): Promise<any> {
        this.dfnsContainer.setAttribute("visible", "true")
        this.dfnsWalletValidationElement.setAttribute("visible", "true");
        const response = await this.waitForEvent(this.dfnsWalletValidationElement, "walletValidated");
        
        this.dfnsWalletValidationElement.removeAttribute("visible");
        this.dfnsContainer.removeAttribute("visible")
        if(!response) throw new Error("User cancelled connection")
        return response;
    }

    public async signMessage(message: string) {
        await this.autoConnect();
        this.dfnsContainer.setAttribute("visible", "true")
        this.dfnsSignMessageElement.setAttribute("visible", "true");
        this.dfnsSignMessageElement.setAttribute("message", message);
        const response = await this.waitForEvent<GetSignatureResponse>(this.dfnsSignMessageElement, "signedMessage");
        
        this.dfnsSignMessageElement.removeAttribute("visible");
        this.dfnsContainer.removeAttribute("visible")
        if(!response) throw new Error("User cancelled signature")
        return response;
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

    public testLocalStorage() {
        LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set("test");
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
        };
        window.addEventListener("localStorageChanged", this.removeOnLocalStorageChanged);
    }
}

