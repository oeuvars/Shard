'use client';

import { InfiniteScroll } from '@/components/global/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link';

type Props = {};

const VideosSection = () => {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <VideosSectionSuspense />
      </Suspense>
   );
};

export default VideosSection;

const VideosSectionSuspense = (props: Props) => {
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
        <div className='border-y'>
          <Table>
            <TableHeader>
              <TableRow className='text-zinc-500'>
                <TableHead className='pl-6 w-[510px]'>Video</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Views</TableHead>
                <TableHead className='text-right'>Comments</TableHead>
                <TableHead className='text-right pr-6'>Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.pages.flatMap((page) => page.items).map((video) => (
                <Link href={`/studio/videos/`} key={video.id} legacyBehavior>
                  <TableRow className='cursor-pointer'>
                    <TableCell className='pl-6'>{video.title}</TableCell>
                    <TableCell>visibilty</TableCell>
                    <TableCell>status</TableCell>
                    <TableCell className='text-right'>views</TableCell>
                    <TableCell className='text-right'>comments</TableCell>
                    <TableCell className='text-right pr-6'>likes</TableCell>
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
