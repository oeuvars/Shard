import { db } from '@/db';
import { videos, videoUpdateSchema } from '@/db/schema';
import { mux } from '@/lib/mux';
import { workflow } from '@/lib/workflow';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';

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

   update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Missing video id',
         });
      }

      const [updatedVideo] = await db
         .update(videos)
         .set({
            title: input.title,
            description: input.description,
            categoryId: input.categoryId,
            visibility: input.visibility,
            updatedAt: new Date(),
         })
         .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId),
         ))
         .returning()

         if (!updatedVideo) {
            throw new TRPCError({
               code: 'NOT_FOUND',
               message: 'Video not found',
            });
         }

         return updatedVideo;
   }),

   remove: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [removedVideo] = await db
         .delete(videos)
         .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId),
         ))
         .returning();

      if (!removedVideo) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Video not found',
         });
      }

      return removedVideo;
   }),

   restoreThumbnail: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
         .select()
         .from(videos)
         .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId),
         ))

      if (!existingVideo) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Video not found',
         });
      }

      if (existingVideo.thumbnailKey) {
         const utapi = new UTApi();
         await utapi.deleteFiles(existingVideo.thumbnailKey);

         await db
            .update(videos)
            .set({ thumbnailKey: null, thumbnailUrl: null })
            .where(and(
               eq(videos.id, input.id),
               eq(videos.userId, userId),
            ))
            .returning();
      }

      if (!existingVideo.videoPlaybackId) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Video not found',
         });
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.videoPlaybackId}/thumbnail.jpg`;
      const utapi = new UTApi();
      const [uploadedThumbnail] = await utapi.uploadFilesFromUrl([tempThumbnailUrl]);

      if (!uploadedThumbnail.data) {
         throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upload thumbnail',
         });
      }

      const [updatedVideo] = await db
         .update(videos)
         .set({
            thumbnailUrl: uploadedThumbnail.data.ufsUrl,
            thumbnailKey: uploadedThumbnail.data.key,
         })
         .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId),
         ))
         .returning()

      return updatedVideo;
   }),

   generateThumbnail: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId} = await workflow.trigger({
         url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
         body: { userId, videoId: input.id },
         retries: 3,
      });

      return workflowRunId;
   })
});
