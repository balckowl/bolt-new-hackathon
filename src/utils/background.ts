export const getBackgroundStyle = (background: string | undefined) => {
	if (!background) return {};

	if (background?.startsWith("http")) {
		return {
			backgroundImage: `url(${background})`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			backgroundRepeat: "no-repeat",
		};
	}
	return {
		background,
	};
};
