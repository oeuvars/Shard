"use client"

import { Button } from '@/components/ui/button';
import useToast from '@/hooks/use-toast';
import { trpc } from '@/trpc/client/client';
import { IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { PlaylistHeaderSkeleton } from '../skeletons/playlist-header-skeleton';

type Props = {
  playlistId: string;
};

const PlaylistHeaderSection = ({ playlistId }: Props) => {
  return (
    <Suspense fallback={<PlaylistHeaderSkeleton />}>
      <PlaylistHeaderSectionSuspense playlistId={playlistId} />
    </Suspense>
  );
};

const PlaylistHeaderSectionSuspense = ({ playlistId }: Props) => {
   const { showToast } = useToast();
   const utils = trpc.useUtils();
   const router = useRouter();

   const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });

   const remove = trpc.playlists.remove.useMutation({
      onSuccess: () => {
         showToast({
            message: "playlist removed successfully",
            type: "success"
         })
         utils.playlists.getMany.invalidate();
         router.push('/playlists')
      },
      onError: (data) => {
         showToast({
            message: data.message,
            type: "error"
         })
      }
   })
   return (
      <div className="flex justify-between items-center">
         <div className="">
         <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">{playlist.name}</h1>
         <p className="text-sm text-neutral-400">Videos from the playlist</p>
         </div>
         <Button
            variant="outline"
            size="icon"
            className='rounded-full'
            onClick={() => remove.mutate({ id: playlistId })}
         >
            <IconTrash />
         </Button>
      </div>
   );
};

export default PlaylistHeaderSection;
