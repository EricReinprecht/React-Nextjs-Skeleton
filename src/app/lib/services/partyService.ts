import prisma from "@prisma/prisma";
import type { Party } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import { PARTY_PAGE_SIZE } from "../utils/env";

type PartyCreateInput = Omit<Party, "id"> & {
    images?: { url: string; caption?: string; alt?: string }[];
    tickets?: { title: string; content?: string }[];
};

export async function getParties(): Promise<Party[]> {
    try {
        const parties = await prisma.party.findMany({
            orderBy: [
                { name: "asc" },
                { startDate: "asc" }
            ],
            include: {
                images: true,
                cards: true,
            },
        });

      return parties;
    } catch (error) {
      console.error("Error fetching parties:", error);
      return [];
    }
}

export const getPartiesPaginated = async (
    cursorId?: string,
    filter?: Record<string, any>
): Promise<{ parties: any[]; nextCursor: string | null }> => {
    try {
        const limit = PARTY_PAGE_SIZE;

        const where: any = {};

        if (filter) {
            for (const [key, value] of Object.entries(filter)) {
                if (!value) continue;
                if (key === "id") {
                    where.id = value;
                } else if (["created", "startDate", "endDate"].includes(key)) {
                    const date = new Date(value);
                    const startOfDay = new Date(date);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(date);
                    endOfDay.setHours(23, 59, 59, 999);

                    where[key] = {
                        gte: startOfDay,
                        lte: endOfDay,
                    };
                } else {
                    where[key] = {
                        contains: value,
                        mode: "insensitive",
                    };
                }
            }
        }

        const parties = await prisma.party.findMany({
            where,
            orderBy: [
                { startDate: "asc" },
                { id: "asc" },
            ],
            take: limit + 1,
            ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
            include: {
                images: true,
                tickets: true,
            },
        });

        let nextCursor: string | null = null;
        if (parties.length > limit) {
            const nextParty = parties.pop();
            nextCursor = nextParty!.id;
        }

        return { parties, nextCursor };
    } catch (error) {
        console.error("Error fetching paginated parties:", error);
        return { parties: [], nextCursor: null };
    }
};


export async function getPartyById(id: string): Promise<Prisma.PartyGetPayload<{ include: { images: true; categories: true } }> | null> {
    try {
        const party = await prisma.party.findUnique({
            where: { id },
            include: {
                images: true,
                categories: true,
            },
        });
        return party;
    } catch (error) {
        console.error("Error fetching party by ID:", error);
        return null;
    }
}

export async function createParty(party: PartyCreateInput): Promise<string | null> {
    try {
        const createdParty = await prisma.party.create({
            data: {
                ...party,
                images: party.images ? { create: party.images } : undefined,
                tickets: party.tickets ? { create: party.tickets } : undefined,
            },
        });
      
        return createdParty.id;
    } catch (error) {
        console.error("Error creating party:", error);
        return null;
    }
}