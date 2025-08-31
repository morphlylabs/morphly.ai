'use client';

import { CuboidIcon, Menu, MessageCirclePlus } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@workspace/ui/components/navigation-menu';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { useState } from 'react';
import { UserAvatar } from '@/components/user-avatar';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@workspace/ui/components/skeleton';

const navigationItems = [
  {
    title: 'My Creations',
    href: '/chats',
  },
];

function MobileNavigation({
  session,
}: {
  session: ReturnType<typeof authClient.useSession>['data'];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setOpen(false)}
            >
              <CuboidIcon className="h-8 w-8" />
              <span className="text-xl font-bold">Morphly</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-4">
          {session && (
            <>
              <Button asChild className="mx-2">
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <MessageCirclePlus className="h-3 w-3" />
                  New Chat
                </Link>
              </Button>

              {navigationItems.map(item => (
                <div key={item.title}>
                  <Link
                    href={item.href}
                    className="hover:bg-accent hover:text-accent-foreground block rounded-md p-2 text-sm font-medium transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="m-0 flex h-16 items-center justify-between px-2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <CuboidIcon className="h-8 w-8" />
            <span className="text-xl font-bold">Morphly</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {isPending ? (
          <div className="hidden items-center space-x-2 md:flex">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        ) : (
          session && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/chat"
                      className="flex flex-row items-center gap-1 border"
                    >
                      <MessageCirclePlus className="h-3 w-3 text-black" /> New
                      Chat
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {navigationItems.map(item => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link href={item.href} className="p-2">
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )
        )}

        {/* Right side - Conditional rendering based on auth status */}
        <div className="flex items-center space-x-2">
          {isPending ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : session ? (
            <>
              <UserAvatar />
              <MobileNavigation session={session} />
            </>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
