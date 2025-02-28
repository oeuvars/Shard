import { DEFAULT_LIMIT } from '@/constants';
import TrendingView from '@/modules/home/ui/views/trending-view';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{
    categoryId?: string;
  }>;
};

const Page = async () => {
  void trpc.videos.getTrending.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default Page;
