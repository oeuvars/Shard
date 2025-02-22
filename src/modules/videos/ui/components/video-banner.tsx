
import { VideoGetOneOutput } from '../../types'
import { AlertTriangleIcon } from 'lucide-react'

type Props = {
   status: VideoGetOneOutput["videoStatus"]
}

const VideoBanner = ({ status}: Props) => {

   if (status === "ready") return null;

   return (
      <div className='bg-yellow-400 py-3 px-4 rounded-b-xl flex items-center gap-2'>
         <AlertTriangleIcon className='size-4 text-black shrink-0' />
         <p className='text-xs md:text-sm text-black font-medium line-clamp-1'>
            This video is still being processed
         </p>
      </div>
   )
}

export default VideoBanner
