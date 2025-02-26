import UserAvatar from '@/components/global/user-avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/trpc/client';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CommentInsertSchema } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';

type Props = {
   videoId: string;
   onSuccess?: () => void;
};

const CommentSchema = CommentInsertSchema.omit({ userId: true });

const CommentForm = ({ videoId, onSuccess }: Props) => {

   const session = authClient.useSession();
   const user = session.data?.user;

   const { showToast } = useToast();
   const utils = trpc.useUtils();

   const create = trpc.comments.create.useMutation({
      onSuccess: () => {
         utils.comments.getMany.invalidate({ videoId: videoId });
         form.reset();
         onSuccess?.();
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            showToast({
               message: 'Please log in to add a comment',
               type: "error"
            });
            // clerk.openSignIn();
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
         videoId: videoId,
         content: '',
      },
   })

   const handleSubmit = (values: z.infer<typeof CommentSchema>) => {
      create.mutate(values);
   };

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
                              placeholder="Add a comment..."
                              className="resize-none bg-transparent overflow-hidden"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="justify-end gap-2 mt-2 flex">
                  <Button type="submit" size="sm">
                     Comment
                  </Button>
               </div>
            </div>
         </form>
      </Form>
   );
};

export default CommentForm;
