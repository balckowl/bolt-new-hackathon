import { BackgroundSelector } from "@/src/components/BackgroundSelector";
import { PublicSelector } from "@/src/components/PublicSelector";
import { Switch } from "@/src/components/ui/switch";
import { Battery, Clock, Search, Wifi } from "lucide-react";

type Props = {
	onBackgroundChange: (newBackground: string) => void;
	background: string;
	setBackground: (background: string) => void;
	currentTime: Date;
	isPublic: boolean;
	setIsPublic: (isPublic: boolean) => void;
	osName: string;
};

export const MenuBar = ({
	onBackgroundChange,
	background,
	setBackground,
	currentTime,
	isPublic,
	setIsPublic,
	osName,
}: Props) => {
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
						className="flex items-center font-bold text-lg text-white leading-none"
						style={{
							fontFamily: "system-ui",
						}}
					>
						<p className="mb-1 text-sm"> {osName ? osName : "🍎"}</p>
					</div>
					{/* Background Selector */}
					<BackgroundSelector
						onBackgroundChange={onBackgroundChange}
						currentBackground={background}
						setBackground={setBackground}
					/>
				</div>
				<div className="flex items-center space-x-3 text-sm text-white">
					{/* public or private toggle */}
					<div className="flex items-center">
						<PublicSelector isPublic={isPublic} setIsPublic={setIsPublic} />
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
