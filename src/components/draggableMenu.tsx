"use client";

import type { FontOptionType } from "@/prisma/prisma/zod";
import { BackgroundSelector } from "@/src/components/BackgroundSelector";
import { PublicSelector } from "@/src/components/PublicSelector";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Slider } from "@/src/components/ui/slider";
import type { HelpWindowType } from "@/src/types/desktop";
import { Sun } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import FontSelector from "./FontSelector";
import HelpSelector from "./HelpSelector";
import { litteOne } from "./lp/hero/Hero";

const DRAG_MARGIN = 100;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type Props = {
	onBackgroundChange: (newBackground: string) => void;
	getFontStyle: (newFont: FontOptionType) => void;
	onFontChange: (newFont: FontOptionType) => void;
	background: string;
	font: FontOptionType;
	setBackground: (background: string) => void;
	brightness: number;
	onBrightnessChange: (brightness: number) => void;
	currentTime: Date;
	isPublic: boolean;
	setIsPublic: (isPublic: boolean) => void;
	osName: string;
	isEditable: boolean;
	setHelpWindow: React.Dispatch<React.SetStateAction<HelpWindowType>>;
	helpWindow: HelpWindowType;
};

export const DraggableMenu = ({
	onBackgroundChange,
	getFontStyle,
	onFontChange,
	background,
	font,
	setBackground,
	brightness,
	onBrightnessChange,
	currentTime,
	isPublic,
	setIsPublic,
	osName,
	isEditable,
	setHelpWindow,
	helpWindow,
}: Props) => {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [hasUserMoved, setHasUserMoved] = useState(false);
	const [isBrightnessOpen, setIsBrightnessOpen] = useState(false);
	const sliderValue = Math.max(0, Math.min(60, Math.round(brightness * 100)));

	const formatTime = useCallback((date: Date) => {
		return date
			.toLocaleTimeString("en-US", {
				weekday: "short",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})
			.replace(", ", " ");
	}, []);

	const toggleHelpWindow = useCallback(() => {
		setHelpWindow((prev) => ({
			...prev,
			visible: !prev.visible,
		}));
	}, [setHelpWindow]);

	useEffect(() => {
		const handleWindowResize = () => {
			if (!menuRef.current) return;
			const rect = menuRef.current.getBoundingClientRect();
			const maxX = window.innerWidth - rect.width - DRAG_MARGIN;
			const maxY = window.innerHeight - rect.height - DRAG_MARGIN;
			setPosition((prev) => {
				if (!prev) return null;
				return {
					x: clamp(prev.x, DRAG_MARGIN, Math.max(maxX, DRAG_MARGIN)),
					y: clamp(prev.y, DRAG_MARGIN, Math.max(maxY, DRAG_MARGIN)),
				};
			});
		};

		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined" || hasUserMoved || !menuRef.current) {
			return;
		}

		const rect = menuRef.current.getBoundingClientRect();
		const initialX = window.innerWidth / 2 - rect.width / 2;
		const initialY = window.innerHeight - rect.height - DRAG_MARGIN;
		setPosition({
			x: clamp(
				initialX,
				DRAG_MARGIN,
				Math.max(window.innerWidth - rect.width - DRAG_MARGIN, DRAG_MARGIN),
			),
			y: clamp(
				initialY,
				DRAG_MARGIN,
				Math.max(window.innerHeight - rect.height - DRAG_MARGIN, DRAG_MARGIN),
			),
		});
	}, [hasUserMoved]);

	const handlePointerMove = useCallback((event: PointerEvent) => {
		if (!menuRef.current) return;

		const rect = menuRef.current.getBoundingClientRect();
		const maxX = window.innerWidth - rect.width - DRAG_MARGIN;
		const maxY = window.innerHeight - rect.height - DRAG_MARGIN;
		const nextPosition = {
			x: clamp(event.clientX - dragOffsetRef.current.x, DRAG_MARGIN, Math.max(maxX, DRAG_MARGIN)),
			y: clamp(event.clientY - dragOffsetRef.current.y, DRAG_MARGIN, Math.max(maxY, DRAG_MARGIN)),
		};

		setPosition(nextPosition);
		setHasUserMoved(true);
	}, []);

	const stopDragging = useCallback(() => {
		setIsDragging(false);
		document.removeEventListener("pointermove", handlePointerMove);
		document.removeEventListener("pointerup", stopDragging);
	}, [handlePointerMove]);

	const handlePointerDown = useCallback(
		(event: ReactPointerEvent<HTMLDivElement>) => {
			if (event.button && event.button !== 0) return;
			if (!menuRef.current) return;

			const rect = menuRef.current.getBoundingClientRect();
			dragOffsetRef.current = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};

			setIsDragging(true);
			document.addEventListener("pointermove", handlePointerMove);
			document.addEventListener("pointerup", stopDragging);
		},
		[handlePointerMove, stopDragging],
	);

	useEffect(() => {
		return () => {
			document.removeEventListener("pointermove", handlePointerMove);
			document.removeEventListener("pointerup", stopDragging);
		};
	}, [handlePointerMove, stopDragging]);

	const style: CSSProperties = position
		? {
				position: "fixed",
				left: `${position.x}px`,
				top: `${position.y}px`,
				zIndex: 20,
			}
		: {
				position: "fixed",
				left: "50%",
				bottom: `${DRAG_MARGIN}px`,
				transform: "translateX(-50%)",
				zIndex: 20,
			};

	return (
		<div
			ref={menuRef}
			onPointerDown={handlePointerDown}
			className={cn(
				"pointer-events-auto select-none",
				isDragging ? "cursor-grabbing" : "cursor-grab",
			)}
			style={style}
		>
			<div className="flex flex-wrap items-center justify-center rounded-full bg-black/90 py-2 pr-2 pl-[18px] text-white shadow-xl`">
				<div className="absolute top-[-60px]">
					<Image
						width={70}
						height={70}
						alt="astro"
						src="/astro-5.png"
						className="pointer-events-none"
					/>
				</div>
				<div
					className={`${litteOne.className} flex items-center font-semibold text-md text-white/70 uppercase tracking-wide`}
				>
					{osName}
				</div>

				<div className="ml-3 flex items-center gap-2">
					{isEditable && (
						<>
							<BackgroundSelector
								onBackgroundChange={onBackgroundChange}
								currentBackground={background}
								setBackground={setBackground}
							/>
							<FontSelector
								onFontChange={onFontChange}
								getFontStyle={getFontStyle}
								currentFont={font}
							/>
							<HelpSelector getHelpWindow={toggleHelpWindow} />
							<PublicSelector
								isPublic={isPublic}
								setIsPublic={setIsPublic}
								getFontStyle={getFontStyle}
								currentFont={font}
							/>
						</>
					)}
					<Popover open={isBrightnessOpen} onOpenChange={setIsBrightnessOpen}>
						<PopoverTrigger asChild>
							<button
								type="button"
								onPointerDown={(event) => event.stopPropagation()}
								className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
								aria-label="Open brightness controls"
							>
								<Sun size={17} aria-hidden="true" />
							</button>
						</PopoverTrigger>
						<PopoverContent
							sideOffset={16}
							side="bottom"
							align="center"
							className="w-[260px] rounded-2xl border-0 bg-white/90 px-4 py-4 shadow-xl"
							onPointerDown={(event) => event.stopPropagation()}
							onOpenAutoFocus={(event) => event.preventDefault()}
						>
							<div className="space-y-3 text-black text-sm">
								{/* <div className="flex items-center justify-between">
                  <p className="font-bold">Display</p>
                  <span className="text-black/50 text-xs">{sliderValue}%</span>
                </div> */}
								<div className="flex items-center gap-3 rounded-lg bg-black/5 px-3 py-3">
									<Sun size={17} aria-hidden="true" />
									<Slider
										className="flex-1"
										min={0}
										max={60}
										step={1}
										value={[sliderValue]}
										onValueChange={(value) => onBrightnessChange((value[0] ?? 0) / 100)}
										aria-label="Brightness"
										trackClassName="h-1.5 bg-black/10"
										rangeClassName="bg-black"
										thumbClassName="h-5 w-5 border-0 bg-white shadow-md"
										onPointerDown={(event) => event.stopPropagation()}
									/>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
};

export default DraggableMenu;
