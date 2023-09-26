import { Component, Prop, h, JSX, Fragment } from "@stencil/core";
import classNames from "classnames";

import dfnsStore from "../../../../stores/DfnsStore";
import chroma from "chroma-js";
import { EAlertVariant } from "../../../../common/enums/alerts-enums";
import { ITypo } from "../../../../common/enums/typography-enums";

@Component({
	tag: "dfns-alert",
	styleUrl: "dfns-alert.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsAlert {
	@Prop({ mutable: true }) variant: EAlertVariant = EAlertVariant.INFO;
	@Prop() classCss?: string;
	@Prop({ mutable: true }) hasTitle = false;
	

	private getIconVariant(): JSX.Element | null {
		const primaryColor_400 = dfnsStore.state.colors ? dfnsStore.state.colors.primary_400 : "#FFFFFF";
		const infoIconSrc: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M12 9V12.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12 15.75H12.0075V15.7575H12V15.75Z"
					stroke={primaryColor_400}
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		);
		const warningIconSrc: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M11.9998 9.00006V12.7501M2.69653 16.1257C1.83114 17.6257 2.91371 19.5001 4.64544 19.5001H19.3541C21.0858 19.5001 22.1684 17.6257 21.303 16.1257L13.9487 3.37819C13.0828 1.87736 10.9167 1.87736 10.0509 3.37819L2.69653 16.1257ZM11.9998 15.7501H12.0073V15.7576H11.9998V15.7501Z"
					stroke="#F59E0B"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		);
		const errorIconSrc: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
					stroke="#EF4444"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		);

		switch (this.variant) {
			case EAlertVariant.WARNING:
				return warningIconSrc;
			case EAlertVariant.ERROR:
				return errorIconSrc;
			case EAlertVariant.INFO:
				return infoIconSrc;
			default:
				return null;
		}
	}

	render() {
		const attributes = {
			variant: this.variant,
			class: classNames("root", this.classCss),
		};
		const primaryColor_500 = dfnsStore.state.colors ? dfnsStore.state.colors.primary_500 : "#FFFFFF";
		return (
			<Fragment>
				<div
					{...attributes}
					style={
						dfnsStore.state.theme.includes("dark") && this.variant === EAlertVariant.INFO
							? {
									backgroundColor: chroma(primaryColor_500).alpha(0.1).hex(),
									border: "1px solid" + chroma(primaryColor_500).alpha(0.25).hex(),
							  }
							: {}
					}>
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
