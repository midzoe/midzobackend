import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function formatUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.firstName ?? null,
    last_name: user.lastName ?? null,
    phone: user.phone ?? null,
  };
}

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
};

export class UserModel {
  static async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: USER_SELECT,
    });
    return user;
  }

  static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: USER_SELECT,
    });
    return user;
  }

  static async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    return user ? formatUser(user) : null;
  }

  static async create(userData: CreateUserData) {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        emailVerified: false,
      },
      select: USER_SELECT,
    });
    return formatUser(user);
  }

  static async validatePassword(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        ...USER_SELECT,
        passwordHash: true,
        emailVerified: true,
      },
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    const { passwordHash, ...rest } = user;
    return { ...formatUser(rest), emailVerified: rest.emailVerified };
  }

  static async createVerificationCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 8);
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: hashedCode,
        verificationCodeExpiry: expiry,
        verificationCodeSentAt: new Date(),
      },
    });

    return code;
  }

  static async verifyEmail(
    email: string,
    code: string
  ): Promise<{ success: boolean; error?: string; user?: ReturnType<typeof formatUser> }> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        ...USER_SELECT,
        emailVerified: true,
        verificationCode: true,
        verificationCodeExpiry: true,
      },
    });

    if (!user) return { success: false, error: 'user not found' };
    if (user.emailVerified) return { success: false, error: 'already verified' };
    if (!user.verificationCode) return { success: false, error: 'invalid code' };
    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      return { success: false, error: 'code expired' };
    }

    const isValid = await bcrypt.compare(code, user.verificationCode);
    if (!isValid) return { success: false, error: 'invalid code' };

    const updated = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpiry: null,
        verificationCodeSentAt: null,
      },
      select: USER_SELECT,
    });

    return { success: true, user: formatUser(updated) };
  }

  static async canResendCode(email: string): Promise<{ allowed: boolean; error?: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        emailVerified: true,
        verificationCodeSentAt: true,
      },
    });

    if (!user) return { allowed: false, error: 'user not found' };
    if (user.emailVerified) return { allowed: false, error: 'already verified' };

    if (user.verificationCodeSentAt) {
      const secondsSinceLast = (Date.now() - user.verificationCodeSentAt.getTime()) / 1000;
      if (secondsSinceLast < 60) {
        return { allowed: false, error: 'too many requests' };
      }
    }

    return { allowed: true };
  }

  static async update(id: number, updates: Partial<Omit<CreateUserData, 'password'>>) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: updates.email,
          firstName: updates.firstName,
          lastName: updates.lastName,
          phone: updates.phone,
        },
        select: USER_SELECT,
      });
      return formatUser(user);
    } catch (error) {
      if (error && (error as any).code === 'P2025') return null;
      throw error;
    }
  }
}
