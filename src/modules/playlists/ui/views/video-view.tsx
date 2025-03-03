import React from 'react';
import VideoSection from '../sections/video-section';
import PlaylistHeaderSection from '../sections/playlist-header-section';

type Props = {
  playlistId: string
};

const VideoView = ({ playlistId }: Props) => {
  return (
    <div className="max-w-screen-2xl mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6 ">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideoSection playlistId={playlistId} />
    </div>
  );
};

export default VideoView;
