/**
 * Catalogue de services — SOURCE DE VÉRITÉ partagée par le seed complet
 * (`src/scripts/seed.ts`) et le script d'application ciblée
 * (`src/scripts/apply-service-catalog.ts`).
 *
 * Depuis que le catalogue est administrable (`/admin/services`), ces tableaux ne
 * décrivent que l'état INITIAL : les ajouts faits en admin ne sont jamais purgés.
 */

// Catalogue public : libellés/descriptions/ordre repris à l'identique du front
// (ex-midzoweb/src/data/categories.ts) car `name` et `description` sont affichés
// tels quels par TripForm et TripWizard, et `order` pilote l'ordre d'affichage.
// professional/business restent en base (isPublic=false) mais ne sont plus exposés.
export const categoriesData = [
  {
    id: 'study',
    name: 'Study & Training',
    description: 'Educational opportunities and professional training worldwide',
    icon: '🎓',
    isPublic: true,
    order: 1
  },
  {
    id: 'tourism',
    name: 'Tourism',
    description: 'Curated travel experiences and events worldwide',
    icon: '🌍',
    isPublic: true,
    order: 2
  },
  {
    id: 'orientation',
    name: 'Orientation',
    description: 'Personalized guidance for your international projects',
    icon: '🧭',
    isPublic: true,
    order: 3
  },
  {
    id: 'professional',
    name: 'Professional Training & Job',
    description: 'Career development and job opportunities',
    icon: '💼',
    isPublic: true,
    order: 4
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Business travel and networking',
    icon: '🤝',
    isPublic: false,
    order: 91
  }
];

// Taxonomie catégorie -> sous-catégories (migrée de midzoweb/src/data/categories.ts).
// Chaque service listé côté front devient une sous-catégorie ; `order` fixe l'affichage.
// Chaque catégorie active reçoit une sous-catégorie sentinelle « Autre » (isOther=true).
export const subcategoriesData = [
  // Study
  { categoryId: 'study', name: 'University finder', order: 1, isOther: false },
  { categoryId: 'study', name: 'Document Legalization & Recognition', order: 2, isOther: false },
  { categoryId: 'study', name: 'Student accommodation', order: 3, isOther: false },
  { categoryId: 'study', name: 'Student visa assistance', order: 4, isOther: false },
  { categoryId: 'study', name: 'Bank account', order: 5, isOther: false },
  { categoryId: 'study', name: 'Insurance', order: 6, isOther: false },
  { categoryId: 'study', name: 'Language center', order: 7, isOther: false },
  { categoryId: 'study', name: 'Flight booking', order: 8, isOther: false },
  { categoryId: 'study', name: 'Autre', order: 999, isOther: true },
  // Tourism
  { categoryId: 'tourism', name: 'Events & Spectacles', order: 1, isOther: false },
  { categoryId: 'tourism', name: 'Safari & Africa', order: 2, isOther: false },
  { categoryId: 'tourism', name: 'Sports Tourism', order: 3, isOther: false },
  { categoryId: 'tourism', name: 'Tourist Visa', order: 4, isOther: false },
  { categoryId: 'tourism', name: 'Flights & Stays', order: 5, isOther: false },
  { categoryId: 'tourism', name: 'Tourist accommodation', order: 6, isOther: false },
  { categoryId: 'tourism', name: 'Restaurants', order: 7, isOther: false },
  { categoryId: 'tourism', name: 'Tourist sites', order: 8, isOther: false },
  { categoryId: 'tourism', name: 'Autre', order: 999, isOther: true },
  // Orientation
  { categoryId: 'orientation', name: 'School Orientation', order: 1, isOther: false },
  { categoryId: 'orientation', name: 'Career Orientation', order: 2, isOther: false },
  { categoryId: 'orientation', name: 'Training Orientation', order: 3, isOther: false },
  { categoryId: 'orientation', name: 'Autre', order: 999, isOther: true },
  // Professional (catégorie publique depuis l'ouverture du catalogue pro)
  { categoryId: 'professional', name: 'Professional Training Finder', order: 1, isOther: false },
  { categoryId: 'professional', name: 'Jobs Finder', order: 2, isOther: false },
  { categoryId: 'professional', name: 'Work Visa Assistance', order: 3, isOther: false },
  { categoryId: 'professional', name: 'Professional Document Legalization', order: 4, isOther: false },
  { categoryId: 'professional', name: 'Autre', order: 999, isOther: true }
];

// Catalogue de services — source de vérité, migré de ex-midzoweb/src/data/{categories,services}.ts.
//   `name`        = clé de catalogue (identique à Subcategory.name de la story 1.1 et aux clés
//                   comparées en dur par TripWizard) — NE PAS renommer sans migrer le front.
//   `displayName` = libellé affiché (TripWizard) quand il diffère de la clé.
//   `order`       = ordre d'affichage ; pilote aussi les étapes du TripWizard.
//   `deliveryMode` conservé de la story 1.2 pour les services préexistants.
export const servicesData = [
  // Study services
  { name: 'University finder', displayName: 'University Finder', description: 'Find the perfect university match based on your academic interests, budget, and location preferences.', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/university-finder', translationKey: 'study.universityFinder', deliveryMode: 'online', order: 1, categoryId: 'study' },
  { name: 'Document Legalization & Recognition', displayName: 'Document Legalization & Recognition', description: 'Complete support for document legalization and recognition of your qualifications internationally.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/document-legalization', translationKey: 'study.documentLegalization', deliveryMode: 'hybrid', order: 2, categoryId: 'study' },
  { name: 'Student accommodation', displayName: 'Student Accommodation', description: 'Find safe and comfortable housing options near your university, from dormitories to shared apartments.', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/student-accommodation', translationKey: 'study.studentAccommodation', deliveryMode: 'physical', order: 3, categoryId: 'study' },
  { name: 'Student visa assistance', displayName: 'Student Visa Assistance', description: 'Complete support throughout your student visa application process, from documentation to interview preparation.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/student-visa', translationKey: 'study.studentVisa', deliveryMode: 'hybrid', order: 4, categoryId: 'study' },
  { name: 'Bank account', displayName: 'Bank Account Setup', description: 'Assistance in opening a student bank account in your destination country.', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/bank-account', translationKey: 'study.bankAccount', deliveryMode: 'hybrid', order: 5, categoryId: 'study' },
  { name: 'Insurance', displayName: 'Insurance', description: 'Comprehensive insurance coverage tailored for students studying abroad.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/insurance', translationKey: 'study.insurance', deliveryMode: 'online', order: 6, categoryId: 'study' },
  { name: 'Language center', displayName: 'Language Center', description: 'Quality language courses and certification programs to enhance your language skills for academic success.', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/language-center', translationKey: 'study.languageCenter', deliveryMode: 'physical', order: 7, categoryId: 'study' },
  { name: 'Flight booking', displayName: 'Flight Booking', description: 'Book your flights with special student rates and flexible options for international travel.', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/flights', translationKey: 'study.flightBooking', deliveryMode: 'online', order: 8, categoryId: 'study' },

  // Tourism services
  { name: 'Events & Spectacles', displayName: 'Events & Spectacles', description: 'Live the biggest global events: World Cup 2026, AFCON, Olympic Games. Complete packages: transport, accommodation, tickets.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/tourism-events', translationKey: 'tourism.events', deliveryMode: 'physical', order: 1, categoryId: 'tourism' },
  { name: 'Safari & Africa', displayName: 'Safari & Africa Discovery', description: 'Unique experiences in the heart of Africa. Lesotho, Botswana, and destinations we master — curated for an authentic experience.', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/tourism-safari', translationKey: 'tourism.safari', deliveryMode: 'physical', order: 2, categoryId: 'tourism' },
  { name: 'Sports Tourism', displayName: 'Sports Tourism', description: 'Travel built around your passion for sport. Marathons, tournaments, sporting events — we organize your entire trip.', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/tourism-sports', translationKey: 'tourism.sports', deliveryMode: 'physical', order: 3, categoryId: 'tourism' },
  { name: 'Tourist Visa', displayName: 'Tourist Visa Assistance', description: 'Streamlined tourist visa application support for hassle-free international travel.', image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/tourist-visa', translationKey: 'tourism.touristVisa', deliveryMode: 'hybrid', order: 4, categoryId: 'tourism' },
  { name: 'Flights & Stays', displayName: 'Flights & Stays — Partner Platforms', description: 'For standard flight + hotel packages, we redirect you to our trusted partner platforms: Booking.com, Expedia, Skyscanner.', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/tourism-partners', translationKey: 'tourism.flightsStays', deliveryMode: 'online', isExternal: true, order: 5, categoryId: 'tourism' },
  { name: 'Tourist accommodation', displayName: 'Tourist Accommodation', description: 'Hotels, guesthouses and apartments selected in our destination countries, with prices and contacts.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/accommodation', translationKey: 'tourism.accommodation', deliveryMode: 'physical', order: 6, categoryId: 'tourism' },
  { name: 'Restaurants', displayName: 'Restaurants', description: 'Curated addresses by city and cuisine, from local specialities to halal and vegetarian options.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/restaurants', translationKey: 'tourism.restaurants', deliveryMode: 'physical', order: 7, categoryId: 'tourism' },
  { name: 'Tourist sites', displayName: 'Tourist Sites', description: 'Must-see sites, museums and natural parks with opening hours, entry fees and access details.', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/tourist-sites', translationKey: 'tourism.touristSites', deliveryMode: 'physical', order: 8, categoryId: 'tourism' },

  // Orientation services
  { name: 'School Orientation', displayName: 'School Orientation', description: 'Personalized guidance to choose the right school, country, and program for your education abroad.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/orientation-study', translationKey: 'orientation.school', deliveryMode: 'online', steps: ['Profile assessment (academic background, goals, budget)', 'Country & school recommendation', 'Program selection & eligibility check', 'Application timeline & checklist', 'Visa, accommodation & pre-departure briefing', 'Premium: in-person or virtual session with a specialist'], order: 1, categoryId: 'orientation' },
  { name: 'Career Orientation', displayName: 'Career Orientation', description: 'Define your professional path with our career advisors. International job market insights, skills assessment and career planning.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/orientation-career', translationKey: 'orientation.career', deliveryMode: 'online', steps: ['Skills & experience assessment', 'International job market mapping', 'CV & LinkedIn international formatting', 'Target country & sector recommendation', 'Work visa guidance', 'Introduction to relevant professional networks'], order: 2, categoryId: 'orientation' },
  { name: 'Training Orientation', displayName: 'Training Orientation', description: 'Find the right professional training program, certification, or vocational course abroad matching your career goals.', image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/orientation-training', translationKey: 'orientation.training', deliveryMode: 'online', steps: ['Training needs assessment', 'International training program search', 'Certification & accreditation verification', 'Country & institution recommendation', 'Visa & accommodation support', 'Premium: dedicated advisor for full program setup'], order: 3, categoryId: 'orientation' },

  // Professional services (catégorie non publique — conservée pour l'admin)
  { name: 'Professional Training Finder', displayName: 'Professional Training Finder', description: 'Access curated professional development courses and certification programs.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', learnMoreLink: '/services/training-finder', translationKey: 'professional.trainingFinder', deliveryMode: 'online', order: 1, categoryId: 'professional' },
  { name: 'Jobs Finder', displayName: 'Jobs Finder', description: 'Connect with international employers and find career opportunities.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', learnMoreLink: '/services/jobs-finder', translationKey: 'professional.jobsFinder', deliveryMode: 'online', order: 2, categoryId: 'professional' },
  { name: 'Work Visa Assistance', displayName: 'Work Visa Assistance', description: 'Expert guidance through work permit and visa applications.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', learnMoreLink: '/services/work-visa', translationKey: 'professional.workVisa', deliveryMode: 'hybrid', order: 3, categoryId: 'professional' },
  { name: 'Professional Document Legalization', displayName: 'Professional Document Legalization', description: 'Legalization, apostille and sworn translation of your professional records, diplomas and work certificates.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', learnMoreLink: '/services/document-pro-legalization', translationKey: 'professional.documentLegalization', deliveryMode: 'hybrid', order: 4, categoryId: 'professional' },

  // Business services (catégorie non publique — conservée pour l'admin)
  { name: 'Business Networking Events', displayName: 'Business Networking Events', description: 'Participate in curated business events to expand your network.', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865', learnMoreLink: '/services/networking-events', translationKey: 'business.networkingEvents', deliveryMode: 'physical', order: 1, categoryId: 'business' },
  { name: 'Corporate Accommodation', displayName: 'Corporate Accommodation', description: 'Premium accommodation solutions for business travelers.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', learnMoreLink: '/services/corporate-accommodation', translationKey: 'business.corporateAccommodation', deliveryMode: 'physical', order: 2, categoryId: 'business' },
  { name: 'Business Visa Assistance', displayName: 'Business Visa Assistance', description: 'Expert support for business visa applications.', image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f', learnMoreLink: '/services/business-visa', translationKey: 'business.businessVisa', deliveryMode: 'hybrid', order: 3, categoryId: 'business' }
];
