import VideoView from '@/modules/studio/ui/views/video-view';
import { HydrateClient, trpc } from '@/trpc/server/server';

type Props = {
  params: Promise<{ videoId: string }>;
};

export const dynamic = 'force-dynamic';

const Page = async ({ params }: Props) => {
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
