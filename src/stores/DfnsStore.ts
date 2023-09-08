import { CredentialInfo } from "@dfns/sdk/codegen/datamodel/Auth";
import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { createStore } from "@stencil/store";
import LocalStorageService, {
	DFNS_ACTIVE_WALLET,
	DFNS_CREDENTIALS,
	DFNS_END_USER_TOKEN,
	OAUTH_ACCESS_TOKEN,
} from "../services/LocalStorageService";
import { EventEmitter } from "../services/EventEmitter";

interface DfnsState {
	appName: string | null;
	apiUrl: string | null;
	dfnsHost: string | null;
	appId: string | null;
	rpId: string | null;
	dfnsUserToken: string | null;
	wallet: Wallet | null;
	oauthAccessToken: string | null;
	appLogoUrl: string | null;
	credentials: CredentialInfo[];
}

const dfnsStoreEvent = new EventEmitter<DfnsState>();

const { state } = createStore<DfnsState>({
	appName: null,
	apiUrl: null,
	dfnsHost: null,
	appId: null,
	rpId: null,
	dfnsUserToken: null,
	wallet: null,
	appLogoUrl: null,
	oauthAccessToken: null,
	credentials: [],
});

function setValue<T extends keyof DfnsState>(key: T, value: DfnsState[T]) {
	if (key === "dfnsUserToken") {
		LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(value as string);
	}
	if (key === "oauthAccessToken") {
		LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].set(value as string);
	}
	if (key === "wallet") {
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(value as Wallet);
	}
	if (key === "credentials") {
		LocalStorageService.getInstance().items[DFNS_CREDENTIALS].set(value as CredentialInfo[]);
	}
	state[key] = value;
	dfnsStoreEvent.emit("changed", state);
}

function disconnect() {
	state.dfnsUserToken = null;
	state.oauthAccessToken = null;
	state.wallet = null;
	state.credentials = [];
	LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].delete();
	LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].delete();
	LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].delete();
	LocalStorageService.getInstance().items[DFNS_CREDENTIALS].delete();
	dfnsStoreEvent.emit("changed", state);
	dfnsStoreEvent.emit("disconnected", state);
}

const dfnsStore: {
	state: Readonly<DfnsState>;
	setValue: <T extends keyof DfnsState>(key: T, value: DfnsState[T]) => void;
	disconnect: () => void;
	dfnsStoreEvent: EventEmitter<DfnsState>;
} = {
	state,
	setValue,
	disconnect,
	dfnsStoreEvent
};

export default dfnsStore;
