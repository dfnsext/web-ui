import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";

import { RegisterCompleteResponse } from "../../../services/api/Register";
import dfnsStore from "../../../stores/DfnsStore";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { registerWithOAuth } from "../../../utils/helper";

@Component({
	tag: "dfns-login",
	styleUrl: "dfns-login.scss",
	shadow: true,
})
export class DfnsLogin {
	@Prop() authenticatorAttachment: AuthenticatorAttachment;

	@Event() passkeyCreated: EventEmitter<RegisterCompleteResponse>;
	@State() isLoading: boolean = false;

	async createPasskey() {
		try {
			this.isLoading = true;
			const response = await registerWithOAuth(
				dfnsStore.state.apiUrl,
				dfnsStore.state.appId,
				dfnsStore.state.oauthAccessToken,
				this.authenticatorAttachment,
			);
			this.isLoading = false;
			this.passkeyCreated.emit(response);
			return response;
		} catch (error) {
			this.isLoading = false;
		}
	}

	async closeBtn() {
		this.passkeyCreated.emit(null);
	}

	render() {
		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						Login
					</dfns-typography>
				</div>
				<div slot="contentSection"></div>
				<div slot="bottomSection"></div>
			</dfns-layout>
		);
	}
}
