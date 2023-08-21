import { Component, Fragment, Prop, h } from "@stencil/core";
import { ITypo } from "../../utils/enums/typography-enums";

@Component({
	tag: "dfns-textarea",
	styleUrl: "dfns-textarea.scss",
	shadow: true,
})
export class DfnsTextarea {
	@Prop({ mutable: true }) appName: string = "";
	@Prop({ mutable: true }) privacyLink: string = "";
	@Prop({ mutable: true }) tosLink: string = "";
	@Prop({ mutable: true }) walletAddress: string = "";
	@Prop({ mutable: true }) nonceValue: string = "";
	render() {
		return (
			<Fragment>
				<div class="textarea">
					<div class="wrapper">
						<div class="content">
							<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}>Welcome to {this.appName}!</dfns-typography>
							<dfns-typography typo={ITypo.TEXTE_SM_REGULAR}>
								<div class="sub-container">
									<span>
										Click to sign in and accept the {this.appName} Terms of Service <a href={this.tosLink}>({this.tosLink})</a> and Privacy Policy
										<a href={this.privacyLink}>({this.privacyLink})</a>.
									</span>
									<span>
										This request will not trigger a blockchain transaction or cost any gas fees. Your authentication
										status will reset after 24 hours.
									</span>
									<span>
										<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}> Wallet address:</dfns-typography>
										<br />
										{this.walletAddress}
									</span>
									<span>
										<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}> Nonce: </dfns-typography>
										<br />
										{this.nonceValue}
									</span>
								</div>
							</dfns-typography>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
