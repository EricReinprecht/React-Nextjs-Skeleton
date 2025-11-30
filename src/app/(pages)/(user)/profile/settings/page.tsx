import ManagerPage from "@/src/app/lib/templates/manager_page";
import "@styles/forms/login_form.scss";
import "@styles/pages/settings.scss";
import EditUserForm from "./editUserForm";
import { cookies } from "next/headers";
import prisma from "@prisma/prisma";
import jwt from "jsonwebtoken";

export default async function EditUser() {
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
                <EditUserForm authUser={authUser} />   
            </ManagerPage>
        </div>
    );
};