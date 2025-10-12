"use client";

import type { FontOptionType } from "@/prisma/prisma/zod";
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
import {
	ArrowRight,
	Check,
	CircleUserRound,
	DoorOpen,
	Globe,
	Leaf,
	LogIn,
	LogOut,
	Monitor,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { litteOne } from "./lp/hero/Hero";

type Props = {
	userName?: string;
	loginUserOsName?: string;
	isPublic: boolean;
	currentUserInfo: CurrentUserType;
	getFontStyle: (newFont: FontOptionType) => void;
	currentFont: FontOptionType;
	osName: string;
};

export const UserIcon = ({
	isPublic,
	currentUserInfo,
	getFontStyle,
	currentFont,
	osName,
}: Props) => {
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

	const [isOpen, setIsOpen] = useState(false);

	const goToMyOspace = () => {
		if (currentUserInfo?.currentUserOsName !== osName) {
			router.push(`/os/${currentUserInfo?.currentUserOsName}`);
		} else {
			setIsOpen(false);
		}
	};

	return (
		<div className="fixed bottom-[60px] left-[40px] z-50 flex items-center gap-1 rounded-3xl bg-white/90 p-1">
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger className="outline-none focus:outline-none">
					<Avatar>
						<AvatarImage src={currentUserInfo?.currentUserIcon ?? undefined} alt="User Avatar" />
						<AvatarFallback>
							<CircleUserRound size={40} color="gray" strokeWidth={1.2} />
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="min-w-[150px] gap-2 rounded-xl border-0 bg-white p-0 text-sm"
					align="start"
					sideOffset={15}
				>
					<div className="m-0 w-[150px]">
						{currentUserInfo?.currentUserOsName && currentUserInfo?.currentUsername ? (
							<div className="p-1">
								<div className="flex w-full items-center justify-between px-2 py-2">
									<CircleUserRound size={17} />
									{truncate(currentUserInfo.currentUsername, 7)}
								</div>
								<button
									type="button"
									className={` ${litteOne.className} flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-md uppercase transition-colors hover:bg-gray-800/10`}
									onClick={() => goToMyOspace()}
								>
									<p>{truncate(currentUserInfo.currentUserOsName, 7)}</p>
									{currentUserInfo?.currentUserOsName === osName ? (
										<Check size={17} />
									) : (
										<ArrowRight size={17} />
									)}
								</button>
								<button
									type="button"
									className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-red-600 text-sm transition-colors hover:bg-red-600/10"
									onClick={() => handleSignOut()}
								>
									<LogOut size={15} />
									Sign Out
								</button>
							</div>
						) : (
							<div className="p-1">
								<Link
									href="/login"
									className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-md transition-colors hover:bg-gray-800/10"
								>
									<LogIn size={15} />
									Sign In
								</Link>
								<button
									type="button"
									className=" flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-gray-800 text-md transition-colors hover:bg-gray-800/10"
									onClick={() => router.push("/")}
								>
									<Leaf size={15} />
									Top Page
								</button>
							</div>
						)}
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
