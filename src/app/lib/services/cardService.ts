import prisma from "@prisma/prisma";
import { Prisma } from "@prisma/client";
import { PARTY_PAGE_SIZE } from "../utils/env";
import { PartyFilter } from "@types_ts";

export const getCardsPaginated = async (
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

export const countCards = async (
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