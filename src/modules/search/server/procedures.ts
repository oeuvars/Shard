import { db } from '@/db/drizzle';
import { user as users, videoReaction, video as videos, videoView } from '@/db/schema';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { and, desc, eq, getTableColumns, ilike, lt, or } from 'drizzle-orm';
import { z } from 'zod';

export const searchRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        query: z.string().nullish(),
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
      const { limit, cursor, query, categoryId } = input;

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
            ilike(videos.title, `%${query}%`),
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
});
