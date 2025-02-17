import React from 'react';
import VideoSection from '../sections/video-section';
import SuggestionSection from '../sections/suggestion-section';
import CommentSection from '../sections/comment-section';

type Props = {
   videoId: string;
};

const VideoView = ({ videoId }: Props) => {
   return (
      <div className="flex flex-col max-w-full mx-auto pt-2.5 px-4 mb-10">
         <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1 min-w-0">
               <VideoSection videoId={videoId} />
               <div className='xl:hidden block mt-4'>
                  <SuggestionSection />
               </div>
               <CommentSection />
            </div>
            <div className='hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1'>
               <SuggestionSection />
            </div>
         </div>
      </div>
   );
};

export default VideoView;
