"use server";

import { env } from "@/src/env.mjs";

export async function getWeather(lat: number, lon: number) {
	const res = await fetch(
		`${env.OPENWEATHERMAP_API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env.OPENWEATHERMAP_API_KEY}`,
	);
	const data = await res.json();
	return data.weather[0].icon;
}
