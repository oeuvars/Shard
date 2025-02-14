import { useToast } from '@/hooks/use-toast';
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus} from '@mux/mux-uploader-react';

type Props = {
   endpoint?: string | null;
   onSuccess: () => void;
}

export const StudioUploader = (props: Props) => {
   const { showToast } = useToast();
   return (
      <MuxUploader
         endpoint={props.endpoint}
         onSuccess={props.onSuccess}
         onError={(error) => {
            showToast({ message: error.type, type: 'error' });
         }}
      >
         <MuxUploaderDrop>
            <p className='text-center text-sm text-zinc-500'>
               Drag and drop your video file here or click to upload
            </p>
         </MuxUploaderDrop>
         <MuxUploaderFileSelect>
            <p className='text-center text-sm text-zinc-500'>
               Select a video file or click to upload
            </p>
         </MuxUploaderFileSelect>
         <MuxUploaderProgress />
         <MuxUploaderStatus />
      </MuxUploader>
   );
};
