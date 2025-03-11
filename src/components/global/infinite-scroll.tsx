import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { IconLoader } from "@tabler/icons-react";

type Props = {
   isManual?: boolean;
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
   endMessage?: boolean;
   fetchNextPage: () => void;
}

export const InfiniteScroll = ({ isManual = false, hasNextPage, isFetchingNextPage, fetchNextPage, endMessage }: Props) => {
   const [isIntersecting, elementRef] = useIntersectionObserver({
      threshold: 1,
      rootMargin: "100px"
   });

   useEffect(() => {
      if (isIntersecting && !isFetchingNextPage && !isManual && hasNextPage) {
         fetchNextPage();
      }
   }, [isIntersecting, isFetchingNextPage, isManual, hasNextPage]);

   return (
      <div className={cn("flex flex-col items-center gap-4 p-4", endMessage, "p-0")}>
         <div ref={elementRef} className="h-1"></div>
         {hasNextPage ? (
            <>
            {isFetchingNextPage ? (
                  <IconLoader className="animate-spin"/>
               ) : (
                  <Button variant="secondary" onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                     Load More
                  </Button>
               )}
            </>
         ) : (
            <>
               {endMessage && (
                  <p className="font-medium text-sm text-zinc-500">You have reached the end of the list.</p>
               )}
            </>
         )}
      </div>
   )
}
