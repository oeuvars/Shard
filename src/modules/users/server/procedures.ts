import { db } from '@/db/drizzle';
import {
  subscription as subscriptions,
  user as users,
  video as videos,
} from '@/db/schema';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm';
import { z } from 'zod';
import { videoUtils } from '@/modules/videos/server/utils';

const videoFileSizeLimit = 1024 * 1024 * 1024; // 1 GB

const VIDEO_SCHEMA = z.object({
  name: z.string(),
  size: z.number().max(videoFileSizeLimit, 'Video file size should not exceed 50MB'),
  type: z.string().refine(
    type =>
      [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime', // .mov
        'video/x-msvideo', // .avi
      ].includes(type),
    { message: 'Invalid video file type' },
  ),
});

export const usersRouter = createTRPCRouter({
   createSignedUrl: protectedProcedure.input(VIDEO_SCHEMA).mutation(async ({ ctx, input }) => {
      try {
         const { id: userId } = ctx.user;
         const fileName = `${new Date().toISOString()}-${crypto.randomUUID()}.mp4`;

         const [video] = await db
         .insert(videos)
         .values({
            userId,
            title: 'New video',
            videoStatus: 'waiting',
            videoUploadId: fileName,
         })
         .returning();

         if (!video) {
         throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create video record',
         });
         }

         const signedUrl = await videoUtils.generateUploadUrl(fileName, input.type);

         return {
            signedUrl,
            videoId: video.id,
            fileName,
         };
      } catch (error) {
         console.error('Error creating signed URL:', error);
         throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while preparing the upload',
         });
      }
  }),

  finalizeUpload: protectedProcedure
    .input(
      z.object({
        videoId: z.string(),
        fileName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id: userId } = ctx.user;
        const { videoId, fileName } = input;

        const [existingVideo] = await db
          .select()
          .from(videos)
          .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

        if (!existingVideo) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Video not found',
          });
        }

        const videoUrl = videoUtils.getVideoUrl(fileName);

        const [video] = await db
          .update(videos)
          .set({
            videoStatus: 'uploaded',
            videoUrl: videoUrl,
          })
          .where(eq(videos.id, videoId))
          .returning();

        return {
          videoId: video.id,
          url: videoUrl,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while finalizing the video upload',
        });
      }
    }),

  getOne: baseProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input, ctx }) => {
    const { userId: sessionUserId } = ctx;

    let userId;

    const [user] = await db
      .select()
      .from(users)
      .where(inArray(users.id, sessionUserId ? [sessionUserId] : []));

    if (user) {
      userId = user.id;
    }

    const viewerSubscriptions = db.$with('viewer-subscriptions').as(
      db
        .select()
        .from(subscriptions)
        .where(inArray(subscriptions.viewerId, userId ? [userId] : [])),
    );

    const [existingUser] = await db
      .with(viewerSubscriptions)
      .select({
        ...getTableColumns(users),
        viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
        videoCount: db.$count(videos, eq(videos.userId, users.id)),
        subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id))
      })
      .from(users)
      .leftJoin(viewerSubscriptions, eq(users.id, viewerSubscriptions.creatorId))
      .where(eq(users.id, input.id));

    if (!existingUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    return existingUser;
  }),

});
