import { Component, JSX, Prop, h } from "@stencil/core";
import { ITypo, ITypoColor } from "../../../../common/enums/typography-enums";

@Component({
	tag: "drop-down-container",
	styleUrl: "drop-down-container.scss",
	shadow: true,
})
export class DropDownContainer {
	@Prop() dropdownContent: { children: JSX.Element; title: string; content: JSX.Element }[] = [];
	private closableCallbacks: (() => void)[] = [];

	onOpen() {
		this.closeAll();
	}

	closeAll() {
		this.closableCallbacks.forEach((close) => {
			close();
		});
	}

	render() {
		return (
			<div class="root">
				{this.dropdownContent.map((dropdown, i) => (
					<drop-down key={i} closeAction={(closable) => this.closableCallbacks.push(closable)} onOpen={() => this.onOpen()}>
						<div slot="toggle">
							<div class="wrapper"> {dropdown.children}</div>
						</div>
						<div slot="title">
							<div class="title-section">
								<dfns-typography typo={ITypo.TEXTE_MD_SEMIBOLD} color={ITypoColor.PRIMARY}>
									{dropdown.title}
								</dfns-typography>
							</div>
						</div>
						<div slot="content">
							<div class="content-section">{dropdown.content}</div>
						</div>
					</drop-down>
				))}
			</div>
		);
	}
}
