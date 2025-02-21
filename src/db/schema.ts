import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
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
   video: many(videos),
   videoViews: many(videoViews),
   videoReactions: many(videoReactions),
   subscriptions: many(subscriptions, {
      relationName: "subscriptions_viewer_id_fkey",
   }),
   subscribers: many(subscriptions, {
      relationName: "subscriptions_creator_id_fkey",
   }),
   comments: many(comments),
}))

export const subscriptions = pgTable("subscriptions", {
   viewerId: uuid("viewer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
   creatorId: uuid("creator_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [primaryKey({ name: "subscriptions_pkey", columns: [t.viewerId, t.creatorId] })]);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
   viewer: one(users, {
      fields: [subscriptions.viewerId],
      references: [users.id],
      relationName: "subscriptions_viewer_id_fkey"
   }),
   creator: one(users, {
      fields: [subscriptions.creatorId],
      references: [users.id],
      relationName: "subscriptions_creator_id_fkey"
   }),
}));

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
export const videoRelations = relations(videos, ({ one, many }) => ({
   user: one(users, {
      fields: [videos.userId],
      references: [users.id],
   }),
   category: one(categories, {
      fields: [videos.categoryId],
      references: [categories.id],
   }),
   views: many(videoViews),
   reactions: many(videoReactions),
   comments: many(comments),
}))

export const comments = pgTable("comments", {
   id: uuid("id").primaryKey().defaultRandom(),
   userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
   }).notNull(),
   videoId: uuid("video_id").references(() => videos.id, {
      onDelete: "cascade",
   }).notNull(),
   content: text("content").notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentRelations = relations(comments, ({ one }) => ({
   user: one(users, {
      fields: [comments.userId],
      references: [users.id],
   }),
   video: one(videos, {
      fields: [comments.videoId],
      references: [videos.id],
   }),
}));

export const CommentInsertSchema = createInsertSchema(comments);
export const CommentUpdateSchema = createUpdateSchema(comments);
export const CommentSelectSchema = createSelectSchema(comments);

export const videoViews = pgTable("video_views", {
   videoId: uuid("video_id").references(() => videos.id, {
      onDelete: "cascade",
   }).notNull(),
   userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
   }).notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
   primaryKey({
      name: "video_views_pkey",
      columns: [t.videoId, t.userId],
   })
]);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
   users: one(users, {
      fields: [videoViews.userId],
      references: [users.id],
   }),
   videos: one(videos, {
      fields: [videoViews.videoId],
      references: [videos.id],
   })
}))

export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);
export const videoViewSelectSchema = createSelectSchema(videoViews);

export const reactionType = pgEnum("reaction_type", [
   "like",
   "dislike",
]);

export const videoReactions = pgTable("video_reactions", {
   videoId: uuid("video_id").references(() => videos.id, {
      onDelete: "cascade",
   }).notNull(),
   userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
   }).notNull(),
   type: reactionType("type").notNull(),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
   primaryKey({
      name: "video_reactions_pkey",
      columns: [t.videoId, t.userId],
   })
]);


export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
   users: one(users, {
      fields: [videoReactions.userId],
      references: [users.id],
   }),
   videos: one(videos, {
      fields: [videoReactions.videoId],
      references: [videos.id],
   })
}))

export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
export const videoReactionSelectSchema = createSelectSchema(videoReactions);
