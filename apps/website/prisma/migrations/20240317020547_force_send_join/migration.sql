-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JoinRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "terminated" BOOLEAN NOT NULL DEFAULT false,
    "forceSentId" TEXT,
    CONSTRAINT "JoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JoinRequest_forceSentId_fkey" FOREIGN KEY ("forceSentId") REFERENCES "Officer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JoinRequest" ("acknowledged", "createdAt", "gameId", "id", "terminated", "updatedAt", "userId") SELECT "acknowledged", "createdAt", "gameId", "id", "terminated", "updatedAt", "userId" FROM "JoinRequest";
DROP TABLE "JoinRequest";
ALTER TABLE "new_JoinRequest" RENAME TO "JoinRequest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
