"use client";

import { Folder, StickyNote } from "lucide-react";
import { Noto_Sans } from "next/font/google";
import Image from "next/image";
import { useRef } from "react";
import { AnimatedBeam } from "../../magicui/animated-beam";
import { AppIconMock } from "./AppIconMock";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export default function FolderSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);
	const div3Ref = useRef<HTMLDivElement>(null);
	const div4Ref = useRef<HTMLDivElement>(null);
	const div5Ref = useRef<HTMLDivElement>(null);

	return (
		<div className="col-span-2 mb-7">
			<p className={`${notoSans.className} mb-3 text-xl`}>
				3. You can organize your notes and apps into folders.
			</p>
			<div className="relative h-[400px] rounded-xl bg-gray-100 p-5" ref={containerRef}>
				<AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} duration={3} />

				<AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} duration={3} />

				<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} duration={3} />

				<AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div5Ref} duration={3} />

				<div className="flex h-full items-center justify-between">
					<div>
						<AppIconMock appName="hoge" ref={div1Ref}>
							<Image src="/angry-face.svg" width={45} height={45} alt="hoge" />
						</AppIconMock>

						<AppIconMock appName="fuga" ref={div2Ref}>
							<Image src="/sunglasses.svg" width={45} height={45} alt="fuga" />
						</AppIconMock>

						<AppIconMock appName="notes" ref={div3Ref}>
							<StickyNote className="h-9 w-9" />
						</AppIconMock>
					</div>

					<AppIconMock appName="folder" ref={div4Ref}>
						<Folder className="h-9 w-9" />
					</AppIconMock>

					<AppIconMock appName="folder" ref={div5Ref}>
						<Folder className="h-9 w-9" />
					</AppIconMock>
				</div>
			</div>
		</div>
	);
}
