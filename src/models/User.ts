import prisma from '../../lib/prisma';
// import { User, Prisma } from '@prisma/client';

export type UserWithoutPassword = any;

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export class UserModel {
  static async findByUsername(username: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  }

  static async findByEmail(email: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  }

  static async findById(id: number): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Failed to find user: ${error}`);
    }
  }

  static async validatePassword(username: string, password: string): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          passwordHash: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      if (!user) return null;

      // Simple password comparison without bcrypt (for development only)
      const isValid = password === user.passwordHash;
      
      if (isValid) {
        // Remove passwordHash from returned user
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
      return null;
    } catch (error) {
      throw new Error(`Failed to validate password: ${error}`);
    }
  }

  static async create(userData: CreateUserData): Promise<UserWithoutPassword> {
    try {
      // Store password as plain text (for development only)
      const user = await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          passwordHash: userData.password, // Store as plain text
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return user;
    } catch (error) {
      if (error && (error as any).code === 'P2002') {
        throw new Error('Username or email already exists');
      }
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  static async update(id: number, updates: Partial<Omit<CreateUserData, 'password'>>): Promise<UserWithoutPassword | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: updates.email,
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return user;
    } catch (error) {
      if (error && (error as any).code === 'P2025') {
        return null; // User not found
      }
      throw new Error(`Failed to update user: ${error}`);
    }
  }
}