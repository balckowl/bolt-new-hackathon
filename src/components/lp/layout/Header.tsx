import Link from "next/link";
import type { ReactNode } from "react";
import { litteOne } from "../hero/Hero";

type Props = {
	children?: ReactNode;
};

export default function Header({ children }: Props) {
	return (
		<div className="fixed z-30 w-full bg-gradient-to-br">
			<div className="mx-auto max-w-[1300px] px-3">
				<div className="flex h-[70px] items-center justify-between">
					<div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 py-1 backdrop-blur-md">
						<Link href="/" className="flex items-center gap-2">
							<h1 className={`${litteOne.className} text-2xl text-white uppercase`}>ospace</h1>
						</Link>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}
