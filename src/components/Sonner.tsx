"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as SonnerToaster } from "sonner";

import { cn } from "@/src/lib/utils";

type AppToasterProps = ComponentProps<typeof SonnerToaster>;

const toastBaseClasses =
	"group toast pointer-events-auto group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg";
const descriptionBaseClasses = "group-[.toast]:text-muted-foreground";
const actionButtonBaseClasses = "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground";
const cancelButtonBaseClasses = "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground";

const Toaster = ({
	className,
	toastOptions,
	position = "top-right",
	...props
}: AppToasterProps) => {
	const { theme = "system" } = useTheme();

	const mergedToastOptions: AppToasterProps["toastOptions"] = {
		...toastOptions,
		classNames: {
			...toastOptions?.classNames,
			toast: cn(
				toastBaseClasses,
				"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-4",
				"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-4",
				toastOptions?.classNames?.toast,
			),
			description: cn(descriptionBaseClasses, toastOptions?.classNames?.description),
			actionButton: cn(actionButtonBaseClasses, toastOptions?.classNames?.actionButton),
			cancelButton: cn(cancelButtonBaseClasses, toastOptions?.classNames?.cancelButton),
		},
	};

	return (
		<SonnerToaster
			theme={theme as AppToasterProps["theme"]}
			className={cn("toaster group", className)}
			position={position}
			toastOptions={mergedToastOptions}
			{...props}
		/>
	);
};

export { Toaster };
export { toast } from "sonner";
