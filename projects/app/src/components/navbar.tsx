"use client";

import { authClient } from "@/lib/auth-client";
import { AuthenticatedNavbar } from "./authenticated-navbar";
import { GuestNavbar } from "./guest-navbar";

export function Navbar() {
  const { data: session } = authClient.useSession();

  return session ? <AuthenticatedNavbar /> : <GuestNavbar />;
}
