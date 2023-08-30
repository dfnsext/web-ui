import { createStore } from "@stencil/store";

export type Route =
	| "create-account"
	| "validate-wallet"
	| "wallet-validation"
	| "sign-message"
	| "settings"
	| "create-passkey"
	| "wallet-overview"
	| null;

const { state: routeState } = createStore({
	route: null as Route,
});

export function setRoute(route: Route) {
	routeState.route = route;
}
export default routeState;
