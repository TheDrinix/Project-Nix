/*
  Warnings:

  - The primary key for the `AnnoucementsConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AnnoucementsConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnnoucementsConfig" DROP CONSTRAINT "AnnoucementsConfig_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AnnoucementsConfig_pkey" PRIMARY KEY ("guildId");
