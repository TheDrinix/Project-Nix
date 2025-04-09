/*
  Warnings:

  - Added the required column `channelId` to the `AnnoucementsConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnnoucementsConfig" ADD COLUMN     "channelId" TEXT NOT NULL;
