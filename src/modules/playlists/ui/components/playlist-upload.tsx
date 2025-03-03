import { ResponsiveModal } from "@/components/global/responsive-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useToast from "@/hooks/use-toast";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IconLoader, IconPlus } from "@tabler/icons-react";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
   name: z.string().min(1),
   description: z.string().min(1)
})

const PlaylistUpload = ({ open, onOpenChange }: Props) => {

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         name: "New Playlist",
         description: ""
      }
   })
   const { showToast } = useToast();
   const utils = trpc.useUtils()

   const create = trpc.playlists.create.useMutation({
      onSuccess: () => {
         form.reset(),
         onOpenChange(false)
         showToast({
            message: "Playlist created",
            type: "success"
         })
         utils.playlists.getMany.invalidate()
      },
      onError: () => {
         showToast({
            message: "Something went wrong",
            type: "error"
         })
      }
   })

   const onSubmit = (values: z.infer<typeof formSchema>) => {
      create.mutate(values)
   }

   return (
      <ResponsiveModal title="Create a playlist" open={open} onOpenChange={onOpenChange}>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-col gap-4"
            >
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="New Playlist"
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="Add a description"
                           />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <div className="flex justify-end">
                  <Button disabled={create.isPending} type="submit">
                     {create.isPending ? (
                        <div className="flex gap-2">
                           <IconLoader className="size-4 animate-spin my-auto" />
                           <h1>Creating</h1>
                        </div>
                     ): (
                        <div className="flex gap-2">
                           <IconPlus className="size-4 my-auto" />
                           <h1>Create</h1>
                        </div>
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </ResponsiveModal>
   )
}

export default PlaylistUpload;
