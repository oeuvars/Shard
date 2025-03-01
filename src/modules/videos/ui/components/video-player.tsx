'use client';

import Video from 'next-video';
import Player from 'next-video/player';

type Props = {
  playbackId: string | null;
  thumbnailUrl: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
};

export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video bg-black rounded-xl " />;
};

const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay = false }: Props) => {
  return (
    <Player
      src={playbackId || ''}
      autoPlay={autoPlay}
      poster={thumbnailUrl || '/images/placeholder.svg'}
      className='overflow-hidden'
    />
  );
};

export default VideoPlayer;
