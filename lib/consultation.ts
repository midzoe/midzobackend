import prisma from "@/lib/prisma";
import { AppSettingModel } from "@/src/models/AppSetting";

/**
 * Consultation (25 €) : disponibilités et réservation des créneaux.
 *
 * Les horaires sont saisis en HEURE D'ALLEMAGNE (Europe/Berlin : GMT+1 l'hiver, GMT+2 l'été) et
 * modifiables par l'admin (réglage `consultation.availability`). Le site les affiche à l'heure
 * du client ; le serveur ne manipule que des instants UTC.
 *
 * 🚨 Un créneau ne peut être payé qu'une fois : la réservation se fait sous verrou Postgres
 * (aucun chevauchement avec un rendez-vous confirmé ou en cours de paiement) et `slot_start`
 * est unique en base. Changer les horaires ne touche pas aux rendez-vous déjà pris.
 */

export interface Availability {
  timezone: string;
  slotMinutes: number;
  leadHours: number;
  horizonDays: number;
  /** Jour de la semaine (0 = dimanche) → plages « HH:MM »–« HH:MM ». */
  weekly: Record<string, [string, string][]>;
  /** Jours fermés « AAAA-MM-JJ » (jours fériés, congés). */
  closedDates: string[];
}

export const AVAILABILITY_KEY = "consultation.availability";

export const DEFAULT_AVAILABILITY: Availability = {
  timezone: "Europe/Berlin",
  slotMinutes: 60,
  leadHours: 12,
  horizonDays: 21,
  weekly: {
    "0": [["17:00", "21:00"]],
    "1": [["18:00", "21:00"]], "2": [["18:00", "21:00"]], "3": [["18:00", "21:00"]],
    "4": [["18:00", "21:00"]], "5": [["18:00", "21:00"]],
    "6": [["08:00", "20:00"]],
  },
  closedDates: [],
};

/** Paiement Stripe : la session expire après 31 min, le créneau reste bloqué 40 min. */
export const HOLD_MINUTES = 40;
export const CHECKOUT_EXPIRY_MINUTES = 31;

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/;
const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Disponibilités valides, ou message d'erreur lisible. */
export function validateAvailability(raw: any): Availability | string {
  if (!raw || typeof raw !== "object") return "disponibilités manquantes";
  const timezone = typeof raw.timezone === "string" ? raw.timezone : DEFAULT_AVAILABILITY.timezone;
  try { new Intl.DateTimeFormat("en", { timeZone: timezone }); } catch { return `fuseau inconnu : ${timezone}`; }
  const slotMinutes = Number(raw.slotMinutes);
  if (![15, 20, 30, 45, 60, 90, 120].includes(slotMinutes)) return "durée de créneau invalide";
  const leadHours = Number(raw.leadHours);
  if (!Number.isInteger(leadHours) || leadHours < 0 || leadHours > 168) return "délai de prévenance invalide (0 à 168 h)";
  const horizonDays = Number(raw.horizonDays);
  if (!Number.isInteger(horizonDays) || horizonDays < 1 || horizonDays > 120) return "horizon invalide (1 à 120 jours)";
  const weekly: Availability["weekly"] = {};
  for (let d = 0; d < 7; d++) {
    const ranges = Array.isArray(raw.weekly?.[d]) ? raw.weekly[d] : [];
    for (const r of ranges) {
      if (!Array.isArray(r) || !HHMM.test(r[0]) || !HHMM.test(r[1]) || toMinutes(r[0]) >= toMinutes(r[1])) {
        return `plage horaire invalide (jour ${d}) : ${JSON.stringify(r)}`;
      }
    }
    weekly[String(d)] = ranges.map((r: string[]) => [r[0], r[1]] as [string, string]);
  }
  const closedDates = Array.isArray(raw.closedDates)
    ? [...new Set<string>(raw.closedDates.filter((x: unknown) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x)))].sort()
    : [];
  return { timezone, slotMinutes, leadHours, horizonDays, weekly, closedDates };
}

export async function loadAvailability(): Promise<Availability> {
  const raw = await AppSettingModel.get(AVAILABILITY_KEY);
  try {
    const parsed = validateAvailability(JSON.parse(raw ?? ""));
    return typeof parsed === "string" ? DEFAULT_AVAILABILITY : parsed;
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}

// ── Fuseaux horaires sans dépendance ─────────────────────────────────────────

/** Date et heure murale d'un instant dans un fuseau. */
function wallClock(utcMs: number, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short",
    }).formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]),
  );
  return {
    y: Number(parts.year), m: Number(parts.month), d: Number(parts.day),
    hour: Number(parts.hour), minute: Number(parts.minute), second: Number(parts.second),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday),
  };
}

function offsetMs(utcMs: number, timeZone: string) {
  const w = wallClock(utcMs, timeZone);
  return Date.UTC(w.y, w.m - 1, w.d, w.hour, w.minute, w.second) - Math.floor(utcMs / 1000) * 1000;
}

/** Instant UTC d'une heure murale (jour + minutes depuis minuit) dans un fuseau, heure d'été comprise. */
function zonedToUtc(y: number, m: number, d: number, minutes: number, timeZone: string) {
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  const first = guess - offsetMs(guess, timeZone);
  return guess - offsetMs(first, timeZone);
}

// ── Créneaux ─────────────────────────────────────────────────────────────────

export interface Slot { start: string; end: string }

/** Créneaux ouverts entre maintenant (+ délai de prévenance) et l'horizon. */
export function generateSlots(av: Availability, now = new Date()): Slot[] {
  const earliest = now.getTime() + av.leadHours * 3600_000;
  const today = wallClock(now.getTime(), av.timezone);
  const closed = new Set(av.closedDates);
  const slots: Slot[] = [];
  for (let i = 0; i <= av.horizonDays; i++) {
    const day = new Date(Date.UTC(today.y, today.m - 1, today.d + i));
    const [y, m, d] = [day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate()];
    const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (closed.has(iso)) continue;
    for (const [from, to] of av.weekly[String(day.getUTCDay())] ?? []) {
      for (let t = toMinutes(from); t + av.slotMinutes <= toMinutes(to); t += av.slotMinutes) {
        const start = zonedToUtc(y, m, d, t, av.timezone);
        if (start >= earliest) slots.push({ start: new Date(start).toISOString(), end: new Date(start + av.slotMinutes * 60_000).toISOString() });
      }
    }
  }
  return slots;
}

/** Rendez-vous qui bloquent un créneau : confirmés, ou paiement en cours non expiré. */
export async function activeBookings(from: Date, to: Date, db: any = prisma) {
  return db.consultationBooking.findMany({
    where: {
      slotStart: { gte: new Date(from.getTime() - 24 * 3600_000), lt: to },
      OR: [{ status: "confirmed" }, { status: "held", holdUntil: { gt: new Date() } }],
    },
    select: { slotStart: true, durationMinutes: true },
  }) as Promise<{ slotStart: Date; durationMinutes: number }[]>;
}

const overlaps = (start: number, end: number, b: { slotStart: Date; durationMinutes: number }) =>
  b.slotStart.getTime() < end && b.slotStart.getTime() + b.durationMinutes * 60_000 > start;

/** Créneaux avec leur disponibilité (un rendez-vous déjà pris les grise, même si les horaires ont changé). */
export async function slotsWithAvailability(av: Availability) {
  const slots = generateSlots(av);
  if (!slots.length) return [];
  const booked = await activeBookings(new Date(slots[0].start), new Date(slots[slots.length - 1].end));
  return slots.map((s) => ({
    ...s,
    available: !booked.some((b) => overlaps(Date.parse(s.start), Date.parse(s.end), b)),
  }));
}

export class SlotUnavailableError extends Error {}

/**
 * Réserve un créneau ET crée l'achat dans la même transaction, sous verrou : deux paiements
 * simultanés sur le même créneau sont impossibles (le second reçoit SlotUnavailableError).
 */
export async function bookSlot<T extends { id: number }>(params: {
  slotStart: string;
  userId: number;
  clientTimezone?: string | null;
  createPurchase: (tx: any) => Promise<T>;
}): Promise<T> {
  const av = await loadAvailability();
  const slot = generateSlots(av).find((s) => s.start === new Date(params.slotStart).toISOString());
  if (!slot) throw new SlotUnavailableError("slot not offered");
  const start = Date.parse(slot.start);
  const end = Date.parse(slot.end);
  return prisma.$transaction(async (tx: any) => {
    // Verrou de transaction : les réservations de consultation passent une par une.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(424242)::text`;
    await tx.consultationBooking.deleteMany({ where: { status: "held", holdUntil: { lt: new Date() } } });
    const booked = await activeBookings(new Date(start), new Date(end), tx);
    if (booked.some((b) => overlaps(start, end, b))) throw new SlotUnavailableError("slot taken");
    const purchase = await params.createPurchase(tx);
    await tx.consultationBooking.create({
      data: {
        slotStart: new Date(start),
        durationMinutes: av.slotMinutes,
        userId: params.userId,
        purchaseId: purchase.id,
        status: "held",
        holdUntil: new Date(Date.now() + HOLD_MINUTES * 60_000),
        clientTimezone: params.clientTimezone ?? null,
      },
    });
    return purchase;
  }, { timeout: 15000 });
}

/** Paiement reçu : le créneau est acquis (plus d'expiration). */
export async function confirmBooking(purchaseId: number) {
  await prisma.consultationBooking.updateMany({ where: { purchaseId }, data: { status: "confirmed", holdUntil: null } });
}

export function isTimeZone(tz: unknown): tz is string {
  if (typeof tz !== "string" || tz.length > 64) return false;
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); return true; } catch { return false; }
}

/**
 * « samedi 8 novembre 2026 à 18:00, heure d'Allemagne (17:00 à Douala) » — pour les emails
 * et le récapitulatif admin.
 */
export function slotLabel(iso: string, av: Pick<Availability, "timezone"> = DEFAULT_AVAILABILITY, clientTz?: string | null): string {
  const at = new Date(iso);
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: av.timezone }).format(at);
  const time = (tz: string) => new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(at);
  const zone = av.timezone === "Europe/Berlin" ? "heure d'Allemagne" : av.timezone;
  const client = clientTz && isTimeZone(clientTz) && time(clientTz) !== time(av.timezone)
    ? ` (${time(clientTz)} à ${clientTz.split("/").pop()!.replace(/_/g, " ")})`
    : "";
  return `${date} à ${time(av.timezone)}, ${zone}${client}`;
}
