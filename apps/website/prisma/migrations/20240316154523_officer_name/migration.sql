/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Officer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Officer_name_key" ON "Officer"("name");
