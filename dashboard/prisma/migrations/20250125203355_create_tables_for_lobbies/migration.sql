-- CreateTable
CREATE TABLE "Lobby" (
    "id" TEXT NOT NULL,
    "entryPointId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "waitingRoomId" TEXT,
    "namingScheme" TEXT NOT NULL,
    "allowPersonalizedNaming" BOOLEAN NOT NULL DEFAULT false,
    "protectedChannelIds" TEXT[],
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalizedNamingScheme" (
    "pattern" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "lobbyId" TEXT NOT NULL,

    CONSTRAINT "PersonalizedNamingScheme_pkey" PRIMARY KEY ("lobbyId","memberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_entryPointId_key" ON "Lobby"("entryPointId");

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_waitingRoomId_key" ON "Lobby"("waitingRoomId");

-- CreateIndex
CREATE INDEX "Lobby_entryPointId_idx" ON "Lobby"("entryPointId");

-- CreateIndex
CREATE INDEX "Lobby_waitingRoomId_idx" ON "Lobby"("waitingRoomId");

-- AddForeignKey
ALTER TABLE "Lobby" ADD CONSTRAINT "Lobby_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizedNamingScheme" ADD CONSTRAINT "PersonalizedNamingScheme_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
