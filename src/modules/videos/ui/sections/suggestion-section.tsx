'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { VideoGridCard } from '../components/video-gridcard';
import { VideoRowCard } from '../components/video-rowcard';
import { SuggestionSkeleton } from '../skeletons/suggestion-skeleton';

type Props = {
  videoId: string;
  isManual?: boolean;
};

const SuggestionSection = ({ videoId, isManual }: Props) => {
  return (
    <Suspense fallback={<SuggestionSkeleton />}>
      <SuggestionSectionSuspense videoId={videoId} isManual={isManual} />
    </Suspense>
  );
};

const SuggestionSectionSuspense = ({ videoId, isManual }: Props) => {
  const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId: videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );

  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap(page =>
          page.items.map(video => (
            <VideoRowCard key={video.id} size="compact" data={video} onRemove={() => {}} />
          )),
        )}
      </div>
      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap(page =>
          page.items.map(video => (
            <VideoGridCard key={video.id} data={video} onRemove={() => {}} />
          )),
        )}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isManual={isManual}
      />
    </>
  );
};

export default SuggestionSection;
