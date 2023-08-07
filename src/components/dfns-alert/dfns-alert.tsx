import { Component, Prop, h } from "@stencil/core";
import classNames from "classnames";
import { EAlertVariant } from "../../utils/enums/alerts-enums";
import { ITypo } from "../../utils/enums/typography-enums";

@Component({
	tag: "dfns-alert",
	styleUrl: "dfns-alert.scss",
	shadow: true,
})
export class DfnsAlert {
	@Prop() variant: EAlertVariant = EAlertVariant.INFO;
	@Prop() icon?: string | null | false;
	@Prop() iconstyle?: any;
	@Prop() classCss?: string;

	render() {
		const attributes = {
			variant: this.variant,
			class: classNames("root", this.classCss),
			style: this.iconstyle,
		};
		return (
			<div {...attributes}>
				{this.icon ? <div class="icon">{this.icon}</div> : null}
				<my-typography typo={ITypo.TEXTE_SM_REGULAR}>
					<slot></slot>
				</my-typography>
			</div>
		);
	}
}
