import { db } from '@/db';
import { videos } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { z } from 'zod';

export const studioRouter = createTRPCRouter({
   getmany: protectedProcedure
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
      const data = await db.select().from(videos).where(and(
         eq(videos.userId, userId),
         cursor ? or(
            lt(videos.updatedAt, cursor.updatedAt),
            and(
               eq(videos.updatedAt, cursor.updatedAt),
               lt(videos.id, cursor.id),
            )
         ) : undefined,
      )).orderBy(desc(videos.updatedAt), desc(videos.id)).limit(limit+1); // +1 to get check if there is more data

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
});
