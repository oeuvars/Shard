import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const videosRouter = createTRPCRouter({
   create: protectedProcedure.mutation(async ({ ctx }) => {
      try {
         const { id: userId } = ctx.user;

         const upload = await mux.video.uploads.create({
            new_asset_settings: {
               passthrough: userId,
               playback_policy: ["public"],
               input: [
                  {
                     generated_subtitles: [
                        {
                           language_code: "en",
                           name: "English",
                        }
                     ]
                  }
               ]
            },
            cors_origin: "*" // TODO: In production, set this to my domain
         });

         const [video] = await db
            .insert(videos)
            .values({
               userId,
               title: 'New video',
               videoStatus: 'waiting',
               videoUploadId: upload.id,
            })
            .returning();

         if (!video) {
            throw new TRPCError({
               code: 'INTERNAL_SERVER_ERROR',
               message: 'Failed to create video',
            });
         }

         return {
            video: video,
            url: upload.url,
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
