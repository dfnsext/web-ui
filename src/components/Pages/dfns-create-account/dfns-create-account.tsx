import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";

import { RegisterCompleteResponse } from "../../../services/api/Register";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { registerWithOAuth } from "../../../utils/helper";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";

@Component({
	tag: "dfns-create-account",
	styleUrl: "dfns-create-account.scss",
	shadow: true,
})
export class DfnsCreateAccount {
	@Event() passkeyCreated: EventEmitter<RegisterCompleteResponse>;
	@State() isLoading: boolean = false;

	async createPasskey() {
		try {
			this.isLoading = true;
			const response = await registerWithOAuth(
				dfnsStore.state.apiUrl,
				dfnsStore.state.appId,
				dfnsStore.state.oauthAccessToken,
				dfnsStore.state.defaultDevice,
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
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY}>
						{langState.values.header.create_wallet}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<dfns-stepper
						steps={[
							langState.values.pages.identification.title,
							langState.values.pages.create_account.title,
							langState.values.pages.validate_wallet.title,
						]}
						activeIndices={[0]}
					/>
					<div class="contentContainer">
						<div class="title">
							<dfns-typography typo={ITypo.TEXTE_LG_SEMIBOLD} color={ITypoColor.PRIMARY}>
								{dfnsStore.state.defaultDevice === "mobile"
									? langState.values.pages.create_account.description_mobile
									: langState.values.pages.create_account.description}{" "}
								{dfnsStore.state.appName && `| ${dfnsStore.state.appName}`}
							</dfns-typography>
						</div>
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.pages.create_account.button_create}
						variant={EButtonVariant.PRIMARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						iconposition="left"
						onClick={this.createPasskey.bind(this)}
						isloading={this.isLoading}
					/>
				</div>
			</dfns-layout>
		);
	}
}
