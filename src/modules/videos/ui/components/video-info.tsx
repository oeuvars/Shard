import UserAvatar from '@/components/global/user-avatar';
import { formatDistanceToNow } from '@/lib/utils';
import UserInfo from '@/modules/users/ui/components/user-info';
import Link from 'next/link';
import { useMemo } from 'react';
import { VideoGetManyOutput } from '../../types';
import VideoMenu from './video-menu';

type Props = {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
};

export const VideoInfo = ({ data, onRemove }: Props) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en-US', { notation: 'compact' }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.image} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="font-semibold line-clamp-1 lg:line-clamp-2 text-sm break-words">
            {data.title}
          </h3>
        </Link>
        <Link href={`/users/${data.user.id}`}>
          <UserInfo name={data.user.name} size="sm" />
        </Link>
        <Link href={`/videos/${data.id}`}>
          <p className="text-sm text-neutral-600 line-clamp-1">
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};
