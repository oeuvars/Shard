import { relations } from 'drizzle-orm';
import {
  boolean,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

export const reactionType = pgEnum('reaction_type', ['like', 'dislike']);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image_url').notNull(),
  bannerUrl: text("banner_url"),
  bannerKey: text("banner_key"),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
}, t => [uniqueIndex('user_id_idx').on(t.id)]);

export const session = pgTable('session', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
   id: uuid("id").primaryKey(),
   accountId: text('account_id').notNull(),
   providerId: text('provider_id').notNull(),
   userId: uuid('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
   accessToken: text('access_token'),
   refreshToken: text('refresh_token'),
   idToken: text('id_token'),
   accessTokenExpiresAt: timestamp('access_token_expires_at'),
   refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
   scope: text('scope'),
   password: text('password'),
   createdAt: timestamp('created_at').notNull(),
   updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const userRelation = relations(user, ({ many }) => ({
  video: many(video),
  videoViews: many(videoView),
  videoReactions: many(videoReaction),
  subscriptions: many(subscription, { relationName: 'subscription_viewer_id_fkey' }),
  subscribers: many(subscription, { relationName: 'subscription_creator_id_fkey' }),
  comments: many(comment),
  commentReactions: many(commentReaction),
  playlists: many(playlist)
}));

export const playlist = pgTable("playlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id").references(() => user.id, {onDelete: "cascade" }).notNull(),
  image: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const playlistRelation = relations(playlist, ({ one, many }) => ({
  user: one(user, {
    fields: [playlist.userId],
    references: [user.id]
  }),
  playlistVideo: many(playlistVideo)
}))

export const playlistVideo = pgTable("playlist-video", {
  playlistId: uuid("playlist_id").references(() => playlist.id, { onDelete: "cascade" }).notNull(),
  videoId: uuid("video_id").references(() => video.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [
  primaryKey({
    name: "playlist_videos_pkey",
    columns: [t.playlistId, t.videoId]
  })
])

export const playlistVideoRelation = relations(playlistVideo, ({ one }) => ({
  playlist: one(playlist, {
    fields: [playlistVideo.playlistId],
    references: [playlist.id]
  }),
  video: one(video, {
    fields: [playlistVideo.videoId],
    references: [video.id]
  })
}))

export const subscription = pgTable('subscription', {
  viewerId: uuid('viewer_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  creatorId: uuid('creator_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, t => [
    primaryKey({
      name: 'subscription_pkey',
      columns: [t.viewerId, t.creatorId],
    }),
  ],
);

export const subscriptionRelation = relations(subscription, ({ one }) => ({
  viewer: one(user, {
    fields: [subscription.viewerId],
    references: [user.id],
    relationName: 'subscription_viewer_id_fkey',
  }),
  creator: one(user, {
    fields: [subscription.creatorId],
    references: [user.id],
    relationName: 'subscription_creator_id_fkey',
  }),
}));

export const category = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, t => [uniqueIndex('name_idx').on(t.name)]);

export const categoryRelation = relations(category, ({ many }) => ({
  video: many(video),
}));

export const videoVisibility = pgEnum('video_visibility', ['private', 'public']);

export const video = pgTable('video', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  videoStatus: text('video_status'),
  videoUploadId: text('video_upload_id').unique(),
  videoUrl: text('video_url').unique(),
  thumbnailUrl: text('thumbnail_url'),
  thumbnailKey: text('thumbnail_key'),
  duration: integer('duration').default(0).notNull(),
  visibility: videoVisibility('visibility').default('private').notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => category.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const VideoInsertSchema = createInsertSchema(video);
export const VideoUpdateSchema = createUpdateSchema(video);
export const VideoSelectSchema = createSelectSchema(video);

// Relations work on application level and not on database level. It is a higher level of abstraction. It is independent of the database, its only for drizzle to know about the relationships between tables.
export const videoRelation = relations(video, ({ one, many }) => ({
  user: one(user, {
    fields: [video.userId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [video.categoryId],
    references: [category.id],
  }),
  views: many(videoView),
  reactions: many(videoReaction),
  comments: many(comment),
  playlistVideos: many(playlistVideo)
}));

export const comment = pgTable('comment', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  parentId: uuid('parent_id'),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  videoId: uuid('video_id').references(() => video.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, t => {
    return [
      foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: 'comments_parent_id_fkey',
      }).onDelete('cascade'),
    ];
  },
);

export const commentRelation = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  video: one(video, {
    fields: [comment.videoId],
    references: [video.id],
  }),
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    relationName: 'comment_parent_id_fkey',
  }),
  reactions: many(commentReaction),
  replies: many(comment, {
    relationName: 'comment_parent_id_fkey',
  }),
}));

export const CommentInsertSchema = createInsertSchema(comment);
export const CommentUpdateSchema = createUpdateSchema(comment);
export const CommentSelectSchema = createSelectSchema(comment);

export const commentReaction = pgTable('comment-reaction', {
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  commentId: uuid('comment_id').references(() => comment.id, { onDelete: 'cascade' }).notNull(),
  type: reactionType('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
t => [
  primaryKey({
    name: 'comment_reaction_pkey',
    columns: [t.userId, t.commentId],
  }),
],
);

export const commentReactionRelation = relations(commentReaction, ({ one }) => ({
  user: one(user, {
    fields: [commentReaction.userId],
    references: [user.id],
  }),
  comment: one(comment, {
    fields: [commentReaction.commentId],
    references: [comment.id],
  }),
}));

export const videoView = pgTable('video-view', {
  videoId: uuid('video_id').references(() => video.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
t => [
  primaryKey({
    name: 'video_view_pkey',
    columns: [t.videoId, t.userId],
  }),
]);

export const videoViewRelation = relations(videoView, ({ one }) => ({
  user: one(user, {
    fields: [videoView.userId],
    references: [user.id],
  }),
  video: one(video, {
    fields: [videoView.videoId],
    references: [video.id],
  }),
}));

export const VideoViewInsertSchema = createInsertSchema(videoView);
export const VideoViewUpdateSchema = createUpdateSchema(videoView);
export const VideoViewSelectSchema = createSelectSchema(videoView);

export const videoReaction = pgTable('video-reaction', {
  videoId: uuid('video_id').references(() => video.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  type: reactionType('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
},
t => [
  primaryKey({
    name: 'video_reaction_pkey',
    columns: [t.videoId, t.userId],
  }),
],
);

export const videoReactionRelation = relations(videoReaction, ({ one }) => ({
  user: one(user, {
    fields: [videoReaction.userId],
    references: [user.id],
  }),
  video: one(video, {
    fields: [videoReaction.videoId],
    references: [video.id],
  }),
}));

export const VideoReactionInsertSchema = createInsertSchema(videoReaction);
export const VideoReactionUpdateSchema = createUpdateSchema(videoReaction);
export const VideoReactionSelectSchema = createSelectSchema(videoReaction);
