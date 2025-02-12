import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Props = {};

const avatarVariants = cva('w-12 h-12 rounded-full', {
   variants: {
      size: {
         default: 'size-12',
         xs: 'size-6',
         sm: 'size-10',
         md: 'size-16',
         lg: 'size-24',
         xl: 'size-40',
      },
   },
   defaultVariants: {
      size: 'default',
   },
});

interface UserAvatarProps extends Props, VariantProps<typeof avatarVariants> {
   imageUrl: string;
   name: string;
   className?: string;
   onClick?: () => void;
}

const UserAvatar = ({ imageUrl, name, className, onClick }: UserAvatarProps) => {
   return (
      <div
         className={cn(
            avatarVariants({ size: 'default' }),
            'relative flex items-center justify-center overflow-hidden rounded-full',
            className
         )}
         onClick={onClick}
      >
         <Image
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
            width={1080}
            height={1080}
         />
      </div>
   );
};

export default UserAvatar;
