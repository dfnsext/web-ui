import { Component, Host, Prop, h } from "@stencil/core";

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
		const shouldRemoveClasses = this.activeIndices.includes(0) && this.activeIndices.includes(1);

		return (
			<Host>
				<div class="wrapper-stepper">
					<ul class={`stepper ${shouldRemoveClasses ? "remove-classes" : ""}`}>
						{this.steps.map((step, index) => (
							<li key={step} class={this.getActiveClass(index)}>
								{step}
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
