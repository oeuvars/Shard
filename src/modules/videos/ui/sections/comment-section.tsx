'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

type Props = {
   videoId: string;
};

const CommentSection = ({ videoId }: Props) => {
   return (
      <Suspense fallback={<CommentSectionSkeleton />}>
         <CommentSectionSuspense videoId={videoId} />
      </Suspense>
   );
};

const CommentSectionSkeleton = () => {
   return (
      <div className='mt-6 flex justify-center items-center'>
         <Loader2 className='text-zinc-400 size-7 animate-spin'/>
      </div>
   );
};

const CommentSectionSuspense = ({ videoId }: Props) => {
   const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({
      videoId: videoId,
      limit: DEFAULT_LIMIT
   }, {
      getNextPageParam: (lastpage) => lastpage.nextCursor,
   });

   return (
      <div className='mt-6'>
        <div className='flex flex-col gap-6'>
          <h1 className='text-xl font-semibold tracking-tight'>
             {comments.pages[0].count}&nbsp;Comments
          </h1>
          <CommentForm videoId={videoId} />
        </div>
        <div className='flex flex-col gap-4 mt-8'>
          {comments.pages.flatMap((page) => page.items).map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
   );
};

export default CommentSection;
