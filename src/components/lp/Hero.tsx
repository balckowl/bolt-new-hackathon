"use client";

import {
	Edit,
	FileText,
	Folder,
	Github,
	Globe,
	Heart,
	MousePointer2,
	Pointer,
	Rocket,
	Sparkles,
	Star,
	Trash2,
	Youtube,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

type Props = {
	scrollY: number;
	changeScrollY: (value: number) => void;
};

export default function Hero({ changeScrollY, scrollY }: Props) {
	const [isClient, setIsClient] = useState(false);
	const [showBrowser, setShowBrowser] = useState(false);
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [isAnimating, setIsAnimating] = useState(false);
	const [showCursor, setShowCursor] = useState(false);
	const [isHeartHovered, setIsHeartHovered] = useState(false);
	const [showContextMenu, setShowContextMenu] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
	const [showNewFolder, setShowNewFolder] = useState(false);
	const [cursorOpacity, setCursorOpacity] = useState(1);
	const [cursorState, setCursorState] = useState<"default" | "hover" | "click">("default");
	const [showCreateFolderClick, setShowCreateFolderClick] = useState(false);
	const [showDeleteMenu, setShowDeleteMenu] = useState(false);
	const [deleteMenuPosition, setDeleteMenuPosition] = useState({ x: 0, y: 0 });
	const [showDeleteClick, setShowDeleteClick] = useState(false);
	const [isStarDeleting, setIsStarDeleting] = useState(false);
	const [showStar, setShowStar] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setIsClient(true);

		// Track mobile vs. desktop
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768); // md breakpoint
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);

		// Desktop‑only setup
		let timer: number;
		if (!isMobile) {
			document.body.style.overflow = "hidden";
			setShowCursor(true);

			const initialX = window.innerWidth * 0.9;
			const initialY = window.innerHeight * 0.8;
			setCursorPosition({ x: initialX, y: initialY });

			timer = window.setTimeout(() => {
				setIsAnimating(true);
				animateCursor();
			}, 2000);
		} else {
			// Mobile: re‑enable scrolling immediately
			document.body.style.overflow = "auto";
		}

		// Parallax scroll handler (runs on both mobile and desktop)
		const handleScroll = () => {
			changeScrollY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			// Clean up everything in one place
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", checkMobile);
			document.body.style.overflow = "auto";
			if (timer) clearTimeout(timer);
		};
	}, [isMobile]);

	const animateCursor = () => {
		// Calculate exact center positions of icons (accounting for icon size and padding)
		// Icons are 40px (w-10 h-10) with 16px padding (p-4) = 72px total container
		// Center is at 36px from top-left of container
		const iconCenterOffset = 36;

		// Former folder icon location (15%, 75%)
		const folderX = window.innerWidth * 0.15 + iconCenterOffset;
		const folderY = window.innerHeight * 0.75 + iconCenterOffset;

		const notepadX = window.innerWidth * 0.82 + iconCenterOffset;
		const notepadY = window.innerHeight * 0.25 + iconCenterOffset;

		// New star icon position (below heart)
		const starX = window.innerWidth * 0.08 + iconCenterOffset;
		const starY = window.innerHeight * 0.55 + iconCenterOffset;

		// Step 1: Move to former folder location
		setTimeout(() => {
			setCursorPosition({ x: folderX, y: folderY });
		}, 100);

		// Step 2: Right-click to show context menu (switch to click state immediately)
		setTimeout(() => {
			setCursorState("click");
			setContextMenuPosition({ x: folderX, y: folderY });
			setShowContextMenu(true);
		}, 1500);

		// Step 2.5: Move cursor to precise center of "Create folder" option
		setTimeout(() => {
			// Calculate the exact center of the "Create folder" button
			const menuX = folderX + 20; // Context menu offset
			const menuY = folderY - 10; // Context menu offset
			const buttonCenterX = menuX + 80; // Half of button width (160px / 2)
			const buttonCenterY = menuY + 20; // First button center (padding + half height)

			setCursorPosition({ x: buttonCenterX, y: buttonCenterY });
		}, 2500);

		// Step 2.75: Stop cursor completely and switch to click state
		setTimeout(() => {
			setCursorState("click");
		}, 3500);

		// Step 3: Click on "Create folder" option with visual effect (after cursor has stopped)
		setTimeout(() => {
			setShowCreateFolderClick(true);
			setCursorState("default");

			// Hide click effect after animation
			setTimeout(() => {
				setShowCreateFolderClick(false);
				setShowContextMenu(false);
				setShowNewFolder(true);
			}, 400);
		}, 4000);

		// Step 4: Move to star icon center
		setTimeout(() => {
			setCursorPosition({ x: starX, y: starY });
		}, 5000);

		// Step 5: Right-click near star icon to show delete menu
		setTimeout(() => {
			setCursorState("click");
			setDeleteMenuPosition({ x: starX, y: starY });
			setShowDeleteMenu(true);
		}, 6500);

		// Step 5.5: Move cursor to "Delete" option center
		setTimeout(() => {
			const menuX = starX + 20;
			const menuY = starY - 10;
			const buttonCenterX = menuX + 80;
			const buttonCenterY = menuY + 52; // Second button center (first button + spacing)

			setCursorPosition({ x: buttonCenterX, y: buttonCenterY });
		}, 7500);

		// Step 5.75: Stop cursor and prepare for click
		setTimeout(() => {
			setCursorState("click");
		}, 8500);

		// Step 6: Click on "Delete" option
		setTimeout(() => {
			setShowDeleteClick(true);
			setCursorState("default");

			setTimeout(() => {
				setShowDeleteClick(false);
				setShowDeleteMenu(false);
				setIsStarDeleting(true);

				// Hide star after delete animation
				setTimeout(() => {
					setShowStar(false);
				}, 500);
			}, 400);
		}, 9000);

		// Step 7: Move directly to notepad center (skip heart)
		setTimeout(() => {
			setCursorPosition({ x: notepadX, y: notepadY });
		}, 10000);

		// Step 8: Hover over notepad icon (switch to hover state)
		setTimeout(() => {
			setCursorState("hover");
		}, 11500);

		// Step 9: Click animation and open browser (switch to click state)
		setTimeout(() => {
			setCursorState("click");
			setShowBrowser(true);
			setIsAnimating(false);
		}, 12000);

		// Step 10: Fade out cursor after animation completes
		setTimeout(() => {
			setCursorOpacity(0);
		}, 13000);

		// Step 11: Hide cursor completely after fade and re-enable scrolling IMMEDIATELY
		setTimeout(() => {
			setShowCursor(false);
			// Re-enable scrolling immediately when browser appears
			document.body.style.overflow = "auto";
		}, 12100); // Enable scrolling right after browser appears
	};

	// Function to check if cursor is over an icon's white background
	const isOverIconBackground = (x: number, y: number) => {
		const iconCenterOffset = 36;
		const iconRadius = 36; // Half of the 72px container

		const heroIcons = [
			{
				x: window.innerWidth * 0.12 + iconCenterOffset,
				y: window.innerHeight * 0.18 + iconCenterOffset,
			},
			{
				x: window.innerWidth * 0.85 + iconCenterOffset,
				y: window.innerHeight * 0.15 + iconCenterOffset,
			},
			{
				x: window.innerWidth * 0.2 + iconCenterOffset,
				y: window.innerHeight * 0.65 + iconCenterOffset,
			},
			{
				x: window.innerWidth * 0.78 + iconCenterOffset,
				y: window.innerHeight * 0.6 + iconCenterOffset,
			},
			{
				x: window.innerWidth * 0.08 + iconCenterOffset,
				y: window.innerHeight * 0.4 + iconCenterOffset,
			},
			{
				x: window.innerWidth * 0.88 + iconCenterOffset,
				y: window.innerHeight * 0.38 + iconCenterOffset,
			},
			{
				x: window.innerWidth * 0.82 + iconCenterOffset,
				y: window.innerHeight * 0.25 + iconCenterOffset,
			},
		];

		// Add star icon position if it exists
		if (showStar) {
			heroIcons.push({
				x: window.innerWidth * 0.08 + iconCenterOffset,
				y: window.innerHeight * 0.55 + iconCenterOffset,
			});
		}

		// Add new folder position if it exists
		if (showNewFolder) {
			heroIcons.push({
				x: window.innerWidth * 0.15 + iconCenterOffset,
				y: window.innerHeight * 0.75 + iconCenterOffset,
			});
		}

		return heroIcons.some((icon) => {
			const distance = Math.sqrt((x - icon.x) ** 2 + (y - icon.y) ** 2);
			return distance <= iconRadius;
		});
	};

	// Update cursor state based on position during animation
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isAnimating && showCursor) {
			const isOverIcon = isOverIconBackground(cursorPosition.x, cursorPosition.y);

			// Only change to hover if we're not already in a specific state from the animation
			if (isOverIcon && cursorState === "default") {
				setCursorState("hover");
			} else if (!isOverIcon && cursorState === "hover") {
				setCursorState("default");
			}
		}
	}, [cursorPosition, isAnimating, showCursor, showNewFolder, showStar]);

	const heroIcons = [
		{
			Icon: Rocket,
			x: "12%",
			y: "18%",
			color: "text-orange-600",
			rotation: "-12deg",
			name: "Rocket",
		},
		{ Icon: Youtube, x: "85%", y: "15%", color: "text-red-600", rotation: "8deg", name: "YouTube" },
		{
			Icon: Sparkles,
			x: "20%",
			y: "65%",
			color: "text-purple-600",
			rotation: "15deg",
			name: "Sparkles",
		},
		{ Icon: Github, x: "78%", y: "60%", color: "text-gray-800", rotation: "-8deg", name: "GitHub" },
		{
			Icon: Heart,
			x: "8%",
			y: "40%",
			color: "text-pink-600",
			rotation: "10deg",
			id: "heart",
			name: "Heart",
		},
		{ Icon: Globe, x: "88%", y: "38%", color: "text-green-600", rotation: "-15deg", name: "Globe" },
		{
			Icon: FileText,
			x: "82%",
			y: "25%",
			color: "text-blue-600",
			rotation: "-10deg",
			id: "notepad",
			name: "Notepad",
		},
	];

	return (
		<>
			{/* Lucide Icon Cursor - Only show on desktop */}
			{showCursor && !isMobile && (
				<div
					className="pointer-events-none fixed z-[9999] transition-all duration-1000 ease-out"
					style={{
						left: cursorPosition.x,
						top: cursorPosition.y,
						transform: "translateZ(0)",
						opacity: cursorOpacity,
						transition: "all 1000ms ease-out, opacity 1500ms ease-out",
					}}
				>
					<div className="relative">
						{/* Lucide cursor icon - changes based on state with instant transitions */}
						<div className="transition-all duration-75 ease-out">
							{cursorState === "default" && (
								<MousePointer2
									className="h-5 w-5 drop-shadow-sm"
									style={{ color: "#000000", fill: "#000000" }}
									color="white"
									strokeWidth={2}
								/>
							)}
							{(cursorState === "hover" || cursorState === "click") && (
								<Pointer
									className="h-5 w-5 drop-shadow-sm"
									style={{ color: "#000000", fill: "#ffffff" }}
								/>
							)}
						</div>

						{/* Click animation rings - only show when clicking notepad */}
						{isAnimating && cursorPosition.x > window.innerWidth * 0.8 && (
							<>
								<div
									className="-inset-4 absolute animate-ping rounded-full border-2 border-blue-500 opacity-75"
									style={{ left: "-16px", top: "-16px" }}
								/>
								<div
									className="-inset-2 absolute animate-ping rounded-full border border-blue-400 opacity-50"
									style={{ left: "-8px", top: "-8px", animationDelay: "0.2s" }}
								/>
							</>
						)}
					</div>
				</div>
			)}

			{/* Context Menu - Only show on desktop */}
			{showContextMenu && !isMobile && (
				<div
					className="fixed z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
					style={{
						left: contextMenuPosition.x + 20,
						top: contextMenuPosition.y - 10,
					}}
				>
					<button
						type="button"
						className={`relative flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-100 ${
							showCreateFolderClick ? "bg-blue-50" : ""
						}`}
						onClick={() => {
							setShowContextMenu(false);
							setShowNewFolder(true);
						}}
					>
						<Folder className="mr-2 h-4 w-4 flex-shrink-0 text-yellow-600" />
						<span className="flex-1">Create folder</span>

						{/* Click animation rings for Create folder button */}
						{showCreateFolderClick && (
							<>
								<div className="absolute inset-0 animate-ping rounded border-2 border-yellow-500 opacity-75" />
								<div
									className="absolute inset-1 animate-ping rounded border border-yellow-400 opacity-50"
									style={{ animationDelay: "0.1s" }}
								/>
								<div
									className="absolute inset-2 animate-ping rounded border border-yellow-300 opacity-25"
									style={{ animationDelay: "0.2s" }}
								/>
							</>
						)}
					</button>
					<hr className="my-1 border-gray-200" />
					<button
						type="button"
						className="w-full px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-100"
					>
						Paste
					</button>
					<button
						type="button"
						className="w-full px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-100"
					>
						Refresh
					</button>
				</div>
			)}

			{/* Delete Menu - Only show on desktop */}
			{showDeleteMenu && !isMobile && (
				<div
					className="fixed z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
					style={{
						left: deleteMenuPosition.x + 20,
						top: deleteMenuPosition.y - 10,
					}}
				>
					<button
						type="button"
						className="flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-100"
					>
						<Edit className="mr-2 h-4 w-4 flex-shrink-0 text-blue-600" />
						<span className="flex-1">Edit</span>
					</button>
					<button
						type="button"
						className={`relative flex w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-100 ${
							showDeleteClick ? "bg-red-50" : ""
						}`}
						onClick={() => {
							setShowDeleteMenu(false);
							setIsStarDeleting(true);
							setTimeout(() => setShowStar(false), 500);
						}}
					>
						<Trash2 className="mr-2 h-4 w-4 flex-shrink-0 text-red-600" />
						<span className="flex-1">Delete</span>

						{/* Click animation rings for Delete button */}
						{showDeleteClick && (
							<>
								<div className="absolute inset-0 animate-ping rounded border-2 border-red-500 opacity-75" />
								<div
									className="absolute inset-1 animate-ping rounded border border-red-400 opacity-50"
									style={{ animationDelay: "0.1s" }}
								/>
								<div
									className="absolute inset-2 animate-ping rounded border border-red-300 opacity-25"
									style={{ animationDelay: "0.2s" }}
								/>
							</>
						)}
					</button>
				</div>
			)}

			{/* Star Icon - Only show on desktop */}
			{showStar && !isMobile && (
				<div
					className={`absolute z-40 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-all duration-500 ${
						isStarDeleting
							? "fade-out zoom-out scale-0 animate-out opacity-0"
							: "fade-in zoom-in animate-in"
					}`}
					style={{
						left: "8%",
						top: "55%",
						transform: "rotate(-8deg) translateZ(0)",
						filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))",
					}}
				>
					<Star className="h-10 w-10 text-yellow-500 drop-shadow-sm" strokeWidth={1.5} />
					<div className="-bottom-8 -translate-x-1/2 absolute left-1/2 transform whitespace-nowrap rounded bg-black/70 px-2 py-1 font-medium text-white text-xs">
						Star
					</div>
				</div>
			)}

			{/* New Folder Icon - Only show on desktop */}
			{showNewFolder && !isMobile && (
				<div
					className="fade-in zoom-in absolute z-40 animate-in rounded-2xl border border-gray-100 bg-white p-4 shadow-lg duration-300"
					style={{
						left: "15%",
						top: "75%",
						transform: "rotate(12deg) translateZ(0)",
						filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))",
					}}
				>
					<Folder className="h-10 w-10 text-yellow-600 drop-shadow-sm" strokeWidth={1.5} />
					<div className="-bottom-8 -translate-x-1/2 absolute left-1/2 transform whitespace-nowrap rounded bg-black/70 px-2 py-1 font-medium text-white text-xs">
						Folder
					</div>
				</div>
			)}

			{/* Safari-style Browser Window */}
			{showBrowser && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
					<div className="fade-in zoom-in mx-auto w-full max-w-2xl transform animate-in rounded-xl bg-white shadow-2xl duration-300">
						{/* Browser Header */}
						<div className="flex items-center justify-between rounded-t-xl border-gray-200 border-b bg-gray-100 px-4 py-3">
							<div className="flex items-center space-x-2">
								<button
									type="button"
									onClick={() => setShowBrowser(false)}
									className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600"
								/>
								<button
									type="button"
									className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
								/>
								<button
									type="button"
									className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600"
								/>
							</div>
							<div className="mx-4 flex-1">
								<div className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-600 text-sm">
									http://localhost:3000/login
								</div>
							</div>
							<div className="w-16" />
						</div>

						{/* Browser Content */}
						<div className="rounded-b-xl bg-white pt-[70px] pb-[110px] text-center">
							<div className="mb-8">
								<h2
									className="mb-4 font-bold text-3xl text-gray-800"
									style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
								>
									Create your very own
									<br />
									OS on the web.
								</h2>
							</div>

							<Button
								size="lg"
								className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-lg text-white hover:bg-blue-700"
							>
								Sign in with Google
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Hero Section with Enhanced Blue-to-Purple Gradient and Synchronized Parallax */}
			<section
				className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800 px-4"
				style={{
					transform: `translateY(${scrollY * 0.3}px)`,
				}}
			>
				{/* Hero Icons with White Backgrounds and Labels - Only show on desktop */}
				{!isMobile && (
					<div className="pointer-events-none absolute inset-0">
						{heroIcons.map(({ Icon, x, y, color, rotation, id, name }, index) => (
							<div
								key={id}
								className={`absolute rounded-2xl border border-gray-100 bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
									id === "notepad" && isAnimating && cursorPosition.x > window.innerWidth * 0.8
										? "ring-4 ring-blue-400 ring-opacity-75"
										: ""
								}`}
								style={{
									left: x,
									top: y,
									transform: `rotate(${rotation}) translateZ(0) translateY(${scrollY * (0.15 + index * 0.05)}px)`,
									filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))",
								}}
							>
								<Icon className={`h-10 w-10 ${color} drop-shadow-sm`} strokeWidth={1.5} />
								<div className="-bottom-8 -translate-x-1/2 absolute left-1/2 transform whitespace-nowrap rounded bg-black/70 px-2 py-1 font-medium text-white text-xs">
									{name}
								</div>
							</div>
						))}
					</div>
				)}

				<div
					className="relative z-10 mx-auto max-w-4xl text-center"
					style={{
						transform: `translateY(${scrollY * 0.2}px) translateY(-80px)`, // Move content upward by 80px
					}}
				>
					{/* Site Icon with White Rounded Background */}
					<div className="mb-6">
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg">
							<Globe className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
						</div>
					</div>

					<h1
						className="mb-10 text-4xl text-white leading-tight drop-shadow-lg md:text-5xl lg:text-7xl"
						style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
					>
						Create your very own
						<br />
						<span className="text-white/90">OS on the web.</span>
					</h1>

					{/* Updated Subtitle with lighter color */}
					<p className="mb-12 text-lg text-white/75 leading-relaxed drop-shadow-md md:text-xl lg:text-2xl">
						Organize info or showcase your portfolio.
					</p>

					<Button
						size="lg"
						variant="outline"
						className="group rounded-lg border-2 border-white bg-transparent px-6 py-3 font-medium text-base text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-purple-700 md:px-8 md:py-4 md:text-lg"
					>
						Sign in with Google
					</Button>
				</div>
			</section>

			{/* Demo Area with Enlarged Safari-style Browser and Reduced Padding */}
			<section
				className="relative px-4 py-20"
				style={{
					transform: `translateY(${scrollY * 0.1}px)`,
				}}
			>
				<div className="mx-auto max-w-6xl">
					<div className="rounded-3xl bg-gray-100 p-6 shadow-lg">
						{/* Safari-style Browser Window - Enlarged */}
						<div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white">
							{/* Browser Header with URL Display */}
							<div className="flex items-center justify-between border-gray-200 border-b bg-gray-100 px-4 py-3">
								<div className="flex items-center space-x-2">
									<div className="h-3 w-3 rounded-full bg-red-400" />
									<div className="h-3 w-3 rounded-full bg-yellow-400" />
									<div className="h-3 w-3 rounded-full bg-green-400" />
								</div>
								<div className="mx-4 flex-1">
									<div className="rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-gray-600 text-sm">
										http://localhost:3000/os/demo
									</div>
								</div>
								<div className="w-16" />
							</div>

							{/* Browser Content - Enlarged aspect ratio */}
							{/* <div className="relative flex aspect-[16/10] items-center justify-center bg-white">
                <p className="text-2xl text-gray-500 italic md:text-3xl" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
                  look like browser
                </p>
              </div> */}
							<Image
								src="/lp-sample.png"
								className="w-full"
								width={1000}
								height={650}
								alt="site-sample"
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
