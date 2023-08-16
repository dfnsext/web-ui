import { Component, Prop, State, h } from "@stencil/core";
import { ThemeMode } from "../../utils/theme-modes";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { LanguageService } from "../../services/language-services";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EAlertVariant } from "../../utils/enums/alerts-enums";

@Component({
	tag: "dfns-create-passkey",
	styleUrl: "dfns-create-passkey.scss",
	shadow: true,
})
export class DfnsCreatePasskey {
	private themeMode = ThemeMode.getInstance();
	@Prop({ mutable: true }) visible: string;
	@State() isLoading: boolean = false;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	render() {
		return (
			<div class={this.visible ? "container visible" : "container"}>
				<dfns-layout closeBtn>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							Create passkey
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<div class="contentContainer">
              <dfns-input-field placeholder="Enter passkey" value="test"></dfns-input-field>
							<dfns-alert variant={EAlertVariant.WARNING}>
								<div slot="title">{LanguageService.getContent("pages.create_passkey.alert_title")}</div>
								<div slot="content">{LanguageService.getContent("pages.create_passkey.alert_description")}</div>
							</dfns-alert>
						</div>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={LanguageService.getContent("pages.create_passkey.button_create")}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							iconposition="left"
							onClick={() => {}}
							isloading={this.isLoading}
						/>
						<dfns-button
							content={LanguageService.getContent("buttons.back")}
							variant={EButtonVariant.SECONDARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							iconposition="left"
							onClick={() => {}}
							isloading={this.isLoading}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
