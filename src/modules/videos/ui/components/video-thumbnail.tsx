import { formatDuration } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

type Props = {
  title: string
  previewUrl: string | null
  imageUrl: string | null
  duration: number
}

const VideoThumbnail = ({ title, previewUrl, imageUrl, duration }: Props) => {
  return (
    <div className='relative group'>
      {/* Thumbanil wrapper */}
      <div className='relative w-full overflow-hidden rounded-lg aspect-video'>
         <Image
            src={imageUrl ?? "/images/placeholder.svg"}
            alt={title}
            fill
            className="object-cover size-full group-hover:opacity-0"
          />
          <Image
            src={previewUrl ?? "/images/placeholder.svg"}
            alt={title}
            fill
            unoptimized={!!previewUrl}
            className="object-cover size-full opacity-0 group-hover:opacity-100"
          />
      </div>

      {/* Video duration box */}
      <div className='absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-xs'>
        {formatDuration(duration)}
      </div>
    </div>
  )
}

export default VideoThumbnail
