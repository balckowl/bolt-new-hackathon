import type { FontOptionType } from "@/prisma/prisma/zod";
import type { FontOption } from "@/src/generated/prisma";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	title: string;
	currentFont: FontOption;
	getFontStyle: (newFont: FontOptionType) => void;
};

export default function WindowHeader({ children, title, currentFont, getFontStyle }: Props) {
	return (
		<div
			className={`${getFontStyle(currentFont)} window-header flex h-[40px] cursor-grab items-center justify-between bg-white/90 px-2 backdrop-blur-lg active:cursor-grabbing`}
		>
			<div className="flex items-center">
				<div className="rounded-sm px-2 font-bold text-black text-sm">{title}</div>
			</div>

			{children}
		</div>
	);
}
