import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@utils/getAuthUser";
import prisma from "@prisma/prisma";

export async function PUT(req: NextRequest) {
    try {
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const userid = formData.get("id") as string;
        if (!userid) return NextResponse.json({ message: "Missing User ID" }, { status: 400 });

        const username = formData.get("username") as string;
        const firstname = formData.get("firstname") as string;
        const lastname = formData.get("lastname") as string;
        const country = formData.get("country") as string;
        const city = formData.get("city") as string;
        const zip = Number(formData.get("zip"));
        const street = formData.get("street") as string;
        const housenumber = Number(formData.get("housenumber"));
        const unit = formData.get("unit") as string;

        const user = await prisma.user.update({
            where: { id: userid },
            data: {
                username,
                firstname,
                lastname,
                country,
                city,
                zip,
                street,
                housenumber,
                unit,
            },
        });

        return NextResponse.json({ user: user.id });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
    }
}