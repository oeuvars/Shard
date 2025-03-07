import { ResponsiveModal } from "@/components/global/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

type Props = {
   videoId: string;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const ThumbnailUpload = ({ videoId, open, onOpenChange }: Props) => {

   const utils = trpc.useUtils();
   const onUploadComplete = () => {
      utils.studio.getOne.invalidate({ id: videoId})
      onOpenChange(false);
   }

   return (
      <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
         <UploadDropzone
            endpoint="thumbnailUploader"
            input={{ videoId }}
            onClientUploadComplete={onUploadComplete}
            className="ut-button:bg-zinc-800 ut-button:ut-uploading:bg-zinc-800 ut-button:!cursor-pointer"
         />
      </ResponsiveModal>
   )
}

export default ThumbnailUpload;
