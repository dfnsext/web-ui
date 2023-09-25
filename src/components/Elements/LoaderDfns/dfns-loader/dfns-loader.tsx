import { Component, JSX, Prop, h } from "@stencil/core";
import dfnsStore from "../../../../stores/DfnsStore";

@Component({
	tag: "dfns-loader",
	styleUrl: "dfns-loader.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsLoader {
	@Prop() classCss?: string;
	@Prop() size?: "small" | "large" = "small";
	render() {
		const LoaderIconSrc: JSX.Element = (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={this.size === "small" ? "32" : "64"}
				height={this.size === "small" ? "32" : "64"}
				viewBox="0 0 64 64"
				fill="none">
				<path
					d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM6.4 32C6.4 46.1385 17.8615 57.6 32 57.6C46.1385 57.6 57.6 46.1385 57.6 32C57.6 17.8615 46.1385 6.4 32 6.4C17.8615 6.4 6.4 17.8615 6.4 32Z"
					fill={this.size === "small" && dfnsStore.state.theme.includes("dark") ? "#FFFFFF" : dfnsStore.state.colors.primary_500}
					fill-opacity="0.1"
				/>
				<path
					d="M32 3.2C32 1.43269 33.4362 -0.0165716 35.1947 0.159867C38.3011 0.471548 41.351 1.23674 44.2459 2.43586C48.1283 4.04401 51.6559 6.40111 54.6274 9.37259C57.5989 12.3441 59.956 15.8717 61.5641 19.7541C62.7633 22.6491 63.5285 25.6989 63.8401 28.8053C64.0166 30.5638 62.5673 32 60.8 32C59.0327 32 57.6206 30.5618 57.4003 28.8083C57.1156 26.5431 56.5286 24.3214 55.6513 22.2033C54.3648 19.0974 52.4791 16.2752 50.1019 13.8981C47.7248 11.5209 44.9026 9.63521 41.7967 8.34868C39.6786 7.47135 37.4569 6.88438 35.1917 6.59974C33.4382 6.3794 32 4.96731 32 3.2Z"
					fill={this.size === "small" && dfnsStore.state.theme.includes("dark") ? "#FFFFFF" : dfnsStore.state.colors.primary_500}
				/>
			</svg>
		);
		return <div class={["loader", this.classCss].filter(Boolean).join(" ")}>{LoaderIconSrc}</div>;
	}
}
