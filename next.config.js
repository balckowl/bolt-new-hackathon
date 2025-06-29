/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["www.google.com", "images.pexels.com"],
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
