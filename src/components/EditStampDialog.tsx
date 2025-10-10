import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { appSchema } from "../server/models/os.schema";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

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
			<div className="edit-stamp-dialog min-w-[400px] rounded-2xl bg-white p-0 shadow-2xl">
				<h3 className="mb-4 flex items-center gap-2 px-5 pt-5 font-semibold text-gray-800 text-lg">
					Edit stamp text
				</h3>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="mx-5">
							<FormField
								control={form.control}
								name="stampContent"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="border-b-[1.5px]">
												<input
													placeholder={formLabel || "Hello!..."}
													{...field}
													onChange={(e) => {
														field.onChange(e);
														changeContentInput(e.target.value);
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
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!currentContent?.trim()}
								className="w-[120px] rounded-xl px-4 py-2 font-medium text-sm text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
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
