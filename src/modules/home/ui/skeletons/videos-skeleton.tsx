import { VideoGridCardSkeleton } from '@/modules/videos/ui/skeletons/video-gridcard-skeleton';

type Props = {};

export const VideoSkeleton = (props: Props) => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5">
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};
