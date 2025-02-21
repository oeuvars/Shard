import { VideoGetOneOutput } from '../../types'
import Link from 'next/link'
import UserAvatar from '@/components/global/user-avatar'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button'
import UserInfo from '@/modules/users/ui/components/user-info'
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription'

type Props = {
   user: VideoGetOneOutput["user"],
   videoId: string
}

const VideoOwner = ({ user, videoId }: Props) => {

   const { userId, isLoaded } = useAuth();
   const { isPending, onClick } = useSubscription({ userId: user.id, isSubscribed: user.viewerSubscribed, fromVideoId: videoId });

   return (
      <div className='flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0'>
         <Link href={`/users/${user.id}`}>
            <div className='flex items-center gap-3 min-w-0'>
               <UserAvatar imageUrl={user.imageUrl} size='lg' name={user.name} />
               <div className='flex flex-col gap-1 min-w-0'>
                  <UserInfo size="lg" name={user.name} />
                  <span className='text-sm text-zinc-400 line-clamp-1'>
                     {user.subscriberCount} &nbsp; {user.subscriberCount === 1 ? "subscriber" : "subscribers"}
                  </span>
               </div>
            </div>
         </Link>
         <div className='flex m-auto'>
            {userId === user.clerkId ? (
               <Button className='rounded-full' asChild variant="secondary">
                  <Link href={`/studio/videos/${videoId}`}>
                     Edit Video
                  </Link>
               </Button>
            ) : (
               <SubscriptionButton
                  onClick={onClick}
                  disabled={isPending || !isLoaded}
                  isSubscribed={user.viewerSubscribed}
                  className='flex-none'
               />
            )}
         </div>
      </div>
   )
}

export default VideoOwner
