'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { VideoGridCard } from '@/modules/videos/ui/components/video-gridcard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { TrendingSkeleton } from '../skeletons/trending-skeleton';

const TrendingSectionSuspense = () => {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );

  return (
    <div className="">
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5">
        {videos.pages
          .flatMap(page => page.items)
          .map(video => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};

const TrendingSection = () => {
  return (
    <Suspense fallback={<TrendingSkeleton />}>
      <TrendingSectionSuspense />
    </Suspense>
  );
};

export default TrendingSection;
