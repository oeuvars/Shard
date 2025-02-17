import { useMemo } from 'react';
import { VideoGetOneOutput } from '../../types';
import VideoDescription from './video-description';
import VideoMenu from './video-menu';
import VideoOwner from './video-owner';
import VideoReactions from './video-reactions';
import { formatDate, formatDistanceToNow } from '@/lib/utils';

type Props = {
   video: VideoGetOneOutput;
};

const VideoInformation = ({ video }: Props) => {

   const compactViews = useMemo(() => {
      return Intl.NumberFormat('en-US', {
         notation: 'compact',
      }).format(video.viewCount);
   }, [video.viewCount])

   const expandedViews = useMemo(() => {
      return Intl.NumberFormat('en-US', {
         notation: 'standard',
      }).format(video.viewCount);
   }, [video.viewCount])

   const compactDate = useMemo(() => {
      return formatDistanceToNow(video.createdAt, { addSuffix: true });
   }, [])

   const expandedDate = useMemo(() => {
      return formatDate(video.createdAt);
   }, [])
   return (
      <div className="flex flex-col gap-4 mt-4">
         <h1 className="text-xl font-semibold tracking-tight">{video.title}</h1>
         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <VideoOwner user={video.user} videoId={video.id} />
            <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
              <VideoReactions />
              <VideoMenu videoId={video.id} variant='secondary'/>
            </div>
         </div>
         <VideoDescription
            compactViews={compactViews}
            expandedViews={expandedViews}
            compactDate={compactDate}
            expandedDate={expandedDate}
            description={video.description}
         />
      </div>
   );
};

export default VideoInformation;
