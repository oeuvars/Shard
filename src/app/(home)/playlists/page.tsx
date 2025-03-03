import { DEFAULT_LIMIT } from '@/constants';
import PlaylistView from '@/modules/playlists/ui/views/playlist-view';
import { HydrateClient, trpc } from '@/trpc/server';

type Props = {};

const Page = async (props: Props) => {

  void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <PlaylistView />
    </HydrateClient>
  );
};

export default Page;
