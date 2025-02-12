import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const StudioUpload = (props: Props) => {
  return (
    <Button variant="secondary">
      <PlusIcon />
      Create
    </Button>
  )
}

export default StudioUpload
