import { DEFAULT_LIMIT } from '@/constants';
import VideoView from '@/modules/playlists/ui/views/video-view';
import { HydrateClient, trpc } from '@/trpc/server/server';

type Props = {
  params: Promise<{ playlistId: string }>;
};

export const dynamic = 'force-dynamic';

const Page = async ({ params }: Props) => {

  const { playlistId } = await params;

  void trpc.playlists.getVideos.prefetchInfinite({ playlistId, limit: DEFAULT_LIMIT });
  void trpc.playlists.getOne.prefetch({ id: playlistId });

  return (
    <HydrateClient>
      <VideoView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Page;
