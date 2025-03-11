'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { VideoGridCard } from '@/modules/videos/ui/components/video-gridcard';
import { VideoRowCard } from '@/modules/videos/ui/components/video-rowcard';
import { trpc } from '@/trpc/client/client';
import { Suspense } from 'react';
import { LikedSkeleton } from '../skeletons/liked-skeleton';

const LikedSectionSuspense = () => {
  const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );

  return (
    <div className="">
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap(page => page.items)
          .map(video => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <div className="hidden md:flex flex-col gap-4">
        {videos.pages
          .flatMap(page => page.items)
          .map(video => (
            <VideoRowCard key={video.id} data={video} size="default"/>
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

const LikedSection = () => {
  return (
    <Suspense fallback={<LikedSkeleton />}>
      <LikedSectionSuspense />
    </Suspense>
  );
};

export default LikedSection;
