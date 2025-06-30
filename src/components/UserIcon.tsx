"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { signIn, signOut } from "@/src/lib/auth-client";
import type { CurrentUserType } from "@/src/types/desktop";
import { Globe, LogIn, LogOut, Monitor, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	userName?: string;
	loginUserOsName?: string;
	isPublic: boolean;
	currentUserInfo: CurrentUserType;
};

export const UserIcon = ({ isPublic, currentUserInfo }: Props) => {
	const router = useRouter();
	const handleSignOut = async () => {
		try {
			await signOut(isPublic);
		} catch (error) {
			toast("Failed to sign out. Please try again.", { style: { color: "#dc2626" } });
		}
	};
	function truncate(str: string, max = 5) {
		return str.length > max ? `${str.slice(0, max)}…` : str;
	}
	return (
		<div className="fixed bottom-7 left-7 z-50">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src={currentUserInfo?.currentUserIcon ?? undefined} alt="User Avatar" />
						<AvatarFallback>
							<User />
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="m-0 w-[150px] gap-2 p-0 text-sm" align="start">
					<div className="m-0 w-[150px]">
						{currentUserInfo?.currentUserOsName && currentUserInfo?.currentUsername ? (
							<>
								<div className="flex w-full items-center justify-between border-b px-2 py-3">
									<User size={15} />
									{truncate(currentUserInfo.currentUsername, 7)}
								</div>
								<button
									type="button"
									className="flex w-full items-center justify-between border-b px-2 py-3 hover:bg-gray-100"
									onClick={() => router.push(`/os/${currentUserInfo.currentUserOsName}`)}
								>
									<Monitor size={15} />
									{truncate(currentUserInfo.currentUserOsName, 7)}
									{"'s OS"}
								</button>
								<button
									type="button"
									className="flex w-full items-center justify-between border-b px-2 py-3 text-red-500 hover:bg-gray-100"
									onClick={() => handleSignOut()}
								>
									<LogOut size={15} />
									Sign Out
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									className="flex w-full items-center justify-between border-b px-2 py-3 hover:bg-gray-100"
									onClick={() => signIn()}
								>
									<LogIn size={15} />
									Sign In
								</button>
								<button
									type="button"
									className="flex w-full items-center justify-between border-b px-2 py-3 hover:bg-gray-100"
									onClick={() => router.push("/")}
								>
									<Globe size={15} />
									Top Page
								</button>
							</>
						)}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
