import { EyeOff } from "lucide-react";
import Link from "next/link";
import Container from "./lp/layout/Container";
import { Button } from "./ui/button";

type Props = {
	osName: string;
};

export default function LockView({ osName }: Props) {
	return (
		<div className="relative h-[100dvh] w-full overflow-hidden bg-black">
			<img
				src="/lockview-bg-img.png"
				alt=""
				aria-hidden
				className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-center"
				draggable={false}
			/>
			<div className="pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-sm" />
			<Container>
				<div className="relative z-10 flex h-[100dvh] items-center justify-center text-white">
					<div className="text-center">
						<EyeOff width={35} height={35} className="mx-auto mb-3" />
						<p className="mb-3">You tried to reach {osName}, but access is restricted.</p>
						<Button className="rounded-xl" asChild>
							<Link href="/" className="flex items-center gap-2">
								Back to Top
							</Link>
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
}
