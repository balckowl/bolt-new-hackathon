/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	images: {
		domains: ["www.google.com", "images.pexels.com", "openweathermap.org"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.google.com",
				port: "",
				pathname: "/s2/favicons/**",
			},
		],
	},
};
module.exports = nextConfig;
