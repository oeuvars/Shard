import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useToast } from '@/hooks/use-toast';
import { ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from 'lucide-react';

type Props = {
  videoId: string;
  variant?: 'ghost' | 'secondary';
  onRemove?: () => void;
};

const VideoMenu = ({ videoId, variant = 'ghost', onRemove }: Props) => {
  const { showToast } = useToast();

  const onShare = () => {
    const URL = `${process.env.NEXT_PUBLIC_APP_URL}/videos/${videoId}`;

    navigator.clipboard.writeText(URL);
    showToast({
      message: 'Video URL copied to clipboard',
      type: 'success',
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg border-dashed"
        align="end"
        onClick={e => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={onShare}
          className="font-semibold text-neutral-600 tracking-tight"
        >
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {}}
          className="font-semibold text-neutral-600 tracking-tight"
        >
          <ListPlusIcon className="mr-1 size-4" />
          Add to playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem
            onClick={onRemove}
            className="font-semibold text-neutral-600 tracking-tight"
          >
            <Trash2Icon className="mr-1 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoMenu;
