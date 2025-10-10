import { PrismaClient } from "@prisma/client";

declare global {
  // allows using global.prisma in development without TS errors
  var prisma: PrismaClient | undefined;
}
