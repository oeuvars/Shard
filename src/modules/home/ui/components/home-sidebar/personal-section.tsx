"use client";

import { useAuthModal } from "@/app/(auth)/sign-in/hooks/use-auth-modal";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { HeartIcon, HistoryIcon, ListVideoIcon } from "lucide-react";
import Link from "next/link";

const items = [
   { title: "History", href: "/playlists/history", icon: HistoryIcon, auth: true },
   { title: "Liked Videos", href: "/playlists/liked", icon: HeartIcon, auth: true },
   { title: "Playlist", href: "/playlists", icon: ListVideoIcon },
]

export const PersonalSection = () => {
   const session = authClient.useSession();
   const isInSession = !!session.data?.session;

   const { openAuthModal } = useAuthModal();

   return (
      <SidebarGroup>
         <SidebarGroupLabel>You</SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu>
               {items.map((item, index) => (
                  <SidebarMenuButton
                     tooltip={item.title}
                     asChild
                     isActive={false}
                     onClick={(e) => {
                        if (!isInSession && item.auth) {
                           e.preventDefault();
                           return openAuthModal()
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
   )
}
