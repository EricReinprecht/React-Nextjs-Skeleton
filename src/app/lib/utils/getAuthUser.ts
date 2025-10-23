import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/src/app/lib/prisma/prisma";

/**
 * Retrieves the currently authenticated user from the JWT stored in cookies.
 * Returns `null` if the user is not authenticated or token is invalid.
 */
export async function getAuthUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("authToken")?.value;
        
        if (!token || !process.env.JWT_SECRET) {
          return null;
        }
      
        // Verify JWT and decode payload
        const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
      
        // Fetch user from database
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
      
        return user;
    } catch (err) {
        console.error("Error in getAuthUser:", err);
        return null;
    }
}
