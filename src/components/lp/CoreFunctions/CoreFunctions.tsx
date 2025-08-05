import { Chewy } from "next/font/google";
import Container from "../Container";
import FolderSection from "./FolderSection";
import NotesSection from "./NotesSection";
import WebsiteToAppSection from "./WebsiteToAppSection";

const chewy = Chewy({ subsets: ["latin"], weight: "400" });

export default function CoreFunctions() {
	return (
		<section className="relative border-b px-4 pt-[120px] pb-[200px]">
			<Container>
				<h2 className={`${chewy.className} mb-20 text-center text-4xl text-black`}>
					Core Fucntions
				</h2>
				<div className="grid grid-cols-2 gap-7">
					<WebsiteToAppSection />
					<NotesSection />
					<FolderSection />
				</div>
			</Container>
		</section>
	);
}
