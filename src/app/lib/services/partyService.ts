import prisma from "@prisma/prisma";
import type { Party } from "@prisma/client";

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
    page: number, 
    limit: number, 
    filter?: Record<string, any>
): Promise<{ parties: any[]; lastVisible: any | null }> => {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};
    
        if(filter){
            for(const [key, value] of Object.entries(filter)){
                if (!value) continue;
                if(key === "id") {
                    where.id = value;
                } else if (["created", "startDate", "endDate"].includes(key)){
                    const date = new Date("value");
                    const startOfDay = new Date(date);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(date);
                    endOfDay.setHours(13, 59, 59, 999);
    
                    where[key] = {
                        startsWith: value,
                        mode: "insensitive",
                    }
                }
            }
        }
    
        const parties = await prisma.party.findMany({
            where,
            orderBy: [
                {name: "asc"},
                {startDate: "asc"}
            ],
            skip,
            take: limit,
            include: {
                images: true,
                tickets: true
            }
        });
    
        const totalCount = await prisma.party.count({ where });
        const hasNextPage = skip + parties.length < totalCount;
    
        return {
            parties,
            lastVisible: hasNextPage ? page + 1 : null,
        }
    } catch (error) {
        console.error("Error fetching paginated parties:", error)
        return{ parties: [], lastVisible: null }
    }
}

export async function getPartyById(id: string): Promise<Party | null> {
    try {
        const party = await prisma.party.findUnique({
            where: { id },
            include: {
                images: true,
                cards: true,
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