import { SignIn } from '@clerk/nextjs'

type Props = {}

const Page = (props: Props) => {
  return (
   <main className='flex justify-center items-center h-screen w-screen'>
      <SignIn />
   </main>
  )
}

export default Page
