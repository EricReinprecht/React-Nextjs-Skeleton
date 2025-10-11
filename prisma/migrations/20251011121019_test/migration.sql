-- CreateTable
CREATE TABLE "TicketCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "TicketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TicketToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketToCategory_B_index" ON "_TicketToCategory"("B");

-- AddForeignKey
ALTER TABLE "_TicketToCategory" ADD CONSTRAINT "_TicketToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToCategory" ADD CONSTRAINT "_TicketToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "TicketCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
