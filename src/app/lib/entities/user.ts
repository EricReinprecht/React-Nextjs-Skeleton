import prisma from "../prisma/prisma";
import { User as PrismaUser } from "@prisma/client";

export class UserEntity {
    constructor(public data: PrismaUser) {}

    // Getter for convenience
    get id() {
        return this.data.id;
    }

    get email() {
        return this.data.email;
    }

    get password() {
        return this.data.password;
    }

    update(data: Partial<PrismaUser>) {
        Object.assign(this.data, data);
    }

    async save() {
        this.data = await prisma.user.update({
            where: { id: this.data.id },
            data: this.data,
        });
        return this;
    }

    static async create(
        data: Omit<PrismaUser, "id" | "createdAt"> & { createdParties?: string[] }
    ) {
        const user = await prisma.user.create({
            data: {
                ...data,
                createdParties: data.createdParties ?? [],
            },
        });
        return new UserEntity(user);
    }

    static async findByEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        return user ? new UserEntity(user) : null;
    }

    static async findById(id: string) {
        const user = await prisma.user.findUnique({ where: { id } });
        return user ? new UserEntity(user) : null;
    }

    toJSON() {
        return this.data;
    }
}
