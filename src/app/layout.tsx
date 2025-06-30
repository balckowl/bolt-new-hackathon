import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { env } from "../env.mjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: {
		default: "OSpace",
		// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
		template: `%s | OSpace`,
	},
	description: "Create your very own OS on the web.",
	openGraph: {
		title: {
			default: "OSpace",
			// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
			template: `%s | OSpace`,
		},
		description: "Create your very own OS on the web.",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
