import { DEFAULT_LIMIT } from '@/constants';
import SubscriptionView from '@/modules/home/ui/views/subscriptions-view';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

const Page = async () => {
  void trpc.videos.getManySubscribed.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <SubscriptionView />
    </HydrateClient>
  );
};

export default Page;
