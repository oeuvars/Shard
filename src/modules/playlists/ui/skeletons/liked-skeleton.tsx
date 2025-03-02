import { VideoGridCardSkeleton } from '@/modules/videos/ui/skeletons/video-gridcard-skeleton';
import { VideoRowCardSkeleton } from '@/modules/videos/ui/skeletons/video-rowcard-skeleton';

type Props = {};

export const LikedSkeleton = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 gap-y-10 md:flex">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
