import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
	scrollY: number;
};

export default function Recommend({ scrollY }: Props) {
	return (
		<section
			className="relative px-4 py-20"
			style={{
				transform: `translateY(${scrollY * 0.02}px)`,
			}}
		>
			<div className="mx-auto mb-20 max-w-4xl">
				<Card className="border-none shadow-none">
					<CardContent className="p-16 text-center">
						<h2 className="mb-8 font-bold text-3xl text-gray-800">Your unique link</h2>
						<p className="mb-8 text-gray-700 text-lg leading-relaxed">
							Launch your own original "OS" on the web and create something amazing!
						</p>
						<Button
							asChild
							size="lg"
							className="rounded-lg bg-blue-600 px-8 py-4 font-medium text-lg text-white hover:bg-blue-700"
						>
							<Link href="/login">
								Get Started
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
