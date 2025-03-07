"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import StudioHeader from "./studio-header"
import { IconDeviceTv, IconLogout } from "@tabler/icons-react"

export const StudioSidebar = () => {
   const pathName = usePathname()
   return (
      <Sidebar className="pt-16 z-40" collapsible="icon">
         <SidebarContent className="bg-background">
            <SidebarGroup>
               <SidebarMenu>
                  <StudioHeader />
                  <SidebarMenuItem>
                     <SidebarMenuButton isActive={pathName === "studio"} tooltip="Exit studio" asChild>
                        <Link href="/studio">
                           <IconDeviceTv className="size-5"/>
                           <span>Content</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Separator />
                  <SidebarMenuItem>
                     <SidebarMenuButton tooltip="Exit studio" asChild>
                        <Link href="/">
                           <IconLogout className="size-5"/>
                           <span>Exit Studio</span>
                        </Link>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   )
}
