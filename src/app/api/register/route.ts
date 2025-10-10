import { NextRequest, NextResponse } from "next/server";
import { UserEntity } from "@entities/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields (optional but recommended)
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newUser = await UserEntity.create({
      username: body.username,
      email: body.email,
      firstname: body.firstname,
      lastname: body.lastname,
      birthdate: new Date(body.birthdate),
      country: body.country,
      zip: Number(body.zip),
      city: body.city,
      street: body.street,
      housenumber: Number(body.housenumber),
      unit: body.unit,
    });

    return NextResponse.json({ success: true, user: newUser.toJSON() });
  } catch (err: any) {
    console.error("Error creating user:", err);

    // Return a safe error message to the client
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
