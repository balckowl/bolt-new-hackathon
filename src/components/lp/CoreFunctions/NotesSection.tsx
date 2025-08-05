import { StickyNote } from "lucide-react";
import { Noto_Sans } from "next/font/google";
import { AppIconMock } from "./AppIconMock";
import MemoWindowMock from "./MemoWindowMock";

const notoSans = Noto_Sans({ subsets: ["latin"], weight: "300" });

export default function NotesSection() {
	return (
		<div className="col-span-2 mb-7">
			<p className={`${notoSans.className} mb-3 text-xl`}>
				2. You can create a notepad that supports Markdown syntax.
			</p>
			<div className="h-[400px] items-center justify-center rounded-xl bg-gray-100 p-5">
				<div className="flex h-full items-center">
					<div className="flex w-[35%] justify-center">
						<AppIconMock appName="notes">
							<StickyNote className="h-9 w-9" />
						</AppIconMock>
					</div>

					<div className="w-[65%] rounded-xl shadow-md">
						<MemoWindowMock />
					</div>
				</div>
			</div>
		</div>
	);
}
