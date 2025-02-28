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

const items = [
  { title: 'Home', href: '/', icon: HomeIcon },
  { title: 'Subscriptions', href: '/subscriptions', icon: PlaySquareIcon, auth: true },
  { title: 'Trending', href: '/feed/trending', icon: FlameIcon },
];

export const MainSection = () => {
  const session = authClient.useSession();
  const isInSession = !!session.data?.session;

  const { openAuthModal } = useAuthModal();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => (
            <SidebarMenuButton
              tooltip={item.title}
              asChild
              isActive={false}
              onClick={e => {
                if (!isInSession && item.auth) {
                  e.preventDefault();
                  return openAuthModal();
                }
              }}
              key={index}
            >
              <Link href={item.href}>
                <item.icon className="size-5" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
