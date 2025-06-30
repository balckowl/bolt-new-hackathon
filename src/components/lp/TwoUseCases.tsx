import { env } from "@/src/env.mjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
	scrollY: number;
};

export default function TwoUseCases({ scrollY }: Props) {
	return (
		<section
			className="relative px-4 py-[130px]"
			style={{
				transform: `translateY(${scrollY * 0.08}px)`,
			}}
		>
			<div className="mx-auto max-w-6xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 font-bold text-4xl text-gray-800">Two Use Cases</h2>
				</div>

				<div className="space-y-20">
					{/* First Use Case: Organizing scattered information */}
					<div className="grid items-center gap-12 lg:grid-cols-2">
						{/* Left: Title and Description */}
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="inline-block rounded-full bg-black/70 px-3 py-1 font-medium text-sm text-white">
									First Case
								</div>
								<h3 className="font-bold text-3xl text-gray-800">
									Organizing scattered information
								</h3>
							</div>
							<p className="text-gray-600 text-lg leading-relaxed">
								Collect and organize all your scattered digital content in one place. Create folders
								for different projects and keep your notes organized.
							</p>
							<Button
								asChild
								size="lg"
								className="rounded-lg bg-blue-600 px-8 py-4 font-medium text-lg text-white hover:bg-blue-700"
							>
								<Link href={`${env.NEXT_PUBLIC_APP_URL}/os/gogo`}>
									View sample
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>

						{/* Right: Sample Image */}
						<div className="relative">
							<div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-lg">
								<Image
									src="/case-1.png"
									width={400}
									height={100}
									alt="Organized workspace with folders and documents"
									className="h-64 w-full rounded-xl object-cover shadow-md"
								/>
							</div>
						</div>
					</div>

					{/* Second Use Case: Publishing as a portfolio */}
					<div className="grid items-center gap-12 lg:grid-cols-2">
						{/* Left: Sample Image */}
						<div className="relative order-2 lg:order-1">
							<div className="rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-8 shadow-lg">
								<Image
									src="/case-2.png"
									width={400}
									height={100}
									alt="Organized workspace with folders and documents"
									className="h-64 w-full rounded-xl object-cover shadow-md"
								/>
							</div>
						</div>

						{/* Right: Title and Description */}
						<div className="order-1 space-y-6 lg:order-2">
							<div className="space-y-4">
								<div className="inline-block rounded-full bg-black/70 px-3 py-1 font-medium text-sm text-white">
									Second Case
								</div>
								<h3 className="font-bold text-3xl text-gray-800">Publishing as a portfolio</h3>
							</div>
							<p className="text-gray-600 text-lg leading-relaxed">
								Transform your organized workspace into a beautiful, public portfolio. Share your
								projects and create a professional online presence.
							</p>
							<Button
								asChild
								size="lg"
								className="rounded-lg bg-blue-600 px-8 py-4 font-medium text-lg text-white hover:bg-blue-700"
							>
								<Link href={`${env.NEXT_PUBLIC_APP_URL}/os/yta`}>
									View sample
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
