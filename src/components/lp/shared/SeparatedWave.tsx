type Props = {
	color: "#111827" | "#ffffff" | "#000000";
};

export default function SeparatedWave({ color }: Props) {
	return (
		<div className="-bottom-1 pointer-events-none absolute inset-x-0 z-10 w-full">
			<svg
				className="h-auto w-full"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1440 320"
				preserveAspectRatio="none"
			>
				<title>wave</title>
				<path
					fill={color}
					fillOpacity="1"
					d="M0,296 C40,280 80,270 120,282 C160,294 200,312 240,304 C280,296 320,262 360,268 C400,274 440,314 480,310 C520,306 560,260 600,266 C640,272 680,318 720,312 C760,306 800,270 840,272 C880,274 920,308 960,306 C1000,304 1040,274 1080,278 C1120,282 1160,308 1200,310 C1240,312 1280,292 1320,288 C1360,284 1400,292 1440,300 L1440,320 L0,320 Z"
				/>
			</svg>
		</div>
	);
}
