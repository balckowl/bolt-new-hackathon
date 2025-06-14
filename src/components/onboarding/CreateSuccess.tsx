import Link from "next/link";

type Props = {
	osName: string;
};

export default function CreateSuccess({ osName }: Props) {
	return (
		<div>
			<p>{osName}できたよ。</p>
			<Link href={`/os/${osName}`}>here</Link>
		</div>
	);
}
