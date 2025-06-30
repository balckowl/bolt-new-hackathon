"use client";

import { Button } from "@/src/components/ui/button";
import { env } from "@/src/env.mjs";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

type Props = {
	osName: string;
};
export default function CreateSuccess({ osName }: Props) {
	const osUrl = `${env.NEXT_PUBLIC_APP_URL}/os/${osName}`;

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800 px-4">
			<div className="w-full max-w-md">
				{/* Welcome Card with Icon Extending Beyond */}
				<div className="relative">
					{/* Extended Icon Holder */}
					<div className="-top-8 -translate-x-1/2 absolute left-1/2 z-10 transform">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white text-4xl">
							🎉
						</div>
					</div>

					{/* Welcome Card */}
					<div className="rounded-2xl border border-gray-100 bg-white p-8 pt-16 shadow-2xl">
						{/* Success State */}
						<div className="text-center">
							{/* Success Message */}
							<h1 className="mb-2 font-bold text-2xl text-gray-800">Your OS is ready!</h1>
							<p className="mb-8 text-gray-600">OS created successfully.</p>

							{/* OS URL Display */}
							<div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
								<div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
									<span className="mr-2 truncate font-mono text-blue-600 text-sm">{osUrl}</span>
									<ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
								</div>
							</div>

							{/* Go to OS Button */}
							<Button
								size="lg"
								className="flex w-full items-center justify-center space-x-3 rounded-lg bg-blue-600 py-3 font-medium text-lg text-white transition-all duration-200 hover:bg-blue-700"
							>
								<Link href={osUrl} className="flex items-center gap-2">
									<span>Go to My OS</span>
									<ArrowRight className="h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
