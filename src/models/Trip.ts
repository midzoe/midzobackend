import prisma from "../../lib/prisma";

export interface CreateTripDestinationInput {
  country: string;
  city?: string;
  arrivalDate?: string | Date;
  departureDate?: string | Date;
  order?: number;
}

export interface CreateTripInput {
  title: string;
  status?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  destinations?: CreateTripDestinationInput[];
}

const FULL_INCLUDE = {
  destinations: { orderBy: { order: "asc" as const } },
  services: { orderBy: { createdAt: "asc" as const } },
  checklistItems: { orderBy: { order: "asc" as const } },
};

export class TripModel {
  // 7.1 — création d'un trip (avec 1..n destinations) rattaché à l'utilisateur.
  static async create(userId: number, data: CreateTripInput) {
    return prisma.trip.create({
      data: {
        userId,
        title: data.title,
        status: data.status ?? "planning",
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        destinations: data.destinations && data.destinations.length
          ? {
              create: data.destinations.map((d, i) => ({
                country: d.country,
                city: d.city,
                arrivalDate: d.arrivalDate ? new Date(d.arrivalDate) : undefined,
                departureDate: d.departureDate ? new Date(d.departureDate) : undefined,
                order: d.order ?? i,
              })),
            }
          : undefined,
      },
      include: FULL_INCLUDE,
    });
  }

  static async findByUser(userId: number) {
    return prisma.trip.findMany({
      where: { userId },
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: { destinations: { orderBy: { order: "asc" } } },
    });
  }

  // 7.6 — historique : trips terminés (status completed OU date de fin passée).
  static async findHistory(userId: number) {
    const now = new Date();
    return prisma.trip.findMany({
      where: { userId, OR: [{ status: "completed" }, { endDate: { lt: now } }] },
      orderBy: { endDate: "desc" },
      include: { destinations: { orderBy: { order: "asc" } } },
    });
  }

  // Prochain départ : trip futur non terminé, le plus proche.
  static async findNextDeparture(userId: number) {
    const now = new Date();
    return prisma.trip.findFirst({
      where: { userId, status: { not: "completed" }, startDate: { gte: now } },
      orderBy: { startDate: "asc" },
      include: { destinations: { orderBy: { order: "asc" } } },
    });
  }

  static async findByIdForUser(id: number, userId: number) {
    const trip = await prisma.trip.findUnique({ where: { id }, include: FULL_INCLUDE });
    if (!trip || trip.userId !== userId) return null;
    return trip;
  }

  static async update(id: number, userId: number, data: Partial<CreateTripInput>) {
    const owned = await prisma.trip.findUnique({ where: { id } });
    if (!owned || owned.userId !== userId) return null;
    return prisma.trip.update({
      where: { id },
      data: {
        title: data.title,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: FULL_INCLUDE,
    });
  }

  static async delete(id: number, userId: number) {
    const owned = await prisma.trip.findUnique({ where: { id } });
    if (!owned || owned.userId !== userId) return false;
    await prisma.trip.delete({ where: { id } });
    return true;
  }

  // 7.2/7.3 — rattacher un service (vol, logement, visa, assurance…) à un trip / une destination.
  static async addService(
    tripId: number,
    userId: number,
    data: { destinationId?: number; type: string; label: string; status?: string; data?: unknown }
  ) {
    const owned = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!owned || owned.userId !== userId) return null;
    return prisma.tripService.create({
      data: {
        tripId,
        destinationId: data.destinationId ?? null,
        type: data.type,
        label: data.label,
        status: data.status ?? "pending",
        data: data.data as any,
      },
    });
  }

  static async updateService(
    serviceId: number,
    userId: number,
    data: { status?: string; label?: string; data?: unknown }
  ) {
    const svc = await prisma.tripService.findUnique({ where: { id: serviceId }, include: { trip: true } });
    if (!svc || svc.trip.userId !== userId) return null;
    return prisma.tripService.update({
      where: { id: serviceId },
      data: { status: data.status, label: data.label, data: data.data as any },
    });
  }

  // 7.4 — checklist.
  static async addChecklistItem(
    tripId: number,
    userId: number,
    data: { label: string; category?: string; order?: number }
  ) {
    const owned = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!owned || owned.userId !== userId) return null;
    return prisma.tripChecklistItem.create({
      data: { tripId, label: data.label, category: data.category, order: data.order ?? 0 },
    });
  }

  static async updateChecklistItem(
    itemId: number,
    userId: number,
    data: { isDone?: boolean; label?: string }
  ) {
    const item = await prisma.tripChecklistItem.findUnique({ where: { id: itemId }, include: { trip: true } });
    if (!item || item.trip.userId !== userId) return null;
    return prisma.tripChecklistItem.update({
      where: { id: itemId },
      data: { isDone: data.isDone, label: data.label },
    });
  }

  // 7.4 — état « prêt avant le départ » : dérivé des services + checklist.
  static async readiness(tripId: number, userId: number) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { services: true, checklistItems: true },
    });
    if (!trip || trip.userId !== userId) return null;

    const pendingServices = trip.services.filter((s) => s.status !== "done");
    const pendingItems = trip.checklistItems.filter((i) => !i.isDone);
    const missing = [
      ...pendingServices.map((s) => ({ kind: "service", label: s.label })),
      ...pendingItems.map((i) => ({ kind: "checklist", label: i.label })),
    ];
    const total = trip.services.length + trip.checklistItems.length;
    const done = total - missing.length;
    return {
      ready: missing.length === 0 && total > 0,
      done,
      total,
      missing,
    };
  }

  // 7.6 — fil d'activités récentes : derniers services ajoutés/complétés + trips créés.
  static async recentActivities(userId: number, limit = 15) {
    const services = await prisma.tripService.findMany({
      where: { trip: { userId } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { trip: { select: { id: true, title: true } } },
    });
    return services.map((s) => ({
      type: "service_added",
      tripId: s.tripId,
      tripTitle: s.trip.title,
      label: s.label,
      serviceType: s.type,
      status: s.status,
      at: s.createdAt,
    }));
  }

  // 7.5 — trips dont le départ approche et sans rappel récent (idempotence via lastReminderAt).
  static async findNeedingReminder(withinDays = 7) {
    const now = new Date();
    const limit = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);
    return prisma.trip.findMany({
      where: {
        status: { not: "completed" },
        startDate: { gte: now, lte: limit },
        OR: [{ lastReminderAt: null }, { lastReminderAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } }],
      },
      include: {
        services: true,
        checklistItems: true,
        user: { select: { id: true, email: true, firstName: true } },
      },
    });
  }

  static async markReminderSent(tripId: number) {
    return prisma.trip.update({ where: { id: tripId }, data: { lastReminderAt: new Date() } });
  }
}
