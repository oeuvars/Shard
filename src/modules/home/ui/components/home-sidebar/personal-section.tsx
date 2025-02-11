"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { HeartIcon, HistoryIcon, ListVideoIcon } from "lucide-react";
import Link from "next/link";
import { useClerk, useAuth } from "@clerk/nextjs";


const items = [
   { title: "History", href: "/playlists/history", icon: HistoryIcon, auth: true },
   { title: "Liked Videos", href: "/playlists/liked", icon: HeartIcon, auth: true },
   { title: "Playlist", href: "/playlists", icon: ListVideoIcon },
]

export const PersonalSection = () => {
   const clerk = useClerk();
   const { isSignedIn } = useAuth();

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
                        if (!isSignedIn && item.auth) {
                           e.preventDefault();
                           return clerk.openSignIn()
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
