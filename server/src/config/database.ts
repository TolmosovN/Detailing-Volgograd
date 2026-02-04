import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client для работы с базой данных
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Graceful shutdown для Prisma
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
