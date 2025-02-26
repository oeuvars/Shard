import { db } from "@/db/drizzle";
import { user as users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ratelimit } from "@/lib/ratelimit";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import Superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  let userId: string | undefined;

  userId = session?.user.id

  return { userId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: Superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please log in first" });
  }

  const [user] = await db.select().from(users).where(eq(users.id, ctx.userId));

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Create an account to get started" });
  }

  const { success } = await ratelimit.limit(ctx.userId);

  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }
  return opts.next({
    ctx: { ...ctx, user },
  });
});
