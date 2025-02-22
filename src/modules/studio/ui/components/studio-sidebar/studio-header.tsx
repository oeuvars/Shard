import UserAvatar from '@/components/global/user-avatar';
import { SidebarHeader, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
;

type Props = {};

const StudioHeader = (props: Props) => {
   const { user } = useUser();
   const { state } = useSidebar()

   if (!user) return (
    <SidebarHeader className="flex items-center justify-center p-4">
        <Skeleton className="size-40 rounded-full" />
        <div className="flex flex-col gap-3 items-center justify-center mt-2">
          <Skeleton className="w-20 h-4 rounded-full" />
          <Skeleton className="w-24 h-4 rounded-full" />
        </div>
    </SidebarHeader>
   );

   if (state === 'collapsed') return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Your Profile" asChild>
          <Link href="/users/current">
            <UserAvatar
               imageUrl={user.imageUrl}
               name={user.fullName ?? 'User'}
               className="size-4 hover:opacity-90 transition-opacity animate"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
   );

   return (
      <SidebarHeader className="flex items-center justify-center p-4">
         <Link href="/users/current">
            <UserAvatar
               imageUrl={user?.imageUrl}
               name={user?.fullName ?? 'User'}
               className="size-40 hover:opacity-90 transition-opacity animate"
            />
         </Link>
         <div className="flex flex-col items-center justify-center mt-2">
            <p className="text-sm font-medium">Your Profile</p>
            <p className='font-semibold text-zinc-600'>{user?.fullName ?? 'User'}</p>
         </div>
      </SidebarHeader>
   );
};

export default StudioHeader;
