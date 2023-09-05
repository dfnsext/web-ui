import { CredentialInfo } from "@dfns/sdk/codegen/datamodel/Auth";
import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { createStore } from "@stencil/store";

interface DfnsState {
	appName: string | null;
	apiUrl: string | null;
	dfnsHost: string | null;
	appId: string | null;
	rpId: string | null;
	dfnsUserToken: string | null;
	wallet: Wallet | null;
	oauthAccessToken: string | null;
	credentials: CredentialInfo[];
}
const { state: dfnsState } = createStore<DfnsState>({
	appName: null,
	apiUrl: null,
	dfnsHost: null,
	appId: null,
	rpId: null,
	dfnsUserToken: null,
	wallet: null,
	oauthAccessToken: null,
	credentials: [],
});

export default dfnsState;
