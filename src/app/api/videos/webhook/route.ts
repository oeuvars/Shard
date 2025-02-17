import { eq } from "drizzle-orm";
import { VideoAssetCreatedWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent, VideoAssetDeletedWebhookEvent } from "@mux/mux-node/resources/webhooks";
import { headers } from "next/headers";
import { mux } from "@/lib/mux";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { UTApi } from "uploadthing/server";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent =
   | VideoAssetCreatedWebhookEvent
   | VideoAssetErroredWebhookEvent
   | VideoAssetReadyWebhookEvent
   | VideoAssetTrackReadyWebhookEvent
   | VideoAssetDeletedWebhookEvent;


export const POST = async (request: Request) => {
   if (!SIGNING_SECRET) {
      return new Response('Missing webhook signing secret', { status: 400 });
   }

   const headersPayload = await headers();
   const signature = headersPayload.get('mux-signature');

   if (!signature) {
      return new Response('Missing signature', { status: 401 });
   }

   const payload = await request.json();
   const body = JSON.stringify(payload);

   mux.webhooks.verifySignature(body,
      {
         "mux-signature": signature,
      },
      SIGNING_SECRET
   );

   switch (payload.type) {
      case 'video.asset.created': {
         const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

         if (!data.upload_id) {
            return new Response('Missing upload id', { status: 400 });
         }

         await db
            .update(videos)
            .set({
               videoAssetId: data.id,
               videoStatus: data.status,
            })
            .where(eq(videos.videoUploadId, data.upload_id));
         break;
      }

      case 'video.asset.ready': {
         const data = payload.data as VideoAssetReadyWebhookEvent["data"];

         if (!data.upload_id) {
            return new Response('Missing upload id', { status: 400 });
         }

         if (!data.playback_ids) {
            return new Response('Missing playback id', { status: 400 });
         }

         const playbackId = data.playback_ids[0].id;

         const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
         const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
         const duration = data.duration ? Math.round(data.duration * 1000) : 0;

         const utapi = new UTApi();
         const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
            tempThumbnailUrl,
            tempPreviewUrl,
         ])

         if (!uploadedThumbnail.data || !uploadedPreview.data) {
            return new Response('Failed to upload thumbnail or preview', { status: 500 });
         }

         const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data;
         const { key: previewKey, ufsUrl: previewUrl } = uploadedPreview.data;

         await db
            .update(videos)
            .set({
               videoStatus: data.status,
               videoPlaybackId: playbackId,
               videoAssetId: data.id,
               thumbnailUrl: thumbnailUrl,
               thumbnailKey: thumbnailKey,
               previewUrl: previewUrl,
               previewKey: previewKey,
               duration: duration,
            })
            .where(eq(videos.videoUploadId, data.upload_id))
         break;
      }

      case 'video.asset.error': {
         const data = payload.data as VideoAssetErroredWebhookEvent["data"];

         if (!data.upload_id) {
            return new Response('Missing upload id', { status: 400 });
         }

         await db.
            update(videos).set({
            videoStatus: data.status,
            }).where(eq(videos.videoUploadId, data.upload_id))
         break;
      }

      case 'video.asset.delete': {
         const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

         if (!data.upload_id) {
            return new Response('Missing upload id', { status: 400 });
         }

         await db
            .delete(videos)
            .where(eq(videos.videoUploadId, data.upload_id))
         break;
      }

      case 'video.asset.track.ready': {
         const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
            asset_id: string;
         };

         const assetId = data.asset_id;

         if (!assetId) {
            return new Response('Missing asset id', { status: 400 });
         }

         await db
            .update(videos)
            .set({
               videoTrackStatus: data.status,
               videoTrackId: data.id,
            })
            .where(eq(videos.videoAssetId, assetId))
         break;
      }
   }

   return new Response('Webhook received', { status: 200 });
}
