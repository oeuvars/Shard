import { categoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  categorires: categoriesRouter,
});

export type AppRouter = typeof appRouter;
