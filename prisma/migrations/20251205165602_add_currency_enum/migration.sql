/*
  Warnings:

  - The `currency` column on the `TicketClassPrice` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD');

-- AlterTable
ALTER TABLE "TicketClassPrice" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';
