"use client";

import { Button } from "@/src/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/i18n/client";
import { hono } from "@/src/lib/hono-client";
import { osNameBaseSchema } from "@/src/server/models/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlagTriangleRight, Loader2 } from "lucide-react";
import { Lilita_One } from "next/font/google";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Header from "../lp/layout/Header";
import { StarryBackdrop } from "../lp/shared/StarryBackdrop";
import SectionTitle from "./shared/SectionTitle";

type Props = {
	handleNextStep: () => void;
	handleOsNameChange: (osName: string) => void;
	lang: string;
};

export default function InputOsNameForm({ handleNextStep, handleOsNameChange, lang }: Props) {
	const { t } = useTranslation(lang);
	const title = t("inputName.title");
	const desc = t("inputName.desc");
	const placeholder = t("inputName.placeholder");
	const btn = t("inputName.btn");
	const formSchema = osNameBaseSchema.refine(
		async (data) => {
			const { osName } = data;

			const res = await hono.api.os["check-name"].$post({
				json: { osName },
			});

			return res.status === 200;
		},
		{
			message: "このOS名はすでに使われています",
			path: ["osName"],
		},
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			osName: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const { osName } = data;

		const res = await hono.api.user["os-name"].$post({
			json: { osName },
		});

		if (res.status === 201) {
			handleOsNameChange(osName);
			handleNextStep();
		}
	};

	return (
		<div>
			<StarryBackdrop />
			<Header />
			<div className="flex min-h-[calc(100dvh-70px)] items-center justify-center bg-black px-4">
				<div className="w-full max-w-md">
					<div className="relative">
						<div className="relative rounded-2xl">
							<SectionTitle title={title} desc={desc} />

							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<FormField
										control={form.control}
										name="osName"
										render={({ field }) => (
											<FormItem className="mb-4 w-full">
												<FormControl>
													<Input
														placeholder={placeholder}
														{...field}
														className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										className="mx-auto flex items-center gap-2 rounded-lg font-medium text-lg text-white transition-all duration-200"
										disabled={form.formState.isSubmitting}
									>
										{form.formState.isSubmitting ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<FlagTriangleRight width={15} height={15} />
										)}
										{btn}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
