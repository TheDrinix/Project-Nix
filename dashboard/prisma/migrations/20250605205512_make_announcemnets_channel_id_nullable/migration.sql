-- AlterTable
ALTER TABLE "AnnouncementsConfig" ALTER COLUMN "channelId" DROP NOT NULL;

-- RenameIndex
ALTER INDEX "AnnoucementsConfig_guildId_key" RENAME TO "AnnouncementsConfig_guildId_key";
