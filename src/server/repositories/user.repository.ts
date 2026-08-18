import type { Prisma, User } from "@prisma/client";

import prisma from "../db/prisma";

const publicUserSelect = {
    id: true,
    email: true,
    username: true,
    firstname: true,
    lastname: true,
    language: true,
} satisfies Prisma.UserSelect;

export const userRepository = {
    findById: (id: string) => prisma.user.findUnique({ where: { id } }),
    findPublicById: (id: string) => prisma.user.findUnique({ where: { id }, select: publicUserSelect }),
    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
    create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),
    update: (id: string, data: Partial<User>) => prisma.user.update({ where: { id }, data }),
};
