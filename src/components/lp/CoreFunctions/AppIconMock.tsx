import { type ReactNode, forwardRef } from "react";

type Props = {
	children: ReactNode;
	notifyIcon?: boolean;
};

function getRandom1to5() {
	return Math.floor(Math.random() * 5) + 1;
}

const AppIconMock = forwardRef<HTMLDivElement, Props>(function AppIconMock(
	{ children, notifyIcon = false },
	ref,
) {
	return (
		<div className="relative" ref={ref}>
			<div className="mb-1 flex h-[70px] w-[70px] items-center justify-center rounded-2xl border border-white/20 bg-white shadow-lg backdrop-blur-sm">
				{children}
			</div>
			{notifyIcon && (
				<div className="-top-2 -right-2 absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white text-xs">
					{getRandom1to5()}
				</div>
			)}
		</div>
	);
});
AppIconMock.displayName = "AppIconMock";

export { AppIconMock };
