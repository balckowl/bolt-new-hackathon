"use client";

import { useState } from "react";
import CoreFunctions from "./CoreFunctions";
import Exprience from "./Exprience";
import Footer from "./Footer";
import Hero from "./Hero";
import Recommend from "./Recommend";
import TwoUseCases from "./TwoUseCases";

export default function LpWrapper() {
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
