'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { useIsMobile } from '@/hooks/use-mobile';
import { VideoGridCard } from '@/modules/videos/ui/components/video-gridcard';
import { VideoRowCard } from '@/modules/videos/ui/components/video-rowcard';
import { trpc } from '@/trpc/client/client';
import { Suspense } from 'react';
import { ResultSkeleton } from '../skeletons/result-skeleton';

type Props = {
  query: string | undefined;
  categoryId: string | undefined;
};

export const ResultSection = ({ query, categoryId }: Props) => {
  return (
    <Suspense key={`${query} + ${categoryId}`} fallback={<ResultSkeleton />}>
      <ResultSectionSuspense query={query} categoryId={categoryId} />
    </Suspense>
  );
};

const ResultSectionSuspense = ({ query, categoryId }: Props) => {
  const isMobile = useIsMobile();
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages.flatMap(page =>
            page.items.map((result, index) => <VideoGridCard key={index} data={result} />),
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages.flatMap(page =>
            page.items.map((result, index) => (
              <VideoRowCard key={index} data={result} size="default" />
            )),
          )}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={resultQuery.hasNextPage}
        isFetchingNextPage={resultQuery.isFetchingNextPage}
        fetchNextPage={resultQuery.fetchNextPage}
      />
    </>
  );
};

export default ResultSection;
