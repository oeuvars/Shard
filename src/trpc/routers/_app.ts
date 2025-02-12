import { categoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedures';

export const appRouter = createTRPCRouter({
  categorires: categoriesRouter,
  studio: studioRouter
});

export type AppRouter = typeof appRouter;
