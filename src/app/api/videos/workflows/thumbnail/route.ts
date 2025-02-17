import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

type InputType = {
   userId: string;
   videoId: string;
   prompt: string;
}

export const { POST } = serve(

  async (context) => {

    const { userId, videoId, prompt } = context.requestPayload as InputType;
    const utapi = new UTApi();

    const video = await context.run("get-video", async () => {
      const [existingVideo] = await db
          .select()
          .from(videos)
          .where(and(
            eq(videos.userId, userId),
            eq(videos.id, videoId),
          ))

      if (!existingVideo) {
        throw new Error("Video not found");
      }

      return existingVideo;
    })


    const { body } = await context.call<{ data: Array<{url: string}>}>("generate-thumbnail", {
      url: "https://api.openai.com/v1/images/generations",
      method: "POST",
      body: {
        prompt: prompt,
        n: 1,
        size: "1792x1024",
        response_format: "url",
        model: "dall-e-3",
      },
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }

    );

    const tempThumbnailUrl = body.data[0].url;

    if (!tempThumbnailUrl) {
      throw new Error("No credits");
    }

    await context.run("cleanup-thumbanil", async () => {
      if (video.thumbnailKey) {
        await utapi.deleteFiles(video.thumbnailKey);

        await db.
          update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(
            eq(videos.userId, userId),
            eq(videos.id, videoId),
          ))
      }
    })

    const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
      const [uploadedThumbnail] = await utapi.uploadFilesFromUrl([tempThumbnailUrl]);

      if (!uploadedThumbnail.data) {
        throw new Error("Failed to upload thumbnail");
      }

      return uploadedThumbnail.data;
    })


    await context.run("update-video", async () => {
      await db
        .update(videos)
        .set({
          thumbnailKey: uploadedThumbnail.key,
          thumbnailUrl: uploadedThumbnail.url,
        })
        .where(and(
          eq(videos.userId, userId),
          eq(videos.id, videoId),
        ))
    })

  }
)
