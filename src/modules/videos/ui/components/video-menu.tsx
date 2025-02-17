import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { useToast } from '@/hooks/use-toast';
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from 'lucide-react';
import React from 'react'

type Props = {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu = ({ videoId, variant = "ghost", onRemove }: Props) => {

  const { showToast } = useToast();

  const onShare = () => {
    const URL = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;

    navigator.clipboard.writeText(URL);
    showToast({
      message: 'Video URL copied to clipboard',
      type: 'success',
    })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className='rounded-full'>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white/90 border-none backdrop-blur-lg' align='end' onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare}>
          <ShareIcon className='mr-2 size-4'/>
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <ListPlusIcon className='mr-2 size-4'/>
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem onClick={onRemove}>
            <Trash2Icon className='mr-2 size-4'/>
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default VideoMenu
