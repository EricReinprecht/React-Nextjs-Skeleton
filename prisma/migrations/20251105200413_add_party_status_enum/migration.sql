/*
  Warnings:

  - You are about to drop the column `created` on the `Party` table. All the data in the column will be lost.
  - Added the required column `ticketAmount` to the `TicketClass` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PartyStatus" AS ENUM ('draft', 'hot', 'published', 'hidden');

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "created",
ADD COLUMN     "status" "PartyStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "TicketClass" ADD COLUMN     "ticketAmount" INTEGER NOT NULL;
