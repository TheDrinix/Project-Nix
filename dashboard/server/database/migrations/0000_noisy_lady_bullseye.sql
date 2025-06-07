CREATE TABLE "AnnouncementsConfig" (
	"guildId" text PRIMARY KEY NOT NULL,
	"channelId" text,
	"announceJoin" boolean DEFAULT false NOT NULL,
	"joinMessageEmbed" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"announceLeave" boolean DEFAULT false NOT NULL,
	"leaveMessageEmbed" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"announceBan" boolean DEFAULT false NOT NULL,
	"banMessageEmbed" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Guild" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"PNRole" text
);
--> statement-breakpoint
CREATE TABLE "Lobby" (
	"id" text PRIMARY KEY NOT NULL,
	"entryPointId" text NOT NULL,
	"isPrivate" boolean DEFAULT false NOT NULL,
	"waitingRoomId" text,
	"namingScheme" text NOT NULL,
	"allowPersonalizedNaming" boolean DEFAULT false NOT NULL,
	"protectedChannelIds" text[] DEFAULT '{}' NOT NULL,
	"guildId" text NOT NULL,
	CONSTRAINT "Lobby_entryPointId_unique" UNIQUE("entryPointId"),
	CONSTRAINT "Lobby_waitingRoomId_unique" UNIQUE("waitingRoomId")
);
--> statement-breakpoint
CREATE TABLE "PersonalizedNamingScheme" (
	"pattern" text NOT NULL,
	"memberId" text NOT NULL,
	"lobbyId" text NOT NULL,
	CONSTRAINT "PersonalizedNamingScheme_lobbyId_memberId_pk" PRIMARY KEY("lobbyId","memberId")
);
--> statement-breakpoint
CREATE TABLE "WatchedThread" (
	"id" text PRIMARY KEY NOT NULL,
	"parentId" text NOT NULL,
	"guildId" text NOT NULL
);
