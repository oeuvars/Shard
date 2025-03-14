import { db } from "@/db/drizzle";
import { subscription as subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/server/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
   create: protectedProcedure.input(z.object({ userId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
         throw new TRPCError({ code: "BAD_REQUEST", message: "You can't subscribe to your own channel" });
      }

      const [subscription] = await db
         .insert(subscriptions)
         .values({ viewerId: ctx.user.id, creatorId: userId })
         .returning()

      return subscription
   }),

   remove: protectedProcedure.input(z.object({ userId: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
         throw new TRPCError({ code: "BAD_REQUEST", message: "You can't subscribe to your own channel" });
      }

      const [deletedSubscription] = await db
         .delete(subscriptions)
         .where(and(
            eq(subscriptions.viewerId, ctx.user.id),
            eq(subscriptions.creatorId, userId),
         ))
         .returning()

      return deletedSubscription
   })
})
