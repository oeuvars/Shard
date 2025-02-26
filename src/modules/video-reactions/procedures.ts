import { db } from "@/db/drizzle";
import { videoReaction as videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
   like: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id: videoId } = input;

      const [existingVideoReactionLike] = await db
         .select()
         .from(videoReactions)
         .where(and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, "like"),
         ));

      if (existingVideoReactionLike) {
         const [deletedVideoReaction] = await db
            .delete(videoReactions)
            .where(and(
               eq(videoReactions.userId, userId),
               eq(videoReactions.videoId, videoId),
            ))
            .returning();

         return deletedVideoReaction;
      }

      const [createdVideoReaction] = await db
         .insert(videoReactions)
         .values({
            userId,
            videoId,
            type: "like",
         })
         .onConflictDoUpdate({
             target: [videoReactions.userId, videoReactions.videoId],
             set: {
                type: "like",
             }
         })
         .returning();

      return createdVideoReaction;
   }),

   dislike: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id: videoId } = input;

      const [existingVideoReactionDislike] = await db
         .select()
         .from(videoReactions)
         .where(and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, "dislike"),
         ));

      if (existingVideoReactionDislike) {
         const [deletedVideoReaction] = await db
            .delete(videoReactions)
            .where(and(
               eq(videoReactions.userId, userId),
               eq(videoReactions.videoId, videoId),
            ))
            .returning();

         return deletedVideoReaction;
      }

      const [createdVideoReaction] = await db
         .insert(videoReactions)
         .values({
            userId,
            videoId,
            type: "dislike",
         })
         .onConflictDoUpdate({
             target: [videoReactions.userId, videoReactions.videoId],
             set: {
                type: "dislike",
             }
         })
         .returning();

      return createdVideoReaction;
   })
})
