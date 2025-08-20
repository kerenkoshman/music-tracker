import { pgTable, text, timestamp, integer, boolean, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (Google OAuth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: text('google_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  googleIdIdx: index('google_id_idx').on(table.googleId),
  emailIdx: index('email_idx').on(table.email),
}));

// Spotify connections table
export const spotifyConnections = pgTable('spotify_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  spotifyId: text('spotify_id').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('spotify_user_id_idx').on(table.userId),
  spotifyIdIdx: index('spotify_id_idx').on(table.spotifyId),
}));

// Artists table
export const artists = pgTable('artists', {
  id: uuid('id').primaryKey().defaultRandom(),
  spotifyId: text('spotify_id').unique().notNull(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  popularity: integer('popularity'),
  genres: text('genres').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  spotifyIdIdx: index('artist_spotify_id_idx').on(table.spotifyId),
  nameIdx: index('artist_name_idx').on(table.name),
}));

// Songs table
export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  spotifyId: text('spotify_id').unique().notNull(),
  name: text('name').notNull(),
  artistId: uuid('artist_id').references(() => artists.id, { onDelete: 'cascade' }).notNull(),
  albumName: text('album_name'),
  albumImageUrl: text('album_image_url'),
  duration: integer('duration'), // in milliseconds
  popularity: integer('popularity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  spotifyIdIdx: index('song_spotify_id_idx').on(table.spotifyId),
  artistIdIdx: index('song_artist_id_idx').on(table.artistId),
  nameIdx: index('song_name_idx').on(table.name),
}));

// Listening history table
export const listeningHistory = pgTable('listening_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  songId: uuid('song_id').references(() => songs.id, { onDelete: 'cascade' }).notNull(),
  playedAt: timestamp('played_at').notNull(),
  duration: integer('duration'), // how long the song was played (in seconds)
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('history_user_id_idx').on(table.userId),
  songIdIdx: index('history_song_id_idx').on(table.songId),
  playedAtIdx: index('history_played_at_idx').on(table.playedAt),
  userPlayedAtIdx: index('history_user_played_at_idx').on(table.userId, table.playedAt),
}));

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  spotifyConnection: one(spotifyConnections, {
    fields: [users.id],
    references: [spotifyConnections.userId],
  }),
  listeningHistory: many(listeningHistory),
}));

export const spotifyConnectionsRelations = relations(spotifyConnections, ({ one }) => ({
  user: one(users, {
    fields: [spotifyConnections.userId],
    references: [users.id],
  }),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  songs: many(songs),
}));

export const songsRelations = relations(songs, ({ one, many }) => ({
  artist: one(artists, {
    fields: [songs.artistId],
    references: [artists.id],
  }),
  listeningHistory: many(listeningHistory),
}));

export const listeningHistoryRelations = relations(listeningHistory, ({ one }) => ({
  user: one(users, {
    fields: [listeningHistory.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [listeningHistory.songId],
    references: [songs.id],
  }),
}));
