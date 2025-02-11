"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";

const items = [
   { title: "Home", href: "/", icon: HomeIcon },
   { title: "Subscriptions", href: "/subscriptions", icon: PlaySquareIcon, auth: true },
   { title: "Trending", href: "/trending", icon: FlameIcon },
]

export const MainSection = () => {
   return (
      <SidebarGroup>
         <SidebarGroupContent>
            <SidebarMenu>
               {items.map((item, index) => (
                  <SidebarMenuButton tooltip={item.title} asChild isActive={false} onClick={() => {}} key={index}>
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
