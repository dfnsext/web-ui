import { Component, Host, Prop, State, Watch, h } from "@stencil/core";

@Component({
	tag: "toggle-switch",
	styleUrl: "toggle-switch.scss",
	shadow: true,
})
export class ToggleSwitch {
	@Prop() label: string;
	@State() active: boolean = false;
	@Prop() checked: boolean = false;
	@State() className: string = "";

	private getClassName = (state: boolean) => {
		return state ? "active" : "";
	};

	private update = () => {
		this.className = this.getClassName(this.checked);
	};

	componentWillLoad() {
		this.update();
	}

	@Watch("checked")
	checkedChanged(newValue: boolean) {
		this.active = newValue;
		this.update();
	}

	render() {
		return (
			<Host>
				<button class={this.className}>
					<span>{this.label}</span>
				</button>
			</Host>
		);
	}
}
