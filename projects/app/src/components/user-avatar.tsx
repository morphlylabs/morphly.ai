import { authClient } from '@/lib/auth-client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import React from 'react';
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@workspace/ui/components/dropdown-menu';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCustomer } from 'autumn-js/react';
import CheckoutDialog from './autumn/checkout-dialog';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function UserAvatar() {
  const { data: session, isPending } = authClient.useSession();
  const { checkout, check } = useCustomer();
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer hover:opacity-80">
          {isPending ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : (
            <>
              <AvatarImage
                src={session?.user.image ?? 'https://github.com/shadcn.png'}
                alt={session?.user.name ?? 'User avatar'}
              />
              <AvatarFallback>
                {session?.user.name.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {check({
          productId: 'plus',
        }).data.allowed === false && (
          <DropdownMenuItem
            onClick={async () => {
              await checkout({
                productId: 'plus',
                dialog: CheckoutDialog,
              });
            }}
            className="border border-violet-200/20 bg-gradient-to-r from-violet-500/10 to-purple-500/10 font-medium text-violet-600 hover:border-violet-300/30 hover:from-violet-500/20 hover:to-purple-500/20 dark:text-violet-400"
          >
            <Sparkles className="h-4 w-4 text-violet-500" />
            Upgrade Plan
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={signOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
