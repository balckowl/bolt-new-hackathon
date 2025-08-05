import { ArrowRight } from "lucide-react";
import { Chewy, Noto_Sans } from "next/font/google";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const chewy = Chewy({ subsets: ["latin"], weight: "400" });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export default function Recommend() {
	return (
		<section className="relative px-4 py-20">
			<div className="mx-auto mb-20 max-w-4xl">
				<Card className="border-none shadow-none">
					<CardContent className="p-16 text-center">
						<h2 className={`${chewy.className} mb-8 font-bold text-3xl text-gray-800`}>
							Ready to build?
						</h2>
						<p className={`${notoSans.className} mb-8 text-gray-700 text-lg leading-relaxed`}>
							Use your unique link to launch a web OS and make something incredible!
						</p>
						<Button className="rounded-xl bg-blue-600 px-5 py-4 text-md hover:bg-blue-700" asChild>
							<Link href="/login">
								Get Started <ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
