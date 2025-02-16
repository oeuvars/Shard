"use client"

import MuxPlayer from "@mux/mux-player-react"

type Props = {
   playbackId: string | null;
   thumbnailUrl: string | null;
   autoPlay?: boolean;
   onPlay?: () => void;
}

const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay = true, onPlay }: Props) => {

   return (
      <MuxPlayer
         playbackId={playbackId || ""}
         poster={thumbnailUrl || "/images/placeholder.svg"}
         playerInitTime={0}
         autoPlay={autoPlay}
         thumbnailTime={0}
         className="size-full object-contain"
         accentColor="#cd201f"
         onPlay={onPlay}
      />
   )
}

export default VideoPlayer
