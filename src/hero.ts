// hero.ts
import { heroui } from "@heroui/react";
import { generateColorPalette } from "./utils/ui.util";

const baseLayout = {
	disabledOpacity: "0.3",
	radius: {
		small: "2px",
		medium: "2px",
		large: "2px",
	},
	borderWidth: {
		small: "1px",
		medium: "2px",
		large: "3px",
	},
};

const basePrimaryColors = {
	...generateColorPalette("#708993"),
};
export default heroui({
	themes: {
		"app-light": {
			extend: "light",
			layout: baseLayout,
			colors: {
				foreground: "#1a1a1a",
				primary: {
					...basePrimaryColors.primary,
					foreground: "#1a1a1a",
				},
			},
		},
		"app-dark": {
			extend: "dark",
			layout: baseLayout,
			colors: {
				background: "#1a1a1a",
				foreground: "#ffffff",
				primary: {
					...basePrimaryColors.primary,
					foreground: "#ffffff",
				},
			},
		},
	},
});
