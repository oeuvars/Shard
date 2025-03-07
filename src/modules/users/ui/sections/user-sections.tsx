"use client"

import { trpc } from '@/trpc/client'
import { Suspense } from 'react'

type Props = {
   userId: string
}

export const UserSection = ({ userId }: Props) => {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <UserSectionSuspense userId={userId} />
    </Suspense>
  )
}

export const UserSectionSuspense = ({ userId }: Props) => {
   const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId })

   return (
      <div>
         {JSON.stringify(user)}
      </div>
   )
}
