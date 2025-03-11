'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client/client';
import { Suspense } from 'react';
import { PlaylistSkeleton } from '../skeletons/playlist-skeleton';
import { PlaylistGridCard } from '../components/playlist-gridcard';

const PlaylistSectionSuspense = () => {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );

  return (
    <div className="">
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5">
        {playlists.pages.flatMap((page) => page.items).map((playlist) => (
          <PlaylistGridCard key={playlist.id} data={playlist} />
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

const PlaylistSection = () => {
  return (
    <Suspense fallback={<PlaylistSkeleton />}>
      <PlaylistSectionSuspense />
    </Suspense>
  );
};

export default PlaylistSection;
