import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MuxUploader, {
   MuxUploaderDrop,
   MuxUploaderFileSelect,
   MuxUploaderProgress,
   MuxUploaderStatus,
} from '@mux/mux-uploader-react';
import { Upload } from 'lucide-react';

type Props = {
   endpoint?: string | null;
   onSuccess: () => void;
};

const UPLOADER_ID = 'video-uploader';

export const StudioUploader = (props: Props) => {
   const { showToast } = useToast();

   return (
      <div>
         <MuxUploader
            id={UPLOADER_ID}
            className="hidden group/uploader"
            endpoint={props.endpoint}
            onSuccess={props.onSuccess}
            onError={error => {
               showToast({ message: error.type, type: 'error' });
            }}
         />
         <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
            <div slot="heading" className="flex flex-col items-center gap-6">
               <div className="flex items-center justify-center gap-2 rounded-full bg-zinc-200 size-32">
                  <Upload className="h-10 w-10 text-primary-500 group/drop-[&[active]]:animate-bounce transition-all duration-300" />
               </div>
               <div className='flex flex-col gap-2 text-center'>
                  <p className='text-sm'>
                     Drag and drop your video files to upload
                  </p>
                  <p className='text-xs text-zinc-300'>
                     Your videos will be private unless you choose to make them public.
                  </p>
                  <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
                     <Button type='button' className='rounded-full'>
                        Select files
                     </Button>
                  </MuxUploaderFileSelect>
               </div>
            </div>
            <span slot='separator' className='hidden' />
            <MuxUploaderStatus muxUploader={UPLOADER_ID} className='text-sm' />
            <MuxUploaderProgress muxUploader={UPLOADER_ID} type='percentage' className='text-sm' />
            <MuxUploaderProgress muxUploader={UPLOADER_ID} type='bar' />
         </MuxUploaderDrop>
      </div>
   );
};
