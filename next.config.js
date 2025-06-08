/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		unoptimized: true,
		domains: ["www.google.com"],
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
