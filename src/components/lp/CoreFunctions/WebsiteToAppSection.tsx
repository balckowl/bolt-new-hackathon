import { Noto_Sans } from "next/font/google";
import Image from "next/image";
import { AppIconMock } from "./AppIconMock";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export default function WebsiteToAppSection() {
	return (
		<div className="col-span-2 mb-5">
			<p className={`${notoSans.className} mb-3 text-xl`}>
				1. You can turn the website into an app.
			</p>
			<div className="flex h-[400px] items-center rounded-xl bg-gray-100 p-5">
				<div className="flex items-center gap-[65px]">
					<div className="relative">
						<Image
							src="/dummy-web-2.jpg"
							width={480}
							height={300}
							alt="hono"
							className="-left-10 -rotate-[7deg] relative top-20 h-[230px] rounded-xl border object-cover shadow-xl"
						/>
						<Image
							src="/dummy-web-1.jpg"
							width={480}
							height={300}
							alt="hono"
							className="relative bottom-[100px] left-8 h-[230px] rotate-[5deg] rounded-xl border object-cover shadow-xl"
						/>
					</div>
					<Image src="/arrow.png" width={100} height={100} alt="arrow" className="rotate-45" />
					<div className="flex gap-2">
						<AppIconMock appName="hoge">
							<Image src="/angry-face.svg" width={45} height={45} alt="hoge" />
						</AppIconMock>
						<AppIconMock appName="fuga">
							<Image src="/sunglasses.svg" width={45} height={45} alt="fuga" />
						</AppIconMock>
					</div>
				</div>
			</div>
		</div>
	);
}
