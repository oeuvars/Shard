import { db } from "@/db/drizzle";
import { commentReaction as commentReactions , comment as comments, user as users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
   create: protectedProcedure
      .input(
         z.object({
            parentId: z.string().uuid().nullish(),
            videoId: z.string().uuid(),
            content: z.string()
         })
      )
      .mutation(async ({ ctx, input }) => {
         const { id: userId} = ctx.user;
         const { parentId, videoId, content } = input;

         const [existingComment] = await db
            .select()
            .from(comments)
            .where(inArray(comments.id, parentId ? [parentId] : []))

         if (!existingComment && parentId) {
            throw new TRPCError({ code: "NOT_FOUND", message: "This comment does not exist" })
         }

         if (existingComment.parentId && parentId) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Method not allowed" })
         }

         const [createdComment] = await db
            .insert(comments)
            .values({
               userId: userId,
               videoId: videoId,
               content: content,
               parentId: parentId
            })
            .returning();

         return createdComment;
   }),

   remove: protectedProcedure
      .input(
         z.object({
            id: z.string().uuid(),
         })
      )
      .mutation(async ({ ctx, input }) => {
         const { id: userId } = ctx.user;
         const { id } = input;

         const [deletedComment] = await db
            .delete(comments)
            .where(and(
               eq(comments.id, id),
               eq(comments.userId, userId)
            ))
            .returning();

         return deletedComment;
   }),

   getMany: baseProcedure
      .input(
         z.object({
            videoId: z.string().uuid(),
            parentId: z.string().uuid().nullish(),
            cursor: z.object({
               id: z.string().uuid(),
               updatedAt: z.date()
            }).nullish(),
            limit: z.number().min(1).max(100)
         }))
      .query(async ({ input, ctx }) => {

         const { userId: sessionUserId } = ctx;
         const { videoId, cursor, limit, parentId } = input;

         let userId;

         const [user] = await db
            .select()
            .from(users)
            .where(
               inArray(users.id, sessionUserId ? [sessionUserId] : [])
            )

         if (user) {
            userId = user.id
         }

         const viewerReactions = db.$with("viewer-reactions").as(
            db
            .select({
               commentId: commentReactions.commentId,
               type: commentReactions.type
            })
            .from(commentReactions)
            .where(inArray(commentReactions.userId, userId ? [userId] : []))
         )

         const replies = db.$with("replies").as(
            db
            .select({
               parentId: comments.parentId,
               count: count(comments.id).as("count")
            })
            .from(comments)
            .where(isNotNull(comments.parentId))
            .groupBy(comments.parentId)
         )

         const [totalData, data] = await Promise.all([
            db
            .select({
               count: count()
            })
            .from(comments)
            .where(eq(comments.videoId, videoId)),

            db
            .with(viewerReactions, replies)
            .select({
               ...getTableColumns(comments),
               user: users,
               viewerReaction: viewerReactions.type,
               replyCount: replies.count,
               likeCount: db.$count(
                  commentReactions,
                  and(
                     eq(commentReactions.type, "like"),
                     eq(commentReactions.commentId, comments.id)
                  )
               ),
               dislikeCount: db.$count(
                  commentReactions,
                  and(
                     eq(commentReactions.type, "dislike"),
                     eq(commentReactions.commentId, comments.id)
                  )
               )
            })
            .from(comments)
            .where(and(
               eq(comments.videoId, videoId),
               parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
               cursor ? or(
                  lt(comments.updatedAt, cursor.updatedAt),
                  and(
                     eq(comments.updatedAt, cursor.updatedAt),
                     lt(comments.id, cursor.id)
                  )
               ) : undefined
            ))
            .innerJoin(users, eq(comments.userId, users.id))
            .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
            .leftJoin(replies, eq(comments.id, replies.parentId))
            .orderBy(desc(comments.updatedAt), desc(comments.id))
            .limit(limit+1)
         ])


         const hasMore = data.length > limit;
         const items = hasMore ? data.slice(0, -1) : data;
         const lastItem = items[items.length - 1];
         const nextCursor = hasMore ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
         } : null;

         return {
            count: totalData[0].count,
            items,
            nextCursor
         }
   }),
})
