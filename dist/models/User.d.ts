export type UserWithoutPassword = any;
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
}
export declare class UserModel {
    static findByUsername(username: string): Promise<UserWithoutPassword | null>;
    static findByEmail(email: string): Promise<UserWithoutPassword | null>;
    static findById(id: number): Promise<UserWithoutPassword | null>;
    static validatePassword(username: string, password: string): Promise<UserWithoutPassword | null>;
    static create(userData: CreateUserData): Promise<UserWithoutPassword>;
    static update(id: number, updates: Partial<Omit<CreateUserData, 'password'>>): Promise<UserWithoutPassword | null>;
}
//# sourceMappingURL=User.d.ts.map