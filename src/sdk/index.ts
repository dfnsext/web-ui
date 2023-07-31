import { Eip1193Provider, JsonRpcError, JsonRpcPayload } from "ethers";
import { UserRegistrationChallenge } from "@dfns/sdk";
import { WebAuthn } from "@dfns/sdk-webauthn";

export enum DFNSMessageType {
	DFNS_OVERLAY_READY = "DFNS_OVERLAY_READY",
	DFNS_SHOW_OVERLAY = "DFNS_SHOW_OVERLAY",
	DFNS_HIDE_OVERLAY = "DFNS_HIDE_OVERLAY",
	DFNS_HANDLE_REQUEST = "DFNS_HANDLE_REQUEST",
	DFNS_CONNECT = "DFNS_CONNECT",
	DFNS_DISCONNECT = "DFNS_DISCONNECT",
	DFNS_SIGN_CHALLENGE = "DFNS_SIGN_CHALLENGE",
	DFNS_CHALLENGE_SIGNED = "DFNS_CHALLENGE_SIGNED",
	DFNS_CREATE_ACCOUNT_SUCCESS = "DFNS_CREATE_ACCOUNT_SUCCESS",
	DFNS_OPEN_CREATE_ACCOUT = "DFNS_OPEN_CREATE_ACCOUT",
	DFNS_CLOSE_CREATE_ACCOUT = "DFNS_CLOSE_CREATE_ACCOUT",
}
export interface DfnsMessageResponse {
	type: string;
	response: Partial<JsonRpcError> & Partial<any>;
	payload: any;
}

export interface DfnsMessageEvent extends Partial<MessageEvent> {
	data: DfnsMessageResponse;
}

const overlayStyles: Partial<CSSStyleDeclaration> = {
	display: "none",
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

function checkForSameSrcInstances() {
	const iframes: HTMLIFrameElement[] = [].slice.call(document.querySelectorAll(".dfns-iframe"));
	return iframes.filter((iframe) => iframe.src);
}

/** DFNS SDK Constructor Options */
export interface DfnsSDKOptions {
	/** Url of the iframe */
	frameUrl: string;
	/** Application name */
	appName?: string;
	/** @optional Application logo image URL; favicon is used if unspecified */

	appLogoUrl?: string | null;
	/** @optional Use dark theme */
	darkMode?: boolean;

	rpId: string;
}

export default class DfnsSDK implements Eip1193Provider {
	private iframe!: Promise<HTMLIFrameElement>;
	protected readonly messageHandlers = new Set<(event: DfnsMessageEvent) => any>();

	public static instance: DfnsSDK | null = null;

	constructor(protected options: DfnsSDKOptions) {
		if (DfnsSDK.instance) {
			return DfnsSDK.instance;
		}
		DfnsSDK.instance = this;
		this.init();
		this.listen();
	}

	connect(): Promise<any> {
		return new Promise(async (resolve) => {
			const removeResponseListener = this.on(DFNSMessageType.DFNS_CONNECT, (event: DfnsMessageEvent) => {
				const { response } = event.data;
				removeResponseListener();
				return resolve(response);
			});
			await this._post({ type: DFNSMessageType.DFNS_CONNECT, payload: {} });
		});
	}

	disconnect(): Promise<Partial<any>> {
		return new Promise(async (resolve) => {
			const removeResponseListener = this.on(DFNSMessageType.DFNS_DISCONNECT, (event: DfnsMessageEvent) => {
				const { response } = event.data;
				removeResponseListener();
				return resolve(response);
			});
			await this._post({ type: DFNSMessageType.DFNS_DISCONNECT, payload: {} });
		});
	}

	protected async init() {
		this.iframe = new Promise((resolve) => {
			const load = () => {
				let iframe: HTMLIFrameElement | undefined = undefined;
				const existingIframe = checkForSameSrcInstances();

				if (existingIframe.length) {
					iframe = existingIframe[0]!;
				}

				if (!iframe) {
					const url = new URL(this.options.frameUrl);
					iframe = document.createElement("iframe");
					iframe.classList.add("dfns-iframe");
					iframe.dataset["dfnsIframeLabel"] = url.host;
					iframe.title = "DFNS";
					iframe.src = url.href;
					iframe.allow = "publickey-credentials-get *; publickey-credentials-create *";
					applyOverlayStyles(iframe);
					document.body.appendChild(iframe);
				}
				resolve(iframe);
			};

			if (["loaded", "interactive", "complete"].includes(document.readyState)) {
				load();
			} else {
				// ...or check load events to load
				window.addEventListener("load", load, false);
			}

			window.addEventListener("message", (event: MessageEvent) => {
				if (event.origin === this.options.frameUrl) {
					if (event.data && event.data.type && this.messageHandlers.size) {
						event.data.response = event.data.response ?? {};
						for (const handler of this.messageHandlers.values()) {
							handler(event);
						}
					}
				}
			});
		});
	}

	protected async showOverlay() {
		const iframe = await this.iframe;

		iframe.style.display = "block";
		iframe.focus();
	}

	protected async hideOverlay() {
		const iframe = await this.iframe;
		iframe.style.display = "none";
	}

	protected async signChallenge(challenge: UserRegistrationChallenge) {
		const attestation = await new WebAuthn({ rpId: this.options.rpId }).create(challenge);
		this._post({ type: DFNSMessageType.DFNS_CHALLENGE_SIGNED, payload: attestation });
	}
	protected async openCreateAccountTab() {
		const windowOpened: Window | null = window.open(this.options.frameUrl + "/create-account", "_blank");
		if (!windowOpened) throw new Error("Failed to open create account tab");
		windowOpened.focus();
		return new Promise(async (resolve) => {
			const removeResponseListener = this.on(DFNSMessageType.DFNS_CLOSE_CREATE_ACCOUT, () => {
				windowOpened.close();
				removeResponseListener();
				return resolve(true);
			});
		});
	}

	public async post(type: DFNSMessageType, payload: Partial<JsonRpcPayload>): Promise<Partial<JsonRpcPayload>> {
		return new Promise(async (resolve) => {
			const removeResponseListener = this.on(type, (event: DfnsMessageEvent) => {
				const { response } = event.data;

				if (response.id && response && response.id === payload.id) {
					removeResponseListener();
					resolve(response);
				}
			});
			await this._post({ type, payload });
		});
	}

	public on(type: DFNSMessageType, handler: (this: Window, event: DfnsMessageEvent) => any): () => void {
		const boundHandler = handler.bind(window);
		const listener = (event: DfnsMessageEvent) => {
			if (event.data.type === type) boundHandler(event);
		};

		this.messageHandlers.add(listener);
		return () => this.messageHandlers.delete(listener);
	}

	protected async _post(data: { type: DFNSMessageType; payload: Partial<any> }) {
		const iframe = await this.iframe;
		if (iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(data, this.options.frameUrl);
		} else {
			throw new Error("DFNS iframe not found");
		}
	}

	private listen() {
		this.on(DFNSMessageType.DFNS_HIDE_OVERLAY, () => {
			this.hideOverlay();
		});

		this.on(DFNSMessageType.DFNS_SHOW_OVERLAY, () => {
			this.showOverlay();
		});
		this.on(DFNSMessageType.DFNS_OPEN_CREATE_ACCOUT, () => {
			this.openCreateAccountTab();
		});

		this.on(DFNSMessageType.DFNS_SIGN_CHALLENGE, (event: DfnsMessageEvent) => {
			this.signChallenge(event.data.payload);
		});
	}

	request(request: { method: string; params?: any[] | Record<string, any> }): Promise<any> {
		return this.post(DFNSMessageType.DFNS_HANDLE_REQUEST, request);
	}
}

function* createIntGenerator(): Generator<number, number, void> {
	let index = 0;

	while (true) {
		if (index < Number.MAX_SAFE_INTEGER) yield ++index;
		else index = 0;
	}
}

const intGenerator = createIntGenerator();

export function getPayloadId(): number {
	return intGenerator.next().value;
}
