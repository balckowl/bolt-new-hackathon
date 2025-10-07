import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { appSchema } from "../server/models/os.schema";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

type Props = {
	dialogZIndex: number;
	contentInput: string;
	changeContentInput: (value: string) => void;
	onSave: () => void;
	visible: boolean;
	onCancel: () => void;
	formLabel: string;
};

const stampSchema = appSchema.pick({ stampContent: true });
type stampSchemaType = z.infer<typeof stampSchema>;

/** スタンプのテキストを編集するダイアログのコンポーネント */
export default function EditStampDialog({
	dialogZIndex,
	contentInput,
	changeContentInput,
	onSave,
	visible,
	onCancel,
	formLabel,
}: Props) {
	const form = useForm<stampSchemaType>({
		resolver: zodResolver(stampSchema),
		defaultValues: {
			stampContent: contentInput,
		},
	});

	const currentContent = form.watch("stampContent");

	const onSubmit = () => {
		onSave();
	};

	if (!visible) return null;

	return (
		<div
			className="dialog fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			style={{ zIndex: dialogZIndex }}
		>
			<div className="edit-stamp-dialog min-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
				<h3 className="mb-4 font-semibold text-gray-800 text-lg">Edit stamp text</h3>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="stampContent"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{formLabel}</FormLabel>
									<FormControl>
										<Input
											placeholder="Hello!..."
											{...field}
											onChange={(e) => {
												field.onChange(e);
												changeContentInput(e.target.value);
											}}
											className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-black"
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
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!currentContent?.trim()}
								className="rounded-lg px-4 py-2 font-medium text-sm text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
							>
								Save
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
