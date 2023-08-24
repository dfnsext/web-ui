import { Component, Prop, h } from "@stencil/core";

@Component({
	tag: "dfns-main",
	styleUrl: "dfns-main.scss",
	shadow: true, // Enables Shadow DOM
})
export class DfnsMain {
	@Prop({ mutable: true }) visible: string;

	render() {
		return (
			<div class={this.visible ? "root visible" : "root"}>
				<div class="backdrop"></div>
				<slot />
			</div>
		);
	}
}
