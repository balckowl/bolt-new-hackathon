"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { env } from "../env.mjs";
import { getWeather } from "../utils/weather";

export const WeatherIcon = () => {
	const [weather, setWeather] = useState<string | null>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			if (!latitude || !longitude) {
				return;
			}
			const icon = await getWeather(latitude, longitude);
			if (!icon) return;
			setWeather(icon);
		});
	}, []);
	if (!weather) {
		return null;
	}
	return (
		<Image
			src={`${env.OPENWEATHERMAP_API_URL}/img/wn/${weather}@2x.png`}
			alt="天気"
			width={30}
			height={30}
		/>
	);
};
