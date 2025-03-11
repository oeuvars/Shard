import { db } from '@/db/drizzle';
import { comment, user as users, videoReaction, video as videos, videoView } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/server/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';
import { z } from 'zod';

export const studioRouter = createTRPCRouter({
   getMany: protectedProcedure
      .input(z.object({
         limit: z.number().min(1).max(100),
         cursor: z.object({
            id: z.string().uuid(),
            updatedAt: z.date(),
         })
         .nullish(),
      }))
      .query(async ({ ctx, input}) => {
         const { limit, cursor } = input;
         const { id: userId } = ctx.user;

         const data = await db
            .select({
               ...getTableColumns(videos),
               user: users,
               viewCount: db.$count(videoView, eq(videoView.videoId, videos.id)),
               commentCount: db.$count(comment, eq(comment.videoId, videos.id)),
               likeCount: db.$count(videoReaction, and(
                  eq(videoReaction.type, "like"),
                  eq(videoReaction.videoId, videos.id)
               ))
            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .where(
               and(
                  eq(videos.userId, userId),
                  cursor ? or(
                     lt(videos.updatedAt, cursor.updatedAt),
                     and(
                        eq(videos.updatedAt, cursor.updatedAt),
                        lt(videos.id, cursor.id),
                     )
                  ) : undefined,
               )
            )
            .orderBy(desc(videos.updatedAt), desc(videos.id))
            .limit(limit+1); // +1 to get check if there is more data

         const hasMore = data.length > limit;

         const items = hasMore ? data.slice(0, -1) : data;
         const lastItem = items[items.length - 1];
         const nextCursor = hasMore ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
         } : null;

         return {
            items,
            nextCursor
         };
      }),

   getOne: protectedProcedure
      .input(z.object({
         id: z.string().uuid(),
      }))
      .query(async ({ ctx, input }) => {
         const { id: userId } = ctx.user;
         const { id } = input;
         const [video] = await db
            .select().
            from(videos).
            where(and(
               eq(videos.id, id),
               eq(videos.userId, userId),
            ));
         if (!video) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found' });
         }
         return video;
      }),
});
