import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  nationality?: string;
  countryOfResidence?: string;
  newsletterStudy?: boolean;
  newsletterTourism?: boolean;
  languages?: { language: string; level: string }[];
}

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  nationality: true,
  countryOfResidence: true,
  isPremium: true,
  premiumSince: true,
  newsletterStudy: true,
  newsletterTourism: true,
  languages: { select: { language: true, level: true } },
};

function formatUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: user.firstName ?? null,
    last_name: user.lastName ?? null,
    phone: user.phone ?? null,
    role: user.role ?? "user",
    nationality: user.nationality ?? null,
    country_of_residence: user.countryOfResidence ?? null,
    is_premium: user.isPremium ?? false,
    premium_since: user.premiumSince ?? null,
    newsletter_study: user.newsletterStudy ?? false,
    newsletter_tourism: user.newsletterTourism ?? false,
    languages: user.languages ?? [],
  };
}

/**
 * Règle unique de « profil premium complet » (FR9), partagée par `getProfileCompleteness`
 * (story 2.3) et `getPremiumTripReadiness` (story 3.6). Renvoie les clés snake_case manquantes.
 * Une chaîne vide ou blanche vaut « non renseigné » (d'anciennes lignes peuvent contenir "").
 * « Langue + niveau » : `UserLanguage.level` est non nullable, donc une langue enregistrée
 * a toujours un niveau — la présence d'au moins une langue suffit.
 */
function computeMissingProfileFields(user: {
  nationality: string | null;
  countryOfResidence: string | null;
  languages: { language: string }[];
}): string[] {
  const isBlank = (value: string | null) => !value || value.trim().length === 0;

  const missing: string[] = [];
  if (isBlank(user.nationality)) missing.push("nationality");
  if (isBlank(user.countryOfResidence)) missing.push("country_of_residence");
  if (user.languages.length === 0) missing.push("languages");
  return missing;
}

export class UserModel {
  static async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username }, select: USER_SELECT });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: USER_SELECT });
  }

  static async findById(id: number) {
    const user = await prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    return user ? formatUser(user) : null;
  }

  static async findAll() {
    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
    });
    return users.map(formatUser);
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
      select: { ...USER_SELECT, passwordHash: true, emailVerified: true },
    });

    if (!user) return null;

    const isBcrypt =
      user.passwordHash.startsWith("$2a$") || user.passwordHash.startsWith("$2b$");
    let isValid: boolean;

    if (isBcrypt) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } else {
      isValid = password === user.passwordHash;
      if (isValid) {
        const newHash = await bcrypt.hash(password, 10);
        await prisma.user.update({ where: { username }, data: { passwordHash: newHash } });
      }
    }

    if (!isValid) return null;

    const { passwordHash, ...rest } = user;
    return { ...formatUser(rest), emailVerified: rest.emailVerified };
  }

  static async createVerificationCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 8);
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

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

  static async verifyEmail(email: string, code: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        ...USER_SELECT,
        emailVerified: true,
        verificationCode: true,
        verificationCodeExpiry: true,
      },
    });

    if (!user) return { success: false, error: "user not found" };
    if (user.emailVerified) return { success: false, error: "already verified" };
    if (!user.verificationCode) return { success: false, error: "invalid code" };
    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      return { success: false, error: "code expired" };
    }

    const isValid = await bcrypt.compare(code, user.verificationCode);
    if (!isValid) return { success: false, error: "invalid code" };

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

  static async canResendCode(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true, verificationCodeSentAt: true },
    });

    if (!user) return { allowed: false, error: "user not found" };
    if (user.emailVerified) return { allowed: false, error: "already verified" };

    if (user.verificationCodeSentAt) {
      const secondsSinceLast = (Date.now() - user.verificationCodeSentAt.getTime()) / 1000;
      if (secondsSinceLast < 60) return { allowed: false, error: "too many requests" };
    }

    return { allowed: true };
  }

  /**
   * Champs exigés d'un client premium avant son 1er trip (résidence, nationalité, langue + niveau).
   * Les clés renvoyées sont en snake_case, comme le reste de l'API publique.
   * Centralisé ici car la story 3.6 refuse le démarrage d'un trip (422) sur la même règle.
   */
  static async getProfileCompleteness(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        nationality: true,
        countryOfResidence: true,
        languages: { select: { language: true } },
      },
    });

    if (!user) return null;

    const missing = computeMissingProfileFields(user);
    return { complete: missing.length === 0, missing };
  }

  /**
   * Aptitude d'un utilisateur à démarrer un trip premium (story 3.6).
   * Une seule requête : le premium ET la complétude, sur la même règle que
   * `getProfileCompleteness` (via `computeMissingProfileFields`) — pas de 2e définition de « complet ».
   */
  static async getPremiumTripReadiness(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        isPremium: true,
        nationality: true,
        countryOfResidence: true,
        languages: { select: { language: true } },
      },
    });

    if (!user) return null;

    const missing = computeMissingProfileFields(user);
    return { isPremium: user.isPremium, complete: missing.length === 0, missing };
  }

  static async update(id: number, updates: UpdateUserData) {
    const { languages, ...scalar } = updates;

    try {
      if (languages !== undefined) {
        await prisma.userLanguage.deleteMany({ where: { userId: id } });
        if (languages.length > 0) {
          await prisma.userLanguage.createMany({
            data: languages.map((l) => ({ userId: id, language: l.language, level: l.level })),
          });
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: scalar.email,
          firstName: scalar.firstName,
          lastName: scalar.lastName,
          phone: scalar.phone,
          nationality: scalar.nationality,
          countryOfResidence: scalar.countryOfResidence,
          newsletterStudy: scalar.newsletterStudy,
          newsletterTourism: scalar.newsletterTourism,
        },
        select: USER_SELECT,
      });

      return formatUser(user);
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async adminUpdate(
    id: number,
    updates: { email?: string; password?: string; role?: string }
  ) {
    const data: any = {};
    if (updates.email) data.email = updates.email;
    if (updates.role) data.role = updates.role;
    if (updates.password) data.passwordHash = await bcrypt.hash(updates.password, 10);

    try {
      const user = await prisma.user.update({ where: { id }, data, select: USER_SELECT });
      return formatUser(user);
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  /**
   * Story 9.5 : changement de mot de passe self-service. Vérifie l'ancien avant d'écrire le nouveau.
   * Gère les anciens hash non-bcrypt (comparaison directe, comme validatePassword).
   */
  static async changePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: { passwordHash: true } });
    if (!user) return { success: false, error: "user not found" };

    const isBcrypt = user.passwordHash.startsWith("$2a$") || user.passwordHash.startsWith("$2b$");
    const ok = isBcrypt
      ? await bcrypt.compare(oldPassword, user.passwordHash)
      : oldPassword === user.passwordHash;
    if (!ok) return { success: false, error: "invalid current password" };

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id }, data: { passwordHash: newHash } });
    return { success: true };
  }

  /**
   * Story 9.5 : changement d'email self-service. Vérifie le mot de passe, refuse un email déjà pris,
   * pose le nouvel email en `emailVerified=false` et génère un code de re-vérification (renvoyé pour envoi).
   */
  static async changeEmail(id: number, newEmail: string, password: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: { passwordHash: true, email: true } });
    if (!user) return { success: false, error: "user not found" as string };

    const isBcrypt = user.passwordHash.startsWith("$2a$") || user.passwordHash.startsWith("$2b$");
    const ok = isBcrypt
      ? await bcrypt.compare(password, user.passwordHash)
      : password === user.passwordHash;
    if (!ok) return { success: false, error: "invalid password" };

    if (newEmail !== user.email) {
      const taken = await prisma.user.findUnique({ where: { email: newEmail }, select: { id: true } });
      if (taken) return { success: false, error: "email already in use" };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 8);
    await prisma.user.update({
      where: { id },
      data: {
        email: newEmail,
        emailVerified: false,
        verificationCode: hashedCode,
        verificationCodeExpiry: new Date(Date.now() + 15 * 60 * 1000),
        verificationCodeSentAt: new Date(),
      },
    });
    return { success: true, code };
  }

  static async activatePremium(id: number) {
    const user = await prisma.user.update({
      where: { id },
      data: { isPremium: true, premiumSince: new Date() },
      select: USER_SELECT,
    });
    return formatUser(user);
  }
}
