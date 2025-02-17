import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"

export const users = pgTable("users", {
   id: uuid("id").primaryKey().defaultRandom(),
   clerkId: text("clerk_id").unique().notNull(),
   name: text("name").notNull(),
   imageUrl: text("image_url").notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const userRelations = relations(users, ({ many }) => ({
   video: many(videos)
}))

export const categories = pgTable("categories", {
   id: uuid("id").primaryKey().defaultRandom(),
   name: text("name").notNull(),
   description: text("description").notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("name_idx").on(t.name)]);

export const categoryRelations = relations(categories, ({ many }) => ({
   video: many(videos)
}))

export const videoVisibility = pgEnum("video_visibility", [
   "private",
   "public"
]);

export const videos = pgTable("videos", {
   id: uuid("id").primaryKey().defaultRandom(),
   title: text("title").notNull(),
   description: text("description"),
   videoStatus: text("video_status"),
   videoAssetId: text("video_asset_id").unique(),
   videoUploadId: text("video_upload_id").unique(),
   videoPlaybackId: text("video_playback_id").unique(),
   videoTrackId: text("video_track_id").unique(),
   videoTrackStatus: text("video_track_status"),
   thumbnailUrl: text("thumbnail_url"),
   thumbnailKey: text("thumbnail_key"),
   previewUrl: text("preview_url"),
   previewKey: text("preview_key"),
   duration: integer("duration").default(0).notNull(),
   visibility: videoVisibility("visibility").default("private").notNull(),
   userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
   }).notNull(),
   categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
   }),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

// Relations work on application level and not on database level. It is a higher level of abstraction. It is independent of the database, its only for drizzle to know about the relationships between tables.
export const videoRelations = relations(videos, ({ one }) => ({
   user: one(users, {
      fields: [videos.userId],
      references: [users.id],
   }),
   category: one(categories, {
      fields: [videos.categoryId],
      references: [categories.id],
   })
}))
