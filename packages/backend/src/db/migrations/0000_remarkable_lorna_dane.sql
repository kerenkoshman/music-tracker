CREATE TABLE IF NOT EXISTS "artists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spotify_id" text NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"popularity" integer,
	"genres" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "artists_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listening_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"song_id" uuid NOT NULL,
	"played_at" timestamp NOT NULL,
	"duration" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spotify_id" text NOT NULL,
	"name" text NOT NULL,
	"artist_id" uuid NOT NULL,
	"album_name" text,
	"album_image_url" text,
	"duration" integer,
	"popularity" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "songs_spotify_id_unique" UNIQUE("spotify_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spotify_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"spotify_id" text NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"google_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"picture" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_spotify_id_idx" ON "artists" ("spotify_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "artist_name_idx" ON "artists" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_user_id_idx" ON "listening_history" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_song_id_idx" ON "listening_history" ("song_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_played_at_idx" ON "listening_history" ("played_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "history_user_played_at_idx" ON "listening_history" ("user_id","played_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "song_spotify_id_idx" ON "songs" ("spotify_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "song_artist_id_idx" ON "songs" ("artist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "song_name_idx" ON "songs" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spotify_user_id_idx" ON "spotify_connections" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spotify_id_idx" ON "spotify_connections" ("spotify_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "google_id_idx" ON "users" ("google_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listening_history" ADD CONSTRAINT "listening_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listening_history" ADD CONSTRAINT "listening_history_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "songs" ADD CONSTRAINT "songs_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spotify_connections" ADD CONSTRAINT "spotify_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
