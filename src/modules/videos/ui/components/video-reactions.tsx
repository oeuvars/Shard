import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

type Props = {};

const VideoReactions = (props: Props) => {

   const viewerReaction: "like" | "dislike" = 'like';
   return (
      <div className="flex items-center flex-none">
         <Button className='rounded-l-full rounded-r-none gap-2 pr-4' variant="secondary">
            <ThumbsUpIcon fill='#ef4444' className={cn("size-5", viewerReaction === "like" && "text-red-500")} />
            {1}
         </Button>
         <Separator orientation='vertical' className='h-7' />
         <Button className='rounded-l-none rounded-r-full gap-2 pl-3' variant="secondary">
         <ThumbsDownIcon className={cn("size-5", viewerReaction !== "like" && "text-black-500")} />
            {100}
         </Button>
      </div>
   );
};

export default VideoReactions;
