import prisma from "@prisma/prisma";
import type { Party } from "@prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";
import { PARTY_PAGE_SIZE } from "../utils/env";
import { PartyFilter } from "@types_ts";/party/PartyFilterType";

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
                tickets: true,
            },
        });

      return parties;
    } catch (error) {
      console.error("Error fetching parties:", error);
      return [];
    }
}

export const getPartiesByCursor = async (
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

export const getPartiesPaginated = async (
    page: number = 1,
    filter?: PartyFilter
): Promise<{ parties: any[] }> => {
    try {
        const limit = PARTY_PAGE_SIZE;
        const skip = (page - 1) * limit;
        
        const where = filter ? Object.fromEntries(
            Object.entries(filter)
                .filter(([_, v]) => v)
                .map(([key, value]) => [
                    key,
                    ["createdAt", "startDate", "endDate"].includes(key)
                        ? {
                            gte: new Date(new Date(value).setHours(0, 0, 0, 0)),
                            lte: new Date(new Date(value).setHours(23, 59, 59, 999)),
                        }
                        : ["id", "status"].includes(key)
                        ? value
                        : { contains: value, mode: "insensitive" },
                ])
            )
        : {};

        const parties = await prisma.party.findMany({
            where,
            skip,
            take: limit,
            orderBy: [{ startDate: "asc" }, { id: "asc" }],
            include: { images: true, tickets: true },
        });
      
        return { parties };
    } catch (error) {
        console.error("Error fetching paginated parties:", error);
        return { parties: [] };
    }
};

export const countParties = async (
    filter?: PartyFilter
): Promise<{ total: number }> => {
    try {        
        const where = filter ? Object.fromEntries(
            Object.entries(filter)
                .filter(([_, v]) => v)
                .map(([key, value]) => [
                  key,
                  ["createdAt", "startDate", "endDate"].includes(key)
                      ? {
                          gte: new Date(new Date(value).setHours(0, 0, 0, 0)),
                          lte: new Date(new Date(value).setHours(23, 59, 59, 999)),
                        }
                      : ["id", "status"].includes(key)
                      ? value
                      : { contains: value, mode: "insensitive" },
                ])
            )
        : {};

        const total = await prisma.party.count({ where });
      
        return { total };
    } catch (error) {
        console.error("Error fetching paginated parties:", error);
        return { total: 0 };
    }
}


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