"use client"

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/trpc/client'
import { Loader2, PlusIcon } from 'lucide-react'

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
    <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
      {create.isPending ? <Loader2 className='animate-spin'/> : <PlusIcon />}
      Create
    </Button>
  )
}

export default StudioUpload
