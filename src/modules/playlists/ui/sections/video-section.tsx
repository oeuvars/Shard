'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { VideoGridCard } from '@/modules/videos/ui/components/video-gridcard';
import { VideoRowCard } from '@/modules/videos/ui/components/video-rowcard';
import { trpc } from '@/trpc/client/client';
import { Suspense } from 'react';
import { HistorySkeleton } from '../skeletons/history-skeleton';
import useToast from '@/hooks/use-toast';

type Props = {
  playlistId: string
}

const VideoSectionSuspense = ({ playlistId }: Props) => {

  const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT, playlistId },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );

  const utils = trpc.useUtils();
  const { showToast } = useToast()

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
       showToast({
          message: `Video added to playlist`,
          type: "success"
       })
       utils.playlists.getMany.invalidate();
       utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId })
       utils.playlists.getOne.invalidate({ id: data.playlistId })
       utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
    },
    onError: (error) => {
       showToast({
          message: error.message,
          type: "error"
       })
    }
 })

 const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
       showToast({
          message: `Video removed from playlist`,
          type: "success"
       })
       utils.playlists.getMany.invalidate();
       utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId })
       utils.playlists.getOne.invalidate({ id: data.playlistId })
       utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
    },
    onError: (error) => {
       showToast({
          message: error.message,
          type: "error"
       })
    }
 })

  return (
    <div className="">
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap(page => page.items)
          .map(video => (
            <VideoGridCard key={video.id} data={video} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
          ))}
      </div>
      <div className="hidden md:flex flex-col gap-4">
        {videos.pages
          .flatMap(page => page.items)
          .map(video => (
            <VideoRowCard key={video.id} data={video} size="default" onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id })} />
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

const VideoSection = ({ playlistId }: Props) => {
  return (
    <Suspense fallback={<HistorySkeleton />}>
      <VideoSectionSuspense playlistId={playlistId} />
    </Suspense>
  );
};

export default VideoSection;
