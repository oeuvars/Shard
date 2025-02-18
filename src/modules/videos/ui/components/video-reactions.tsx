import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { VideoGetOneOutput } from '../../types';
import { useClerk } from '@clerk/nextjs';
import { trpc } from '@/trpc/client';
import { useToast } from '@/hooks/use-toast';

type Props = {
   videoId: string;
   likes: number;
   dislikes: number;
   viewerReaction: VideoGetOneOutput["viewerReaction"];
};

const VideoReactions = ({ videoId, likes, dislikes, viewerReaction }: Props) => {

   const clerk = useClerk();
   const utils = trpc.useUtils();
   const { showToast } = useToast();

   const like = trpc.videoReactions.like.useMutation({
      onSuccess: () => {
         utils.videos.getOne.invalidate({ id: videoId });
      },
      onError: (error) => {
         showToast({
            message: 'Please log in to like this video',
            type: 'error',
         })
         if (error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn()
         }
      }
   });

   const dislike = trpc.videoReactions.dislike.useMutation({
      onSuccess: () => {
         utils.videos.getOne.invalidate({ id: videoId });
      },
      onError: (error) => {
         showToast({
            message: 'Please log in to dislike this video',
            type: 'error',
         })
         if (error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn()
         }
      }
   });

   return (
      <div className="flex items-center flex-none">
         <Button onClick={() => like.mutate({ id: videoId })} disabled={like.isPending || dislike.isPending} className='rounded-l-full rounded-r-none gap-2 pr-4' variant="secondary">
            <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "text-red-500 fill-red-500")} />
            {likes}
         </Button>
         <Separator orientation='vertical' className='h-7' />
         <Button onClick={() => dislike.mutate({ id: videoId })} disabled={like.isPending || dislike.isPending} className='rounded-l-none rounded-r-full gap-2 pl-3' variant="secondary">
         <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "text-black fill-black")} />
            {dislikes}
         </Button>
      </div>
   );
};

export default VideoReactions;
