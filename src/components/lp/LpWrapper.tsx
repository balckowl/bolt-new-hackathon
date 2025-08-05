import CoreFunctions from "./CoreFunctions/CoreFunctions";
import Exprience from "./Exprience";
import Footer from "./Footer";
import Hero from "./Hero";
import Recommend from "./Recommend";

export default function LpWrapper() {
	return (
		<div className="bg-white">
			<Hero />
			<CoreFunctions />
			<Exprience />
			<Recommend />
			<Footer />
		</div>
	);
}
