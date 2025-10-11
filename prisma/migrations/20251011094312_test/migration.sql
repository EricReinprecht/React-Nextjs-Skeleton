/*
  Warnings:

  - Added the required column `partyId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "partyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_PartyToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PartyToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PartyToCategory_B_index" ON "_PartyToCategory"("B");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartyToCategory" ADD CONSTRAINT "_PartyToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Party"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PartyToCategory" ADD CONSTRAINT "_PartyToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "PartyCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
