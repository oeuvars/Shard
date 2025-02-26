import { db } from "@/db/drizzle";
import { category } from "@/db/schema";

const categoryNames = [
   "Science",
   "Technology",
   "Gaming",
   "Music",
   "Film",
   "Sports",
   "Animals",
   "Travel",
   "Food",
   "Fashion",
   "Art",
   "Comedy",
   "Entertainment",
   "Education",
   "Health",
   "History",
   "Politics",
   "Business",
   "Science Fiction",
   "Computers",
   "Cooking",
   "Photography",
   "Reading",
   "Writing",
   "Comics",
   "Animation",
];

async function main() {
   console.log("Seeding categories...");
   try {
      const values = categoryNames.map((name) => ({
         name,
         description: `Videos related to ${name.toLowerCase()}`,
         createdAt: new Date(),
         updatedAt: new Date(),
      }));

      await db.insert(category).values(values);
      console.log("Categories seeded successfully.");
   } catch (error) {
      console.log("Error Seeding categories:", error);
      process.exit(1);
   }
}


main().catch((error) => {
   console.error("Error:", error);
   process.exit(1);
});
