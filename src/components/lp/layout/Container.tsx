import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export default function Container({ children }: Props) {
	return <div className="mx-auto max-w-[950px]">{children}</div>;
}
