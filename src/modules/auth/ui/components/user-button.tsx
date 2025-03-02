'use client';

import { useAuthModal } from '@/app/(auth)/sign-in/hooks/use-auth-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';
import { IconDeviceTv, IconLogin2, IconLogout2, IconUser } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  name: string | undefined;
  image: string | null | undefined | undefined;
  isInSession: boolean;
};

export const UserButton = ({ name, image, isInSession }: Props) => {
  const { openAuthModal } = useAuthModal();

  const getInitials = (name: string) => {
    const nameParts = name.split('');
    return nameParts
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const router = useRouter();

  const handleAuth = async () => {
    if (isInSession) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
            setTimeout(() => {
              router.refresh();
            }, 100);
          },
        },
      });
    } else {
      openAuthModal();
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className="my-auto cursor-pointer transition-all duration-300 hover:shadow-md hover:shadow-primary/25 rounded-full">
          {isInSession ? (
            <>
              {image ? (
                <Image
                  src={image}
                  alt={name || ''}
                  width={40}
                  height={40}
                  className="rounded-full hover:opacity-90 transition-opacity border border-neutral-200"
                />
              ) : name ? (
                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white text-sm font-semibold transition-transform hover:scale-105 border border-neutral-200">
                  {getInitials(name)}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center transition-transform hover:scale-105 border border-neutral-200">
                  <span className="text-gray-500">User</span>
                </div>
              )}
            </>
          ) : (
            <Button
              className="transition-all duration-300 hover:shadow-md hover:shadow-primary/25 hover:brightness-110"
              variant="secondary"
            >
              Sign in
            </Button>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 mt-4 w-96 border-dashed rounded-lg bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl shadow-lg transition-all duration-300">
        <DropdownMenuLabel className="rounded-md mb-2 pt-2 px-2">
          {name ? <>Hey, {name} ✨</> : <>Hey, User 👀</>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="p-2 rounded-md hover:bg-neutral-100 transition-colors font-semibold tracking-tight text-neutral-600"
        >
          <Link href="/studio">
            <IconDeviceTv className="mr-2 text-neutral-600" strokeWidth={2.25} />
            Studio
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="p-2 rounded-md hover:bg-neutral-100 transition-colors font-semibold tracking-tight text-neutral-600"
        >
          <Link href="/cart" className="flex items-center">
            <IconUser className="mr-2 text-neutral-600" strokeWidth={2.25} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleAuth}
          className="p-2 rounded-md hover:bg-neutral-100 transition-colors font-semibold tracking-tight text-neutral-600"
        >
          {isInSession ? (
            <div className="flex items-center gap-2">
              <IconLogout2 className="size-4 mr-2" strokeWidth={2.25} />
              Sign Out
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <IconLogin2 className="size-4 mr-2" strokeWidth={2.25} />
              Sign In
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
