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
import { Loader2 } from "lucide-react";
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
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800 px-4">
			<div className="w-full max-w-md">
				<div className="relative">
					<div className="-top-8 -translate-x-1/2 absolute left-1/2 z-10 transform">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white text-4xl">
							✋
						</div>
					</div>

					<div className="rounded-2xl border border-gray-100 bg-white p-8 pt-16 shadow-2xl">
						<div className="mb-8 text-center">
							<h1 className="mb-2 font-bold text-2xl text-gray-800">Welcome!</h1>
							<p className="text-gray-600">Let&#39;s pick a name for your OS.</p>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={form.control}
									name="osName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>OS Name</FormLabel>
											<FormControl>
												<Input placeholder="Enter your OS name..." {...field} />
											</FormControl>
											<FormDescription>This can’t be changed later.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="flex w-full items-center justify-center space-x-3 rounded-lg bg-blue-600 py-3 font-medium text-lg text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Create My OS
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
