-- Rename the table
ALTER TABLE "AnnoucementsConfig" RENAME TO "AnnouncementsConfig";

-- Rename the primary key constraint
ALTER TABLE "AnnouncementsConfig" RENAME CONSTRAINT "AnnoucementsConfig_pkey" TO "AnnouncementsConfig_pkey";

-- Rename the foreign key constraint
ALTER TABLE "AnnouncementsConfig" RENAME CONSTRAINT "AnnoucementsConfig_guildId_fkey" TO "AnnouncementsConfig_guildId_fkey";

-- Update the default values for the columns
ALTER TABLE "AnnouncementsConfig" ALTER COLUMN "announceJoin" SET DEFAULT false;
ALTER TABLE "AnnouncementsConfig" ALTER COLUMN "announceLeave" SET DEFAULT false;
