import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { ManagerPage } from "@templates";
import prisma from "@prisma/prisma";

import EditUserForm from "./editUserForm";

import "@styles/forms/login_form.scss";
import "@styles/pages/settings.scss";

export default async function EditUser(props) {
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