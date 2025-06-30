import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { appSchema } from "../server/models/os.schema";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

type Props = {
	dialogZIndex: number;
	dialogClassName: string;
	nameInput: string;
	changeNameInput: (value: string) => void;
	onSave: () => void;
	visible: boolean;
	title: string;
	saveLabel?: string;
	onCancel: () => void;
	cancelLabel?: string;
	placeholder: string;
	formLabel: string;
};

const nameSchema = appSchema.pick({ name: true });
type nameSchemaType = z.infer<typeof nameSchema>;

export default function DefaultDialog({
	dialogZIndex,
	dialogClassName,
	nameInput,
	changeNameInput,
	onSave,
	visible,
	title,
	onCancel,
	cancelLabel = "Cancel",
	saveLabel = "Save",
	placeholder,
	formLabel,
}: Props) {
	const form = useForm<nameSchemaType>({
		resolver: zodResolver(nameSchema),
		defaultValues: {
			name: nameInput,
		},
	});

	const currentName = form.watch("name");

	const onSubmit = () => {
		onSave();
	};

	if (!visible) return null;

	return (
		<div
			className="dialog fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			style={{ zIndex: dialogZIndex }}
		>
			<div
				className={`min-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-2xl ${dialogClassName}`}
			>
				<h3 className="mb-4 font-semibold text-gray-800 text-lg">{title}</h3>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{formLabel}</FormLabel>
									<FormControl>
										<Input
											placeholder={placeholder}
											{...field}
											onChange={(e) => {
												field.onChange(e);
												changeNameInput(e.target.value);
											}}
											className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="mt-6 flex justify-end space-x-3">
							<Button
								onClick={onCancel}
								className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200"
								type="button"
							>
								{cancelLabel}
							</Button>
							<Button
								type="submit"
								disabled={!currentName.trim()}
								className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
							>
								{saveLabel}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
