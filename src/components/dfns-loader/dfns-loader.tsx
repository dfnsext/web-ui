import { Component, Prop, getAssetPath, h } from "@stencil/core";

@Component({
	tag: "dfns-loader",
	styleUrl: "dfns-loader.scss",
	assetsDirs: ["assets"],
  shadow: true,
})
export class DfnsLoader {
	@Prop() classCss?: string;
	@Prop() LoaderIconSrc = "icons/loader.svg";
	render() {
		return <img src={getAssetPath(`./assets/${this.LoaderIconSrc}`)} class={["loader", this.classCss].filter(Boolean).join(" ")} alt="" />;
	}
}
