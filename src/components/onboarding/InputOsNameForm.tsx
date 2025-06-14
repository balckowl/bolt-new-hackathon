"use client";

import { Button } from "@/src/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { hono } from "@/src/lib/hono-client";
import { osNameBaseSchema } from "@/src/server/models/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type Props = {
	handleNextStep: () => void;
	handleOsNameChange: (osName: string) => void;
};

export default function InputOsNameForm({ handleNextStep, handleOsNameChange }: Props) {
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="osName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>OS name</FormLabel>
							<FormControl>
								<Input placeholder="shadcn" {...field} />
							</FormControl>
							<FormDescription>This is your OS name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
