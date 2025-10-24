import ManagerPage from "@/src/app/lib/templates/manager_page";
import prisma from "@prisma/prisma";
import jwt from "jsonwebtoken";
import CreatePartyForm from "./editPartyForm"; // Client Component
import { cookies } from "next/headers";
import EditPartyForm from "./editPartyForm";

export default async function CreatePartyPage(props) {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    let authUser = null;

    if (token && process.env.JWT_SECRET) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
            authUser = await prisma.user.findUnique({ where: { id: payload.id } });
        } catch (err) {
            console.error("Invalid token:", err);
        }
    }

    if (!authUser) {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="main">
            <ManagerPage>
                <EditPartyForm authUser={authUser} />
            </ManagerPage>
        </div>
    );
}
