import { trpc } from '@/trpc/client';
import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client';
import { useAuthModal } from '@/app/(auth)/sign-in/hooks/use-auth-modal';

type Props = {
   userId: string;
   isSubscribed: boolean;
   fromVideoId?: string;
};

export const useSubscription = ({ userId, isSubscribed, fromVideoId }: Props) => {

   const { openAuthModal } = useAuthModal();

   const utils = trpc.useUtils();
   const { showToast } = useToast()

   const subscribe = trpc.subsciptions.create.useMutation({
      onSuccess: () => {
         showToast({
            message: "Subscribed",
            type: "success"
         })
         if (fromVideoId) {
            utils.videos.getOne.invalidate({ id: fromVideoId });
         }
      },
      onError: (error) => {
         if (error.data?.code === "UNAUTHORIZED") {
            showToast({
               message: "Please Log in or sign up to subscribe",
               type: "error"
            })
            openAuthModal()
         } else {
            showToast({
               message: "Something went wrong",
               type: "error"
            })
         }
      }
   });
   const unsubscribe = trpc.subsciptions.remove.useMutation({
      onSuccess: () => {
         showToast({
            message: "UnSubscribed",
            type: "success"
         })
         if (fromVideoId) {
            utils.videos.getOne.invalidate({ id: fromVideoId });
         }
      },
      onError: (error) => {
         showToast({
            message: "Failed to unsubscribe",
            type: "error"
         })

         if (error.data?.code === "UNAUTHORIZED") {
            openAuthModal()
         }
      }
   });

   const isPending = subscribe.isPending || unsubscribe.isPending;

   const onClick = () => {
      if (isSubscribed) {
         unsubscribe.mutate({ userId });
      } else {
        subscribe.mutate({ userId });
      }
   };

   return {
      isPending,
      onClick,
   }
};
