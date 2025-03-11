'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DEFAULT_LIMIT } from '@/constants';
import { formatDate, snakeToTitle } from '@/lib/utils';
import VideoThumbnail from '@/modules/videos/ui/components/video-thumbnail';
import { trpc } from '@/trpc/client/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { VideoSectionSkeleton } from '../skeletons/video-skeleton';
import { IconLock, IconWorld } from '@tabler/icons-react';

const VideoSection = () => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <VideoSectionSuspense />
    </Suspense>
  );
};

const VideoSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );
  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow className="text-zinc-500">
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead className="w-[120px]">Visibility</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[150px]">Date</TableHead>
              <TableHead className="text-right w-[100px]">Views</TableHead>
              <TableHead className="text-right w-[120px]">Comments</TableHead>
              <TableHead className="text-right pr-6 w-[100px]">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap(page => page.items)
              .map(video => (
                <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                  <TableRow className="cursor-pointer hover:bg-zinc-50">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-36 h-20 shrink-0">
                          <VideoThumbnail
                            imageUrl={video.thumbnailUrl}
                            title={video.title}
                            duration={video.duration || 0}
                          />
                        </div>
                        <div className="flex flex-col gap-y-1 min-w-0">
                          <span className="text-sm line-clamp-1 font-semibold">{video.title}</span>
                          <span className="text-xs text-zinc-500 line-clamp-1">
                            {video.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {video.visibility === 'public' ? (
                          <IconWorld className="h-4 w-4" />
                        ) : (
                          <IconLock className="h-4 w-4" />
                        )}
                        {snakeToTitle(video.visibility)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        {snakeToTitle(video.videoStatus || 'error')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(new Date(video.createdAt))}
                    </TableCell>
                    <TableCell className="text-right">{video.viewCount}</TableCell>
                    <TableCell className="text-right">{video.commentCount}</TableCell>
                    <TableCell className="text-right pr-6">{video.likeCount}</TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export default VideoSection;
