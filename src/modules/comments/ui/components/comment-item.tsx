import { CommentGetManyOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/global/user-avatar';
import { cn, formatDistanceToNow } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import { MessageSquareIcon, MoreVertical, ThumbsDown, ThumbsUp, Trash2Icon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import { useAuthModal } from '@/app/(auth)/sign-in/hooks/use-auth-modal';
import { useState } from 'react';
import CommentForm from './comment-form';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { CommentReplies } from './comment-replies';

type Props = {
   comment: CommentGetManyOutput["items"][number];
   variant?: "reply" | "comment"
}

const CommentItem = ({ comment, variant = "comment" }: Props) => {

   const session = authClient.useSession();
   const user = session.data?.user;

   const utils = trpc.useUtils();

   const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
   const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);

   const { showToast } = useToast()
   const { openAuthModal } = useAuthModal();

   const remove = trpc.comments.remove.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId: comment.videoId })
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            openAuthModal();
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
            openAuthModal()
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
            openAuthModal()
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
                  size={variant === "comment" ? "lg" : "sm"}
                  imageUrl={comment.user.image}
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
                     {variant === "comment" && (
                        <Button variant="ghost" size="sm" className='h-8' onClick={() => setIsReplyOpen(true)}>
                           Reply
                        </Button>
                     )}
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
                  {variant === "comment" && (
                     <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                        <MessageSquareIcon className='size-4' />
                        Reply
                     </DropdownMenuItem>
                  )}
                  {comment.user.id === user?.id && (
                     <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                        <Trash2Icon className='size-4' />
                        Delete
                     </DropdownMenuItem>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
         {isReplyOpen && variant === "comment" && (
            <div className='mt-4 pl-14'>
               <CommentForm
                  variant='reply'
                  parentId={comment.id}
                  onCancel={() => setIsReplyOpen(false)}
                  videoId={comment.videoId}
                  onSuccess={() => {
                     setIsReplyOpen(false);
                     setIsRepliesOpen(true);
                  }}
               />
            </div>
         )}
         {comment.replyCount > 0 && variant === "comment" && (
            <div className='pl-14'>
               <Button variant="ghost" size="sm" onClick={() => setIsRepliesOpen(current => !current)}>
                  {isRepliesOpen ? <IconChevronUp className='size-5 my-auto' /> : <IconChevronDown className='size-5 my-auto' />}
                  <h1 className='font-medium text-neutral-600'>{comment.replyCount} replies</h1>
               </Button>
            </div>
         )}
         {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
            <CommentReplies
               parentId={comment.id}
               videoId={comment.videoId}
            />
         )}
      </div>
   )
}

export default CommentItem
