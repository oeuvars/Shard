"use client"

import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'

type Props = {}

const VideosSection = (props: Props) => {
  const [data] = trpc.studio.getmany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}

export default VideosSection
