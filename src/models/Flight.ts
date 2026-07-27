import prisma from "../../lib/prisma";

export interface CreateFlightData {
  airline: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  departure: string;
  arrival: string;
  price: string;
  type: string;
  audience?: string;
  duration?: string;
  stops?: number;
  baggage?: string;
  features?: string[];
  image?: string;
  isActive?: boolean;
}

export interface FlightFilters {
  audience?: string;
  fromCountry?: string;
  toCountry?: string;
  type?: string;
}

export class FlightModel {
  // Le public ne voit que les vols actifs ; l'admin passe par findAllAdmin.
  static async findAll(filters: FlightFilters = {}) {
    return prisma.flight.findMany({
      where: {
        isActive: true,
        audience: filters.audience ? { equals: filters.audience, mode: "insensitive" } : undefined,
        fromCountry: filters.fromCountry
          ? { equals: filters.fromCountry, mode: "insensitive" }
          : undefined,
        toCountry: filters.toCountry
          ? { equals: filters.toCountry, mode: "insensitive" }
          : undefined,
        type: filters.type ? { equals: filters.type, mode: "insensitive" } : undefined,
      },
      orderBy: [{ airline: "asc" }, { departure: "asc" }],
    });
  }

  static async findAllAdmin() {
    return prisma.flight.findMany({ orderBy: [{ audience: "asc" }, { airline: "asc" }] });
  }

  static async findById(id: number) {
    return prisma.flight.findUnique({ where: { id } });
  }

  static async create(data: CreateFlightData) {
    return prisma.flight.create({
      data: {
        airline: data.airline,
        fromCountry: data.fromCountry,
        fromCity: data.fromCity,
        toCountry: data.toCountry,
        toCity: data.toCity,
        departure: data.departure,
        arrival: data.arrival,
        price: data.price,
        type: data.type,
        audience: data.audience ?? "general",
        duration: data.duration,
        stops: data.stops ?? 0,
        baggage: data.baggage,
        features: data.features as any,
        image: data.image,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: Partial<CreateFlightData>) {
    try {
      return await prisma.flight.update({
        where: { id },
        data: {
          airline: data.airline,
          fromCountry: data.fromCountry,
          fromCity: data.fromCity,
          toCountry: data.toCountry,
          toCity: data.toCity,
          departure: data.departure,
          arrival: data.arrival,
          price: data.price,
          type: data.type,
          audience: data.audience,
          duration: data.duration,
          stops: data.stops,
          baggage: data.baggage,
          features: data.features as any,
          image: data.image,
          isActive: data.isActive,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") return null;
      throw error;
    }
  }

  static async delete(id: number) {
    try {
      await prisma.flight.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error.code === "P2025") return false;
      throw error;
    }
  }
}
