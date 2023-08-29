import en from "../../configs/lang/en.json";
import fr from "../../configs/lang/fr.json";
import { createStore } from "@stencil/store";

const { state: langState } = createStore({
	values: en,
});

export function setActiveLanguage(language: "en" | "fr") {
	if (language === "en") {
		langState.values = en;
	}
	if (language === "fr") {
		langState.values = fr;
	}
}

export default langState;
