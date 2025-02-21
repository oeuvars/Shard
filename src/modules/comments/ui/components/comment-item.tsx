import React from 'react'
import { CommentGetManyOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/global/user-avatar';
import { formatDistanceToNow } from '@/lib/utils';

type Props = {
   comment: CommentGetManyOutput[number];
}

const CommentItem = ({ comment }: Props) => {
  return (
    <div className=''>
      <div className='flex gap-4'>
         <Link href={`/users/${comment.userId}`}>
            <UserAvatar
               size="lg"
               imageUrl={comment.user.imageUrl}
               name={comment.user.name}
            />
         </Link>
         <div className='flex-1 min-w-0'>
            <Link href={`/users/${comment.userId}`}>
               <div className='flex items-center gap-2 mb-0.5'>
                  <div className='flex items-center gap-2 pb-0.5'>
                     <span className='font-medium text-sm pb-0.5'>
                        {comment.user.name}
                     </span>
                     <span className='text-xs font-medium text-zinc-500'>
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                     </span>
                  </div>
               </div>
            </Link>
            <p className='text-sm'>{comment.content}</p>
         </div>
      </div>
    </div>
  )
}

export default CommentItem
