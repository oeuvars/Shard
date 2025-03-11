import { SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { SearchInput } from './search-input';
import { UserButton } from '@/modules/auth/ui/components/user-button';

export const HomeNavbar = async () => {
   return (
      <nav className="fixed top-0 left-0 right-0 bg-white flex items-center px-2 pr-5 z-50 rounded-t-md">
         <div className="flex items-center gap-4 w-full py-3">
            <div className="flex items-center flex-shrink-0 gap-4">
               <SidebarTrigger />
               <Link href="/" className='-ml-3'>
                  <Image src="/logos/tkiara.svg" alt="Youtube Logo" width={35} height={35} />
               </Link>
            </div>

            <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
               <SearchInput />
            </div>

            <div className="flex-shrink-0 items-center flex gap-4">
               <UserButton />
            </div>
         </div>
      </nav>
   );
};
