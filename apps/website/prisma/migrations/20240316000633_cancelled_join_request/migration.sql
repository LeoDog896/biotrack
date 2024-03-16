-- CreateTable
CREATE TABLE "CancelledJoinRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "joinRequestId" INTEGER NOT NULL,
    CONSTRAINT "CancelledJoinRequest_joinRequestId_fkey" FOREIGN KEY ("joinRequestId") REFERENCES "JoinRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CancelledJoinRequest_joinRequestId_key" ON "CancelledJoinRequest"("joinRequestId");
