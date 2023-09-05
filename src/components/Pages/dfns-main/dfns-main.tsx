import { Component, Prop, h } from "@stencil/core";
import routeState from "../../../stores/RouteStore"; // Import the setRoute and goBack functions
import { BlockchainNetwork } from "@dfns/sdk/codegen/datamodel/Wallets";


@Component({
	tag: "dfns-main",
	styleUrl: "dfns-main.scss",
	shadow: true,
})
export class DfnsMain {
	@Prop() userCreationAuthenticatorAttachment: AuthenticatorAttachment;
	@Prop() messageToSign: string;
	@Prop() network: BlockchainNetwork;

	render() {
		return (
			<div class="root" data-visible={routeState.route ? "visible" : "hidden"}>
				<div class="backdrop" />
				{routeState.route === "create-account" && (
					<dfns-create-account authenticatorAttachment={this.userCreationAuthenticatorAttachment}></dfns-create-account>
				)}
				{routeState.route === "validate-wallet" && <dfns-validate-wallet network={this.network}></dfns-validate-wallet>}
				{routeState.route === "wallet-validation" && <dfns-wallet-validation></dfns-wallet-validation>}
				{routeState.route === "sign-message" && <dfns-sign-message message={this.messageToSign}></dfns-sign-message>}
				{routeState.route === "settings" && <dfns-settings></dfns-settings>}
				{routeState.route === "create-passkey" && <dfns-create-passkey></dfns-create-passkey>}
				{routeState.route === "wallet-overview" && <dfns-wallet-overview></dfns-wallet-overview>}
			</div>
		);
	}
}
