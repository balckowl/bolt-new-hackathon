import { FileText, Folder, Github } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type Props = {
	scrollY: number;
};

export default function CoreFunctions({ scrollY }: Props) {
	return (
		<section
			className="relative px-4 py-[130px]"
			style={{
				transform: `translateY(${scrollY * 0.06}px)`,
			}}
		>
			<div className="mx-auto max-w-5xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 font-bold text-4xl text-gray-800">Core Functions</h2>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{/* Folder Card - Using Folder icon from hero */}
					<Card className="relative cursor-pointer overflow-visible rounded-xl border-2 border-gray-200 bg-white transition-all duration-300">
						<CardContent className="relative p-6 text-center">
							{/* Popping Icon - Using Folder from hero icons */}
							<div className="-top-8 -translate-x-1/2 absolute left-1/2 z-10 flex h-[90px] w-[90px] transform items-center justify-center rounded-2xl border-2 bg-white shadow-lg">
								<Folder className="h-11 w-11 text-yellow-600" />
							</div>
							<div className="pt-12">
								{/* Styled Title with Black Background */}
								<div className="mb-4 inline-block rounded bg-black/90 px-2 py-1 text-white">
									<h3 className="font-semibold text-xs">Folder</h3>
								</div>
								<p className="text-gray-600 text-sm leading-relaxed">
									Using folders, you can organize the apps you’ve created.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Site App Card - Using Github icon from hero */}
					<Card className="relative cursor-pointer overflow-visible rounded-xl border-2 border-gray-200 bg-white transition-all duration-300">
						<CardContent className="relative p-6 text-center">
							{/* Popping Icon - Using Github from hero icons */}
							<div className="-top-8 -translate-x-1/2 absolute left-1/2 z-10 flex h-[90px] w-[90px] transform items-center justify-center rounded-2xl border-2 bg-white shadow-lg">
								<Github className="h-12 w-12 text-gray-800" />
							</div>
							<div className="pt-12">
								{/* Styled Title with Black Background */}
								<div className="mb-4 inline-block rounded bg-black/90 px-2 py-1 text-white">
									<h3 className="font-semibold text-xs">Website</h3>
								</div>
								<p className="text-gray-600 text-sm leading-relaxed">
									You can turn any website you like into an app and open it on your OS.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Memo Card - Using FileText icon from hero */}
					<Card className="relative cursor-pointer overflow-visible rounded-xl border-2 border-gray-200 bg-white transition-all duration-300">
						<CardContent className="relative p-6 text-center">
							{/* Popping Icon - Using FileText from hero icons */}
							<div className="-top-8 -translate-x-1/2 absolute left-1/2 z-10 flex h-[90px] w-[90px] transform items-center justify-center rounded-2xl border-2 bg-white shadow-lg">
								<FileText className="h-12 w-12 text-blue-600" />
							</div>
							<div className="pt-12">
								{/* Styled Title with Black Background */}
								<div className="mb-4 inline-block rounded bg-black/90 px-2 py-1 text-white">
									<h3 className="font-semibold text-xs">Notepad</h3>
								</div>
								<p className="text-gray-600 text-sm leading-relaxed">
									Using the notepad, you can write notes in Markdown format.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
