import { db } from "@/db/drizzle";
import { category } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";


export const categoriesRouter = createTRPCRouter({
   getMany: baseProcedure.query(async () => {
      const data = await db.select().from(category);

      return data;
   })
})
