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
			<div className="mb-1 flex h-[70px] w-[70px] items-center justify-center rounded-3xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-sm">
				{children}
			</div>
			{notifyIcon && (
				<div className="-top-[8px] -right-[8px] absolute flex h-[28px] w-[28px] items-center justify-center rounded-full bg-red-500 font-bold text-sm text-white">
					{getRandom1to5()}
				</div>
			)}
		</div>
	);
});
AppIconMock.displayName = "AppIconMock";

export { AppIconMock };
