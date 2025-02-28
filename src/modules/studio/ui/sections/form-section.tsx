'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VideoUpdateSchema } from '@/db/schema';
import { useToast } from '@/hooks/use-toast';
import { snakeToTitle } from '@/lib/utils';
import VideoPlayer from '@/modules/videos/ui/components/video-player';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  CheckIcon,
  CopyIcon,
  GlobeIcon,
  ImagePlus,
  LockIcon,
  MoreVertical,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ThumbnailGenerate from '../components/global/thumbnail-generate';
import ThumbnailUpload from '../components/global/thumbnail-upload';
import { FormSectionSkeleton } from '../skeletons/form-skeleton';

type Props = {
  videoId: string;
};

export const FormSection = ({ videoId }: Props) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <FormSectionSuspense videoId={videoId} />
    </Suspense>
  );
};

export const FormSectionSuspense = ({ videoId }: Props) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const { showToast } = useToast();

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState<boolean>(false);
  const [thumbnailGenerateOpen, setThumbnailGenerateOpen] = useState<boolean>(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categorires] = trpc.categorires.getMany.useSuspenseQuery();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });

      showToast({
        message: 'Video saved successfully',
        type: 'success',
      });
    },
    onError: () => {
      showToast({
        message: 'Error saving video',
        type: 'error',
      });
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      showToast({
        message: 'Video deleted successfully',
        type: 'success',
      });
      router.refresh();
    },
    onError: () => {
      showToast({
        message: 'Error deleted video',
        type: 'error',
      });
    },
  });

  const revalidate = trpc.videos.revalidate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      showToast({
        message: 'Video revalidated successfully',
        type: 'success',
      });
    },
    onError: () => {
      showToast({
        message: 'Error deleted video',
        type: 'error',
      });
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getOne.invalidate({ id: videoId });
      showToast({
        message: 'Thumbnail restored successfully',
        type: 'success',
      });
      router.refresh();
    },
    onError: () => {
      showToast({
        message: 'Could not restore thumbnail',
        type: 'error',
      });
    },
  });

  const form = useForm<z.infer<typeof VideoUpdateSchema>>({
    resolver: zodResolver(VideoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof VideoUpdateSchema>) => {
    update.mutate(data);
  };

  const URL = `${process.env.NEXT_PUBLIC_APP_URL}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(URL);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <ThumbnailUpload
        videoId={videoId}
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
      />
      <ThumbnailGenerate
        videoId={videoId}
        open={thumbnailGenerateOpen}
        onOpenChange={setThumbnailGenerateOpen}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div className="">
              <h1 className="text-2xl font-bold tracking-tight">Video Details</h1>
              <p className="text-sm text-zinc-500">Manage your video details</p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-gradient-to-br from-white/90 to-white/95 backdrop-blur-xl border-dashed"
                >
                  <DropdownMenuItem
                    className="font-semibold text-neutral-600"
                    onClick={() => revalidate.mutate({ id: video.id })}
                  >
                    <RotateCcwIcon className="size-4 mr-2" />
                    Refresh
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-neutral-300/70" />
                  <DropdownMenuItem
                    className="font-semibold text-neutral-600"
                    onClick={() => remove.mutate({ id: video.id })}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Add a Title to your video" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={10}
                        className="resize-none pr-10"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="border border-dashed rounded-lg border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          src={video.thumbnailUrl || '/images/placeholder.svg'}
                          className="object-cover object-center rounded-lg p-0.5"
                          fill
                          alt="Thumbnail"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 size-7"
                              size="icon"
                            >
                              <MoreVertical className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right" className="ml-2">
                            <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                              <ImagePlus className="size-4 mr-1" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setThumbnailGenerateOpen(true)}>
                              <SparklesIcon className="size-4 mr-1" />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => restoreThumbnail.mutate({ id: video.id })}
                            >
                              <RotateCcwIcon className="size-4 mr-1" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="mr-3 border-dashed rounded-lg bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl shadow-lg transition-all duration-300">
                        {categorires.map(category => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="hover:bg-zinc-200 cursor-pointer animate font-medium text-neutral-700"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.videoPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-zinc-500 font-medium text-xs">Video Link</p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${video.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500">{URL}</p>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <CheckIcon className="size-4 mr-2" />
                          ) : (
                            <CopyIcon className="size-4 mr-2" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-zinc-500 text-xs">Video Status</p>
                      <p className="text-sm font-medium">
                        {snakeToTitle(video.videoStatus || 'preparing')}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-zinc-500 text-xs">Track Status</p>
                      <p className="text-sm font-medium">
                        {snakeToTitle(video.videoTrackStatus || 'No Subtitles')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="public"
                          className="hover:bg-zinc-200 cursor-pointer animate"
                        >
                          <div className="flex items-center gap-x-2">
                            <GlobeIcon className="size-4 mr-2" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="private"
                          className="hover:bg-zinc-200 cursor-pointer animate"
                        >
                          <div className="flex items-center gap-x-2">
                            <LockIcon className="size-4 mr-2" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
