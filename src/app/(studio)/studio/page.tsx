import { DEFAULT_LIMIT } from '@/constants';
import StudioView from '@/modules/studio/ui/views/studio-view';
import { HydrateClient, trpc } from '@/trpc/server'
import React from 'react'

type Props = {}

export const dynamic = "force-dynamic";

const Page = async (props: Props) => {
  void trpc.studio.getmany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  })
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  )
}

export default Page
