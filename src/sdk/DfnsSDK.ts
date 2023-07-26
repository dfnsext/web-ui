import { Eip1193Provider, JsonRpcError, JsonRpcPayload } from "ethers";

export enum DFNSMessageType {
  DFNS_OVERLAY_READY = "DFNS_OVERLAY_READY",
  DFNS_SHOW_OVERLAY = "DFNS_SHOW_OVERLAY",
  DFNS_HIDE_OVERLAY = "DFNS_HIDE_OVERLAY",
  DFNS_HANDLE_REQUEST = "DFNS_HANDLE_REQUEST",
  DFNS_CONNECT = "DFNS_CONNECT",
}
export interface DfnsMessageResponse {
  type: string;
  response: Partial<JsonRpcError> & Partial<JsonRpcPayload>;
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
    /* eslint-disable-next-line no-param-reassign */
    (elem.style as any)[cssProperty as any] = value;
  }
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
  /** @optional DFNS endpoint URL */ endpoint: string;
}

export class DfnsSDK implements Eip1193Provider {
  protected readonly messageHandlers = new Set<
    (event: DfnsMessageEvent) => any
  >();
  private activeElement: any = null;

  private iframe!: Promise<HTMLIFrameElement>;

  constructor(protected options: DfnsSDKOptions) {
    this.init();
    this.listen();
  }

  init() {
    this.iframe = new Promise((resolve) => {
      const onload = () => {
        const url = new URL(this.options.frameUrl);
        const iframe = document.createElement("iframe");
        iframe.classList.add("dfns-iframe");
        iframe.dataset.dfnsIframeLabel = url.host;
        iframe.title = "DFNS";
        iframe.src = url.href;
        applyOverlayStyles(iframe);
        document.body.appendChild(iframe);
        resolve(iframe);
      };

      // Check DOM state and load...
      if (["loaded", "interactive", "complete"].includes(document.readyState)) {
        onload();
      } else {
        // ...or check load events to load
        window.addEventListener("load", onload, false);
      }
    });

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
  }

  protected async showOverlay() {
    const iframe = await this.iframe;
    iframe.style.display = "block";
    this.activeElement = document.activeElement;
    iframe.focus();
  }

  protected async hideOverlay() {
    const iframe = await this.iframe;
    iframe.style.display = "none";
    if (this.activeElement?.focus) this.activeElement.focus();
    this.activeElement = null;
  }

  public async post(
    type: DFNSMessageType,
    payload: Partial<JsonRpcPayload>
  ): Promise<Partial<JsonRpcPayload>> {
    return new Promise(async (resolve) => {

      await this._post({ type, payload });

      /**
       * Collect successful RPC responses and resolve.
       */
      const acknowledgeResponse =
        (removeEventListener: () => void) => (event: DfnsMessageEvent) => {
          const { response } = event.data;

          if (response.id && response && response.id === payload.id) {
            removeEventListener();
            resolve(response);
          }
        };

      // Listen for and handle responses.
      const removeResponseListener = this.on(
        type,
        acknowledgeResponse(() => removeResponseListener())
      );
    });
  }

  public on(
    type: DFNSMessageType,
    handler: (this: Window, event: DfnsMessageEvent) => any
  ): () => void {
    const boundHandler = handler.bind(window);

    const listener = (event: DfnsMessageEvent) => {
      if (event.data.type === type) boundHandler(event);
    };

    this.messageHandlers.add(listener);
    return () => this.messageHandlers.delete(listener);
  }

  protected async _post(data: {
    type: DFNSMessageType;
    payload: Partial<JsonRpcPayload>;
  }) {
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
  }

  request(request: {
    method: string;
    params?: any[] | Record<string, any> | undefined;
  }): Promise<any> {
    return this.post(DFNSMessageType.DFNS_HANDLE_REQUEST, request);
  }
}
