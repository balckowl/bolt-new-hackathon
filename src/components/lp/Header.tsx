import Image from "next/image";
import Container from "./Container";

export default function Header() {
	return (
		<div className="h-[50px] border-t">
			<Container>
				<div className="flex">
					<Image src="/logo.svg" width={20} height={20} alt="ロゴ" />
					<h1>ospace</h1>
				</div>
			</Container>
		</div>
	);
}
