import { db } from '@/db/drizzle';
import { user as users, video as videos } from '@/db/schema';
import { auth } from '@/lib/auth';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';
import { z } from 'zod';

const f = createUploadthing();

export const ourFileRouter = {
   thumbnailUploader: f({
      image: {
         maxFileSize: '32MB',
         maxFileCount: 1,
      },
   })
      .input(
         z.object({
            videoId: z.string().uuid(),
         }),
      )
      .middleware(async ({ input }) => {
         const session = await auth.api.getSession({
            headers: await headers(),
         });

         let userId: string;

         if (!session) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please log in first' });
         } else {
            userId = session.user.id;
         }

         if (!userId) throw new UploadThingError('Unauthorized');

         const [user] = await db.select().from(users).where(eq(users.id, userId));

         const [existingVideo] = await db
            .select({
               thumbnailKey: videos.thumbnailKey,
            })
            .from(videos)
            .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));

         if (!existingVideo) {
            throw new UploadThingError('Video not found');
         }

         if (existingVideo.thumbnailKey) {
            const utapi = new UTApi();
            await utapi.deleteFiles(existingVideo.thumbnailKey);

            await db
               .update(videos)
               .set({ thumbnailKey: null, thumbnailUrl: null })
               .where(eq(videos.id, input.videoId))
               .returning();
         }

         return { user, ...input };
      })
      .onUploadComplete(async ({ metadata, file }) => {
         await db
            .update(videos)
            .set({
               thumbnailUrl: file.ufsUrl,
               thumbnailKey: file.key,
            })
            .where(and(eq(videos.id, metadata.videoId), eq(videos.userId, metadata.user.id)))
            .returning();
         return { uploadedBy: metadata.user.id };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
