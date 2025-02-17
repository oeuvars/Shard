import VideoView from '@/modules/videos/ui/views/video-view'
import { HydrateClient, trpc } from '@/trpc/server'

type Props = {
   params: Promise<{
      videoId: string
   }>
}

export const dynamic = "force-dynamic"

const Page = async (props: Props) => {
   const { videoId } = await props.params;

   void trpc.videos.getOne.prefetch({ id: videoId });

   return (
      <HydrateClient>
         <VideoView videoId={videoId} />
      </HydrateClient>
   )
}

export default Page
