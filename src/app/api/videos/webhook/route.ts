import { eq } from "drizzle-orm";
import { VideoAssetCreatedWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent } from "@mux/mux-node/resources/webhooks";
import { headers } from "next/headers";
import { mux } from "@/lib/mux";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent =
   | VideoAssetCreatedWebhookEvent
   | VideoAssetErroredWebhookEvent
   | VideoAssetReadyWebhookEvent
   | VideoAssetTrackReadyWebhookEvent;


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
      case 'video.asset.created':
         const data = payload.data as VideoAssetCreatedWebhookEvent["data"];
         return new Response('Video asset created', { status: 200 });
      case 'video.asset.errored':
         return new Response('Video asset errored', { status: 200 });
      case 'video.asset.ready':
         return new Response('Video asset ready', { status: 200 });
      case 'video.asset.track.ready':
         return new Response('Video asset track ready', { status: 200 });
      default:
         return new Response('Unknown webhook event', { status: 400 });
   }
}
