import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
 } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority"

 const userInfoVariants = cva("flex items-center gap-2", {
   variants: {
      size: {
         default: "[&_p]:text-sm [&_svg]:size-4",
         lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:text-black",
         sm: "[&_p]:text-xs [&_svg]:size-3.5",
      },
   },
   defaultVariants: {
      size: "default",
   },
})

interface Props extends VariantProps<typeof userInfoVariants> {
   className?: string;
   name: string;
}

const UserInfo = ({ name, className, size }: Props) => {
  return (
    <div className={cn(userInfoVariants({ size, className }))}>
      <Tooltip>
         <TooltipTrigger asChild>
            <p className="text-zinc-500 hover:text-zinc-800 line-clamp-1">{name}</p>
         </TooltipTrigger>
         <TooltipContent align="center" className="bg-black/70">
            <p>{name}</p>
         </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default UserInfo
