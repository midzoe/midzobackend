import { toBool, toInt, toList, toNumber, toText } from "@/lib/directory-input";

/**
 * Un parser par entité « annuaire » : transforme le corps de requête admin en
 * payload de modèle. C'est le seul endroit qui connaît la forme d'un champ (texte,
 * liste, nombre, booléen) — les routes se contentent de le brancher.
 *
 * Les clés absentes du corps ressortent en `undefined`, ce que Prisma traduit par
 * « ne pas toucher à cette colonne » : une modification partielle reste possible.
 *
 * Vit hors des route files : Next n'autorise que les handlers HTTP en export d'une route.
 */

export const parseFlight = (b: any) => ({
  airline: toText(b.airline),
  fromCountry: toText(b.fromCountry ?? b.from_country),
  fromCity: toText(b.fromCity ?? b.from_city),
  toCountry: toText(b.toCountry ?? b.to_country),
  toCity: toText(b.toCity ?? b.to_city),
  departure: toText(b.departure),
  arrival: toText(b.arrival),
  price: toText(b.price),
  type: toText(b.type),
  audience: toText(b.audience),
  duration: toText(b.duration),
  stops: toInt(b.stops),
  baggage: toText(b.baggage),
  features: toList(b.features),
  image: toText(b.image),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseInsurancePlan = (b: any) => ({
  provider: toText(b.provider),
  country: toText(b.country),
  audience: toText(b.audience),
  coverageTypes: toList(b.coverageTypes ?? b.coverage_types),
  benefits: toList(b.benefits),
  insuranceTypes: toList(b.insuranceTypes ?? b.insurance_types),
  monthlyPremium: toText(b.monthlyPremium ?? b.monthly_premium),
  coverage: toText(b.coverage),
  rating: toNumber(b.rating),
  reviews: toInt(b.reviews),
  image: toText(b.image),
  description: toText(b.description),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseBank = (b: any) => ({
  name: toText(b.name),
  country: toText(b.country),
  image: toText(b.image),
  description: toText(b.description),
  isActive: toBool(b.isActive ?? b.is_active),
  // Les comptes ne sont éditables qu'en JSON (le CRUD générique n'a pas de sous-formulaire) :
  // absent => on ne touche pas aux comptes existants.
  accountTypes: Array.isArray(b.accountTypes ?? b.account_types)
    ? (b.accountTypes ?? b.account_types).map((a: any) => ({
        name: toText(a.name) ?? "",
        features: toList(a.features),
        monthlyFee: toText(a.monthlyFee ?? a.monthly_fee),
        requirements: toList(a.requirements),
        minimumDeposit: toText(a.minimumDeposit ?? a.minimum_deposit),
        cardType: toText(a.cardType ?? a.card_type),
        withdrawalLimit: toText(a.withdrawalLimit ?? a.withdrawal_limit),
        onlineBanking: toBool(a.onlineBanking ?? a.online_banking),
        studentPerks: toList(a.studentPerks ?? a.student_perks),
      }))
    : undefined,
});

export const parseTouristSite = (b: any) => ({
  name: toText(b.name),
  country: toText(b.country),
  city: toText(b.city),
  location: toText(b.location),
  category: toText(b.category),
  description: toText(b.description),
  rating: toNumber(b.rating),
  reviews: toInt(b.reviews),
  price: toText(b.price),
  features: toList(b.features),
  image: toText(b.image),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseRestaurant = (b: any) => ({
  name: toText(b.name),
  country: toText(b.country),
  city: toText(b.city),
  location: toText(b.location),
  cuisine: toText(b.cuisine),
  priceRange: toText(b.priceRange ?? b.price_range),
  rating: toNumber(b.rating),
  reviews: toInt(b.reviews),
  features: toList(b.features),
  image: toText(b.image),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseTourismAccommodation = (b: any) => ({
  name: toText(b.name),
  country: toText(b.country),
  city: toText(b.city),
  type: toText(b.type),
  priceRange: toText(b.priceRange ?? b.price_range),
  amenities: toList(b.amenities),
  rating: toNumber(b.rating),
  reviews: toInt(b.reviews),
  description: toText(b.description),
  image: toText(b.image),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseJob = (b: any) => ({
  title: toText(b.title),
  company: toText(b.company),
  country: toText(b.country),
  city: toText(b.city),
  location: toText(b.location),
  type: toText(b.type),
  salary: toText(b.salary),
  experience: toText(b.experience),
  description: toText(b.description),
  requirements: toList(b.requirements),
  benefits: toList(b.benefits),
  applyUrl: toText(b.applyUrl ?? b.apply_url),
  image: toText(b.image),
  postedAt: toText(b.postedAt ?? b.posted_at),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseTraining = (b: any) => ({
  provider: toText(b.provider),
  country: toText(b.country),
  city: toText(b.city),
  course: toText(b.course),
  duration: toText(b.duration),
  price: toText(b.price),
  certification: toText(b.certification),
  category: toText(b.category),
  rating: toNumber(b.rating),
  reviews: toInt(b.reviews),
  features: toList(b.features),
  image: toText(b.image),
  description: toText(b.description),
  link: toText(b.link),
  isActive: toBool(b.isActive ?? b.is_active),
});

export const parseServiceProvider = (b: any) => ({
  provider: toText(b.provider),
  country: toText(b.country),
  serviceType: toText(b.serviceType ?? b.service_type),
  services: toList(b.services),
  visaTypes: toList(b.visaTypes ?? b.visa_types),
  acceptedDegrees: toList(b.acceptedDegrees ?? b.accepted_degrees),
  documentTypes: toList(b.documentTypes ?? b.document_types),
  processingTime: toText(b.processingTime ?? b.processing_time),
  price: toText(b.price),
  requirements: toList(b.requirements),
  features: toList(b.features),
  successRate: toText(b.successRate ?? b.success_rate),
  rating: toNumber(b.rating),
  link: toText(b.link),
  isActive: toBool(b.isActive ?? b.is_active),
});
