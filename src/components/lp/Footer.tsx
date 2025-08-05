import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export default function Footer() {
	return (
		<footer className="border-gray-200 border-t px-4 py-8">
			<div className="mx-auto max-w-6xl text-center">
				<p className={`${notoSans.className} text-gray-500 text-sm`}>© OSpace 2025</p>
			</div>
		</footer>
	);
}
