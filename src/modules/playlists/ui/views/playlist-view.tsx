"use client"

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import PlaylistUpload from '../components/playlist-upload';
import { useState } from 'react';
import PlaylistSection from '../sections/playlist-section';

type Props = {};

const PlaylistView = (props: Props) => {

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistUpload
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className='flex justify-between items-center'>
        <div className="">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">Playlist</h1>
          <p className="text-sm text-neutral-400">Collections you have created</p>
        </div>
        <Button variant="outline" size="icon" className='rounded-full' onClick={() => setCreateModalOpen(true)}>
          <IconPlus />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};

export default PlaylistView;
