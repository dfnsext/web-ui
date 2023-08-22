import { Component, EventEmitter, Prop, State, h, Event } from "@stencil/core";

@Component({
	tag: "dfns-input-field",
	styleUrl: "dfns-input-field.scss",
	shadow: true,
})

export class DfnsInputField {
	@Prop() value: string;
	@Prop() type: string;
	@Prop() placeholder: string;
	@Prop() isReadOnly: boolean;
	@Prop() errors: string[];
	@Prop() leftElement: any;
	@Prop() rightElement: any;
	@Prop() disableErrors: boolean;

	get containerClassName() {
		const classNames = ["container"];
		if (this.isFocused) classNames.push("focused");
		if (this.errors.length > 0) classNames.push("error");
		if (this.isReadOnly) classNames.push("read-only");
		return classNames.join(" ");
	}

	renderInput() {
		return (
			<input
				type={this.type}
				value={this.value}
				placeholder={this.placeholder}
				onInput={this.handleOnChange.bind(this)}
				onFocus={this.toggleFocus.bind(this)}
				onBlur={this.toggleFocus.bind(this)}
				readOnly={this.isReadOnly}
			/>
		);
	}

	autoRenderErrors() {
		return (
			<div class="errors">
				{this.errors.map((error) => (
					<div class="error">{error}</div>
				))}
			</div>
		);
	}

	@Event() inputChange: EventEmitter<string>;

	@State() isFocused = false;

	handleOnChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.inputChange.emit(input.value);
	}

	toggleFocus() {
		if ((this.value && this.isFocused) || this.errors.length > 0 || this.isReadOnly) return;
		this.isFocused = !this.isFocused;
	}

	render() {
		return (
			<div class={this.containerClassName}>
				{this.leftElement && <div class="left">{this.leftElement}</div>}
				{this.renderInput()}
				{this.rightElement && <div class="right">{this.rightElement}</div>}
				{!this.disableErrors && this.autoRenderErrors()}
			</div>
		);
	}
}
