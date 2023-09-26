import { Component, EventEmitter, Event, JSX, Prop, h, Fragment } from "@stencil/core";
import classNames from "classnames";
import { EButtonSize, EButtonVariant } from "../../../../common/enums/buttons-enums";
import { ITypo } from "../../../../common/enums/typography-enums";

@Component({
	tag: "dfns-button",
	styleUrl: "dfns-button.scss",
	shadow: true,
})
export class DfnsButton {
	@Prop({ mutable: true }) variant: EButtonVariant = EButtonVariant.PRIMARY;
	@Prop({ mutable: true }) sizing: EButtonSize = EButtonSize.LARGE;
	@Prop({ mutable: true }) content: string;
	@Prop() disabled = false;
	@Prop() type: "button" | "submit" = "button";
	@Prop() isloading = false;
	@Prop() fullwidth = false;
	@Prop() iconposition: "left" | "right" = "right";
	@Prop() icon?: JSX.Element;
	@Prop() iconUrl?: string;
	@Prop() iconstyle?: any;
	@Prop() classCss?: string;
	@Prop() onClick: () => any;

	@Event() buttonClick: EventEmitter<void>;

	private get fullwidthattr(): string {
		return this.fullwidth.toString();
	}

	componentWillLoad() {
		if (!this.variant) {
			this.variant = EButtonVariant.PRIMARY; // Set default variant value if not provided
		}

		if (!this.sizing) {
			this.sizing = EButtonSize.LARGE; // Set default sizing value if not provided
		}
	}

	private formatWithTypo(): JSX.Element | null {
		switch (this.sizing) {
			case EButtonSize.SMALL:
				return <dfns-typography typo={ITypo.TEXTE_SM_REGULAR}>{this.content}</dfns-typography>;
			case EButtonSize.MEDIUM:
				return <dfns-typography typo={ITypo.TEXTE_MD_REGULAR}>{this.content}</dfns-typography>;
			case EButtonSize.LARGE:
				return <dfns-typography typo={ITypo.TEXTE_LG_REGULAR}>{this.content}</dfns-typography>;
			default:
				return null;
		}
	}

	render() {
		const attributes = {
			variant: this.variant,
			sizing: this.sizing,
			disabled: this.disabled,
			type: this.type,
			fullwidthattr: this.fullwidthattr,
			class: classNames("root", this.classCss),
		};

		return (
			<button onClick={this.onClick} {...attributes} class={classNames("root", this.classCss)} type={this.type}>
				<Fragment>
					{this.isloading ? <dfns-loader size="small" /> : null}
					{!this.isloading && this.icon && this.iconposition === "left" ? <div class="icon">{this.icon}</div> : null}
					{!this.isloading && this.iconUrl && this.iconposition === "left" ? (
						<div class="icon">
							<img src={this.iconUrl} alt={this.iconUrl} width={18} height={18} />
						</div>
					) : null}
					{!this.isloading ? this.formatWithTypo() : null}
					{!this.isloading && this.icon && this.iconposition === "right" ? <div class="icon">{this.icon}</div> : null}
					
					{!this.isloading && this.iconUrl && this.iconposition === "right" ? (
						<div class="icon">
							<img src={this.iconUrl} alt={this.iconUrl} width={18} height={18} />
						</div>
					) : null}
				</Fragment>
			</button>
		);
	}
}
