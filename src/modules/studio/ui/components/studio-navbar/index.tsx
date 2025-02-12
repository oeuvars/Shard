import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import StudioUpload from "./studio-upload";

export const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full py-3">
         <div className="flex items-center flex-shrink-0 gap-4">
            <SidebarTrigger />
            <Link href="/studio">
               <Image src="/logos/youtube-studio.svg" alt="Youtube Logo" width={90} height={30} />
            </Link>
         </div>

         <div className="flex-1"/>

         <div className="flex-shrink-0 items-center flex gap-4">
            <StudioUpload />
            <AuthButton />
         </div>
      </div>
    </nav>
  )
}
