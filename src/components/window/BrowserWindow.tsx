import { ArrowDownRight, Check, Link, RefreshCcw, SquareArrowOutUpRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BrowserWindowType } from "../../types/desktop";
import WindowHeader from "./WindowHeader";

const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const SNAP_PADDING = 24;

type BrowserWindowProps = {
	window: BrowserWindowType;
	onClose: () => void;
	onMinimize: () => void;
	onBringToFront: () => void;
	onPositionChange: (position: { x: number; y: number }) => void;
	onSizeChange: (size: { width: number; height: number }) => void;
};

export function BrowserWindow({
	window,
	onClose,
	onMinimize,
	onBringToFront,
	onPositionChange,
	onSizeChange,
}: BrowserWindowProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [resizeStart, setResizeStart] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});
	const [copiedUrl, setCopiedUrl] = useState(false);
	const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	// const [isLaunching, setIsLaunching] = useState(false);
	// const [countdown, setCountdown] = useState<number | null>(null);
	// const [hasLaunched, setHasLaunched] = useState(false);
	// const launchResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
	// const countdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	// ★ 追加: iframe を強制的に作り直すためのキー
	const [frameKey, setFrameKey] = useState(0);

	// const showCountdown = countdown !== null || hasLaunched;
	// const secondsRemaining = countdown !== null ? Math.max(countdown, 0) : 0;
	// const countdownStatus = hasLaunched
	//   ? "Opening new tab..."
	//   : `Launching in ${secondsRemaining} second${secondsRemaining === 1 ? "" : "s"}...`;

	const handleMouseDown = (e: React.MouseEvent) => {
		if (
			e.target === e.currentTarget ||
			(e.target as HTMLElement).classList.contains("window-header")
		) {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - window.position.x,
				y: e.clientY - window.position.y,
			});
			onBringToFront();
		}
	};

	const handleResizeMouseDown = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsResizing(true);
		setResizeStart({
			x: e.clientX,
			y: e.clientY,
			width: window.size.width,
			height: window.size.height,
		});
		onBringToFront();
	};

	// ★ 追加: リフレッシュ（最初の URL に戻す）
	const handleRefresh = (e: React.MouseEvent) => {
		e.stopPropagation(); // ドラッグ抑止
		// key を変えて iframe をリマウント => ナビゲーション履歴やスクロールも初期化
		setFrameKey((k) => k + 1);
	};

	const handleCopyUrl = async (e: React.MouseEvent) => {
		e.stopPropagation();

		const textToCopy = window.url ?? "";
		let success = false;

		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(textToCopy);
				success = true;
			} else {
				const textarea = document.createElement("textarea");
				textarea.value = textToCopy;
				textarea.setAttribute("readonly", "");
				textarea.style.position = "absolute";
				textarea.style.left = "-9999px";
				document.body.appendChild(textarea);
				const selection = document.getSelection();
				const selectedRange = selection?.rangeCount ? selection.getRangeAt(0) : null;
				textarea.select();
				success = document.execCommand("copy");
				document.body.removeChild(textarea);
				if (selectedRange) {
					selection?.removeAllRanges();
					selection?.addRange(selectedRange);
				}
			}
		} catch (error) {
			success = false;
		}

		if (success) {
			setCopiedUrl(true);
			if (copyResetTimeout.current) {
				clearTimeout(copyResetTimeout.current);
			}
			copyResetTimeout.current = setTimeout(() => {
				setCopiedUrl(false);
				copyResetTimeout.current = null;
			}, 2000);
		}
	};

	// const handleOpenInNewTab = (e: React.MouseEvent) => {
	//   e.stopPropagation();
	//   if (!window.url || isLaunching) {
	//     return;
	//   }
	//
	//   setHasLaunched(false);
	//   setIsLaunching(true);
	//   setCountdown(3);
	// };

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging) {
				onPositionChange({
					x: e.clientX - dragStart.x,
					y: e.clientY - dragStart.y,
				});
			} else if (isResizing) {
				const newWidth = Math.max(MIN_WIDTH, resizeStart.width + (e.clientX - resizeStart.x));
				const newHeight = Math.max(MIN_HEIGHT, resizeStart.height + (e.clientY - resizeStart.y));
				onSizeChange({
					width: newWidth,
					height: newHeight,
				});
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setIsResizing(false);
		};

		if (isDragging || isResizing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);

	// useEffect(() => {
	//   if (!isLaunching) {
	//     return;
	//   }
	//
	//   if (countdown === null) {
	//     setCountdown(3);
	//     return;
	//   }
	//
	//   if (countdown <= 0) {
	//     if (countdownTimeout.current) {
	//       clearTimeout(countdownTimeout.current);
	//       countdownTimeout.current = null;
	//     }
	//
	//     if (window.url) {
	//       globalThis.open(window.url, "_blank", "noopener,noreferrer");
	//     }
	//
	//     if (launchResetTimeout.current) {
	//       clearTimeout(launchResetTimeout.current);
	//     }
	//
	//     launchResetTimeout.current = setTimeout(() => {
	//       setIsLaunching(false);
	//       setCountdown(null);
	//       setHasLaunched(false);
	//       launchResetTimeout.current = null;
	//     }, 600);
	//
	//     return;
	//   }
	//
	//   if (countdownTimeout.current) {
	//     clearTimeout(countdownTimeout.current);
	//   }
	//
	//   countdownTimeout.current = setTimeout(() => {
	//     setCountdown((prev) => (prev ?? 1) - 1);
	//   }, 1000);
	//
	//   return () => {
	//     if (countdownTimeout.current) {
	//       clearTimeout(countdownTimeout.current);
	//       countdownTimeout.current = null;
	//     }
	//   };
	// }, [isLaunching, countdown, window.url]);

	// useEffect(() => {
	//   if (isLaunching && countdown === 0) {
	//     setHasLaunched(true);
	//   }
	// }, [isLaunching, countdown]);

	useEffect(() => {
		return () => {
			if (copyResetTimeout.current) {
				clearTimeout(copyResetTimeout.current);
			}
		};
	}, []);

	const handleSnapToCorner = (e: React.MouseEvent) => {
		e.stopPropagation();

		const viewport =
			typeof globalThis !== "undefined" &&
			typeof (globalThis as unknown as Window).innerWidth === "number"
				? (globalThis as unknown as Window)
				: undefined;

		const nextWidth = MIN_WIDTH;
		const nextHeight = MIN_HEIGHT;
		const viewportWidth = viewport?.innerWidth ?? nextWidth;
		const viewportHeight = viewport?.innerHeight ?? nextHeight;

		const nextX = Math.max(SNAP_PADDING, viewportWidth - nextWidth - SNAP_PADDING);
		const nextY = Math.max(SNAP_PADDING, viewportHeight - nextHeight - SNAP_PADDING);

		onBringToFront();
		onSizeChange({ width: nextWidth, height: nextHeight });
		onPositionChange({ x: nextX, y: nextY });
	};

	return (
		<>
			<div
				className="fixed overflow-hidden rounded-2xl shadow-2xl"
				style={{
					left: window.position.x,
					top: window.position.y,
					width: window.size.width,
					height: window.size.height,
					zIndex: window.zIndex,
					cursor: isDragging ? "grabbing" : "default",
				}}
				onMouseDown={handleMouseDown}
			>
				{/* Window Header */}
				<WindowHeader title={window.title}>
					<div className="flex items-center gap-1">
						<button
							onMouseDown={(e) => e.stopPropagation()}
							onClick={handleCopyUrl}
							className="relative flex h-6 w-8 items-center justify-center rounded-sm text-black transition-all duration-200 hover:bg-gray-300/60"
							type="button"
							title={copiedUrl ? "Copied" : "Copy URL"}
							aria-label={copiedUrl ? "Copied" : "Copy URL"}
						>
							<span
								className={`absolute transition-all duration-200 ${copiedUrl ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
							>
								<Link size={15} strokeWidth={2.5} />
							</span>
							<span
								className={`absolute transition-all duration-200 ${copiedUrl ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
							>
								<Check size={15} strokeWidth={2.5} />
							</span>
						</button>

						<a
							onMouseDown={(e) => e.stopPropagation()}
							className={`relative flex h-6 w-8 items-center justify-center rounded-sm text-black transition-all duration-200 ${window.url ? "hover:bg-gray-300/60" : "cursor-not-allowed opacity-50"}`}
							title="Open in new tab"
							aria-label="Open in new tab"
							href={window.url ?? undefined}
							target="_blank"
							rel="noopener noreferrer"
							aria-disabled={!window.url}
							onClick={(e) => {
								if (!window.url) {
									e.preventDefault();
									e.stopPropagation();
								}
							}}
						>
							<SquareArrowOutUpRight size={15} strokeWidth={2.5} />
						</a>

						{/* リフレッシュ（最初の URL に戻す） */}
						<button
							onMouseDown={(e) => e.stopPropagation()}
							onClick={handleRefresh}
							className="relative flex h-6 w-8 items-center justify-center rounded-sm text-black transition-all duration-200 hover:bg-gray-300/60"
							type="button"
							title="Refresh"
							aria-label="Refresh"
						>
							<RefreshCcw size={15} strokeWidth={2.5} />
						</button>

						<button
							onMouseDown={(event) => event.stopPropagation()}
							onClick={handleSnapToCorner}
							className="relative flex h-6 w-8 items-center justify-center rounded-sm text-black transition-all duration-200 hover:bg-gray-300/60"
							type="button"
							title="Snap to bottom right"
							aria-label="Snap to bottom right"
						>
							<ArrowDownRight size={15} strokeWidth={2.5} />
						</button>

						{/* クローズ */}
						<button
							onMouseDown={(e) => e.stopPropagation()}
							onClick={onClose}
							className="relative flex h-6 w-8 items-center justify-center rounded-lg font-bold text-black transition-all duration-200 hover:bg-gray-300/60"
							type="button"
							title="Close"
							aria-label="Close"
						>
							<X size={17} strokeWidth={2.5} />
						</button>
					</div>
				</WindowHeader>

				{/* Browser Content */}
				<div className="relative h-[calc(100%-40px)] flex-1 bg-white/90 px-[6px] pb-[6px] backdrop-blur-lg">
					<iframe
						key={frameKey}
						src={window.url}
						className="h-full w-full rounded-xl"
						title={window.title}
					/>

					{/*
            // Launch animation overlay temporarily disabled per spec.
            {(isLaunching || showCountdown) && (
              <div className="launch-overlay absolute inset-0 mx-[6px] mb-[6px] rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="launch-starfield launch-starfield--back" />
                  <div className="launch-starfield launch-starfield--mid" />
                  <div className="launch-starfield launch-starfield--front" />
                  <div className="launch-starfield launch-starfield--giants" />
                  <div className="launch-meteors">
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                  </div>
                  <div className="launch-glow" />
                  <div className="launch-rocket-shell relative mb-7 flex flex-col items-center">
                    NOTE: Re-enable the Image import from "next/image" when restoring this block.
                    <Image
                      src="/rocket-2.png"
                      width={120}
                      height={100}
                      alt="rocket"
                      className="launch-rocket pointer-events-none"
                      priority
                    />
                    {showCountdown && (
                      <div
                        className="launch-countdown-bubble flex min-w-[60px] items-center justify-center rounded-full bg-white/90 px-3 py-2 font-bold text-3xl text-black shadow-lg"
                      >
                        <span aria-hidden="true" className="font-bold text-lg">
                          {secondsRemaining}
                        </span>
                        <span className="sr-only">{countdownStatus}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/70">
                    Launching to an external site
                    <span className="inline-block animate-blink opacity-0 [animation-delay:0ms]">.</span>
                    <span className="inline-block animate-blink opacity-0 [animation-delay:200ms]">.</span>
                    <span className="inline-block animate-blink opacity-0 [animation-delay:400ms]">.</span>
                  </p>
                </div>
              </div>
            )}
          */}
				</div>

				{/* Resize Handle */}
				<div
					className="absolute right-1 bottom-1 h-4 w-4 cursor-se-resize"
					onMouseDown={handleResizeMouseDown}
				>
					<div className="absolute right-2 bottom-2 h-2 w-2 rounded-br-sm border-white border-r-2 border-b-2" />
				</div>

				{/* Copy confirmation mascot */}
				<div
					className={`pointer-events-none absolute right-10 bottom-0 z-100 flex items-end shadow-xl transition-all duration-500 ease-out ${copiedUrl ? "translate-y-[30%] opacity-100" : "translate-y-[120%] opacity-0"}`}
				>
					<div className="relative flex flex-col items-center">
						<div className="-left-12 -rotate-[10deg] relative bottom-3 mb-2 hidden rounded-2xl bg-white/90 px-4 py-2 font-semibold text-black text-sm shadow-lg xl:block">
							copyied url
							<span
								className="-translate-x-1/2 absolute top-full left-1/2 h-3 w-4 bg-white/90 [clip-path:polygon(0_0,100%_0,50%_100%)]"
								aria-hidden="true"
							/>
						</div>
						<img
							src="/astro.png"
							alt="Astro mascot"
							className={`h-44 w-auto drop-shadow-2xl transition-transform duration-500 ${copiedUrl ? "-translate-y-1" : "translate-y-10"}`}
							draggable={false}
						/>
					</div>
				</div>
			</div>

			{/*
      <style jsx>{`
        @keyframes blink {
          0%, 20% { opacity: 0; }
          30%, 70% { opacity: 1; }
          80%, 100% { opacity: 0; }
        }

        .animate-blink {
          animation: blink 1.2s infinite;
          animation-fill-mode: both;
        }

        .launch-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at top, rgba(87, 111, 230, 0.4), transparent 55%),
            radial-gradient(ellipse at bottom, rgba(10, 10, 25, 0.95), rgba(5, 5, 15, 0.98));
          overflow: hidden;
          pointer-events: none;
        }

        .launch-starfield {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
          mix-blend-mode: screen;
          will-change: background-position;
        }

        .launch-starfield--back {
          opacity: 0.25;
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.45), transparent 60%),
            radial-gradient(2px 2px at 80% 70%, rgba(255, 255, 255, 0.3), transparent 60%);
          background-size: 220px 220px, 320px 320px;
          animation: starSlideSlow 0.2s linear infinite;
        }

        .launch-starfield--mid {
          opacity: 0.45;
          background-image:
            radial-gradient(1px 1px at 40% 50%, rgba(255, 255, 255, 0.7), transparent 55%),
            radial-gradient(2px 2px at 70% 20%, rgba(255, 255, 255, 0.35), transparent 65%);
          background-size: 160px 160px, 260px 260px;
          animation: starSlide 0.8s linear infinite;
        }

        .launch-starfield--front {
          opacity: 0.65;
          background-image:
            radial-gradient(1px 1px at 30% 60%, rgba(255, 255, 255, 0.9), transparent 55%),
            radial-gradient(1px 1px at 10% 15%, rgba(255, 255, 255, 0.8), transparent 60%),
            radial-gradient(3px 3px at 80% 40%, rgba(150, 200, 255, 0.6), transparent 70%);
          background-size: 120px 120px, 180px 180px, 260px 260px;
          animation: starSlideFast 0.6s linear infinite;
        }

        .launch-starfield--giants {
          opacity: 0.8;
          background-image:
            radial-gradient(6px 6px at 12% 24%, rgba(255, 255, 255, 0.85), transparent 62%),
            radial-gradient(8px 8px at 78% 64%, rgba(255, 220, 185, 0.75), transparent 68%),
            radial-gradient(5px 5px at 45% 82%, rgba(160, 220, 255, 0.8), transparent 65%);
          background-size: 360px 360px, 520px 520px, 480px 480px;
          animation: giantStarDrift 0.8s linear infinite;
          mix-blend-mode: screen;
        }

        .launch-meteors {
          position: absolute;
          inset: -12%;
          pointer-events: none;
          overflow: hidden;
          mix-blend-mode: screen;
          z-index: 6;
        }

        .launch-meteors span {
          position: absolute;
          top: 0;
          left: 0;
          width: 220px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.65) 35%,
            rgba(255, 210, 160, 0.9) 65%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: drop-shadow(0 0 11px rgba(255, 220, 190, 0.75));
          opacity: 0;
          --meteor-rotate: -24deg;
          --meteor-x-start: 42vw;
          --meteor-y-start: -14vh;
          --meteor-x-end: -16vw;
          --meteor-y-end: 52vh;
          animation: meteorTrail 5.2s linear infinite;
          will-change: transform, opacity;
        }

        .launch-meteors span::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 16%;
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.15) 55%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.85));
        }

        .launch-meteors span:nth-child(2) {
          width: 260px;
          --meteor-rotate: -20deg;
          --meteor-x-start: 36vw;
          --meteor-y-start: -22vh;
          --meteor-x-end: -22vw;
          --meteor-y-end: 46vh;
          animation-delay: 1.6s;
        }

        .launch-meteors span:nth-child(3) {
          width: 200px;
          --meteor-rotate: -28deg;
          --meteor-x-start: 48vw;
          --meteor-y-start: -18vh;
          --meteor-x-end: -10vw;
          --meteor-y-end: 58vh;
          animation-delay: 3.2s;
        }

        .launch-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 35% 65%, rgba(255, 160, 100, 0.4), transparent 55%),
            radial-gradient(circle at 70% 30%, rgba(140, 180, 255, 0.25), transparent 60%);
          mix-blend-mode: screen;
          opacity: 0.4;
          animation: glowPulse 3.6s ease-in-out infinite;
        }

        .launch-rocket-shell {
          position: relative;
        }

        .launch-countdown-bubble {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 65%;
          transform: translateX(-50%);
          pointer-events: none;
          backdrop-filter: blur(6px);
        }

        .launch-countdown-bubble::after {
          content: "";
          position: absolute;
          top: 90%;
          left: 32%;
          width: 18px;
          height: 14px;
          background: rgba(255, 255, 255, 0.9);
          clip-path: polygon(0 0, 100% 0, 30% 100%);
          filter: drop-shadow(0 4px 6px rgba(15, 15, 25, 0.28));
        }

        .launch-rocket {
          position: relative;
          z-index: 10;
          transition: transform 0.9s cubic-bezier(0.19, 1, 0.22, 1),
            filter 0.6s ease-in-out;
          filter: drop-shadow(-10px 12px 25px rgba(40, 80, 160, 0.45));
        }

        .launch-rocket::after {
          content: "";
          position: absolute;
          bottom: -36px;
          left: 50%;
          width: 32px;
          height: 120px;
          transform: translateX(-50%);
          background: radial-gradient(circle at 50% 0%, rgba(255, 200, 120, 0.75), transparent 65%),
            linear-gradient(180deg, rgba(255, 180, 102, 0.9) 0%, rgba(255, 75, 75, 0.2) 70%, transparent 100%);
          filter: blur(2px);
          opacity: 0.85;
          animation: flamePulse 0.32s ease-in-out infinite alternate;
        }

        .launch-rocket--idle {
          transform: translate(-30%, 24%) rotate(-9deg) scale(0.92);
        }

        .launch-rocket--fly {
          transform: translate(160%, -190%) rotate(18deg) scale(0.86);
          filter: drop-shadow(-8px 12px 35px rgba(255, 200, 120, 0.55));
        }

        .launch-rocket--fly::after {
          animation-duration: 0.2s;
          opacity: 1;
        }

        @keyframes starSlideSlow {
          from {
            background-position:
              0px 0px,
              0px 0px;
          }
          to {
            background-position:
              calc(-1 * 220px) calc(220px),
              calc(-1 * 320px) calc(320px);
          }
        }

        @keyframes starSlide {
          from {
            background-position:
              0px 0px,
              0px 0px;
          }
          to {
            background-position:
              calc(-1 * 160px) calc(160px),
              calc(-1 * 260px) calc(260px);
          }
        }

        @keyframes starSlideFast {
          from {
            background-position:
              0px 0px,
              0px 0px,
              0px 0px;
          }
          to {
            background-position:
              calc(-1 * 120px) calc(120px),
              calc(-1 * 180px) calc(180px),
              calc(-1 * 260px) calc(260px);
          }
        }

        @keyframes giantStarDrift {
          0% {
            background-position:
              0px 0px,
              0px 0px,
              0px 0px;
            opacity: 0.65;
          }
          50% {
            background-position:
              calc(-0.5 * 360px) calc(0.5 * 360px),
              calc(-0.5 * 520px) calc(0.5 * 520px),
              calc(-0.5 * 480px) calc(0.5 * 480px);
            opacity: 0.9;
          }
          100% {
            background-position:
              calc(-1 * 360px) calc(360px),
              calc(-1 * 520px) calc(520px),
              calc(-1 * 480px) calc(480px);
            opacity: 0.65;
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.55;
          }
        }

        @keyframes flamePulse {
          from {
            transform: translateX(-50%) scaleY(0.9);
            opacity: 0.65;
          }
          to {
            transform: translateX(-50%) scaleY(1.1);
            opacity: 1;
          }
        }

        @keyframes meteorTrail {
          0% {
            transform: translate3d(var(--meteor-x-start), var(--meteor-y-start), 0)
              rotate(var(--meteor-rotate));
            opacity: 0;
          }
          10% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          45% {
            opacity: 1;
          }
          60% {
            opacity: 0;
          }
          100% {
            transform: translate3d(var(--meteor-x-end), var(--meteor-y-end), 0)
              rotate(var(--meteor-rotate));
            opacity: 0;
          }
        }
      `}</style>
      */}
		</>
	);
}
