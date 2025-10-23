/*
  Warnings:

  - You are about to drop the column `alt` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partyId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `created` on the `Party` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_partyId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "alt",
DROP COLUMN "caption",
DROP COLUMN "url",
ADD COLUMN     "filename" TEXT NOT NULL,
ALTER COLUMN "partyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Party" DROP COLUMN "created",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "partyId_idx" ON "Image"("partyId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;
