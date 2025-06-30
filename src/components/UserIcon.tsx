"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { signOut } from "@/src/lib/auth-client";
import { Monitor, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
	userName?: string;
	loginUserOsName?: string;
	isPublic: boolean;
};

export const UserIcon = ({
	userName = "hoge",
	loginUserOsName = "gogofasdfasfasfasdflkjfasd;ljfal;skjfl;akjfd;laskj",
	isPublic,
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
	return (
		<div className="fixed bottom-4 left-4 z-50">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src={"icon-url"} alt="User Avatar" />
						<AvatarFallback>
							<User />
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-[100px] gap-2 text-sm" align="start">
					<DropdownMenuGroup>
						<DropdownMenuItem style={{ display: "flex", justifyContent: "center" }}>
							<User size={15} className="mr-2" />
							{truncate(userName, 5)}
						</DropdownMenuItem>
						<DropdownMenuItem
							style={{ display: "flex", justifyContent: "center" }}
							onClick={() => router.push(`/os/${loginUserOsName}`)}
						>
							<Monitor size={15} className="mr-2" />
							{truncate(loginUserOsName, 5)}
						</DropdownMenuItem>
						<DropdownMenuItem
							style={{ display: "flex", justifyContent: "center", color: "#dc2626" }}
							onClick={() => handleSignOut()}
						>
							logout
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
