import { Component, EventEmitter, Prop, State, h, Event, JSX } from "@stencil/core";
import { ITypo, ITypoColor } from "../../../../../common/enums/typography-enums";
import dfnsStore from "../../../../../stores/DfnsStore";

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
	@Prop({ mutable: true }) isPasswordVisible = false;
	@State() showPassword = false;

	get containerClassName() {
		const classNames = ["wrapper"];
		if (this.isFocused) classNames.push("focused");
		if (this.errors.length > 0) classNames.push("error");
		if (this.isReadOnly) classNames.push("read-only");
		if (this.fullWidth) classNames.push("full-width");
		return classNames.join(" ");
	}

	get inputClassName() {
		const classNames = ["input"];
		if (this.isFocused) classNames.push("focused");
		if (this.errors.length > 0) classNames.push("error");
		if (this.isReadOnly) classNames.push("read-only");
		return classNames.join(" ");
	}

	renderInput() {
		const eyeIcon: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M0.664255 10.5904C0.517392 10.2087 0.517518 9.78563 0.66461 9.40408C2.10878 5.65788 5.7433 3 9.99859 3C14.256 3 17.892 5.66051 19.3347 9.40962C19.4816 9.79127 19.4814 10.2144 19.3344 10.5959C17.8902 14.3421 14.2557 17 10.0004 17C5.74298 17 2.10698 14.3395 0.664255 10.5904ZM14.0004 10C14.0004 12.2091 12.2095 14 10.0004 14C7.79123 14 6.00037 12.2091 6.00037 10C6.00037 7.79086 7.79123 6 10.0004 6C12.2095 6 14.0004 7.79086 14.0004 10Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
		return (
			<div>
				<slot />
				<div class="input-container">
					<input
						class={this.inputClassName}
						type={this.type == "password" && !this.isPasswordVisible && !this.showPassword ? "password" : "text"}
						value={this.value}
						placeholder={this.placeholder}
						onInput={this.handleOnChange.bind(this)}
						onFocus={this.toggleFocus.bind(this)}
						onBlur={this.toggleFocus.bind(this)}
						// onChange={this.handleOnChange.bind(this)}
						readOnly={this.isReadOnly}
					/>
					{this.rightElement && (
						<div class="right" onClick={this.handleRightElementClick.bind(this)}>
							{this.rightElement}
						</div>
					)}
					{this.type == "password" && (
						<i
							class="fa-solid fa-eye"
							role="button"
							onClick={() => {
								this.isPasswordVisible = !this.isPasswordVisible;
								this.showPassword = !this.showPassword;
							}}>
							{eyeIcon}
						</i>
					)}
				</div>
			</div>
		);
	}

	handleRightElementClick(event: Event) {
		// Vous pouvez implémenter ici le comportement souhaité lorsque l'élément de droite est cliqué
		// Par exemple, ouvrir une boîte de dialogue, effectuer une action, etc.
	}

	autoRenderErrors() {
		return (
			<div class="errors">
				{this.errors.map((error) => (
					<div class="error">
						<dfns-typography typo={ITypo.TEXTE_XS_REGULAR}>{error}</dfns-typography>
					</div>
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
					{this.leftElement && <div class="left">{this.leftElement}</div>}
					{this.renderInput()}
					{!this.disableErrors && this.autoRenderErrors()}
				</div>
			</div>
		);
	}
}
