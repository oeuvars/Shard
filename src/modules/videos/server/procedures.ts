import { DEFAULT_LIMIT } from '@/constants';
import { db } from '@/db/drizzle';
import {
  subscription as subscriptions,
  user as users,
  videoReaction as videoReactions,
  video as videos,
  VideoUpdateSchema,
  videoView as videoViews,
} from '@/db/schema';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/server/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, exists, getTableColumns, inArray, isNotNull, lt, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { videoUtils } from './utils';
import { UTApi } from 'uploadthing/server';

const videoFileSizeLimit = 1024 * 1024 * 1024; // 1 GB

const utapi = new UTApi();

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

export const videosRouter = createTRPCRouter({
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

  update: protectedProcedure.input(VideoUpdateSchema).mutation(async ({ ctx, input }) => {
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
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      .returning();

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

    const [videoToRemove] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

    if (!videoToRemove) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Video not found',
      });
    }

    try {
      if (videoToRemove.videoUploadId) {
        await videoUtils.deleteVideo(videoToRemove.videoUploadId);
      }
      if (videoToRemove.thumbnailKey) {
        await utapi.deleteFiles(videoToRemove.thumbnailKey);
      }
    } catch (error) {
      console.error('Error deleting video from S3:', error);
    }

    const [removedVideo] = await db
      .delete(videos)
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      .returning();

    if (!removedVideo) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Video not found',
      });
    }

    return removedVideo;
  }),

  removeThumbnail: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;

    const [videoToRemove] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

    if (!videoToRemove) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Video not found to remove thumbnail',
      });
    }

    try {
      if (videoToRemove.thumbnailKey) {
        await utapi.deleteFiles(videoToRemove.thumbnailKey);
        await db.update(videos).set({ thumbnailKey: null, thumbnailUrl: null }).where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      }
    } catch (error) {
      console.error('Error deleting file from uploadthing:', error);
    }

    return videoToRemove
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

    const viewerReactions = db.$with('viewer_reactions').as(
      db
        .select({
          videoId: videoReactions.videoId,
          type: videoReactions.type,
        })
        .from(videoReactions)
        .where(inArray(videoReactions.userId, userId ? [userId] : [])),
    );

    const viewerSubscriptions = db.$with('viewer_subscriptions').as(
      db
        .select()
        .from(subscriptions)
        .where(inArray(subscriptions.viewerId, userId ? [userId] : [])),
    );

    const [existingVideo] = await db
      .with(viewerReactions, viewerSubscriptions)
      .select({
        ...getTableColumns(videos),
        user: {
          ...getTableColumns(users),
          subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
          viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
        },
        viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
        likeCount: db.$count(
          videoReactions,
          and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
        ),
        dislikeCount: db.$count(
          videoReactions,
          and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
        ),
        viewerReaction: viewerReactions.type,
      })
      .from(videos)
      .innerJoin(users, eq(videos.userId, users.id))
      .leftJoin(viewerReactions, eq(videos.id, viewerReactions.videoId))
      .leftJoin(viewerSubscriptions, eq(users.id, viewerSubscriptions.creatorId))
      .where(eq(videos.id, input.id));

    if (!existingVideo) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Video not found',
      });
    }

    return existingVideo;
  }),

  getMany: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        categoryId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor, categoryId } = input;

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            eq(videos.visibility, 'public'),
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(eq(videos.updatedAt, cursor.updatedAt), lt(videos.id, cursor.id)),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1); // +1 to get check if there is more data

      const hasMore = data.length > limit;

      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),

  getTrending: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(DEFAULT_LIMIT),
        cursor: z
          .object({
            id: z.string().uuid(),
            viewCount: z.number(),
          })
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      const viewCountSubquery = db.$count(videoViews, eq(videoViews.videoId, videos.id));

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: viewCountSubquery,
          likeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            eq(videos.visibility, 'public'),
            cursor
              ? or(
                  lt(viewCountSubquery, cursor.viewCount),
                  and(eq(viewCountSubquery, cursor.viewCount), lt(videos.id, cursor.id)),
                )
              : undefined,
          ),
        )
        .orderBy(desc(viewCountSubquery), desc(videos.id))
        .limit(limit + 1); // +1 to get check if there is more data

      const hasMore = data.length > limit;

      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            viewCount: lastItem.viewCount,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),

  getManySubscribed: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(DEFAULT_LIMIT),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const viewerSubscriptions = db.$with('viewer_subscriptions').as(
        db
          .select({
            userId: subscriptions.creatorId,
          })
          .from(subscriptions)
          .where(eq(subscriptions.viewerId, userId)),
      );

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'like')),
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, 'dislike')),
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            eq(videos.visibility, 'public'),
            exists(
              db
                .select({ dummy: sql`1` })
                .from(subscriptions)
                .where(
                  and(
                    eq(subscriptions.viewerId, userId),
                    eq(subscriptions.creatorId, videos.userId)
                  )
                )
            ),
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(eq(videos.updatedAt, cursor.updatedAt), lt(videos.id, cursor.id)),
                )
              : undefined,
          ),
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;

      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
