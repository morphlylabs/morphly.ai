"use client";

import { CuboidIcon, Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { UserAvatar } from "./user-avatar";

const navigationItems = [
  {
    title: "Workspace",
    href: "#",
    items: [
      {
        title: "Text to Parametric",
        href: "/services/text-to-parametric",
        description: "Generate parametric models from text",
      },
      {
        title: "Text to Mesh",
        href: "/services/text-to-mesh",
        description: "Generate meshes from text",
      },
      {
        title: "Upload STL",
        href: "/services/upload-stl",
        description: "Upload STL files to the workspace",
      },
    ],
  },
  {
    title: "Resources",
    href: "#",
    items: [
      {
        title: "Documentation",
        href: "/resources/documentation",
        description: "Documentation for the workspace",
      },
      {
        title: "Blog",
        href: "/resources/blog",
        description: "Blog posts about the workspace",
      },
    ],
  },
];

function MobileNavigation() {
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
          {navigationItems.map((item) => (
            <div key={item.title}>
              {item.items ? (
                <div className="space-y-2">
                  <h4 className="text-muted-foreground px-2 text-sm font-medium">
                    {item.title}
                  </h4>
                  <div className="space-y-1 pl-4">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="hover:bg-accent hover:text-accent-foreground block rounded-md p-2 text-sm transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <div className="font-medium">{subItem.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {subItem.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="hover:bg-accent hover:text-accent-foreground block rounded-md p-2 text-sm font-medium transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
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
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="h-9">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.items.map((subItem) => (
                          <NavigationMenuLink key={subItem.title} asChild>
                            <Link href={subItem.href} className="p-3">
                              <div className="text-sm leading-none font-medium">
                                {subItem.title}
                              </div>
                              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                {subItem.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link href={item.href} className="p-3">
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side - Conditional rendering based on auth status */}
        <div className="flex items-center space-x-2">
          <UserAvatar />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
