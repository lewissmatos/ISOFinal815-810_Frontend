function generateColorPalette(baseColor: string) {
	// Assuming baseColor is in the format "#RRGGBB"
	const lighten = (color: string, percent: number) => {
		const num = parseInt(color.slice(1), 16),
			amt = Math.round(2.55 * percent),
			R = (num >> 16) + amt,
			B = ((num >> 8) & 0x00ff) + amt,
			G = (num & 0x0000ff) + amt;
		return (
			"#" +
			(
				0x1000000 +
				Math.min(255, Math.max(0, R)) * 0x10000 +
				Math.min(255, Math.max(0, B)) * 0x100 +
				Math.min(255, Math.max(0, G))
			)
				.toString(16)
				.slice(1)
		);
	};

	const darken = (color: string, percent: number) => {
		const num = parseInt(color.slice(1), 16),
			amt = Math.round(2.55 * percent),
			R = (num >> 16) - amt,
			B = ((num >> 8) & 0x00ff) - amt,
			G = (num & 0x0000ff) - amt;
		return (
			"#" +
			(
				0x1000000 +
				Math.min(255, Math.max(0, R)) * 0x10000 +
				Math.min(255, Math.max(0, B)) * 0x100 +
				Math.min(255, Math.max(0, G))
			)
				.toString(16)
				.slice(1)
		);
	};

	return {
		primary: {
			50: lighten(baseColor, 40),
			100: lighten(baseColor, 35),
			200: lighten(baseColor, 30),
			300: lighten(baseColor, 25),
			400: lighten(baseColor, 20),
			500: baseColor, // DEFAULT
			600: darken(baseColor, 10),
			700: darken(baseColor, 20),
			800: darken(baseColor, 30),
			900: darken(baseColor, 40),
			DEFAULT: baseColor,
		},
		focus: baseColor,
	};
}

export const getRotationDg = (direction?: "up" | "down" | "left" | "right") => {
	const directions = {
		up: 180,
		down: 0,
		left: 90,
		right: 270,
	};
	return directions[direction ?? "down"] ?? 0;
};

export type RotateIconProps = {
	direction?: "up" | "down" | "left" | "right";
};

export { generateColorPalette };
