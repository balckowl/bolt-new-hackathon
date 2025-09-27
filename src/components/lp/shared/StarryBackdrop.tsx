const SPARKLES = [
	{ top: "18%", left: "20%", size: 14, delay: 0, duration: 3.2 },
	{ top: "26%", left: "42%", size: 10, delay: 1.1, duration: 2.8 },
	{ top: "20%", left: "68%", size: 12, delay: 0.6, duration: 3.6 },
	{ top: "34%", left: "30%", size: 9, delay: 1.8, duration: 2.4 },
	{ top: "38%", left: "56%", size: 11, delay: 0.3, duration: 3 },
	{ top: "42%", left: "74%", size: 13, delay: 1.4, duration: 3.4 },
	{ top: "50%", left: "24%", size: 10, delay: 0.9, duration: 2.6 },
	{ top: "58%", left: "70%", size: 9, delay: 0.5, duration: 2.7 },
	{ top: "62%", left: "36%", size: 11, delay: 1.3, duration: 3.3 },
] as const;

export function StarryBackdrop() {
	return (
		<div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
			{SPARKLES.map((sparkle, index) => (
				<span
					key={`hero-sparkle-${
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						index
					}`}
					className="sparkle"
					style={{
						top: sparkle.top,
						left: sparkle.left,
						width: `${sparkle.size}px`,
						height: `${sparkle.size}px`,
						animationDelay: `${sparkle.delay}s`,
						animationDuration: `${sparkle.duration}s`,
					}}
				/>
			))}
		</div>
	);
}
