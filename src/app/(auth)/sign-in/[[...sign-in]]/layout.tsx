import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react'

type Props = {
   children: ReactNode
}

export const metadata: Metadata = {
   title: "Youtube | Sign In",
   description: "Youtube is a video sharing platform that allows users to watch, upload, and share videos.",
 };

const SignInLayout = ({ children }: Props) => {
  return (
   <Suspense>
      {children}
   </Suspense>
  )
}

export default SignInLayout
