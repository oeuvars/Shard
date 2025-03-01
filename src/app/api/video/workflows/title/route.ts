import { db } from '@/db/drizzle';
import { video as videos } from '@/db/schema';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';

type InputType = {
  userId: string;
  videoId: string;
};

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(async context => {
  const { userId, videoId } = context.requestPayload as InputType;

  const video = await context.run('get-video', async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.userId, userId), eq(videos.id, videoId)));

    if (!existingVideo) {
      throw new Error('Video not found');
    }

    return existingVideo;
  });

  // const transcript = await context.run('get-transcript', async () => {
  //   const trackUrl = `https://stream.mux.com/${video.videoPlaybackId}/text/${video.videoTrackId}.txt`;
  //   const response = await fetch(trackUrl);
  //   const text = await response.text();

  //   if (!text) {
  //     throw new Error('Transcript not found');
  //   }

  //   return text;
  // });

  const { body } = await context.api.openai.call('generate-title', {
    baseURL: 'https://api.deepseek.com',
    token: process.env.DEEPSEEK_API_KEY as string,
    operation: 'chat.completions.create',
    body: {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content:
            "Hi everyone, I'm a video creator and I need a title for my video. Can you help me with that?",
        },
      ],
    },
  });

  const title = body.choices[0]?.message.content;

  if (!title) {
    throw new Error('No credits');
  }

  await context.run('update-video', async () => {
    await db
      .update(videos)
      .set({
        title: title || video.title,
      })
      .where(and(eq(videos.userId, userId), eq(videos.id, videoId)));
  });
});
