"use client"

import React, { useEffect, useState } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type Props = {
   value?: string | null;
   isLoading?: boolean;
   onSelect: (value: string | null) => void;
   data: {
      value: string;
      label: string;
   }[]
}

const FilterCarousel = ({ value, isLoading, onSelect, data }: Props) => {
   const [API, setAPI] = useState<CarouselApi>();
   const [current, setCurrent] = useState<number>(0);
   const [count, setCount] = useState<number>(0);
   const [selectedValue, setSelectedValue] = useState<string | null>(value ?? null);

   useEffect(() => {
      setSelectedValue(value ?? null);
   }, [value]);

   useEffect(() => {
      if (!API) {
         return;
      }

      setCount(API.scrollSnapList().length);
      setCurrent(API.selectedScrollSnap() + 1);

      API.on("select", () => {
         setCurrent(API.selectedScrollSnap() + 1);
      })
   }, [API]);

   const handleSelect = (newValue: string | null) => {
      setSelectedValue(newValue);
      onSelect(newValue);
   };

   return (
      <div className='relative w-full'>
         <div className={cn("absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none", current === 1 && "hidden")}/>
         <Carousel
            setApi={setAPI}
            opts={{
               align: "start",
               dragFree: true,
            }}
            className='w-full px-12'
         >
            <CarouselContent className='-ml-3'>
               {!isLoading && (
                  <CarouselItem className='pl-3 basis-auto' onClick={() => handleSelect(null)}>
                     <Badge
                        variant={selectedValue === null ? "default" : "secondary"}
                        className='rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm'
                     >
                        All
                     </Badge>
                  </CarouselItem>
               )}
               {!isLoading ? data.map((item) => (
                  <CarouselItem key={item.value} className='pl-3 basis-auto' onClick={() => handleSelect(item.value)}>
                     <Badge
                        variant={selectedValue === item.value ? "default" : "secondary"}
                        className='rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm'
                     >
                        {item.label}
                     </Badge>
                  </CarouselItem>
               )) : (
                  Array.from({ length: 14 }).map((_, i) => (
                     <CarouselItem key={i} className='pl-3 basis-auto'>
                        <Skeleton className='rounded-lg px-3 py-1 h-full text-sm w-[100px] font-medium'>
                           &nbsp;
                        </Skeleton>
                     </CarouselItem>
                  ))
               )}
            </CarouselContent>
            <CarouselPrevious className='left-0 z-20'/>
            <CarouselNext className='right-0 z-20'/>
         </Carousel>
         <div className={cn("absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none", current === count && "hidden")}/>
      </div>
   )
}

export default FilterCarousel
