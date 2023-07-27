import { Eip1193Provider, JsonRpcError, JsonRpcPayload } from "ethers";

export enum DFNSMessageType {
	DFNS_OVERLAY_READY = "DFNS_OVERLAY_READY",
	DFNS_SHOW_OVERLAY = "DFNS_SHOW_OVERLAY",
	DFNS_HIDE_OVERLAY = "DFNS_HIDE_OVERLAY",
	DFNS_HANDLE_REQUEST = "DFNS_HANDLE_REQUEST",
	DFNS_CONNECT = "DFNS_CONNECT",
	DFNS_DISCONNECT = "DFNS_DISCONNECT",
}
export interface DfnsMessageResponse {
	type: string;
	response: Partial<JsonRpcError> & Partial<any>;
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
}

export default class DfnsSDK implements Eip1193Provider {
	protected readonly messageHandlers = new Set<(event: DfnsMessageEvent) => any>();

	private iframe?: HTMLIFrameElement = undefined;

	constructor(protected options: DfnsSDKOptions) {
		this.init();
		this.listen();
	}

	init() {
		// Check DOM state and load...
		if (["loaded", "interactive", "complete"].includes(document.readyState)) {
			this.loadIframe();
		} else {
			// ...or check load events to load
			window.addEventListener("load", this.loadIframe, false);
		}
	}

	connect(): Promise<any> {
		return new Promise(async (resolve) => {
      console.log("connect")
			await this._post({ type: DFNSMessageType.DFNS_CONNECT, payload: {} });
      console.log("posted")
			const removeResponseListener = this.on(DFNSMessageType.DFNS_CONNECT, (event: DfnsMessageEvent) => {
				const { response } = event.data;
        console.log("listen")
				removeResponseListener();
				return resolve(response);
			});
		});
	}

  disconnect(): Promise<Partial<any>> {
		return new Promise(async (resolve) => {
			await this._post({ type: DFNSMessageType.DFNS_DISCONNECT, payload: {} });
			const removeResponseListener = this.on(DFNSMessageType.DFNS_DISCONNECT, (event: DfnsMessageEvent) => {
				const { response } = event.data;
				removeResponseListener();
				return resolve(response);
			});
		});
	}

	protected async loadIframe(): Promise<HTMLIFrameElement> {
		return new Promise(async (resolve) => {
			if (this.iframe) return resolve(this.iframe);
			const existingIframe = checkForSameSrcInstances();

			if (existingIframe.length) {
				this.iframe = existingIframe[0]!;
				resolve(this.iframe);
				return;
			}

			const url = new URL(this.options.frameUrl);
			const iframe = document.createElement("iframe");
			iframe.classList.add("dfns-iframe");
			iframe.dataset["dfnsIframeLabel"] = url.host;
			iframe.title = "DFNS";
			iframe.src = url.href;
			iframe.allow = "publickey-credentials-get *";
			applyOverlayStyles(iframe);
			document.body.appendChild(iframe);
			this.iframe = iframe;

			const removeResponseListener = this.on(DFNSMessageType.DFNS_OVERLAY_READY, () => {
				removeResponseListener();
				resolve(iframe);
			});

			window.addEventListener("message", (event: MessageEvent) => {
				if (event.origin === this.options.frameUrl) {
					if (event.data && event.data.type && this.messageHandlers.size) {
						event.data.response = event.data.response ?? {};
            console.log(event.data)
						for (const handler of this.messageHandlers.values()) {
							handler(event);
						}
					}
				}
			});
		});
	}

	protected async showOverlay() {
		const iframe = await this.loadIframe();

		iframe.style.display = "block";
		iframe.focus();
	}

	protected async hideOverlay() {
		const iframe = await this.loadIframe();
		iframe.style.display = "none";
	}

	public async post(type: DFNSMessageType, payload: Partial<JsonRpcPayload>): Promise<Partial<JsonRpcPayload>> {
		return new Promise(async (resolve) => {
			await this._post({ type, payload });

			const removeResponseListener = this.on(type, (event: DfnsMessageEvent) => {
				const { response } = event.data;

				if (response.id && response && response.id === payload.id) {
					removeResponseListener();
					resolve(response);
				}
			});
		});
	}

	public on(type: DFNSMessageType, handler: (this: Window, event: DfnsMessageEvent) => any): () => void {
		const boundHandler = handler.bind(window);

		const listener = (event: DfnsMessageEvent) => {
			if (event.data.type === type) boundHandler(event);
		};

		this.messageHandlers.add(listener);
    console.log(type, this.messageHandlers)
		return () => this.messageHandlers.delete(listener);
	}

	protected async _post(data: { type: DFNSMessageType; payload: Partial<JsonRpcPayload> }) {
    const iframe = await this.loadIframe();
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
