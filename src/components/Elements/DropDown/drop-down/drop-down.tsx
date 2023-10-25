import { Component, h, State, Watch, Prop } from "@stencil/core";
import { WindowStore } from "../../../../stores/WindowStore";
import dfnsStore from "../../../../stores/DfnsStore";

@Component({
	tag: "drop-down",
	styleUrl: "drop-down.scss",
	shadow: true,
})
export class DropDown {
	@State() open = false;
	@State() dropdownHeight = 0;
	@State() animate = true;
	@Prop() closeAction?: (close: () => void) => void;
	@Prop() onOpen?: (open: boolean) => void;

	private contentRef!: HTMLDivElement;
	private removeOnresize = () => {};

	componentWillLoad() {
		if (this.closeAction) {
			this.closeAction(() => this.close());
			this.removeOnresize = WindowStore.getInstance().onResize(() => this.onResize());
		}
	}

	disconnectedCallback() {
		this.removeOnresize();
	}

	@Watch("open")
	watchOpen(newValue: boolean) {
		if (this.onOpen && !newValue) {
			this.onOpen(false);
		}

		if (!newValue) {
			this.dropdownHeight = 0;
		} else {
			this.dropdownHeight = this.contentRef?.scrollHeight ?? 0;
		}
	}

	private toogle() {
		this.open = !this.open;
		this.animate = true;
	}

	private close() {
		this.open = false;
		this.animate = true;
	}

	private onResize() {
		if (!this.open) return;

		this.dropdownHeight = 0;
		this.animate = false;

		setTimeout(() => {
			this.dropdownHeight = this.contentRef?.scrollHeight ?? 0;
			this.animate = false;
		});
	}

	render() {
		return (
			<div class="root">
				<div class="container">
					<slot name="toggle"></slot>
					<div class="wrapper" onClick={() => this.toogle()}>
						<slot name="title"></slot>
						<span class="arrow" data-open={this.open}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M12.5303 16.2803C12.2374 16.5732 11.7626 16.5732 11.4697 16.2803L3.96967 8.78033C3.67678 8.48744 3.67678 8.01256 3.96967 7.71967C4.26256 7.42678 4.73744 7.42678 5.03033 7.71967L12 14.6893L18.9697 7.71967C19.2626 7.42678 19.7374 7.42678 20.0303 7.71967C20.3232 8.01256 20.3232 8.48744 20.0303 8.78033L12.5303 16.2803Z"
									fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
								/>
							</svg>
						</span>
					</div>
				</div>
				<div
					ref={(el) => (this.contentRef = el)}
					style={{ height: `${this.dropdownHeight}px` }}
					data-open={this.open}
					data-animate={this.animate}
					class="content">
					<div class="content-padding">
						<slot name="content"></slot>
					</div>
				</div>
			</div>
		);
	}
}
