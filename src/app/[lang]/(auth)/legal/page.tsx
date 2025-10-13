import LegalWrapper from "@/src/components/onboarding/LegalWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Legal",
};

export default function Page() {
	return (
		<>
			<LegalWrapper />
		</>
	);
}
