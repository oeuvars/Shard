"use client";

import { useAuthModal } from "@/app/(auth)/sign-in/hooks/use-auth-modal";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { IconHeart, IconHistory, IconList } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
   { title: "History", href: "/playlists/history", icon: IconHistory, auth: true },
   { title: "Liked Videos", href: "/playlists/liked", icon: IconHeart, auth: true },
   { title: "Playlist", href: "/playlists", icon: IconList },
]

export const PersonalSection = () => {
   const session = authClient.useSession();
   const isInSession = !!session.data?.session;

   const { openAuthModal } = useAuthModal();
   const pathName = usePathname()

   return (
      <SidebarGroup>
         <SidebarGroupLabel>You</SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu>
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
   )
}
