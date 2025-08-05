import { Chewy } from "next/font/google";
import React, { forwardRef, type ReactNode } from "react";

const chewy = Chewy({ subsets: ["latin"], weight: "400" });

type Props = {
	children: ReactNode;
	appName: string;
};

const AppIconMock = forwardRef<HTMLDivElement, Props>(function AppIconMock(
	{ children, appName },
	ref,
) {
	return (
		<div className="relative" ref={ref}>
			<div className="mb-1 flex h-20 w-20 items-center justify-center rounded-xl border bg-white shadow-md">
				{children}
			</div>
			<p className={`${chewy.className} text-center text-xl`}>{appName}</p>
		</div>
	);
});
AppIconMock.displayName = "AppIconMock";

export { AppIconMock };
