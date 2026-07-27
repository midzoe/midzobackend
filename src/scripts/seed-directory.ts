import { PrismaClient } from '@prisma/client';

/**
 * Seed des tables « annuaire » (vols, assurances, banques, sites, restaurants,
 * hébergements tourisme, jobs, formations, démarches administratives).
 *
 * Ces contenus étaient auparavant des constantes `mock*` codées dans les composants
 * React : ils sont repris ici à l'identique pour que le passage à la base ne fasse
 * disparaître aucune fiche déjà visible sur le site.
 *
 * Idempotent : chaque fiche est retrouvée par sa clé naturelle (prestataire + pays,
 * nom + ville, …) puis mise à jour. Relancer le script ne crée pas de doublon et ne
 * supprime rien de ce que l'admin a ajouté entre-temps.
 */

const prisma = new PrismaClient();

/** upsert sur une clé naturelle, faute d'index unique sur ces tables. */
async function upsertBy<T>(
  model: { findFirst: (a: any) => Promise<T | null>; create: (a: any) => Promise<T>; update: (a: any) => Promise<T> },
  where: Record<string, unknown>,
  data: Record<string, unknown>
) {
  const existing = (await model.findFirst({ where })) as any;
  if (existing) return model.update({ where: { id: existing.id }, data });
  return model.create({ data });
}

const flights = [
  { airline: 'British Airways', fromCountry: 'United Kingdom', fromCity: 'London', toCountry: 'United States', toCity: 'New York', departure: '10:00 AM', arrival: '1:30 PM', price: '$450', type: 'Economy', audience: 'general', duration: '7h 30m', stops: 0, baggage: '2x23kg', features: ['Meals', 'Entertainment', 'WiFi'], image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { airline: 'Lufthansa', fromCountry: 'Germany', fromCity: 'Berlin', toCountry: 'France', toCity: 'Paris', departure: '2:00 PM', arrival: '3:30 PM', price: '$150', type: 'Business', audience: 'general', duration: '1h 30m', stops: 0, baggage: '2x32kg', features: ['Lounge Access', 'Priority Boarding', 'Gourmet Meals'], image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { airline: 'Air France', fromCountry: 'France', fromCity: 'Paris', toCountry: 'Italy', toCity: 'Rome', departure: '9:00 AM', arrival: '11:00 AM', price: '$180', type: 'Economy Premium', audience: 'general', duration: '2h', stops: 0, baggage: '2x23kg', features: ['Extra Legroom', 'Priority Check-in', 'Meals'], image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { airline: 'Student Airways', fromCountry: 'United States', fromCity: 'New York', toCountry: 'United Kingdom', toCity: 'London', departure: '10:00 AM', arrival: '10:00 PM', price: '$450', type: 'Student Special', audience: 'student', duration: '7h', stops: 0, baggage: '2x23kg', features: ['Student Discount', 'Extra Baggage'], image: null },
  { airline: 'EuroStudent', fromCountry: 'United Kingdom', fromCity: 'London', toCountry: 'Germany', toCity: 'Berlin', departure: '2:00 PM', arrival: '5:00 PM', price: '$150', type: 'Student Flex', audience: 'student', duration: '3h', stops: 0, baggage: '1x23kg', features: ['Free Date Change', 'Student Discount'], image: null },
  { airline: 'Academic Air', fromCountry: 'France', fromCity: 'Paris', toCountry: 'Italy', toCity: 'Rome', departure: '9:00 AM', arrival: '11:00 AM', price: '$180', type: 'Student Basic', audience: 'student', duration: '2h', stops: 0, baggage: '1x23kg', features: ['Student Discount'], image: null },
];

const insurancePlans = [
  // Page Assurances (grand public)
  { provider: 'Global Care Plus', country: 'United Kingdom', audience: 'general', coverageTypes: ['Medical', 'Dental', 'Vision', 'Prescription Drugs'], benefits: ['24/7 Support', 'Direct Billing', 'Online Claims', 'Worldwide Coverage', 'Emergency Evacuation'], monthlyPremium: '£30', coverage: 'Up to £2,000,000', insuranceTypes: ['Health Insurance', 'Travel Medical Insurance'], rating: 4.8, reviews: 1250, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Comprehensive health and travel medical insurance with worldwide coverage.' },
  { provider: 'Professional Shield', country: 'Germany', audience: 'general', coverageTypes: ['Professional Liability', 'Errors & Omissions', 'Cyber Liability', 'Business Property'], benefits: ['Legal Defense Coverage', 'Professional Indemnity', 'Data Breach Protection', 'Business Interruption', 'Equipment Coverage'], monthlyPremium: '€100', coverage: 'Up to €5,000,000', insuranceTypes: ['Professional Liability Insurance', 'Business Insurance'], rating: 4.9, reviews: 850, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Comprehensive professional and business liability coverage.' },
  { provider: 'Travel Guard Elite', country: 'France', audience: 'general', coverageTypes: ['Trip Cancellation', 'Lost Baggage', 'Emergency Medical', 'Travel Delay'], benefits: ['Trip Cancellation/Interruption', 'Emergency Medical Coverage', 'Baggage Protection', 'Flight Accident', '24/7 Travel Assistance'], monthlyPremium: '€40', coverage: 'Up to €3,000,000', insuranceTypes: ['Travel Insurance', 'Travel Medical Insurance'], rating: 4.7, reviews: 2100, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Comprehensive travel insurance with emergency medical coverage.' },
  { provider: 'Life & Income Protect', country: 'United Kingdom', audience: 'general', coverageTypes: ['Life', 'Critical Illness', 'Income Protection', 'Disability'], benefits: ['Death Benefit', 'Critical Illness Coverage', 'Monthly Income Replacement', 'Permanent Disability Benefit', 'Family Support'], monthlyPremium: '£85', coverage: 'Up to £1,000,000', insuranceTypes: ['Life Insurance', 'Income Protection Insurance'], rating: 4.8, reviews: 920, image: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Comprehensive life and income protection coverage.' },
  { provider: 'Property Shield Plus', country: 'Germany', audience: 'general', coverageTypes: ['Building', 'Contents', 'Personal Liability', 'Natural Disasters'], benefits: ['Building Coverage', 'Contents Protection', 'Liability Coverage', 'Natural Disaster Protection', 'Emergency Repairs'], monthlyPremium: '€75', coverage: 'Up to €2,500,000', insuranceTypes: ['Property Insurance', 'Home Insurance', 'Renters Insurance'], rating: 4.6, reviews: 1580, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Complete property protection for homeowners and renters.' },

  // Espace études
  { provider: 'UK Student Care', country: 'United Kingdom', audience: 'student', coverageTypes: ['Health', 'Accident', 'Liability'], benefits: ['24/7 Support', 'Direct Billing', 'Online Claims'], monthlyPremium: '£30', coverage: 'Up to £2,000,000', insuranceTypes: ['Student Health Insurance'], rating: null, reviews: null, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'Comprehensive student insurance coverage with excellent support services and quick claims processing.' },
  { provider: 'Deutsche Studenten Versicherung', country: 'Germany', audience: 'student', coverageTypes: ['Health', 'Personal Liability', 'Accident'], benefits: ['Multilingual Support', 'Hospital Network', 'Emergency Assistance'], monthlyPremium: '€40', coverage: 'Up to €3,000,000', insuranceTypes: ['Student Health Insurance'], rating: null, reviews: null, image: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'German insurance provider specializing in international student coverage with extensive hospital network.' },
  { provider: 'Assurance Étudiante', country: 'France', audience: 'student', coverageTypes: ['Health', 'Travel', 'Personal Property'], benefits: ['Dental Coverage', 'Prescription Drugs', 'Mental Health Support'], monthlyPremium: '€35', coverage: 'Up to €2,500,000', insuranceTypes: ['Student Health Insurance'], rating: null, reviews: null, image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', description: 'French student insurance with comprehensive health coverage including mental health and dental care.' },

  // Espace tourisme
  { provider: 'Global Travel Care', country: 'United Kingdom', audience: 'travel', coverageTypes: ['Medical', 'Trip Cancellation', 'Baggage'], benefits: ['24/7 Support', 'Direct Billing', 'Mobile App'], monthlyPremium: '£30', coverage: 'Up to £2,000,000', insuranceTypes: ['Travel Insurance'], rating: null, reviews: null, image: null, description: null },
  { provider: 'Euro Travel Shield', country: 'Germany', audience: 'travel', coverageTypes: ['Medical', 'Personal Liability', 'Emergency'], benefits: ['Multilingual Support', 'Hospital Network', 'Emergency Evacuation'], monthlyPremium: '€35', coverage: 'Up to €3,000,000', insuranceTypes: ['Travel Insurance'], rating: null, reviews: null, image: null, description: null },
  { provider: 'Travel Secure Plus', country: 'France', audience: 'travel', coverageTypes: ['Medical', 'Trip Delay', 'Personal Property'], benefits: ['Dental Coverage', 'Lost Passport Help', 'Flight Insurance'], monthlyPremium: '€40', coverage: 'Up to €2,500,000', insuranceTypes: ['Travel Insurance'], rating: null, reviews: null, image: null, description: null },
];

const banks = [
  {
    name: 'UK Student Bank',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Leading UK bank offering comprehensive student banking solutions with excellent digital services.',
    accountTypes: [
      { name: 'Basic Student', features: ['Free International Transfers', 'Mobile Banking', 'Student Discounts', 'Overdraft up to £500'], monthlyFee: '£0', requirements: ['Student ID', 'Proof of Address', 'Passport'], minimumDeposit: '£0', cardType: 'Visa Debit', withdrawalLimit: '£300/day', onlineBanking: true, studentPerks: ['Free Amazon Prime Student for 6 months', '10% off at selected stores', 'Free railcard for 4 years'] },
      { name: 'Student Plus', features: ['Free International Transfers', 'Mobile Banking', 'Premium Student Discounts', 'Overdraft up to £2000', 'Travel Insurance', 'Mobile Phone Insurance'], monthlyFee: '£5', requirements: ['Student ID', 'Proof of Address', 'Passport', 'Minimum Course Duration 2 years'], minimumDeposit: '£500', cardType: 'Visa Debit Gold', withdrawalLimit: '£500/day', onlineBanking: true, studentPerks: ['Free Amazon Prime Student for 1 year', '20% off at selected stores', 'Free railcard for 4 years', 'Airport lounge access'] },
      { name: 'International Student Premium', features: ['Free Worldwide Transfers', 'Mobile Banking', 'Premium Student Discounts', 'Overdraft up to £3000', 'Comprehensive Travel Insurance', 'Mobile Phone Insurance', 'Priority Customer Service'], monthlyFee: '£10', requirements: ['Student ID', 'Proof of Address', 'Passport', 'Minimum Course Duration 2 years', 'Proof of Funds'], minimumDeposit: '£1000', cardType: 'Visa Platinum', withdrawalLimit: '£1000/day', onlineBanking: true, studentPerks: ['Free Amazon Prime Student for 1 year', '30% off at selected stores', 'Free railcard for 4 years', 'Priority airport lounge access', 'Dedicated international student advisor'] },
    ],
  },
  {
    name: 'Deutsche Student Bank',
    country: 'Germany',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'Trusted German bank providing student-friendly accounts with nationwide ATM network.',
    accountTypes: [
      { name: 'Basis Studentenkonto', features: ['Free ATM Withdrawals', 'Online Banking', 'Student Card', 'Basic Insurance'], monthlyFee: '€0', requirements: ['University Enrollment', 'Registration Certificate', 'Passport'], minimumDeposit: '€0', cardType: 'Girocard', withdrawalLimit: '€500/day', onlineBanking: true, studentPerks: ['Public transport discounts', 'Museum passes', 'Study materials discount'] },
      { name: 'Komfort Studentenkonto', features: ['Free ATM Withdrawals Worldwide', 'Online Banking', 'Premium Student Card', 'Travel Insurance', 'Study Abroad Support'], monthlyFee: '€5', requirements: ['University Enrollment', 'Registration Certificate', 'Passport', 'Proof of Regular Income'], minimumDeposit: '€250', cardType: 'Visa Debit', withdrawalLimit: '€1000/day', onlineBanking: true, studentPerks: ['Public transport annual pass discount', 'Culture pass', 'Study materials allowance', 'Language course discounts'] },
    ],
  },
  {
    name: 'Banque Étudiante',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    description: 'French banking institution specializing in international student services with comprehensive coverage.',
    accountTypes: [
      { name: 'Compte Étudiant Basique', features: ['Free Bank Card', 'Mobile App', 'Insurance Package', 'Student Discounts'], monthlyFee: '€0', requirements: ['Student Card', 'Residence Permit', 'ID Card'], minimumDeposit: '€20', cardType: 'Carte Bancaire', withdrawalLimit: '€300/day', onlineBanking: true, studentPerks: ['Cinema discounts', 'Public transport benefits', 'Book store discounts'] },
      { name: 'Compte Étudiant Premium', features: ['Premium Bank Card', 'Mobile App', 'Comprehensive Insurance', 'International Transfers', 'Travel Assistance'], monthlyFee: '€7', requirements: ['Student Card', 'Residence Permit', 'ID Card', 'Proof of Income/Scholarship'], minimumDeposit: '€100', cardType: 'Carte Premier', withdrawalLimit: '€800/day', onlineBanking: true, studentPerks: ['Theater and cinema passes', 'Annual transport card', 'Bookstore allowance', 'Sports facility access'] },
    ],
  },
];

const touristSites = [
  { name: 'Eiffel Tower', country: 'France', city: 'Paris', location: 'Paris, France', category: 'Landmarks', description: 'Iconic iron lattice tower on the Champ de Mars', rating: 4.7, reviews: 12500, price: '€26', features: ['Guided Tours', 'Restaurant', 'Observation Deck'] },
  { name: 'Colosseum', country: 'Italy', city: 'Rome', location: 'Rome, Italy', category: 'Historical', description: 'Ancient amphitheater in the center of Rome', rating: 4.8, reviews: 9800, price: '€16', features: ['Audio Guide', 'Skip the Line', 'Guided Tours'] },
  { name: 'Sagrada Familia', country: 'Spain', city: 'Barcelona', location: 'Barcelona, Spain', category: 'Religious Sites', description: 'Unfinished basilica designed by Antoni Gaudí', rating: 4.9, reviews: 8900, price: '€20', features: ['Audio Guide', 'Guided Tours', 'Museum'] },
];

const restaurants = [
  { name: 'Le Petit Bistro', country: 'France', city: 'Paris', location: 'Paris, France', cuisine: 'French', priceRange: '€€€', rating: 4.8, reviews: 450, features: ['Outdoor Seating', 'Wine Bar', 'Vegetarian Options'] },
  { name: 'Tapas & More', country: 'Spain', city: 'Barcelona', location: 'Barcelona, Spain', cuisine: 'Spanish', priceRange: '€€', rating: 4.6, reviews: 320, features: ['Live Music', 'Late Night', 'Group Friendly'] },
  { name: 'Bella Italia', country: 'Italy', city: 'Rome', location: 'Rome, Italy', cuisine: 'Italian', priceRange: '€€', rating: 4.7, reviews: 580, features: ['Family Style', 'Romantic', 'Wine Selection'] },
];

const tourismAccommodations = [
  { name: 'Grand Plaza Hotel', country: 'France', city: 'Paris', type: 'Hotel', priceRange: '$200-$400/night', amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'], rating: 4.8, reviews: 1250 },
  { name: 'Coastal Villa Resort', country: 'Spain', city: 'Barcelona', type: 'Resort', priceRange: '$300-$600/night', amenities: ['Beach Access', 'Pool', 'Restaurant', 'Gym'], rating: 4.7, reviews: 890 },
  { name: 'City Center Apartments', country: 'Germany', city: 'Berlin', type: 'Apartment', priceRange: '$150-$300/night', amenities: ['Kitchen', 'WiFi', 'Laundry', 'Parking'], rating: 4.5, reviews: 675 },
];

// `postedAt` reprend l'ancienneté affichée par les mocks (« 2 days ago »), calculée à
// l'exécution du seed pour que l'affichage relatif reste crédible.
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const jobs = [
  { title: 'Senior Software Engineer', company: 'Tech Innovations GmbH', country: 'Germany', city: 'Berlin', location: 'Berlin, Germany', type: 'Full-time', salary: '€65,000 - €85,000', experience: '5+ years', description: 'Looking for an experienced software engineer to join our growing team.', requirements: ['5+ years of experience in full-stack development', 'Strong knowledge of JavaScript/TypeScript', 'Experience with React and Node.js', 'Good understanding of cloud services'], benefits: ['Flexible working hours', 'Remote work options', 'Health insurance', 'Professional development budget'], postedAt: daysAgo(2), image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { title: 'Marketing Manager', company: 'Global Brands Ltd', country: 'United Kingdom', city: 'London', location: 'London, United Kingdom', type: 'Full-time', salary: '£45,000 - £60,000', experience: '3-5 years', description: 'Seeking a creative marketing manager to lead our digital campaigns.', requirements: ['3-5 years of digital marketing experience', 'Strong analytical skills', 'Experience with marketing automation tools', 'Excellent communication skills'], benefits: ['Performance bonuses', 'Gym membership', 'Company events', 'Training opportunities'], postedAt: daysAgo(7), image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { title: 'Data Scientist', company: 'Analytics Pro', country: 'France', city: 'Paris', location: 'Paris, France', type: 'Full-time', salary: '€50,000 - €70,000', experience: '2-4 years', description: 'Join our data science team to work on cutting-edge AI projects.', requirements: ['Masters in Data Science or related field', 'Experience with Python and ML frameworks', 'Strong statistical background', 'Good communication skills'], benefits: ['Flexible hours', 'Remote work options', 'Health coverage', 'Stock options'], postedAt: daysAgo(3), image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

const trainings = [
  { provider: 'Global Tech Academy', country: 'Germany', course: 'Full Stack Development', duration: '6 months', price: '€5,000', certification: 'Professional Developer Certificate', category: 'Technology', rating: 4.8, reviews: 450, features: ['Industry Expert Instructors', 'Project-Based Learning', 'Career Support', 'Internship Placement'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Comprehensive full stack development program with focus on modern technologies.' },
  { provider: 'Medical Training Institute', country: 'United Kingdom', course: 'Nursing Assistant Program', duration: '12 months', price: '£8,000', certification: 'Certified Nursing Assistant', category: 'Healthcare', rating: 4.9, reviews: 320, features: ['Hands-on Clinical Training', 'Patient Care Techniques', 'Medical Ethics', 'Hospital Placement', 'Emergency Response Training'], image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Comprehensive nursing assistant program with extensive practical training and hospital placement.' },
  { provider: 'European Medical Academy', country: 'Germany', course: 'Emergency Medical Technician', duration: '9 months', price: '€7,500', certification: 'EMT Professional Certificate', category: 'Healthcare', rating: 4.8, reviews: 275, features: ['Advanced Life Support Training', 'Emergency Response Protocols', 'Medical Equipment Operation', 'Clinical Rotations', 'Ambulance Service Training'], image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Professional EMT training program with focus on emergency medical care and response.' },
  { provider: 'Healthcare Training Center', country: 'France', course: 'Medical Laboratory Technician', duration: '15 months', price: '€9,000', certification: 'Medical Lab Tech Certificate', category: 'Healthcare', rating: 4.7, reviews: 190, features: ['Laboratory Techniques', 'Sample Analysis', 'Quality Control Procedures', 'Medical Testing Equipment', 'Clinical Laboratory Practice'], image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Comprehensive training in medical laboratory procedures and techniques.' },
  { provider: 'Business Excellence Institute', country: 'France', course: 'Digital Marketing', duration: '3 months', price: '€3,500', certification: 'Digital Marketing Professional', category: 'Business', rating: 4.7, reviews: 320, features: ['Real Campaign Experience', 'Industry Tools Training', 'Portfolio Development', 'Networking Events'], image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Advanced digital marketing program covering latest trends and strategies.' },
  { provider: 'Innovation Hub', country: 'United Kingdom', course: 'Data Science', duration: '8 months', price: '£6,000', certification: 'Data Science Professional', category: 'Technology', rating: 4.9, reviews: 580, features: ['Machine Learning', 'Big Data Analytics', 'Python Programming', 'Industry Projects'], image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Comprehensive data science program with focus on practical applications.' },
];

const serviceProviders = [
  // Visa travail (page professionnelle)
  { provider: 'Global Work Visa Services', country: 'Germany', serviceType: 'work_visa', visaTypes: ['Work Permit', 'Blue Card', 'Freelance Visa'], processingTime: '4-6 weeks', price: '€2,000-€3,000', requirements: ['Job Contract', 'University Degree', 'Work Experience Proof', 'Language Certificate'], features: ['Document Translation', 'Application Support', 'Interview Preparation', 'Post-arrival Support'], successRate: '94%' },
  { provider: 'UK Work Visa Center', country: 'United Kingdom', serviceType: 'work_visa', visaTypes: ['Skilled Worker Visa', 'Global Talent Visa'], processingTime: '3-4 weeks', price: '£1,500-£2,500', requirements: ['Job Offer', 'Qualification Documents', 'English Proficiency', 'Financial Proof'], features: ['Priority Processing', 'Legal Consultation', 'Document Check', 'Visa Extension Support'], successRate: '92%' },
  { provider: 'French Immigration Services', country: 'France', serviceType: 'work_visa', visaTypes: ['Talent Passport', 'Employee Visa'], processingTime: '6-8 weeks', price: '€1,800-€2,800', requirements: ['Employment Contract', 'Educational Certificates', 'Professional Experience', 'Health Insurance'], features: ['Full Application Support', 'Translation Services', 'Local Registration', 'Family Visa Support'], successRate: '90%' },

  // Légalisation de documents
  { provider: 'Global Document Services', country: 'Germany', serviceType: 'legalization', services: ['Document Authentication', 'Apostille', 'Embassy Legalization', 'Document Translation'], processingTime: '2-3 weeks', price: '€200-€500 per document', requirements: ['Original Documents', 'Passport Copy', 'Application Form', 'Power of Attorney (if applicable)'], features: ['Free Document Review', 'Express Processing Available', 'Document Translation', 'Courier Service', 'Online Tracking'], successRate: '98%', documentTypes: ['Academic Degrees', 'Professional Certificates', 'Work Experience Letters', 'Birth Certificates', 'Marriage Certificates'] },
  { provider: 'UK Legalization Center', country: 'United Kingdom', serviceType: 'legalization', services: ['Apostille Service', 'Embassy Attestation', 'Document Translation', 'Certification'], processingTime: '1-2 weeks', price: '£150-£400 per document', requirements: ['Original/Notarized Documents', 'ID Proof', 'Supporting Documents', 'Application Details'], features: ['Same Day Processing Option', 'Multi-Language Translation', 'Door-to-Door Service', 'Digital Copy Storage', '24/7 Support'], successRate: '99%', documentTypes: ['University Degrees', 'Professional Qualifications', 'Employment Records', 'Legal Documents', 'Commercial Documents'] },
  { provider: 'European Document Authority', country: 'France', serviceType: 'legalization', services: ['Document Authentication', 'Apostille', 'Ministry Legalization', 'Certified Translation'], processingTime: '2-4 weeks', price: '€180-€450 per document', requirements: ['Original Documents', 'Identity Documents', 'Proof of Address', 'Application Form'], features: ['Multilingual Service', 'Priority Processing', 'Secure Document Handling', 'International Shipping', 'Expert Consultation'], successRate: '97%', documentTypes: ['Educational Certificates', 'Professional Licenses', 'Corporate Documents', 'Personal Documents', 'Medical Certificates'] },
  { provider: 'Global Docs International', country: 'United Kingdom', serviceType: 'legalization', services: ['Document Authentication', 'Apostille', 'Embassy Legalization'], processingTime: '5-7 business days', price: '$200-$300', requirements: ['Original Documents', 'Passport Copy', 'Application Form'], rating: 4.8 },
  { provider: 'EuroLegal Services', country: 'Germany', serviceType: 'legalization', services: ['Document Translation', 'Authentication', 'Embassy Legalization'], processingTime: '7-10 business days', price: '$150-$250', requirements: ['Original Documents', 'Passport Copy', 'Proof of Address'], rating: 4.6 },
  { provider: 'LegalDocs France', country: 'France', serviceType: 'legalization', services: ['Document Authentication', 'Translation', 'Ministry Legalization'], processingTime: '8-12 business days', price: '$180-$280', requirements: ['Original Documents', 'ID Card Copy', 'Proof of Purpose'], rating: 4.7 },

  // Reconnaissance de diplôme
  { provider: 'European Qualification Framework', country: 'Germany', serviceType: 'recognition', acceptedDegrees: ["Bachelor's Degree", "Master's Degree", 'PhD'], processingTime: '4-6 weeks', price: '$300-$500', successRate: '95%' },
  { provider: 'UK NARIC', country: 'United Kingdom', serviceType: 'recognition', acceptedDegrees: ['High School', "Bachelor's Degree", "Master's Degree"], services: ['Qualification Recognition', 'Statement of Comparability', 'Career Path Report'], processingTime: '3-4 weeks', price: '$250-$400', requirements: ['Original Diploma', 'Transcripts', 'Certified Translations'], successRate: '92%', rating: 4.7 },
  { provider: 'French Ministry of Education', country: 'France', serviceType: 'recognition', acceptedDegrees: ["Bachelor's Degree", "Master's Degree", 'Professional Certification'], processingTime: '6-8 weeks', price: '$200-$350', successRate: '90%' },
  { provider: 'German ENIC-NARIC', country: 'Germany', serviceType: 'recognition', services: ['Degree Recognition', 'Professional Qualification Assessment'], processingTime: '20-25 business days', price: '$200-$350', requirements: ['Notarized Diploma Copy', 'Transcript Translation', 'CV'], rating: 4.5 },
  { provider: 'ENIC-NARIC France', country: 'France', serviceType: 'recognition', services: ['Academic Recognition', 'Professional Recognition', 'Comparability Statement'], processingTime: '15-20 business days', price: '$220-$380', requirements: ['Original Diploma', 'Course Descriptions', 'Official Translations'], rating: 4.6 },
];

async function main() {
  for (const f of flights) {
    await upsertBy(prisma.flight as any, { airline: f.airline, fromCity: f.fromCity, toCity: f.toCity, type: f.type }, f);
  }
  console.log(`✅ ${flights.length} flights seeded`);

  for (const i of insurancePlans) {
    await upsertBy(prisma.insurancePlan as any, { provider: i.provider, audience: i.audience }, i);
  }
  console.log(`✅ ${insurancePlans.length} insurance plans seeded`);

  for (const b of banks) {
    const { accountTypes, ...bank } = b;
    const existing = await prisma.bank.findFirst({ where: { name: bank.name } });
    if (existing) {
      await prisma.bank.update({
        where: { id: existing.id },
        // Les comptes se remplacent en bloc : un diff partiel créerait des doublons.
        data: { ...bank, accountTypes: { deleteMany: {}, create: accountTypes } },
      });
    } else {
      await prisma.bank.create({ data: { ...bank, accountTypes: { create: accountTypes } } });
    }
  }
  console.log(`✅ ${banks.length} banks seeded`);

  for (const s of touristSites) {
    await upsertBy(prisma.touristSite as any, { name: s.name, country: s.country }, s);
  }
  console.log(`✅ ${touristSites.length} tourist sites seeded`);

  for (const r of restaurants) {
    await upsertBy(prisma.restaurant as any, { name: r.name, country: r.country }, r);
  }
  console.log(`✅ ${restaurants.length} restaurants seeded`);

  for (const a of tourismAccommodations) {
    await upsertBy(prisma.tourismAccommodation as any, { name: a.name, city: a.city }, a);
  }
  console.log(`✅ ${tourismAccommodations.length} tourism accommodations seeded`);

  for (const j of jobs) {
    await upsertBy(prisma.job as any, { title: j.title, company: j.company }, j);
  }
  console.log(`✅ ${jobs.length} jobs seeded`);

  for (const t of trainings) {
    await upsertBy(prisma.training as any, { provider: t.provider, course: t.course }, t);
  }
  console.log(`✅ ${trainings.length} trainings seeded`);

  for (const p of serviceProviders) {
    await upsertBy(prisma.serviceProvider as any, { provider: p.provider, serviceType: p.serviceType }, p);
  }
  console.log(`✅ ${serviceProviders.length} service providers seeded`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
