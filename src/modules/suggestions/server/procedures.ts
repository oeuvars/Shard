import { db } from '@/db/drizzle';
import { user as users, videoReaction, video as videos, videoView } from '@/db/schema';
import { baseProcedure, createTRPCRouter } from '@/trpc/server/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, lt, not, or } from 'drizzle-orm';
import { z } from 'zod';

export const suggestionsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const { videoId, limit, cursor } = input;

      const [existingVideo] = await db.select().from(videos).where(eq(videos.id, videoId));

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found' });
      }

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: users,
          viewCount: db.$count(videoView, eq(videoView.videoId, videos.id)),
          likeCount: db.$count(
            videoReaction,
            and(eq(videoReaction.videoId, videos.id), eq(videoReaction.type, 'like')),
          ),
          dislikeCount: db.$count(
            videoReaction,
            and(eq(videoReaction.videoId, videos.id), eq(videoReaction.type, 'dislike')),
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            not(eq(videos.id, existingVideo.id)),
            eq(videos.visibility, 'public'),
            existingVideo.categoryId ? eq(videos.categoryId, existingVideo.categoryId) : undefined,
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
});
