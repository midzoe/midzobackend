import { PrismaClient } from '@prisma/client';
declare const prisma: PrismaClient<{
    log: ("info" | "query" | "warn" | "error")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function connectDatabase(): Promise<boolean>;
export declare function disconnectDatabase(): Promise<void>;
export default prisma;
//# sourceMappingURL=database.d.ts.map