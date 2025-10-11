const LIGHT_DEGREE_STORAGE_KEY = "lightDeg";
const DEFAULT_BRIGHTNESS = 0.1;
const MAX_BRIGHTNESS = 0.6;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeBrightness = (value: number) => {
	if (!Number.isFinite(value)) return DEFAULT_BRIGHTNESS;
	return clamp(value, 0, MAX_BRIGHTNESS);
};

const parseStoredBrightness = (rawValue: string | null) => {
	if (!rawValue) return DEFAULT_BRIGHTNESS;
	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return DEFAULT_BRIGHTNESS;
	// Support legacy percentage values (0-100) by converting to decimal.
	const candidate = numeric > 1 ? numeric / 100 : numeric;
	return normalizeBrightness(candidate);
};

export const lightDegreeLocalStore = {
	get: () => {
		if (typeof window === "undefined") {
			return DEFAULT_BRIGHTNESS;
		}
		return parseStoredBrightness(window.localStorage.getItem(LIGHT_DEGREE_STORAGE_KEY));
	},
	set: (brightness: number) => {
		if (typeof window === "undefined") {
			return;
		}
		const normalized = normalizeBrightness(brightness);
		window.localStorage.setItem(LIGHT_DEGREE_STORAGE_KEY, String(normalized));
	},
	key: LIGHT_DEGREE_STORAGE_KEY,
	defaultValue: DEFAULT_BRIGHTNESS,
};

export type LightDegreeLocalStore = typeof lightDegreeLocalStore;
