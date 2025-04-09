-- CreateTable
CREATE TABLE "AnnoucementsConfig" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "announceJoin" BOOLEAN NOT NULL DEFAULT true,
    "announceLeave" BOOLEAN NOT NULL DEFAULT true,
    "announceBan" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AnnoucementsConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnnoucementsConfig_guildId_key" ON "AnnoucementsConfig"("guildId");

-- AddForeignKey
ALTER TABLE "AnnoucementsConfig" ADD CONSTRAINT "AnnoucementsConfig_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
