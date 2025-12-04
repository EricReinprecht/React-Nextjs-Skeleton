import ManagerPage from "@/src/app/lib/templates/manager_page";
import prisma from "@prisma/prisma";
import jwt from "jsonwebtoken";
import CreatePartyForm from "../createPartyForm"; // Client Component
import { cookies } from "next/headers";
import withAuth from "@/src/app/lib/hoc/withAuth";

const EditPartyPage = async () => {
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
                <CreatePartyForm authUser={authUser} />
            </ManagerPage>
        </div>
    );
}

export default withAuth(EditPartyPage);