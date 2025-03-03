import { Skeleton } from '@/components/ui/skeleton';

type Props = {};

export const PlaylistSkeleton = (props: Props) => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5">
      {Array.from({ length: 18 }).map((_, index) => (
        <div className="flex flex-col gap-2 w-full" key={index}>
          <div className="relative w-full overflow-hidden rounded-xl aspect-video">
            <Skeleton className="size-full" />
          </div>
          <div className="flex gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-[90%]" />
              <Skeleton className="h-5 w-[70%]" />
              <Skeleton className="h-5 w-[50%]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
