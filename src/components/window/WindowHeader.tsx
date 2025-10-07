import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	title: string;
};

export default function WindowHeader({ children, title }: Props) {
	return (
		<div className="window-header flex h-[40px] cursor-grab items-center justify-between bg-white/90 px-2 backdrop-blur-lg active:cursor-grabbing">
			<div className="flex items-center">
				<div className="rounded-sm px-2 font-bold text-black text-sm">{title}</div>
			</div>

			{children}
		</div>
	);
}
