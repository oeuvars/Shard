import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@/modules/auth/ui/components/user-button';
import  { StudioUpload } from './studio-upload';
import { Instrument_Serif } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: "normal",
  subsets: ['latin'],
})

export const StudioNavbar = async () => {
   return (
      <nav className="fixed top-0 left-0 right-0 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
         <div className="flex items-center gap-4 w-full py-3">
            <div className="flex items-center flex-shrink-0 gap-4">
               <SidebarTrigger />
               <Link href="/studio" className='flex gap-2'>
                  <Image src="/logos/tkiara.svg" alt="tkiara" width={35} height={35} />
                  <h1 className={`${instrumentSerif.className} text-3xl my-auto font-semibold text-neutral-800 tracking-tight`}>Studio</h1>
               </Link>
            </div>

            <div className="flex-1" />

            <div className="flex-shrink-0 items-center flex gap-4">
               <StudioUpload />
               <UserButton />
            </div>
         </div>
      </nav>
   );
};
