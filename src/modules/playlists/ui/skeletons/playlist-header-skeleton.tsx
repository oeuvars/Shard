import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

export const PlaylistHeaderSkeleton = (props: Props) => {
  return (
    <div className='flex flex-col gap-y-2'>
      <Skeleton className='h-6 w-24'/>
      <Skeleton className='h-6 w-32'/>
    </div>
  )
}
