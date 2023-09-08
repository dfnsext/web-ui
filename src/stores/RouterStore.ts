import { createStore } from "@stencil/store";
import { EventEmitter } from "../services/EventEmitter";

export enum RouteType {
	"CREATE_ACCOUNT" = "create-account",
	"VALIDATE_WALLET" = "validate-wallet",
	"WALLET_VALIDATION" = "wallet-validation",
	"SIGN_MESSAGE" = "sign-message",
	"SETTINGS" = "settings",
	"CREATE_PASSKEY" = "create-passkey",
	"WALLET_OVERVIEW" = "wallet-overview",
	"RECOVERY_SETUP" = "recovery-setup",
}

const routerEvent = new EventEmitter<RouteType>();

const { state } = createStore<{
	route: RouteType | null;
	history: RouteType[];
}>({
	route: null,
	history: [] as RouteType[],
});
function navigate(route: RouteType) {
	if (state.route === route) return;
	state.route = route;
	state.history.push(state.route);
	routerEvent.emit("changed", state.route);
}

function goBack() {
	state.history.pop();
	const previousRoute = state.history[state.history.length - 1];
	if (!previousRoute) {
		state.route = null;
	}
	state.route = previousRoute;
	routerEvent.emit("changed", state.route);

}

export function close() {
	state.history = [];
	state.route = null;
	routerEvent.emit("changed", state.route);
}

const router = {
	state,
	navigate,
	goBack,
	close,
	routerEvent
};

export default router;
