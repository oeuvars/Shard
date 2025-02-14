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
import { Button } from '../ui/button';

type Props = {
   children: ReactNode;
   open: boolean;
   title: string;
   onOpenChange: (open: boolean) => void;
};

export const ResponsiveModal = (props: Props) => {

  const isMobile = useIsMobile();

   if (isMobile) {
      return (
         <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerTrigger asChild>
               <button className="btn btn-primary">Open drawer</button>
            </DrawerTrigger>
            <DrawerContent>
               <DrawerHeader>
                  <DrawerTitle>{props.title}</DrawerTitle>
                  <DrawerDescription>
                     Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt
                     aute id consequat veniam incididunt duis in sint irure nisi.
                  </DrawerDescription>
                  {props.children}
               </DrawerHeader>
               <DrawerFooter>
                  <DrawerClose>Close</DrawerClose>
               </DrawerFooter>
            </DrawerContent>
         </Drawer>
      );
   }
   return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
         <DialogTrigger asChild>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{props.title}</DialogTitle>
               <DialogDescription>
                  Sit nulla est ex deserunt exercitation anim occaecat. Nostrud ullamco deserunt
                  aute id consequat veniam incididunt duis in sint irure nisi.
               </DialogDescription>
               {props.children}
            </DialogHeader>
            <DialogFooter>
               <Button className="btn btn-neutral">Cancel</Button>
               <Button className="btn btn-accent">Save</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
