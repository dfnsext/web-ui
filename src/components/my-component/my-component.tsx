import { Component, h } from "@stencil/core";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { EAlertVariant } from "../../utils/enums/alerts-variants";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ThemeMode } from "../../utils/theme-modes";


@Component({
	tag: "my-component",
	styleUrl: "my-component.css",
	shadow: true,
})
export class MyComponent {
  private themeMode = ThemeMode.getInstance();

componentWillLoad() {
  // Manually set the theme mode to DARK or LIGHT as desired
  this.themeMode.switch(EThemeModeType.LIGHT); // Replace EThemeModeType.DARK with EThemeModeType.LIGHT if you want to set it to light mode
}

	render() {
		return (
			<div>
				<dfns-layout closeBtn>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H6_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							Top Section Content
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<dfns-alert variant={EAlertVariant.ERROR} icon="!" iconstyle={{ color: "red" }}>
							generate text with lorem ipsum generator
						</dfns-alert>
					</div>
					<div slot="bottomSection">
						<dfns-button variant={EButtonVariant.PRIMARY} sizing={EButtonSize.LARGE} icon="checkmark" iconposition="left">
							Click Me
						</dfns-button>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
