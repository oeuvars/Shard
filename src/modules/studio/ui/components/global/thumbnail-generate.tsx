import { ResponsiveModal } from "@/components/global/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
   videoId: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
   prompt: z.string().min(10),
})

export const ThumbnailGenerate = ({ videoId, open, onOpenChange }: Props) => {

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         prompt: "",
      }
   })

   const { showToast } = useToast();

   const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
      onSuccess: () => {
         showToast({
            message: 'Background job started',
            type: 'success',
         })
         form.reset();
         onOpenChange(false);
      },
      onError: () => {
         showToast({
            message: 'Some error',
            type: 'error',
         })
      }
   });

   const onSubmit = (value: z.infer<typeof formSchema>) => {
      generateThumbnail.mutate({ id: videoId, prompt: value.prompt });
      onOpenChange(false);
   }

   return (
      <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
               <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                           <Textarea
                              {...field}
                              placeholder="Add a prompt to your thumbnail"
                              className="resize-none"
                              cols={30}
                              rows={10}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </form>
            <div className="flex justify-end">
               <Button type="submit" disabled={form.formState.isSubmitting && generateThumbnail.isPending}>
                  Generate
               </Button>
            </div>
         </Form>
      </ResponsiveModal>
   )
}
