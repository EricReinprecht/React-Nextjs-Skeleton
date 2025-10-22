/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `PartyCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PartyCategory_name_key" ON "PartyCategory"("name");
