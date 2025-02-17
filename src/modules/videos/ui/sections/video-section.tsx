"use client"

import { cn } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import React, { Suspense } from 'react'
import VideoPlayer from '../components/video-player'
import VideoBanner from '../components/video-banner'
import VideoInformation from '../components/video-information'

type Props = {
   videoId: string
}

const VideoSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={"loading"}>
      <VideoSectionSuspense videoId={videoId} />
    </Suspense>
  )
}

const VideoSectionSuspense = ({ videoId }: Props) => {

   const [video] =  trpc.videos.getOne.useSuspenseQuery({ id: videoId });

   return (
      <>
         <div className={cn("aspect-video bg-black rounded-xl overflow-hidden relative", video.videoStatus !== "ready" && "rounded-b-none")}>
            <VideoPlayer
               autoPlay
               onPlay={() => {}}
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
