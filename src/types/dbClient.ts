import { Prisma, PrismaClient } from "../prisma/generated/prisma/client.js";

export type DbClient = PrismaClient | Prisma.TransactionClient;