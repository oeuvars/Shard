import React from 'react'
import { CommentGetManyOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/global/user-avatar';
import { formatDistanceToNow } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import { MessageSquareIcon, MoreVertical, Trash2Icon } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';

type Props = {
   comment: CommentGetManyOutput["items"][number];
}

const CommentItem = ({ comment }: Props) => {

   const { userId } = useAuth();
   const clerk = useClerk();

   const utils = trpc.useUtils()

   const remove = trpc.comments.remove.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId: comment.videoId })
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn()
         }
      }
   });

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
            <DropdownMenu modal={false}>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className='size-8'>
                     <MoreVertical />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align='end' className='border-none bg-white/90 backdrop-blur-md'>
                  <DropdownMenuItem onClick={() => {}}>
                     <MessageSquareIcon className='size-4' />
                     Reply
                  </DropdownMenuItem>
                  {comment.user.clerkId === userId && (
                     <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                        <Trash2Icon className='size-4' />
                        Delete
                     </DropdownMenuItem>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   )
}

export default CommentItem
