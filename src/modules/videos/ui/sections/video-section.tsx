'use client';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import VideoPlayer, { VideoPlayerSkeleton } from '../components/video-player';
import VideoBanner from '../components/video-banner';
import VideoInformation, { VideoInformationSkeleton } from '../components/video-information';
import { authClient } from '@/lib/auth-client';

type Props = {
  videoId: string;
};

const VideoSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <VideoSectionSuspense videoId={videoId} />
    </Suspense>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoInformationSkeleton />
    </>
  );
};

const VideoSectionSuspense = ({ videoId }: Props) => {
  const session = authClient.useSession();
  const isInSession = !!session.data?.session;

  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });

  const utils = trpc.useUtils();

  const handlePlay = () => {
    if (!isInSession) return;

    createView.mutate({ id: videoId });
  };

  return (
    <>
      <div
        className={cn(
          'aspect-video flex justify-center bg-neutral-950 rounded-xl overflow-hidden',
          video.videoStatus !== 'ready' && '',
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={handlePlay}
          playbackId={video.videoUrl}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.videoStatus} />
      <VideoInformation video={video} />
    </>
  );
};

export default VideoSection;
