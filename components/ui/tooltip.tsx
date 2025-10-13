"use client";

import { cn } from "@/src/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

function TooltipProvider({
	delayDuration = 0,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
	return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
	// Provider はアプリどこか一箇所で包むのが理想だが、
	// 互換のためここでも包む
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
	return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 6, // 少し余白をデフォルト付与
	children,
	...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				sideOffset={sideOffset}
				// v3 安定版: レイアウト系だけ。transform-origin は var() でOK
				className={cn(
					"z-50 max-w-xs rounded-md bg-foreground px-3 py-1.5 text-background text-xs shadow-md",
					"origin-[var(--radix-tooltip-content-transform-origin)]",
					// data-variants は v3 でもOK（Tailwind 3.2+）:
					// tailwindcss-animate を導入していない場合は下2行は外してもOK
					"data-[state=closed]:animate-out data-[state=open]:animate-in",
					// 導入済みなら軽いフェード＋ズーム
					"data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
					"data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					// スライド（入れてもOK/未導入なら削除）
					"data-[side=bottom]:slide-in-from-top-1",
					"data-[side=top]:slide-in-from-bottom-1",
					"data-[side=left]:slide-in-from-right-1",
					"data-[side=right]:slide-in-from-left-1",
					className,
				)}
				{...props}
			>
				{children}
				{/* v3 安定版: SVG三角。fill を使い、回転や角丸はしない */}
				<TooltipPrimitive.Arrow width={10} height={5} className="fill-foreground" />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
