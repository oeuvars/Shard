import { Skeleton } from '@/components/ui/skeleton';

type Props = {};

export const VideoThumbnailSkeleton = (props: Props) => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
};
