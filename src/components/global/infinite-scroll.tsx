import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface InfiniteScrollProps {
   isManual?: boolean;
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
   fetchNextPage: () => void;
}

export const InfiniteScroll = ({
   isManual = false,
   hasNextPage,
   isFetchingNextPage,
   fetchNextPage,
}: InfiniteScrollProps) => {
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
      <div className="flex flex-col items-center gap-4 p-4">
         <div ref={elementRef} className="h-1"></div>
         {hasNextPage ? (
            <Button variant="secondary" onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
               {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
         ) : (
            <p className="font-medium text-sm text-zinc-500">You have reached the end of the list.</p>
         )}
      </div>
   )
}
