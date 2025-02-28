import { VideoGridCardSkeleton } from '@/modules/videos/ui/skeletons/video-gridcard-skeleton';
import { VideoRowCardSkeleton } from '@/modules/videos/ui/skeletons/video-rowcard-skeleton';

type Props = {};

export const CategorySkeleton = (props: Props) => {
  return (
    <div className="">
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
