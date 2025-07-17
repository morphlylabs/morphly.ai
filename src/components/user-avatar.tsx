import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React from "react";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function UserAvatar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer hover:opacity-80">
          <AvatarImage
            src={session?.user.image ?? "https://github.com/shadcn.png"}
            alt={session?.user.name ?? "User avatar"}
          />
          <AvatarFallback>
            {session?.user.name?.charAt(0).toUpperCase() ??
              session?.user.email?.charAt(0).toUpperCase() ??
              "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
