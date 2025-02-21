"use client"

import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import React, { Suspense } from 'react'
import VideoPlayer, { VideoPlayerSkeleton } from '../components/video-player'
import VideoBanner from '../components/video-banner'
import VideoInformation, { VideoInformationSkeleton } from '../components/video-information'
import { useAuth } from '@clerk/nextjs'

type Props = {
   videoId: string
}

const VideoSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <VideoSectionSuspense videoId={videoId} />
    </Suspense>
  )
}

const VideoSectionSkeleton = () => {
   return (
      <>
         <VideoPlayerSkeleton />
         <VideoInformationSkeleton />
      </>
   )
}

const VideoSectionSuspense = ({ videoId }: Props) => {

   const { isSignedIn } = useAuth();

   const [video] =  trpc.videos.getOne.useSuspenseQuery({ id: videoId });

   const createView = trpc.videoViews.create.useMutation({
      onSuccess: () => {
         utils.videos.getOne.invalidate({ id: videoId });
      },
   });

   const utils = trpc.useUtils();

   const handlePlay = () => {
      if (!isSignedIn) return;

      createView.mutate({ id: videoId });
   }

   return (
      <>
         <div className={cn("aspect-video bg-black rounded-xl overflow-hidden relative", video.videoStatus !== "ready" && "rounded-b-none")}>
            <VideoPlayer
               autoPlay
               onPlay={handlePlay}
               playbackId={video.videoPlaybackId}
               thumbnailUrl={video.thumbnailUrl}
            />
         </div>
         <VideoBanner status={video.videoStatus} />
         <VideoInformation video={video}/>
      </>
   )
}

export default VideoSection;
