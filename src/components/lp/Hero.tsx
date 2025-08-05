import { env } from "@/src/env.mjs";
import { ArrowRight } from "lucide-react";
import { Chewy } from "next/font/google";
import Link from "next/link";
import { Safari } from "../magicui/safari";
import { Button } from "../ui/button";
import Container from "./Container";

export const chewy = Chewy({ subsets: ["latin"], weight: "400" });

export default function Hero() {
	return (
		<div className="flex h-[550px] flex-col justify-end bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800">
			<Container>
				<div className="space-y-7 text-center">
					<h2 className={`text-center font-semibold text-4xl text-white ${chewy.className}`}>
						Your browser is now <br /> changing into “my own OS.”
					</h2>
					<Button className="rounded-xl px-5 py-4 text-md" asChild>
						<Link href="/login">
							Get Started <ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</Button>
					<Safari
						url={`${env.NEXT_PUBLIC_APP_URL}/os/yta`}
						className="mx-auto h-[250px] max-w-[800px]"
						height={400}
						imageSrc="/hero.png"
					/>
				</div>
			</Container>
		</div>
	);
}
