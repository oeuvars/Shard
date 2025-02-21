'use client';

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
   return <Loader2 className="animate-spin size-10" />;
};

const CommentSectionSuspense = ({ videoId }: Props) => {
   const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId: videoId });

   return (
      <div className='mt-6'>
        <div className='flex flex-col gap-6'>
          <h1>
            0 Comments
          </h1>
          <CommentForm videoId={videoId} />
        </div>
        <div className='flex flex-col gap-4 mt-2'>
          {comments?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
   );
};

export default CommentSection;
