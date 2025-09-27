import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
	children?: ReactNode;
};

export default function Header({ children }: Props) {
	return (
		<div className="fixed z-30 w-full bg-gradient-to-br">
			<div className="mx-auto max-w-[1300px] px-3">
				<div className="flex h-[70px] items-center justify-between">
					<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-2 py-1 backdrop-blur-md">
						<Link href="/" className="flex items-center gap-2">
							<Image src="/logo-new.png" alt="logo" width={40} height={40} />
							<h1 className="text-2xl text-white">ospace</h1>
						</Link>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}
