"use client"

import { ResponsiveModal } from '@/components/global/responsive-modal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/trpc/client'
import { Loader2, PlusIcon } from 'lucide-react'
import { StudioUploader } from './studio-uploader'
import { useRouter } from 'next/navigation'

type Props = {}

const StudioUpload = (props: Props) => {

  const { showToast } = useToast();
  const router = useRouter();

  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      showToast({ message: 'Video created successfully', type: 'success' })
      utils.studio.getMany.invalidate()
    },
    onError: (error) => {
      showToast({ message: error.message, type: 'error' })
    }
  })

  const onSuccess = () => {
    if (!create.data?.video.id) return;
    create.reset();

    router.push(`/studio/videos/${create.data?.video.id}`)
  }

  return (
    <section>
      <ResponsiveModal title='Upload a video' open={!!create.data} onOpenChange={() => create.reset()}>
        {create.data?.url ? <StudioUploader endpoint={create.data?.url} onSuccess={onSuccess} /> : <Loader2 className='animate-spin' />}
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2 className='animate-spin'/> : <PlusIcon />}
        Create
      </Button>
    </section>
  )
}

export default StudioUpload
