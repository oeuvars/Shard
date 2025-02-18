import { categoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/procedures';
import { videoReactionsRouter } from '@/modules/video-reactions/procedures';

export const appRouter = createTRPCRouter({
  categorires: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
});

export type AppRouter = typeof appRouter;
