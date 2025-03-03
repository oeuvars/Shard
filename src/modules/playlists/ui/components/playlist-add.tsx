import { InfiniteScroll } from "@/components/global/infinite-scroll";
import { ResponsiveModal } from "@/components/global/responsive-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_LIMIT } from "@/constants";
import useToast from "@/hooks/use-toast";
import {  trpc } from "@/trpc/client";
import { IconLoader, IconSquareRounded, IconSquareRoundedCheckFilled } from "@tabler/icons-react";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   videoId: string
}

export const PlaylistAdd = ({ open, onOpenChange, videoId }: Props) => {

   const { showToast } = useToast();
   const utils = trpc.useUtils()

   const { data: playlists, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = trpc.playlists.getManyForVideo.useInfiniteQuery({
      limit: DEFAULT_LIMIT,
      videoId: videoId
   }, {
      getNextPageParam: (lastpage) => lastpage.nextCursor,
      enabled: !!videoId && open
   })

   const addVideo = trpc.playlists.addVideo.useMutation({
      onSuccess: () => {
         showToast({
            message: `Video added to playlist`,
            type: "success"
         })
         utils.playlists.getMany.invalidate();
         utils.playlists.getManyForVideo.invalidate({ videoId })
      },
      onError: (error) => {
         showToast({
            message: error.message,
            type: "error"
         })
      }
   })

   const removeVideo = trpc.playlists.removeVideo.useMutation({
      onSuccess: () => {
         showToast({
            message: `Video removed from playlist`,
            type: "success"
         })
         utils.playlists.getMany.invalidate();
         utils.playlists.getManyForVideo.invalidate({ videoId })
      },
      onError: (error) => {
         showToast({
            message: error.message,
            type: "error"
         })
      }
   })

   return (
      <ResponsiveModal title="Add to playlist" open={open} onOpenChange={onOpenChange}>
         <div className="flex flex-col pt-2">
            {isLoading && (
               <div className="flex justify-center p-4">
                  <IconLoader className="animate-spin"/>
               </div>
            )}
            <div className="grid">
               {!isLoading && playlists?.pages.flatMap((page) => page.items).map((playlist, index, array) => (
                  <div key={playlist.id}>
                     <Button
                        variant="ghost"
                        className="w-full justify-start px-2 [&_svg]:size-6"
                        size="lg"
                        onClick={() => {
                           if (playlist.containsVideo) {
                              removeVideo.mutate({ playlistId: playlist.id, videoId })
                           } else {
                              addVideo.mutate({ playlistId: playlist.id, videoId })
                           }
                        }}
                        disabled={removeVideo.isPending || addVideo.isPending}
                     >
                        {playlist.containsVideo ? (
                           <IconSquareRoundedCheckFilled strokeWidth={1.5} />
                        ) : (
                           <IconSquareRounded strokeWidth={1.5} />
                        )}
                        {playlist.name}
                     </Button>
                     {index !== array.length - 1 && <Separator className="my-1.5" />}
                  </div>
               ))}
               {!isLoading && (
                  <InfiniteScroll
                     hasNextPage={hasNextPage}
                     isFetchingNextPage={isFetchingNextPage}
                     fetchNextPage={fetchNextPage}
                     endMessage={false}
                     isManual
                  />
               )}
            </div>
         </div>
      </ResponsiveModal>
   )
}
