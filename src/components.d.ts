/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EAlertVariant } from "./common/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "./common/enums/buttons-enums";
import { JSX } from "@stencil/core";
import { ITokenInfo } from "./common/interfaces/ITokenInfo";
import { Amount, BlockchainAddress } from "@dfns/sdk/codegen/datamodel/Foundations";
import { RegisterCompleteResponse } from "./services/api/Register";
import { CreatePasskeyAction, SettingsAction, WalletOverviewAction } from "./common/enums/actions-enum";
import { ITypo, ITypoColor } from "./common/enums/typography-enums";
import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
export { EAlertVariant } from "./common/enums/alerts-enums";
export { EButtonSize, EButtonVariant } from "./common/enums/buttons-enums";
export { JSX } from "@stencil/core";
export { ITokenInfo } from "./common/interfaces/ITokenInfo";
export { Amount, BlockchainAddress } from "@dfns/sdk/codegen/datamodel/Foundations";
export { RegisterCompleteResponse } from "./services/api/Register";
export { CreatePasskeyAction, SettingsAction, WalletOverviewAction } from "./common/enums/actions-enum";
export { ITypo, ITypoColor } from "./common/enums/typography-enums";
export { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
export namespace Components {
    interface DfnsAlert {
        "classCss"?: string;
        "hasTitle": boolean;
        "variant": EAlertVariant;
    }
    interface DfnsButton {
        "classCss"?: string;
        "content": string;
        "disabled": boolean;
        "fullwidth": boolean;
        "icon"?: JSX.Element;
        "iconUrl"?: string;
        "iconposition": "left" | "right";
        "iconstyle"?: any;
        "isloading": boolean;
        "onClick": () => any;
        "sizing": EButtonSize;
        "type": "button" | "submit";
        "variant": EButtonVariant;
    }
    interface DfnsConfirmTransaction {
        "backButtonCallback": () => void;
        "confirmationImgSrc": string;
        "data"?: string;
        "decimals": number;
        "dfnsTransfer": boolean;
        "dfnsTransferSelectedToken": ITokenInfo;
        "to": BlockchainAddress;
        "tokenSymbol": string;
        "txNonce"?: number;
        "value": Amount;
    }
    interface DfnsCreateAccount {
    }
    interface DfnsCreatePasskey {
    }
    interface DfnsInputField {
        "disableErrors": boolean;
        "errors": string[];
        "fullWidth": boolean;
        "isPasswordVisible": boolean;
        "isReadOnly": boolean;
        "label": string;
        "leftElement": any;
        "onChange": (input: string) => void;
        "placeholder": string;
        "rightElement": any;
        "type": string;
        "value": string;
    }
    interface DfnsLayout {
        "closeBtn"?: boolean;
        "onClickCloseBtn": () => void;
    }
    interface DfnsLoader {
        "classCss"?: string;
        "size"?: "small" | "large";
    }
    interface DfnsLogin {
    }
    interface DfnsMain {
        "messageToSign": string;
        "transactionData"?: BlockchainAddress;
        "transactionDecimals"?: number;
        "transactionNonce"?: number;
        "transactionTo": BlockchainAddress;
        "transactionTokenSymbol"?: string;
        "transactionValue": Amount;
    }
    interface DfnsReceiveTokens {
    }
    interface DfnsRecoverAccount {
    }
    interface DfnsRecoverySetup {
    }
    interface DfnsSettings {
        "confirmationImgSrc": string;
    }
    interface DfnsSignMessage {
        "message": string;
    }
    interface DfnsStepper {
        "activeIndices": number[];
        "classCss"?: string;
        "icon"?: string;
        "iconstyle"?: string;
        "steps": string[];
    }
    interface DfnsTransferTokens {
    }
    interface DfnsTypography {
        "classCss"?: string;
        "color"?: ITypoColor;
        "typo": ITypo;
    }
    interface DfnsValidateWallet {
    }
    interface DfnsWalletOverview {
    }
    interface DfnsWalletValidation {
        "confirmationImgSrc": string;
    }
    interface DropDown {
        "closeAction"?: (close: () => void) => void;
        "onOpen"?: (open: boolean) => void;
    }
    interface DropDownContainer {
        "dropdownContent": { children: JSX.Element; title: string; content: JSX.Element }[];
    }
    interface ToggleSwitch {
        "checked": boolean;
        "label": string;
    }
}
export interface DfnsButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsButtonElement;
}
export interface DfnsConfirmTransactionCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsConfirmTransactionElement;
}
export interface DfnsCreateAccountCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsCreateAccountElement;
}
export interface DfnsInputFieldCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsInputFieldElement;
}
export interface DfnsLoginCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsLoginElement;
}
export interface DfnsRecoverAccountCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsRecoverAccountElement;
}
export interface DfnsRecoverySetupCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsRecoverySetupElement;
}
export interface DfnsSettingsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsSettingsElement;
}
export interface DfnsSignMessageCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsSignMessageElement;
}
export interface DfnsTransferTokensCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsTransferTokensElement;
}
export interface DfnsValidateWalletCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsValidateWalletElement;
}
export interface DfnsWalletOverviewCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsWalletOverviewElement;
}
export interface DfnsWalletValidationCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsWalletValidationElement;
}
declare global {
    interface HTMLDfnsAlertElement extends Components.DfnsAlert, HTMLStencilElement {
    }
    var HTMLDfnsAlertElement: {
        prototype: HTMLDfnsAlertElement;
        new (): HTMLDfnsAlertElement;
    };
    interface HTMLDfnsButtonElement extends Components.DfnsButton, HTMLStencilElement {
    }
    var HTMLDfnsButtonElement: {
        prototype: HTMLDfnsButtonElement;
        new (): HTMLDfnsButtonElement;
    };
    interface HTMLDfnsConfirmTransactionElement extends Components.DfnsConfirmTransaction, HTMLStencilElement {
    }
    var HTMLDfnsConfirmTransactionElement: {
        prototype: HTMLDfnsConfirmTransactionElement;
        new (): HTMLDfnsConfirmTransactionElement;
    };
    interface HTMLDfnsCreateAccountElement extends Components.DfnsCreateAccount, HTMLStencilElement {
    }
    var HTMLDfnsCreateAccountElement: {
        prototype: HTMLDfnsCreateAccountElement;
        new (): HTMLDfnsCreateAccountElement;
    };
    interface HTMLDfnsCreatePasskeyElement extends Components.DfnsCreatePasskey, HTMLStencilElement {
    }
    var HTMLDfnsCreatePasskeyElement: {
        prototype: HTMLDfnsCreatePasskeyElement;
        new (): HTMLDfnsCreatePasskeyElement;
    };
    interface HTMLDfnsInputFieldElement extends Components.DfnsInputField, HTMLStencilElement {
    }
    var HTMLDfnsInputFieldElement: {
        prototype: HTMLDfnsInputFieldElement;
        new (): HTMLDfnsInputFieldElement;
    };
    interface HTMLDfnsLayoutElement extends Components.DfnsLayout, HTMLStencilElement {
    }
    var HTMLDfnsLayoutElement: {
        prototype: HTMLDfnsLayoutElement;
        new (): HTMLDfnsLayoutElement;
    };
    interface HTMLDfnsLoaderElement extends Components.DfnsLoader, HTMLStencilElement {
    }
    var HTMLDfnsLoaderElement: {
        prototype: HTMLDfnsLoaderElement;
        new (): HTMLDfnsLoaderElement;
    };
    interface HTMLDfnsLoginElement extends Components.DfnsLogin, HTMLStencilElement {
    }
    var HTMLDfnsLoginElement: {
        prototype: HTMLDfnsLoginElement;
        new (): HTMLDfnsLoginElement;
    };
    interface HTMLDfnsMainElement extends Components.DfnsMain, HTMLStencilElement {
    }
    var HTMLDfnsMainElement: {
        prototype: HTMLDfnsMainElement;
        new (): HTMLDfnsMainElement;
    };
    interface HTMLDfnsReceiveTokensElement extends Components.DfnsReceiveTokens, HTMLStencilElement {
    }
    var HTMLDfnsReceiveTokensElement: {
        prototype: HTMLDfnsReceiveTokensElement;
        new (): HTMLDfnsReceiveTokensElement;
    };
    interface HTMLDfnsRecoverAccountElement extends Components.DfnsRecoverAccount, HTMLStencilElement {
    }
    var HTMLDfnsRecoverAccountElement: {
        prototype: HTMLDfnsRecoverAccountElement;
        new (): HTMLDfnsRecoverAccountElement;
    };
    interface HTMLDfnsRecoverySetupElement extends Components.DfnsRecoverySetup, HTMLStencilElement {
    }
    var HTMLDfnsRecoverySetupElement: {
        prototype: HTMLDfnsRecoverySetupElement;
        new (): HTMLDfnsRecoverySetupElement;
    };
    interface HTMLDfnsSettingsElement extends Components.DfnsSettings, HTMLStencilElement {
    }
    var HTMLDfnsSettingsElement: {
        prototype: HTMLDfnsSettingsElement;
        new (): HTMLDfnsSettingsElement;
    };
    interface HTMLDfnsSignMessageElement extends Components.DfnsSignMessage, HTMLStencilElement {
    }
    var HTMLDfnsSignMessageElement: {
        prototype: HTMLDfnsSignMessageElement;
        new (): HTMLDfnsSignMessageElement;
    };
    interface HTMLDfnsStepperElement extends Components.DfnsStepper, HTMLStencilElement {
    }
    var HTMLDfnsStepperElement: {
        prototype: HTMLDfnsStepperElement;
        new (): HTMLDfnsStepperElement;
    };
    interface HTMLDfnsTransferTokensElement extends Components.DfnsTransferTokens, HTMLStencilElement {
    }
    var HTMLDfnsTransferTokensElement: {
        prototype: HTMLDfnsTransferTokensElement;
        new (): HTMLDfnsTransferTokensElement;
    };
    interface HTMLDfnsTypographyElement extends Components.DfnsTypography, HTMLStencilElement {
    }
    var HTMLDfnsTypographyElement: {
        prototype: HTMLDfnsTypographyElement;
        new (): HTMLDfnsTypographyElement;
    };
    interface HTMLDfnsValidateWalletElement extends Components.DfnsValidateWallet, HTMLStencilElement {
    }
    var HTMLDfnsValidateWalletElement: {
        prototype: HTMLDfnsValidateWalletElement;
        new (): HTMLDfnsValidateWalletElement;
    };
    interface HTMLDfnsWalletOverviewElement extends Components.DfnsWalletOverview, HTMLStencilElement {
    }
    var HTMLDfnsWalletOverviewElement: {
        prototype: HTMLDfnsWalletOverviewElement;
        new (): HTMLDfnsWalletOverviewElement;
    };
    interface HTMLDfnsWalletValidationElement extends Components.DfnsWalletValidation, HTMLStencilElement {
    }
    var HTMLDfnsWalletValidationElement: {
        prototype: HTMLDfnsWalletValidationElement;
        new (): HTMLDfnsWalletValidationElement;
    };
    interface HTMLDropDownElement extends Components.DropDown, HTMLStencilElement {
    }
    var HTMLDropDownElement: {
        prototype: HTMLDropDownElement;
        new (): HTMLDropDownElement;
    };
    interface HTMLDropDownContainerElement extends Components.DropDownContainer, HTMLStencilElement {
    }
    var HTMLDropDownContainerElement: {
        prototype: HTMLDropDownContainerElement;
        new (): HTMLDropDownContainerElement;
    };
    interface HTMLToggleSwitchElement extends Components.ToggleSwitch, HTMLStencilElement {
    }
    var HTMLToggleSwitchElement: {
        prototype: HTMLToggleSwitchElement;
        new (): HTMLToggleSwitchElement;
    };
    interface HTMLElementTagNameMap {
        "dfns-alert": HTMLDfnsAlertElement;
        "dfns-button": HTMLDfnsButtonElement;
        "dfns-confirm-transaction": HTMLDfnsConfirmTransactionElement;
        "dfns-create-account": HTMLDfnsCreateAccountElement;
        "dfns-create-passkey": HTMLDfnsCreatePasskeyElement;
        "dfns-input-field": HTMLDfnsInputFieldElement;
        "dfns-layout": HTMLDfnsLayoutElement;
        "dfns-loader": HTMLDfnsLoaderElement;
        "dfns-login": HTMLDfnsLoginElement;
        "dfns-main": HTMLDfnsMainElement;
        "dfns-receive-tokens": HTMLDfnsReceiveTokensElement;
        "dfns-recover-account": HTMLDfnsRecoverAccountElement;
        "dfns-recovery-setup": HTMLDfnsRecoverySetupElement;
        "dfns-settings": HTMLDfnsSettingsElement;
        "dfns-sign-message": HTMLDfnsSignMessageElement;
        "dfns-stepper": HTMLDfnsStepperElement;
        "dfns-transfer-tokens": HTMLDfnsTransferTokensElement;
        "dfns-typography": HTMLDfnsTypographyElement;
        "dfns-validate-wallet": HTMLDfnsValidateWalletElement;
        "dfns-wallet-overview": HTMLDfnsWalletOverviewElement;
        "dfns-wallet-validation": HTMLDfnsWalletValidationElement;
        "drop-down": HTMLDropDownElement;
        "drop-down-container": HTMLDropDownContainerElement;
        "toggle-switch": HTMLToggleSwitchElement;
    }
}
declare namespace LocalJSX {
    interface DfnsAlert {
        "classCss"?: string;
        "hasTitle"?: boolean;
        "variant"?: EAlertVariant;
    }
    interface DfnsButton {
        "classCss"?: string;
        "content"?: string;
        "disabled"?: boolean;
        "fullwidth"?: boolean;
        "icon"?: JSX.Element;
        "iconUrl"?: string;
        "iconposition"?: "left" | "right";
        "iconstyle"?: any;
        "isloading"?: boolean;
        "onButtonClick"?: (event: DfnsButtonCustomEvent<void>) => void;
        "onClick"?: () => any;
        "sizing"?: EButtonSize;
        "type"?: "button" | "submit";
        "variant"?: EButtonVariant;
    }
    interface DfnsConfirmTransaction {
        "backButtonCallback"?: () => void;
        "confirmationImgSrc"?: string;
        "data"?: string;
        "decimals"?: number;
        "dfnsTransfer"?: boolean;
        "dfnsTransferSelectedToken"?: ITokenInfo;
        "onTransactionSent"?: (event: DfnsConfirmTransactionCustomEvent<string>) => void;
        "to"?: BlockchainAddress;
        "tokenSymbol"?: string;
        "txNonce"?: number;
        "value"?: Amount;
    }
    interface DfnsCreateAccount {
        "onPasskeyCreated"?: (event: DfnsCreateAccountCustomEvent<RegisterCompleteResponse>) => void;
    }
    interface DfnsCreatePasskey {
    }
    interface DfnsInputField {
        "disableErrors"?: boolean;
        "errors"?: string[];
        "fullWidth"?: boolean;
        "isPasswordVisible"?: boolean;
        "isReadOnly"?: boolean;
        "label"?: string;
        "leftElement"?: any;
        "onChange"?: (input: string) => void;
        "onInputChange"?: (event: DfnsInputFieldCustomEvent<string>) => void;
        "placeholder"?: string;
        "rightElement"?: any;
        "type"?: string;
        "value"?: string;
    }
    interface DfnsLayout {
        "closeBtn"?: boolean;
        "onClickCloseBtn"?: () => void;
    }
    interface DfnsLoader {
        "classCss"?: string;
        "size"?: "small" | "large";
    }
    interface DfnsLogin {
        "onWalletConnected"?: (event: DfnsLoginCustomEvent<string>) => void;
    }
    interface DfnsMain {
        "messageToSign"?: string;
        "transactionData"?: BlockchainAddress;
        "transactionDecimals"?: number;
        "transactionNonce"?: number;
        "transactionTo"?: BlockchainAddress;
        "transactionTokenSymbol"?: string;
        "transactionValue"?: Amount;
    }
    interface DfnsReceiveTokens {
    }
    interface DfnsRecoverAccount {
        "onWalletConnected"?: (event: DfnsRecoverAccountCustomEvent<string>) => void;
    }
    interface DfnsRecoverySetup {
        "onAction"?: (event: DfnsRecoverySetupCustomEvent<CreatePasskeyAction>) => void;
    }
    interface DfnsSettings {
        "confirmationImgSrc"?: string;
        "onAction"?: (event: DfnsSettingsCustomEvent<SettingsAction>) => void;
    }
    interface DfnsSignMessage {
        "message"?: string;
        "onSignedMessage"?: (event: DfnsSignMessageCustomEvent<string>) => void;
    }
    interface DfnsStepper {
        "activeIndices"?: number[];
        "classCss"?: string;
        "icon"?: string;
        "iconstyle"?: string;
        "steps"?: string[];
    }
    interface DfnsTransferTokens {
        "onTransferRequest"?: (event: DfnsTransferTokensCustomEvent<string>) => void;
    }
    interface DfnsTypography {
        "classCss"?: string;
        "color"?: ITypoColor;
        "typo"?: ITypo;
    }
    interface DfnsValidateWallet {
        "onWalletCreated"?: (event: DfnsValidateWalletCustomEvent<Wallet>) => void;
    }
    interface DfnsWalletOverview {
        "onAction"?: (event: DfnsWalletOverviewCustomEvent<WalletOverviewAction>) => void;
    }
    interface DfnsWalletValidation {
        "confirmationImgSrc"?: string;
        "onWalletValidated"?: (event: DfnsWalletValidationCustomEvent<Wallet>) => void;
    }
    interface DropDown {
        "closeAction"?: (close: () => void) => void;
        "onOpen"?: (open: boolean) => void;
    }
    interface DropDownContainer {
        "dropdownContent"?: { children: JSX.Element; title: string; content: JSX.Element }[];
    }
    interface ToggleSwitch {
        "checked"?: boolean;
        "label"?: string;
    }
    interface IntrinsicElements {
        "dfns-alert": DfnsAlert;
        "dfns-button": DfnsButton;
        "dfns-confirm-transaction": DfnsConfirmTransaction;
        "dfns-create-account": DfnsCreateAccount;
        "dfns-create-passkey": DfnsCreatePasskey;
        "dfns-input-field": DfnsInputField;
        "dfns-layout": DfnsLayout;
        "dfns-loader": DfnsLoader;
        "dfns-login": DfnsLogin;
        "dfns-main": DfnsMain;
        "dfns-receive-tokens": DfnsReceiveTokens;
        "dfns-recover-account": DfnsRecoverAccount;
        "dfns-recovery-setup": DfnsRecoverySetup;
        "dfns-settings": DfnsSettings;
        "dfns-sign-message": DfnsSignMessage;
        "dfns-stepper": DfnsStepper;
        "dfns-transfer-tokens": DfnsTransferTokens;
        "dfns-typography": DfnsTypography;
        "dfns-validate-wallet": DfnsValidateWallet;
        "dfns-wallet-overview": DfnsWalletOverview;
        "dfns-wallet-validation": DfnsWalletValidation;
        "drop-down": DropDown;
        "drop-down-container": DropDownContainer;
        "toggle-switch": ToggleSwitch;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dfns-alert": LocalJSX.DfnsAlert & JSXBase.HTMLAttributes<HTMLDfnsAlertElement>;
            "dfns-button": LocalJSX.DfnsButton & JSXBase.HTMLAttributes<HTMLDfnsButtonElement>;
            "dfns-confirm-transaction": LocalJSX.DfnsConfirmTransaction & JSXBase.HTMLAttributes<HTMLDfnsConfirmTransactionElement>;
            "dfns-create-account": LocalJSX.DfnsCreateAccount & JSXBase.HTMLAttributes<HTMLDfnsCreateAccountElement>;
            "dfns-create-passkey": LocalJSX.DfnsCreatePasskey & JSXBase.HTMLAttributes<HTMLDfnsCreatePasskeyElement>;
            "dfns-input-field": LocalJSX.DfnsInputField & JSXBase.HTMLAttributes<HTMLDfnsInputFieldElement>;
            "dfns-layout": LocalJSX.DfnsLayout & JSXBase.HTMLAttributes<HTMLDfnsLayoutElement>;
            "dfns-loader": LocalJSX.DfnsLoader & JSXBase.HTMLAttributes<HTMLDfnsLoaderElement>;
            "dfns-login": LocalJSX.DfnsLogin & JSXBase.HTMLAttributes<HTMLDfnsLoginElement>;
            "dfns-main": LocalJSX.DfnsMain & JSXBase.HTMLAttributes<HTMLDfnsMainElement>;
            "dfns-receive-tokens": LocalJSX.DfnsReceiveTokens & JSXBase.HTMLAttributes<HTMLDfnsReceiveTokensElement>;
            "dfns-recover-account": LocalJSX.DfnsRecoverAccount & JSXBase.HTMLAttributes<HTMLDfnsRecoverAccountElement>;
            "dfns-recovery-setup": LocalJSX.DfnsRecoverySetup & JSXBase.HTMLAttributes<HTMLDfnsRecoverySetupElement>;
            "dfns-settings": LocalJSX.DfnsSettings & JSXBase.HTMLAttributes<HTMLDfnsSettingsElement>;
            "dfns-sign-message": LocalJSX.DfnsSignMessage & JSXBase.HTMLAttributes<HTMLDfnsSignMessageElement>;
            "dfns-stepper": LocalJSX.DfnsStepper & JSXBase.HTMLAttributes<HTMLDfnsStepperElement>;
            "dfns-transfer-tokens": LocalJSX.DfnsTransferTokens & JSXBase.HTMLAttributes<HTMLDfnsTransferTokensElement>;
            "dfns-typography": LocalJSX.DfnsTypography & JSXBase.HTMLAttributes<HTMLDfnsTypographyElement>;
            "dfns-validate-wallet": LocalJSX.DfnsValidateWallet & JSXBase.HTMLAttributes<HTMLDfnsValidateWalletElement>;
            "dfns-wallet-overview": LocalJSX.DfnsWalletOverview & JSXBase.HTMLAttributes<HTMLDfnsWalletOverviewElement>;
            "dfns-wallet-validation": LocalJSX.DfnsWalletValidation & JSXBase.HTMLAttributes<HTMLDfnsWalletValidationElement>;
            "drop-down": LocalJSX.DropDown & JSXBase.HTMLAttributes<HTMLDropDownElement>;
            "drop-down-container": LocalJSX.DropDownContainer & JSXBase.HTMLAttributes<HTMLDropDownContainerElement>;
            "toggle-switch": LocalJSX.ToggleSwitch & JSXBase.HTMLAttributes<HTMLToggleSwitchElement>;
        }
    }
}
