import { DEFAULT_LIMIT } from '@/constants'
import { trpc } from '@/trpc/client'
import { IconChevronDownRight, IconLoader } from '@tabler/icons-react'
import React from 'react'
import CommentItem from './comment-item'
import { Button } from '@/components/ui/button'

type Props = {
   parentId: string,
   videoId: string
}

export const CommentReplies = ({ parentId, videoId }: Props) => {

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.comments.getMany.useInfiniteQuery({
    limit: DEFAULT_LIMIT,
    videoId: videoId,
    parentId: parentId
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  return (
    <div className='pl-14'>
      <div className='flex flex-col gap-4 mt-2'>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <IconLoader className='size-6 animate-spin text-neutral-600'/>
          </div>
        )}
        {!isLoading && data?.pages.flatMap((page) => page.items).map((comment) => (
          <CommentItem key={comment.id} comment={comment} variant='reply' />
        ))}
      </div>
      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Show more replies
          <IconChevronDownRight />
        </Button>
      )}
    </div>
  )
}

