/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	webpack: (config) => {
		config.externals.push("encoding" /* add any other modules that might be causing the error */);
		return config;
	},
	images: {
		domains: ["www.google.com", "images.pexels.com", "openweathermap.org", "api.microlink.io"],
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
