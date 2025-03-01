import Link from 'next/link';
import { VideoGetManyOutput } from '../../types';
import { VideoInfo } from './video-info';
import VideoThumbnail from './video-thumbnail';

type Props = {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
};

export const VideoGridCard = ({ data, onRemove }: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail imageUrl={data.thumbnailUrl} title={data.title} duration={data.duration} />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};
