import { cn } from '@/lib/utils';
import { PlaylistGetManyOutput } from '../../types';
import Link from 'next/link';
import Image from 'next/image';
import { IconListTree, IconPlayerPlayFilled } from '@tabler/icons-react';
import { useMemo } from 'react';

type Props = {
  data: PlaylistGetManyOutput['items'][number];
};

export const PlaylistGridCard = ({ data }: Props) => {

  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en-US', { notation: 'compact' }).format(data.videoCount);
  }, [data.videoCount]);

  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <div className={cn('relative pt-3')}>
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video" />
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video" />
            <div className="relative overflow-hidden w-ful;l rounded-xl aspect-video">
              <Image
                src={ data.thumbnailUrl || "/images/placeholder.svg"}
                alt={data.name}
                className="size-full object-cover"
                fill
              />
              <div className="absolute inset-0 bg-black/70 animate opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center gap-x-2">
                  <IconPlayerPlayFilled className="text-white fill-white size-5" />
                  <span className="text-white font-medium tracking-tight">Play all</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 backdrop-blur-xl text-white text-xs font-medium flex items-center gap-x-1">
            <IconListTree className="size-4" />
            <span>{compactViews} views</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm break-words">
              {data.name}
            </h3>
            <p className="text-sm text-neutral-600 font-medium">Playlist</p>
            <p className="text-sm text-neutral-300 font-semibold hover:text-neutral-400 animate">
              View full playlist
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
