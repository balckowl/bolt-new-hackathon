"use client";

import { set } from "date-fns";
import { useState } from "react";
import CreateSuccess from "./CreateSuccess";
import InputOsNameForm from "./InputOsNameForm";

type Props = {
	lang: string;
};

export default function WelcomeWrapper({ lang }: Props) {
	const [step, setStep] = useState(1);
	const [osName, setOsName] = useState("");

	const handleNextStep = () => setStep(2);
	const handleOsNameChange = (name: string) => setOsName(name);

	return (
		<>
			{step === 1 && (
				<InputOsNameForm
					handleOsNameChange={handleOsNameChange}
					handleNextStep={handleNextStep}
					lang={lang}
				/>
			)}
			{step === 2 && <CreateSuccess lang={lang} osName={osName} />}
		</>
	);
}
