import { Frown } from "lucide-react";
import Link from "next/link";
import Container from "../components/lp/layout/Container";
import { Button } from "../components/ui/button";

export default function NotFound() {
	return (
		<Container>
			<div className="flex h-[100dvh] items-center justify-center text-white">
				<div className="text-center">
					<Frown width={35} height={35} className="mx-auto mb-3" />
					<p className="mb-3">This part of the universe has not been discovered.</p>
					<Button className="rounded-xl" asChild>
						<Link href="/" className="flex items-center gap-2">
							Back to Top
						</Link>
					</Button>
				</div>
			</div>
		</Container>
	);
}
