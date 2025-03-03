import UserAvatar from '@/components/global/user-avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import UserInfo from '@/modules/users/ui/components/user-info';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useMemo } from 'react';
import { VideoGetManyOutput } from '../../types';
import VideoMenu from './video-menu';
import VideoThumbnail from './video-thumbnail';

export const videoRowCardVariants = cva('group flex min-w-0', {
  variants: {
    size: {
      default: 'gap-4',
      compact: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const thumbnailVariants = cva('rounded-md overflow-hidden', {
  variants: {
    size: {
      default: 'w-[38%]',
      compact: 'w-[168px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export const VideoRowCard = ({ data, size, onRemove }: VideoRowCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en-US', { notation: 'compact' }).format(data.viewCount);
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat('en-US', { notation: 'compact' }).format(data.likeCount);
  }, [data.likeCount]);

  console.log("rendered data", data)

  return (
    <div className={videoRowCardVariants({ size })}>
      <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail imageUrl={data.thumbnailUrl} title={data.title} duration={data.duration} />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <Link href={`/videos/${data.id}`}>
            <h1
              className={cn(
                'font-semibold text-neutral-700 tracking-tight line-clamp-2',
                size === 'compact' ? 'text-sm' : 'text-base',
              )}
            >
              {data.title}
            </h1>
            {size === 'default' && (
              <p className="text-xs text-neutral-500 font-medium">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
            {size === 'default' && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <UserAvatar className="size-5" imageUrl={data.user.image} name={data.user.name} />
                  <UserInfo size="sm" name={data.user.name} />
                </div>
                <p className="text-sm text-neutral-600 w-fit line-clamp-2">
                  {data.description ?? 'No description'}
                </p>
              </>
            )}
            {size === 'compact' && <UserInfo size="sm" name={data.user.name} />}
            {size === 'compact' && (
              <p className="text-xs font-medium text-neutral-500 mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
};
