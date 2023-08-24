import { Component, Prop, h } from "@stencil/core";

@Component({
	tag: "dfns-loader",
	styleUrl: "dfns-loader.scss",
	assetsDirs: ["assets"],
  shadow: true,
})
export class DfnsLoader {
	@Prop() classCss?: string;
	@Prop() LoaderIconSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/loader.svg";
	render() {
		return <img src={this.LoaderIconSrc} class={["loader", this.classCss].filter(Boolean).join(" ")} alt="" />;
	}
}
