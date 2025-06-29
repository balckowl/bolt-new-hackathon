import { BackgroundSelector } from "@/src/components/BackgroundSelector";
import { Battery, Clock, Search, Wifi } from "lucide-react";

type Props = {
	onBackgroundChange: (newBackground: string) => void;
	background: string;
	currentTime: Date;
};

export const MenuBar = ({ onBackgroundChange, background, currentTime }: Props) => {
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	};

	return (
		<div className="relative z-10 h-8 border-white/10 border-b bg-black/20 backdrop-blur-md">
			<div className="flex h-full items-center justify-between px-4">
				<div className="flex items-center space-x-4">
					{/* Apple Logo */}
					<div
						className="font-bold text-lg text-white leading-none"
						style={{
							fontFamily: "system-ui",
						}}
					>
						🍎
					</div>
					{/* Finder */}
					<div className="flex items-center space-x-1">
						<Search size={14} className="text-white" />
						<span className="font-medium text-sm text-white">Finder</span>
					</div>
					{/* Background Selector */}
					<BackgroundSelector
						onBackgroundChange={onBackgroundChange}
						currentBackground={background}
					/>
				</div>
				<div className="flex items-center space-x-3 text-sm text-white">
					{/* Wi-Fi Icon */}
					<div className="flex items-center">
						<Wifi size={14} className="text-white" />
					</div>
					{/* Battery Icon */}
					<div className="flex items-center">
						<Battery size={14} className="text-white" />
					</div>
					{/* Time */}
					<div className="flex items-center space-x-1">
						<Clock size={14} className="text-white" />
						<span className="font-medium">{formatTime(currentTime)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
