'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { VideoGridCard } from '../components/video-gridcard';
import { VideoRowCard } from '../components/video-rowcard';

type Props = {
  videoId: string;
  isManual?: boolean;
};

const SuggestionSection = ({ videoId }: Props) => {
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
        isManual
      />
    </>
  );
};

export default SuggestionSection;
