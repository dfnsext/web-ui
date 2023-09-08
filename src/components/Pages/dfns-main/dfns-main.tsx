import { Component, Prop, h } from "@stencil/core";
import router, { RouteType } from "../../../stores/RouterStore"; // Import the navigate and goBack functions
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
			<div class="root">
				
				{router.state.route === RouteType.CREATE_ACCOUNT && (
					<dfns-create-account authenticatorAttachment={this.userCreationAuthenticatorAttachment}></dfns-create-account>
				)}
				{router.state.route === RouteType.RECOVERY_SETUP && (
					<dfns-recovery-setup></dfns-recovery-setup>
				)}
				{router.state.route === RouteType.VALIDATE_WALLET && <dfns-validate-wallet network={this.network}></dfns-validate-wallet>}
				{router.state.route === RouteType.WALLET_VALIDATION && <dfns-wallet-validation></dfns-wallet-validation>}
				{router.state.route === RouteType.SIGN_MESSAGE && <dfns-sign-message message={this.messageToSign}></dfns-sign-message>}
				{router.state.route === RouteType.SETTINGS && <dfns-settings></dfns-settings>}
				{router.state.route === RouteType.CREATE_PASSKEY && <dfns-create-passkey></dfns-create-passkey>}
				{router.state.route === RouteType.WALLET_OVERVIEW && <dfns-wallet-overview></dfns-wallet-overview>}
				{router.state.route === RouteType.LOGIN && <dfns-login></dfns-login>}
			</div>
		);
	}
}
