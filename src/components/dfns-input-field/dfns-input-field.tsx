import { Component, EventEmitter, Prop, State, h, Event } from "@stencil/core";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";

@Component({
	tag: "dfns-input-field",
	styleUrl: "dfns-input-field.scss",
	shadow: true,
})
export class DfnsInputField {
	@Prop() value: string;
	@Prop() type: string;
	@Prop() placeholder: string;
	@Prop() label: string;
	@Prop() isReadOnly: boolean;
	@Prop() errors: string[] = [];
	@Prop() leftElement: any;
	@Prop() rightElement: any;
	@Prop() disableErrors: boolean;
	@Prop() fullWidth: boolean;
	@Prop() onChange: (input: string) => void;
	@Event() inputChange: EventEmitter<string>;
	@State() isFocused = false;

	get containerClassName() {
		const classNames = ["wrapper"];
		if (this.isFocused) classNames.push("focused");
		if (this.errors.length > 0) classNames.push("error");
		if (this.isReadOnly) classNames.push("read-only");
		if (this.fullWidth) classNames.push("full-width");
		return classNames.join(" ");
	}

	renderInput() {
		return (
			<div>
				<slot />
				<input
					class="input"
					type={this.type}
					value={this.value}
					placeholder={this.placeholder}
					onInput={this.handleOnChange.bind(this)}
					onFocus={this.toggleFocus.bind(this)}
					onBlur={this.toggleFocus.bind(this)}
					// onChange={this.handleOnChange.bind(this)}
					readOnly={this.isReadOnly}
				/>
			</div>
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

	handleOnChange(event: Event) {
		const input = event.target as HTMLInputElement;
		this.inputChange.emit(input.value);
		this.onChange(input.value);
	}

	toggleFocus() {
		if ((this.value && this.isFocused) || this.errors.length > 0 || this.isReadOnly) return;
		this.isFocused = !this.isFocused;
	}

	render() {
		return (
			<div class="root">
				<div class={this.containerClassName}>
					<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
						{this.label}
					</dfns-typography>
					<label></label>
					{this.leftElement && <div class="left">{this.leftElement}</div>}
					{this.renderInput()}
					{this.rightElement && <div class="right">{this.rightElement}</div>}
					{!this.disableErrors && this.autoRenderErrors()}
				</div>
			</div>
		);
	}
}
