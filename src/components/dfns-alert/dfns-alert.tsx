import { Component, Prop, h, getAssetPath, JSX, Fragment } from "@stencil/core";
import classNames from "classnames";
import { EAlertVariant } from "../../utils/enums/alerts-enums";
import { ITypo } from "../../utils/enums/typography-enums";

@Component({
	tag: "dfns-alert",
	styleUrl: "dfns-alert.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsAlert {
	@Prop({ mutable: true }) variant: EAlertVariant = EAlertVariant.INFO;
	@Prop() classCss?: string;
	@Prop() errorIconSrc = "icons/x-circle.svg";
	@Prop() warningIconSrc = "icons/exclamation-triangle.svg";
	@Prop() infoIconSrc = "icons/exclamation-circle.svg";
	@Prop({ mutable: true }) hasTitle = false;

	private getIconVariant(): JSX.Element | null {
		switch (this.variant) {
			case EAlertVariant.WARNING:
				return <img alt="Warning" src={getAssetPath(`./assets/${this.warningIconSrc}`)} width={24} height={24} />;
			case EAlertVariant.ERROR:
				return <img alt="Error" src={getAssetPath(`./assets/${this.errorIconSrc}`)} width={24} height={24} />;
			case EAlertVariant.INFO:
				return <img alt="Info" src={getAssetPath(`./assets/${this.infoIconSrc}`)} width={24} height={24} />;
			default:
				return null;
		}
	}

	render() {
		const attributes = {
			variant: this.variant,
			class: classNames("root", this.classCss),
		};
		return (
			<Fragment>
				<div {...attributes}>
					<div class="icon">{this.getIconVariant()}</div>
					<div class="container">
						{this.hasTitle && (
							<div class="title">
								<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}>
									<slot name="title"></slot>
								</dfns-typography>
							</div>
						)}
						<div class="content">
							<dfns-typography typo={ITypo.TEXTE_SM_REGULAR}>
								<slot name="content"></slot>
							</dfns-typography>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}
