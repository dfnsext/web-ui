import { Component, Prop, h } from "@stencil/core";
import { match } from "ts-pattern";
import dfnsStore from "../../../stores/DfnsStore";
import router, { RouteType } from "../../../stores/RouterStore"; // Import the navigate and goBack functions
import { TransferKind } from "@dfns/sdk/codegen/datamodel/Wallets";
import { Amount, BlockchainAddress } from "@dfns/sdk/codegen/datamodel/Foundations";

@Component({
	tag: "dfns-main",
	styleUrl: "dfns-main.scss",
	shadow: true,
})
export class DfnsMain {
	@Prop() messageToSign: string;
	@Prop() shouldShowWalletValidation: boolean;
	@Prop() transactionTo: BlockchainAddress;
	@Prop() transactionValue: Amount;
	@Prop() transactionData?: BlockchainAddress;
	@Prop() transactionTokenSymbol?: string;
	@Prop() transactionDecimals?: number;
	@Prop() transactionNonce?: number;

	render() {
		const page = match(router.state.route)
			.with(RouteType.CREATE_ACCOUNT, () => <dfns-create-account></dfns-create-account>)
			.with(RouteType.RECOVERY_SETUP, () => <dfns-recovery-setup></dfns-recovery-setup>)
			.with(RouteType.VALIDATE_WALLET, () => (
				<dfns-validate-wallet shouldShowWalletValidation={this.shouldShowWalletValidation}></dfns-validate-wallet>
			))
			.with(RouteType.WALLET_VALIDATION, () => <dfns-wallet-validation></dfns-wallet-validation>)
			.with(RouteType.SIGN_MESSAGE, () => <dfns-sign-message message={this.messageToSign}></dfns-sign-message>)
			.with(RouteType.SETTINGS, () => <dfns-settings></dfns-settings>)
			.with(RouteType.CREATE_PASSKEY, () => <dfns-create-passkey></dfns-create-passkey>)
			.with(RouteType.WALLET_OVERVIEW, () => <dfns-wallet-overview></dfns-wallet-overview>)
			.with(RouteType.LOGIN, () => <dfns-login shouldShowWalletValidation={this.shouldShowWalletValidation}></dfns-login>)
			.with(RouteType.TRANSFER_TOKENS, () => <dfns-transfer-tokens></dfns-transfer-tokens>)
			.with(RouteType.CONFIRM_TRANSACTION, () => (
				<dfns-confirm-transaction
					to={this.transactionTo}
					value={this.transactionValue}
					decimals={this.transactionDecimals}
					tokenSymbol={this.transactionTokenSymbol}
					data={this.transactionData}
					txNonce={this.transactionNonce}
					></dfns-confirm-transaction>
			))
			.with(RouteType.RECEIVE_TOKENS, () => <dfns-receive-tokens></dfns-receive-tokens>)
			.with(null, () => null)
			.with(undefined, () => null)
			.exhaustive();

		return (
			<div class="root" theme-mode={dfnsStore.state.theme} data-visible={router.state.route ? "visible" : "hidden"}>
				<div class="backdrop" />
				<div class="content">{page}</div>
			</div>
		);
	}
}
