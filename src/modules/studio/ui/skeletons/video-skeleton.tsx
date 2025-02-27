import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";

export const VideosSectionSkeleton = () => {
   return (
      <Fragment>
         <div className='border-y'>
            <Table>
               <TableHeader>
                  <TableRow className='text-zinc-500'>
                     <TableHead className='pl-6 w-[510px]'>Video</TableHead>
                     <TableHead className='w-[120px]'>Visibility</TableHead>
                     <TableHead className='w-[100px]'>Status</TableHead>
                     <TableHead className='text-right w-[150px]'>Date</TableHead>
                     <TableHead className='text-right w-[100px]'>Views</TableHead>
                     <TableHead className='text-right w-[120px]'>Comments</TableHead>
                     <TableHead className='text-right pr-6 w-[100px]'>Likes</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                       <TableCell className='pl-6'>
                          <div className='flex items-center gap-4'>
                            <div className='relative w-36 h-20 shrink-0'>
                              <Skeleton className='absolute inset-0' />
                            </div>
                            <div className='flex flex-col gap-y-1 min-w-0'>
                               <Skeleton className='h-5 w-48' />
                               <Skeleton className='h-4 w-72' />
                            </div>
                          </div>
                       </TableCell>
                       <TableCell>
                          <div className='flex items-center gap-2'>
                            <Skeleton className='h-4 w-4' />
                            <Skeleton className='h-4 w-16' />
                          </div>
                       </TableCell>
                       <TableCell>
                          <Skeleton className='h-5 w-16' />
                       </TableCell>
                       <TableCell className='text-right'>
                          <Skeleton className='h-5 w-32 ml-auto' />
                       </TableCell>
                       <TableCell className='text-right'>
                          <Skeleton className='h-5 w-16 ml-auto' />
                       </TableCell>
                       <TableCell className='text-right'>
                          <Skeleton className='h-5 w-16 ml-auto' />
                       </TableCell>
                       <TableCell className='text-right pr-6'>
                          <Skeleton className='h-5 w-12 ml-auto' />
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
              </Table>
         </div>
      </Fragment>
   );
};
