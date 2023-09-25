import { createStore } from "@stencil/store";
import PromiseDeferred from "../utils/PromiseDeferred";

const { state: deferred } = createStore(new PromiseDeferred<any>());

function inject() {
	
	if (document.readyState === "complete") {
		load();
		return;
	}
	
	window.addEventListener("DOMContentLoaded", () => {
		load();
	});
}

function load() {
	if (window["google"]) {
		deferred.resolve(window["google"]);
		return;
	}
	
	const script = document.createElement("script");
	script.src = "https://accounts.google.com/gsi/client";
	script.onload = () => deferred.resolve(window["google"]);

	const css = document.createElement("link");
	css.id = "googleidentityservice";
	css.type = "text/css";
	css.media = "all";
	css.rel = "stylesheet";
	css.href = "https://accounts.google.com/gsi/style";
	
	//*
	document.head.appendChild(script);
	document.head.appendChild(css);
}

inject();
const GoogleStore = {
	deferred,
};

export default GoogleStore;
