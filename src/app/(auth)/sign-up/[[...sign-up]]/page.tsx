import { SignUp } from '@clerk/nextjs'

type Props = {}

const Page = (props: Props) => {
  return (
   <main className='flex justify-center items-center h-screen w-screen'>
      <SignUp />
   </main>
  )
}

export default Page
