"use client"

import { ResponsiveModal } from '@/components/global/responsive-modal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/trpc/client'
import { Loader2, PlusIcon } from 'lucide-react'
import { StudioUploader } from './studio-uploader'

type Props = {}

const StudioUpload = (props: Props) => {

  const { showToast } = useToast();

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

  return (
    <>
      <ResponsiveModal title='Upload a video' open={!!create.data} onOpenChange={() => create.reset()}>
        {create.data?.url ? <StudioUploader endpoint={create.data?.url} onSuccess={() => create.reset()} /> : <Loader2 className='animate-spin' />}
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2 className='animate-spin'/> : <PlusIcon />}
        Create
      </Button>
    </>
  )
}

export default StudioUpload
