"use client"

import { Button } from "@/components/ui/button"
import { ClapperboardIcon, UserCircleIcon } from "lucide-react"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Fragment } from "react"

export const AuthButton = () => {
   return (
      <Fragment>
         <SignedIn>
            <UserButton>
               <UserButton.MenuItems>
                  <UserButton.Link label="Studio" href="/studio" labelIcon={<ClapperboardIcon className="size-4 my-auto"/>} />
               </UserButton.MenuItems>
            </UserButton>
         </SignedIn>
         <SignedOut>
            <SignInButton mode="modal">
               <Button variant="outline" className="bg-zinc-100 rounded-full px-4 py-2 text-sm font-medium">
                  <div className="flex gap-2">
                     <UserCircleIcon className="size-5 my-auto"/>
                     <h1 className="text-base font-medium tracking-tight">Sign In</h1>
                  </div>
               </Button>
            </SignInButton>
         </SignedOut>
      </Fragment>
   )
}
