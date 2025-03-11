import UserAvatar from '@/components/global/user-avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client/client';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CommentInsertSchema } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';
import { useAuthModal } from '@/app/(auth)/sign-in/hooks/use-auth-modal';
import { IconLoader } from '@tabler/icons-react';

type Props = {
   videoId: string;
   parentId?: string;
   onSuccess?: () => void;
   onCancel?: () => void;
   variant?: "comment" | "reply";
};

const CommentSchema = CommentInsertSchema.omit({ userId: true });

const CommentForm = ({ videoId, parentId, onSuccess, onCancel, variant = "comment" }: Props) => {

   const session = authClient.useSession();
   const user = session.data?.user;

   const { showToast } = useToast();
   const utils = trpc.useUtils();

   const { openAuthModal } = useAuthModal();

   const create = trpc.comments.create.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId });
         utils.comments.getMany.invalidate({ videoId, parentId })
         form.reset();
         onSuccess?.();
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            showToast({
               message: 'Please log in to add a comment',
               type: "error"
            });
            openAuthModal()
         } else {
            showToast({
               message: 'Could not add comment',
               type: "error"
            });
         }
      },
   });

   const form = useForm<z.infer<typeof CommentSchema>>({
      resolver: zodResolver(CommentSchema),
      defaultValues: {
         parentId: parentId,
         videoId: videoId,
         content: '',
      },
   })

   const handleSubmit = (values: z.infer<typeof CommentSchema>) => {
      create.mutate(values);
   };

   const handleCancel = () => {
      form.reset();
      onCancel?.()
   }

   return (
      <Form {...form}>
         <form
            className="flex gap-4 group"
            onSubmit={form.handleSubmit(handleSubmit)}
         >
            <UserAvatar
               size="lg"
               imageUrl={user?.image || '/icons/person.svg'}
               name={user?.name || 'User'}
            />
            <div className="flex-1">
               <FormField
                  name='content'
                  control={form.control}
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Textarea
                              {...field}
                              placeholder={
                                 variant === "reply" ? "Reply to this comment..." : "Add a comment..."
                              }
                              className="resize-none bg-transparent overflow-hidden"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="justify-end gap-2 mt-2 flex">
                  {onCancel && (
                     <Button variant="ghost" type='button' onClick={handleCancel}>
                        Cancel
                     </Button>
                  )}
                  <Button type="submit" size="sm" disabled={create.isPending}>
                     {create.isPending ? (
                        <IconLoader className='animate-spin'/>
                     ) : (
                        <>
                           {variant === "reply" ? "Reply" : "Comment"}
                        </>
                     )}
                  </Button>
               </div>
            </div>
         </form>
      </Form>
   );
};

export default CommentForm;
