import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";

import { createAuthToken } from "../auth/session";
import { ApplicationError } from "../errors/application-error";
import { userRepository } from "../repositories/user.repository";

export type RegisterUserInput = {
    username: string;
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
    birthdate?: string;
    country?: string;
    zip?: string | number;
    city?: string;
    street?: string;
    housenumber?: string | number;
    unit?: string;
};

const publicUser = <T extends { password: string }>(user: T) => {
    const { password: _password, ...safeUser } = user;
    return safeUser;
};

export const authService = {
    getCurrentUser: (id: string) => userRepository.findPublicById(id),
    getUserByEmail: (email: string) => userRepository.findByEmail(email),

    async login(email: string, password: string) {
        if (!email || !password) throw new ApplicationError("Email and password are required", 400, "INVALID_CREDENTIALS");
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApplicationError("Invalid email or password", 401, "INVALID_CREDENTIALS");
        }
        return { token: createAuthToken({ id: user.id, email: user.email }), user: publicUser(user) };
    },

    async register(input: RegisterUserInput) {
        if (!input.username || !input.email || !input.password) throw new ApplicationError("Missing required fields", 400, "INVALID_INPUT");
        if (await userRepository.findByEmail(input.email)) throw new ApplicationError("Email already in use", 409, "EMAIL_IN_USE");

        const data: Prisma.UserCreateInput = {
            username: input.username,
            email: input.email,
            password: await bcrypt.hash(input.password, 10),
            firstname: input.firstname ?? "",
            lastname: input.lastname ?? "",
            birthdate: input.birthdate ? new Date(input.birthdate) : new Date(),
            country: input.country ?? "",
            zip: Number(input.zip ?? 0),
            city: input.city ?? "",
            street: input.street ?? "",
            housenumber: Number(input.housenumber ?? 0),
            unit: input.unit || null,
            language: "en",
        };
        const user = await userRepository.create(data);
        return { token: createAuthToken({ id: user.id, email: user.email }), user: publicUser(user) };
    },
};
