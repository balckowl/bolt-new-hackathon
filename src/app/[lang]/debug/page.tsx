import CreateSuccess from "../../../components/onboarding/CreateSuccess";

type Props = {
	params: { lang: string };
};
export default function Page({ params }: Props) {
	const { lang } = params;
	return (
		<div>
			<CreateSuccess osName="ospace" lang={lang} />
		</div>
	);
}
