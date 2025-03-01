import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

type Props = {
  title: string;
  imageUrl: string | null;
  duration: number;
};

const VideoThumbnail = ({ title, imageUrl, duration }: Props) => {
  return (
    <div className="relative group">
      {/* Thumbanil wrapper */}
      <div className="relative w-full overflow-hidden rounded-lg aspect-video">
        <Image
          src={imageUrl ?? '/images/placeholder.svg'}
          alt={title}
          fill
          className="object-cover size-full group-hover:opacity-0"
        />
      </div>

      {/* Video duration box */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/40 backdrop-blur-xl text-white text-xs font-xs">
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default VideoThumbnail;
