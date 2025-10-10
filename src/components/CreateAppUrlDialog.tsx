import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { appSchema } from "../server/models/os.schema";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

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
	isLoadingApp: boolean;
};

//フロントではnullを許容しない
const urlSchema = appSchema.pick({ url: true }).extend({
	url: z.string().url({ message: "不正なURL形式です。" }),
});
type urlSchemaType = z.infer<typeof urlSchema>;

export default function CreateAppUrlDialog({
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
	isLoadingApp,
}: Props) {
	const form = useForm<urlSchemaType>({
		resolver: zodResolver(urlSchema),
		defaultValues: {
			url: nameInput,
		},
	});

	const currentName = form.watch("url");

	const onSubmit = () => {
		onSave();
	};

	if (!visible) return null;

	return (
		<div
			className="dialog fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			style={{ zIndex: dialogZIndex }}
		>
			<div className={`min-w-[400px] rounded-2xl bg-white p-0 shadow-2xl ${dialogClassName}`}>
				<h3 className="mb-4 flex items-center gap-2 px-5 pt-5 font-semibold text-gray-800 text-lg">
					{title}
				</h3>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="mx-5">
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="border-b-[1.5px]">
												<input
													placeholder={placeholder}
													{...field}
													onChange={(e) => {
														field.onChange(e);
														changeNameInput(e.target.value);
													}}
													className="w-full rounded-2xl border-0 px-1 py-[6px] outline-none focus-visible:ring-0"
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="mt-6 flex justify-end space-x-3 px-5 pb-5">
							<Button
								onClick={onCancel}
								className="w-[120px] rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-200"
								type="button"
							>
								{cancelLabel}
							</Button>
							<Button
								type="submit"
								disabled={!currentName.trim() || isLoadingApp}
								className="w-[120px] rounded-xl px-4 py-2 font-medium text-sm text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
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
