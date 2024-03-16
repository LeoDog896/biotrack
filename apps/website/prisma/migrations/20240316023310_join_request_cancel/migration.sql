-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JoinRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "precedingJoinRequestId" INTEGER,
    CONSTRAINT "JoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_precedingJoinRequestId_fkey" FOREIGN KEY ("precedingJoinRequestId") REFERENCES "JoinRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JoinRequest" ("acknowledged", "createdAt", "gameId", "id", "precedingJoinRequestId", "updatedAt", "userId") SELECT "acknowledged", "createdAt", "gameId", "id", "precedingJoinRequestId", "updatedAt", "userId" FROM "JoinRequest";
DROP TABLE "JoinRequest";
ALTER TABLE "new_JoinRequest" RENAME TO "JoinRequest";
CREATE UNIQUE INDEX "JoinRequest_userId_key" ON "JoinRequest"("userId");
CREATE UNIQUE INDEX "JoinRequest_precedingJoinRequestId_key" ON "JoinRequest"("precedingJoinRequestId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
