import React from 'react'
import { CommentGetManyOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/global/user-avatar';
import { cn, formatDistanceToNow } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import { MessageSquareIcon, MoreVertical, ThumbsDown, ThumbsUp, Trash2Icon } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';

type Props = {
   comment: CommentGetManyOutput["items"][number];
}

const CommentItem = ({ comment }: Props) => {
   const { userId } = useAuth();
   const clerk = useClerk();
   const utils = trpc.useUtils();

   const { showToast } = useToast()

   const remove = trpc.comments.remove.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId: comment.videoId })
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            clerk.openSignIn()
         } else {
            showToast({
               message: "Some error occoured",
               type: "error"
            })
         }
      }
   });

   const like = trpc.commentReactions.like.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId: comment.videoId })
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            showToast({
               message: "Please log in first",
               type: "error"
            })
            clerk.openSignIn()
         } else {
            showToast({
               message: "Some error occoured",
               type: "error"
            })
         }
      }
   });
   const dislike = trpc.commentReactions.dislike.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId: comment.videoId })
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            showToast({
               message: "Please log in first",
               type: "error"
            })
            clerk.openSignIn()
         } else {
            showToast({
               message: "Some error occoured",
               type: "error"
            })
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
               <div className='flex items-center mt-1 gap-2'>
                  <div className='flex items-center gap-2'>
                     <div>
                        <Button className='size-8 my-auto' disabled={false} variant="ghost" onClick={() => like.mutate({ commentId: comment.id })}>
                           <ThumbsUp className={cn(comment.viewerReaction === "like" && "fill-black")} />
                        </Button>
                        <span className='text-sm text-zinc-500'>{comment.likeCount}</span>
                     </div>
                     <div>
                        <Button className='size-8' size="icon" disabled={false} variant="ghost" onClick={() => dislike.mutate({ commentId: comment.id })}>
                           <ThumbsDown className={cn(comment.viewerReaction === "dislike" && "fill-black")} />
                        </Button>
                        <span className='text-sm text-zinc-500'>{comment.dislikeCount}</span>
                     </div>
                  </div>
               </div>
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
