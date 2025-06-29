"use client";

import { useState } from "react";
import CoreFunctions from "../components/lp/CoreFunctions";
import Exprience from "../components/lp/Exprience";
import Footer from "../components/lp/Footer";
import Hero from "../components/lp/Hero";
import Recommend from "../components/lp/Recommend";
import TwoUseCases from "../components/lp/TwoUseCases";

export default function HomePage() {
	const [scrollY, setScrollY] = useState(0);
	const changeScrollY = (value: number) => setScrollY(value);

	return (
		<div className="min-h-screen bg-white">
			<Hero changeScrollY={changeScrollY} scrollY={scrollY} />
			<TwoUseCases scrollY={scrollY} />
			<CoreFunctions scrollY={scrollY} />
			<Exprience scrollY={scrollY} />
			<Recommend scrollY={scrollY} />
			<Footer />
		</div>
	);
}
