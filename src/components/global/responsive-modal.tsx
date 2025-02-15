import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from '@/components/ui/drawer';

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';

import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode } from 'react';

type Props = {
   children: ReactNode;
   open: boolean;
   title: string;
   description?: string;
   onOpenChange: (open: boolean) => void;
};

export const ResponsiveModal = ({ children, open, title, description, onOpenChange }: Props) => {

  const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
            </DrawerTrigger>
            <DrawerContent>
               <DrawerHeader>
                  <DrawerTitle>{title}</DrawerTitle>
                  <DrawerDescription>
                     {description}
                  </DrawerDescription>
                  {children}
               </DrawerHeader>
               <DrawerFooter>
                  <DrawerClose>Close</DrawerClose>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      );
   }
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>
                  {description}
               </DialogDescription>
               {children}
            </DialogHeader>
            <DialogFooter>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
