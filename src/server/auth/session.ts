import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { userRepository } from "../repositories/user.repository";

type AuthTokenPayload = {
    id: string;
    email?: string;
};

export const createAuthToken = (payload: AuthTokenPayload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");
    return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const getAuthUser = async () => {
    try {
        const token = (await cookies()).get("authToken")?.value;
        const secret = process.env.JWT_SECRET;
        if (!token || !secret) return null;
        const payload = jwt.verify(token, secret) as AuthTokenPayload;
        return userRepository.findById(payload.id);
    } catch {
        return null;
    }
};
