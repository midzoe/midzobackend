import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
// Initialize Prisma Client
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully with Prisma');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}
export async function disconnectDatabase() {
    await prisma.$disconnect();
}
export default prisma;
//# sourceMappingURL=database.js.map