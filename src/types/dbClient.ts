import { Prisma, PrismaClient } from '../generated/prisma';

export type DbClient = PrismaClient | Prisma.TransactionClient;
