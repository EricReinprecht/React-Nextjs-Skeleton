import prisma from "../db/prisma";
import type { Party } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { PARTY_PAGE_SIZE } from "@shared/utils/env";
import { PartyFilter, TableSort } from "@shared/types";

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
    filter?: PartyFilter,
    userId?: string,
    sorting: TableSort[] = []
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

        if (userId) Object.assign(where, { userId });
        const sortableFields = new Set(["name", "createdAt", "startDate", "endDate", "location", "status"]);
        const orderBy = sorting.filter(({ key }) => sortableFields.has(key)).map(({ key, direction }) => ({ [key]: direction }));
        const parties = await prisma.party.findMany({
            where,
            skip,
            take: limit,
            orderBy: [...orderBy, { id: "asc" }],
            include: { images: true, tickets: true },
        });
      
        return { parties };
    } catch (error) {
        console.error("Error fetching paginated parties:", error);
        return { parties: [] };
    }
};

export const countParties = async (
    filter?: PartyFilter,
    userId?: string
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

        if (userId) Object.assign(where, { userId });
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

export async function browseParties(page = 1, search = "") {
    const limit = PARTY_PAGE_SIZE;
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const normalizedSearch = search.slice(0, 120);
    const where: Prisma.PartyWhereInput = normalizedSearch
        ? {
            OR: ["name", "location", "teaser", "description"].map((field) => ({
                [field]: { contains: normalizedSearch, mode: "insensitive" },
            })),
        }
        : {};

    const rows = await prisma.party.findMany({
        where,
        skip: (safePage - 1) * limit,
        take: limit + 1,
        orderBy: [{ startDate: "asc" }, { id: "asc" }],
        include: { images: true },
    });
    const hasMore = rows.length > limit;

    return {
        parties: hasMore ? rows.slice(0, limit) : rows,
        hasMore,
    };
}

export const createParty = (data: Prisma.PartyCreateInput) => prisma.party.create({
    data,
    include: { categories: true, createdBy: true },
});

export const updateParty = (id: string, data: Prisma.PartyUpdateInput) => prisma.party.update({
    where: { id },
    data,
    include: { categories: true, images: true },
});

export const deletePartyImages = (partyId: string, imageIds: string[]) => prisma.image.deleteMany({
    where: { partyId, id: { in: imageIds } },
});

export const createPartyImages = (partyId: string, paths: string[]) => prisma.$transaction(
    paths.map((imagePath) => prisma.image.create({ data: { partyId, path: imagePath } }))
);

export const findPartyDetails = (id: string) => prisma.party.findUnique({
    where: { id },
    include: {
        images: true,
        categories: true,
        createdBy: true,
        ticketClasses: { include: { prices: true } },
    },
});

export const findPartyTickets = (id: string) => prisma.party.findUnique({
    where: { id },
    select: { ticketClasses: { include: { prices: true } } },
});
