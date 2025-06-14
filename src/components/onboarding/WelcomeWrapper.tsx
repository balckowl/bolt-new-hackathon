"use client";

import { set } from "date-fns";
import { useState } from "react";
import CreateSuccess from "./CreateSuccess";
import InputOsNameForm from "./InputOsNameForm";

export default function WelcomeWrapper() {
	const [step, setStep] = useState(1);
	const [osName, setOsName] = useState("");

	const handleNextStep = () => setStep(2);
	const handleOsNameChange = (name: string) => setOsName(name);

	return (
		<>
			{step === 1 && (
				<InputOsNameForm handleOsNameChange={handleOsNameChange} handleNextStep={handleNextStep} />
			)}
			{step === 2 && <CreateSuccess osName={osName} />}
		</>
	);
}
