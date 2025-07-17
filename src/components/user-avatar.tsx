import Link from "next/link";
import { authClient } from "~/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserAvatar() {
  const { data: session } = authClient.useSession();

  return (
    <Link
      href={session?.session ? "/account" : "/sign-in"}
      className="flex justify-center"
    >
      <Avatar>
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
    </Link>
  );
}
