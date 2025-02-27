import { VideoGridcardSkeleton } from './video-gridcard-skeleton';
import { VideoRowCardSkeleton } from './video-rowcard-skeleton';

export const SuggestionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
        <div className="block md:hidden space-y-10">
          {Array.from({ length: 8 }).map((_, index) => (
            <VideoGridcardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
};
