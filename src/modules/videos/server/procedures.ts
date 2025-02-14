import { db } from '@/db';
import { videos } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const videosRouter = createTRPCRouter({
   create: protectedProcedure.mutation(async ({ ctx }) => {
      try {
         const { id: userId } = ctx.user;
         console.log("hey")
         const [video] = await db
            .insert(videos)
            .values({
               userId,
               title: 'New video',
            })
            .returning();

         if (!video) {
            throw new TRPCError({
               code: 'INTERNAL_SERVER_ERROR',
               message: 'Failed to create video',
            });
         }

         return {
            video,
         };
      } catch (error) {
         console.error('Error creating video:', error);

         throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while creating the video',
         });
      }
   }),
});
