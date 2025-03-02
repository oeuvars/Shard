'use client';

import { useAuthModal } from '@/app/(auth)/sign-in/hooks/use-auth-modal';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { FlameIcon, HomeIcon, PlaySquareIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Subscriptions', href: '/feed/subscriptions', icon: PlaySquareIcon, auth: true },
  { title: 'Trending', href: '/feed/trending', icon: FlameIcon },
];

export const MainSection = () => {
  const session = authClient.useSession();
  const isInSession = !!session.data?.session;

  const { openAuthModal } = useAuthModal();
  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className='mt-1.5'>
          {items.map((item, index) => {
            const isActive = pathName === item.href;

            return (
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isActive}
                onClick={e => {
                  if (!isInSession && item.auth) {
                    e.preventDefault();
                    return openAuthModal();
                  }
                }}
                key={index}
                className={isActive ? "!bg-neutral-200 !text-neutral-800 dark:!bg-neutral-700 dark:!text-neutral-100 font-medium" : ""}
              >
                <Link href={item.href}>
                  <item.icon className="size-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
