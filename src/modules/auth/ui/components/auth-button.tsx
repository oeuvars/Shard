import { Button } from "@/components/ui/button"
import { UserCircleIcon } from "lucide-react"

export const AuthButton = () => {
   return (
      <Button variant="outline" className="bg-zinc-100 rounded-full px-4 py-2 text-sm font-medium">
         <div className="flex gap-2">
            <UserCircleIcon className="size-5 my-auto"/>
            <h1 className="text-base font-medium tracking-tight">Sign In</h1>
         </div>
      </Button>
   )
}
