import { Component, Host, Prop, h } from "@stencil/core";
import { ITypo } from "../../utils/enums/typography-enums";

@Component({
	tag: "dfns-stepper",
	styleUrl: "dfns-stepper.scss",
	shadow: true,
})
export class DfnsStepper {
	@Prop() icon?: string;
	@Prop() iconstyle?: string;
	@Prop() classCss?: string;
	@Prop() steps: string[] = [];
	@Prop() activeIndices: number[] = [];

	render() {
		return (
			<Host>
				<div class="wrapper-stepper">
					<ul class="stepper">
						{this.steps.map((step, index) => (
							<li key={step} class={this.getActiveClass(index)}>
								<dfns-typography typo={ITypo.TEXTE_XS_REGULAR}>{step}</dfns-typography>
							</li>
						))}
					</ul>
				</div>
			</Host>
		);
	}

	getActiveClass(index: number): string {
		return this.activeIndices.includes(index) ? "active" : "";
	}
}
