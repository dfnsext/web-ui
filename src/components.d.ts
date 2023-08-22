/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EAlertVariant } from "./utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "./utils/enums/buttons-enums";
import { JSX } from "@stencil/core";
import { RegisterCompleteResponse } from "./components";
import { ITypo, ITypoColor } from "./utils/enums/typography-enums";
export { EAlertVariant } from "./utils/enums/alerts-enums";
export { EButtonSize, EButtonVariant } from "./utils/enums/buttons-enums";
export { JSX } from "@stencil/core";
export { RegisterCompleteResponse } from "./components";
export { ITypo, ITypoColor } from "./utils/enums/typography-enums";
export namespace Components {
    interface DfnsAlert {
        "classCss"?: string;
        "errorIconSrc": string;
        "hasTitle": boolean;
        "infoIconSrc": string;
        "variant": EAlertVariant;
        "warningIconSrc": string;
    }
    interface DfnsButton {
        "classCss"?: string;
        "content": string;
        "disabled": boolean;
        "fullwidth": boolean;
        "icon"?: JSX.Element;
        "iconposition": "left" | "right";
        "iconstyle"?: any;
        "isloading": boolean;
        "onClick": () => any;
        "sizing": EButtonSize;
        "type": "button" | "submit";
        "variant": EButtonVariant;
    }
    interface DfnsCreateAccount {
        "oauthAccessToken": string;
        "rpId": string;
        "visible": string;
    }
    interface DfnsCreatePasskey {
        "visible": string;
    }
    interface DfnsDesignSystem {
    }
    interface DfnsInputField {
        "disableErrors": boolean;
        "errors": string[];
        "isReadOnly": boolean;
        "leftElement": any;
        "placeholder": string;
        "rightElement": any;
        "type": string;
        "value": string;
    }
    interface DfnsLayout {
        "bloomLogoSrc": string;
        "closeBtn"?: boolean;
        "closeBtnShouldDisconnect"?: boolean;
        "crossIconSrc": string;
        "molitorLogoSrc": string;
    }
    interface DfnsLoader {
        "LoaderIconSrc": string;
        "classCss"?: string;
    }
    interface DfnsSignMessage {
        "appId": string;
        "dfnsUserToken": string;
        "message": string;
        "rpId": string;
        "visible": string;
        "walletId": string;
    }
    interface DfnsStepper {
        "activeIndices": number[];
        "classCss"?: string;
        "icon"?: string;
        "iconstyle"?: string;
        "steps": string[];
    }
    interface DfnsTypography {
        "classCss"?: string;
        "color"?: ITypoColor;
        "typo": ITypo;
    }
    interface DfnsValidateWallet {
        "appId": string;
        "dfnsUserToken": string;
        "rpId": string;
        "visible": string;
    }
    interface DfnsWalletValidation {
        "appId": string;
        "confirmationImgSrc": string;
        "dfnsUserToken": string;
        "rpId": string;
        "visible": string;
        "walletId": string;
    }
}
export interface DfnsButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsButtonElement;
}
export interface DfnsCreateAccountCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsCreateAccountElement;
}
export interface DfnsInputFieldCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsInputFieldElement;
}
export interface DfnsSignMessageCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsSignMessageElement;
}
export interface DfnsValidateWalletCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsValidateWalletElement;
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
    interface HTMLDfnsDesignSystemElement extends Components.DfnsDesignSystem, HTMLStencilElement {
    }
    var HTMLDfnsDesignSystemElement: {
        prototype: HTMLDfnsDesignSystemElement;
        new (): HTMLDfnsDesignSystemElement;
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
    interface HTMLDfnsWalletValidationElement extends Components.DfnsWalletValidation, HTMLStencilElement {
    }
    var HTMLDfnsWalletValidationElement: {
        prototype: HTMLDfnsWalletValidationElement;
        new (): HTMLDfnsWalletValidationElement;
    };
    interface HTMLElementTagNameMap {
        "dfns-alert": HTMLDfnsAlertElement;
        "dfns-button": HTMLDfnsButtonElement;
        "dfns-create-account": HTMLDfnsCreateAccountElement;
        "dfns-create-passkey": HTMLDfnsCreatePasskeyElement;
        "dfns-design-system": HTMLDfnsDesignSystemElement;
        "dfns-input-field": HTMLDfnsInputFieldElement;
        "dfns-layout": HTMLDfnsLayoutElement;
        "dfns-loader": HTMLDfnsLoaderElement;
        "dfns-sign-message": HTMLDfnsSignMessageElement;
        "dfns-stepper": HTMLDfnsStepperElement;
        "dfns-typography": HTMLDfnsTypographyElement;
        "dfns-validate-wallet": HTMLDfnsValidateWalletElement;
        "dfns-wallet-validation": HTMLDfnsWalletValidationElement;
    }
}
declare namespace LocalJSX {
    interface DfnsAlert {
        "classCss"?: string;
        "errorIconSrc"?: string;
        "hasTitle"?: boolean;
        "infoIconSrc"?: string;
        "variant"?: EAlertVariant;
        "warningIconSrc"?: string;
    }
    interface DfnsButton {
        "classCss"?: string;
        "content"?: string;
        "disabled"?: boolean;
        "fullwidth"?: boolean;
        "icon"?: JSX.Element;
        "iconposition"?: "left" | "right";
        "iconstyle"?: any;
        "isloading"?: boolean;
        "onButtonClick"?: (event: DfnsButtonCustomEvent<void>) => void;
        "onClick"?: () => any;
        "sizing"?: EButtonSize;
        "type"?: "button" | "submit";
        "variant"?: EButtonVariant;
    }
    interface DfnsCreateAccount {
        "oauthAccessToken"?: string;
        "onPasskeyCreated"?: (event: DfnsCreateAccountCustomEvent<RegisterCompleteResponse>) => void;
        "rpId"?: string;
        "visible"?: string;
    }
    interface DfnsCreatePasskey {
        "visible"?: string;
    }
    interface DfnsDesignSystem {
    }
    interface DfnsInputField {
        "disableErrors"?: boolean;
        "errors"?: string[];
        "isReadOnly"?: boolean;
        "leftElement"?: any;
        "onChange"?: (event: DfnsInputFieldCustomEvent<string>) => void;
        "placeholder"?: string;
        "rightElement"?: any;
        "type"?: string;
        "value"?: string;
    }
    interface DfnsLayout {
        "bloomLogoSrc"?: string;
        "closeBtn"?: boolean;
        "closeBtnShouldDisconnect"?: boolean;
        "crossIconSrc"?: string;
        "molitorLogoSrc"?: string;
    }
    interface DfnsLoader {
        "LoaderIconSrc"?: string;
        "classCss"?: string;
    }
    interface DfnsSignMessage {
        "appId"?: string;
        "dfnsUserToken"?: string;
        "message"?: string;
        "onSignedMessage"?: (event: DfnsSignMessageCustomEvent<GetSignatureResponse>) => void;
        "rpId"?: string;
        "visible"?: string;
        "walletId"?: string;
    }
    interface DfnsStepper {
        "activeIndices"?: number[];
        "classCss"?: string;
        "icon"?: string;
        "iconstyle"?: string;
        "steps"?: string[];
    }
    interface DfnsTypography {
        "classCss"?: string;
        "color"?: ITypoColor;
        "typo"?: ITypo;
    }
    interface DfnsValidateWallet {
        "appId"?: string;
        "dfnsUserToken"?: string;
        "onWalletValidated"?: (event: DfnsValidateWalletCustomEvent<Wallet>) => void;
        "rpId"?: string;
        "visible"?: string;
    }
    interface DfnsWalletValidation {
        "appId"?: string;
        "confirmationImgSrc"?: string;
        "dfnsUserToken"?: string;
        "onWalletValidated"?: (event: DfnsWalletValidationCustomEvent<Wallet>) => void;
        "rpId"?: string;
        "visible"?: string;
        "walletId"?: string;
    }
    interface IntrinsicElements {
        "dfns-alert": DfnsAlert;
        "dfns-button": DfnsButton;
        "dfns-create-account": DfnsCreateAccount;
        "dfns-create-passkey": DfnsCreatePasskey;
        "dfns-design-system": DfnsDesignSystem;
        "dfns-input-field": DfnsInputField;
        "dfns-layout": DfnsLayout;
        "dfns-loader": DfnsLoader;
        "dfns-sign-message": DfnsSignMessage;
        "dfns-stepper": DfnsStepper;
        "dfns-typography": DfnsTypography;
        "dfns-validate-wallet": DfnsValidateWallet;
        "dfns-wallet-validation": DfnsWalletValidation;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dfns-alert": LocalJSX.DfnsAlert & JSXBase.HTMLAttributes<HTMLDfnsAlertElement>;
            "dfns-button": LocalJSX.DfnsButton & JSXBase.HTMLAttributes<HTMLDfnsButtonElement>;
            "dfns-create-account": LocalJSX.DfnsCreateAccount & JSXBase.HTMLAttributes<HTMLDfnsCreateAccountElement>;
            "dfns-create-passkey": LocalJSX.DfnsCreatePasskey & JSXBase.HTMLAttributes<HTMLDfnsCreatePasskeyElement>;
            "dfns-design-system": LocalJSX.DfnsDesignSystem & JSXBase.HTMLAttributes<HTMLDfnsDesignSystemElement>;
            "dfns-input-field": LocalJSX.DfnsInputField & JSXBase.HTMLAttributes<HTMLDfnsInputFieldElement>;
            "dfns-layout": LocalJSX.DfnsLayout & JSXBase.HTMLAttributes<HTMLDfnsLayoutElement>;
            "dfns-loader": LocalJSX.DfnsLoader & JSXBase.HTMLAttributes<HTMLDfnsLoaderElement>;
            "dfns-sign-message": LocalJSX.DfnsSignMessage & JSXBase.HTMLAttributes<HTMLDfnsSignMessageElement>;
            "dfns-stepper": LocalJSX.DfnsStepper & JSXBase.HTMLAttributes<HTMLDfnsStepperElement>;
            "dfns-typography": LocalJSX.DfnsTypography & JSXBase.HTMLAttributes<HTMLDfnsTypographyElement>;
            "dfns-validate-wallet": LocalJSX.DfnsValidateWallet & JSXBase.HTMLAttributes<HTMLDfnsValidateWalletElement>;
            "dfns-wallet-validation": LocalJSX.DfnsWalletValidation & JSXBase.HTMLAttributes<HTMLDfnsWalletValidationElement>;
        }
    }
}
