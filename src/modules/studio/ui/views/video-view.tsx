import React from 'react'
import { FormSection } from '../sections/form-section'

type Props = {
   videoId: string
}

const VideoView = ({ videoId }: Props) => {
  return (
    <div className='px-4 pt-2.5 '>
      <FormSection videoId={videoId} />
    </div>
  )
}

export default VideoView
