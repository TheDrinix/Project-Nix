-- AlterTable
ALTER TABLE "AnnoucementsConfig" ADD COLUMN     "banMessageEmbed" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "joinMessageEmbed" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "leaveMessageEmbed" JSONB NOT NULL DEFAULT '{}';
