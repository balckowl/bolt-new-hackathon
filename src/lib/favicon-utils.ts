export const checkUrlExists = async (url: string): Promise<boolean> => {
	try {
		const response = await fetch(url, {
			method: "HEAD",
			mode: "no-cors",
		});
		if (response.type === "opaque") {
			return true;
		}
		return false;
	} catch (error) {
		return false;
	}
};
