-- CreateTable
CREATE TABLE "WatchedThread" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "WatchedThread_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchedThread" ADD CONSTRAINT "WatchedThread_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
