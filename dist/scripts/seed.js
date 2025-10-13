import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Sample data based on the frontend structure
const categoriesData = [
    {
        id: 'study',
        name: 'Study',
        description: 'Educational opportunities worldwide',
        icon: '🎓'
    },
    {
        id: 'professional',
        name: 'Professional Training & Job',
        description: 'Career development and job opportunities',
        icon: '💼'
    },
    {
        id: 'tourism',
        name: 'Tourism',
        description: 'Travel and exploration experiences',
        icon: '🌍'
    },
    {
        id: 'business',
        name: 'Business',
        description: 'Business travel and networking',
        icon: '🤝'
    }
];
const servicesData = [
    // Study services
    { name: 'University Finder', description: 'Find the perfect university match based on your academic interests, budget, and location preferences.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', learnMoreLink: '/services/university-finder', categoryId: 'study' },
    { name: 'Document Legalization & Recognition', description: 'Complete support for document legalization and recognition.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85', learnMoreLink: '/services/document-legalization', categoryId: 'study' },
    { name: 'Student Accommodation', description: 'Find safe and comfortable housing options near your university.', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5', learnMoreLink: '/services/student-accommodation', categoryId: 'study' },
    { name: 'Student Visa Assistance', description: 'Complete support throughout your student visa application process.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', learnMoreLink: '/services/student-visa', categoryId: 'study' },
    { name: 'Bank Account Setup', description: 'Assistance in opening a student bank account in your destination country.', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc', learnMoreLink: '/services/bank-account', categoryId: 'study' },
    { name: 'Language Center', description: 'Access to quality language courses and certification programs.', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8', learnMoreLink: '/services/language-center', categoryId: 'study' },
    // Professional services
    { name: 'Professional Training Finder', description: 'Access curated professional development courses and certification programs.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', learnMoreLink: '/services/training-finder', categoryId: 'professional' },
    { name: 'Jobs Finder', description: 'Connect with international employers and find career opportunities.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', learnMoreLink: '/services/jobs-finder', categoryId: 'professional' },
    { name: 'Work Visa Assistance', description: 'Expert guidance through work permit and visa applications.', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', learnMoreLink: '/services/work-visa', categoryId: 'professional' },
    // Tourism services
    { name: 'Accommodation Finder', description: 'Find and book the perfect accommodation for your travel needs.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', learnMoreLink: '/services/accommodation', categoryId: 'tourism' },
    { name: 'Tourist Visa Assistance', description: 'Streamlined tourist visa application support for hassle-free travel.', image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81', learnMoreLink: '/services/tourist-visa', categoryId: 'tourism' },
    { name: 'Tourist Sites Finder', description: 'Discover popular attractions and must-visit locations.', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', learnMoreLink: '/services/tourist-sites', categoryId: 'tourism' },
    // Business services
    { name: 'Business Networking Events', description: 'Participate in curated business events to expand your network.', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865', learnMoreLink: '/services/networking-events', categoryId: 'business' },
    { name: 'Corporate Accommodation', description: 'Premium accommodation solutions for business travelers.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', learnMoreLink: '/services/corporate-accommodation', categoryId: 'business' },
    { name: 'Business Visa Assistance', description: 'Expert support for business visa applications.', image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f', learnMoreLink: '/services/business-visa', categoryId: 'business' }
];
const countriesData = [
    // Europe
    { name: 'Spain', code: 'ES', heroImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4', motto: 'Plus Ultra', history: 'Spain has a rich history from ancient Roman Hispania to the powerful Spanish Empire and modern democratic state.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Spain balances tradition with contemporary lifestyle, known for art, culture, and vibrant social life.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'France', code: 'FR', heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', motto: 'Liberty, Equality, Fraternity', history: 'France has a rich history spanning over two millennia, from ancient Roman Gaul to the powerful French monarchy, the French Revolution, and its current position as a leading global power.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern France blends traditional values with contemporary lifestyle. The country maintains its reputation for fashion, gastronomy, and art while embracing innovation.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Germany', code: 'DE', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b', motto: 'Unity and Justice and Freedom', history: 'Germany has evolved from medieval kingdoms to modern federal republic, playing a central role in European history.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Germany is known for innovation, engineering excellence, and strong democratic institutions.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Italy', code: 'IT', heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963', motto: 'L\'Italia è cultura (Italy is culture)', history: 'Italy\'s rich history spans from the Roman Empire through the Renaissance to modern times. The country has been a cradle of Western civilization, art, and culture.', culturalImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5', modernLife: 'Modern Italy balances its rich historical heritage with contemporary innovation in fashion, design, and technology.', modernImage: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c' },
    { name: 'Portugal', code: 'PT', heroImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b', motto: 'Esta é a ditosa Pátria minha amada', history: 'Portugal has a maritime history as a major colonial power and pioneer of global exploration.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Portugal combines Atlantic tradition with European innovation and growing tech sector.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Greece', code: 'GR', heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e', motto: 'Freedom or Death', history: 'Greece is the cradle of Western civilization, democracy, philosophy, and Olympic Games.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Greece preserves ancient heritage while embracing Mediterranean lifestyle and EU membership.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Sweden', code: 'SE', heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11', motto: 'For Sverige – i tiden', history: 'Sweden evolved from Viking heritage to modern welfare state and global innovation leader.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Sweden leads in sustainability, technology, and quality of life.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Norway', code: 'NO', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Alt for Norge', history: 'Norway has maritime and Viking heritage, becoming oil-rich modern democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Norway combines natural beauty with technological advancement and high living standards.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Finland', code: 'FI', heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', motto: 'Our land, our land, our fatherland', history: 'Finland gained independence from Russia, becoming modern Nordic welfare state.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Finland leads in education, technology, and happiness indices.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Denmark', code: 'DK', heroImage: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc', motto: 'God\'s help, the love of the people, Denmark\'s strength', history: 'Denmark has Viking heritage and long monarchical tradition in modern Scandinavian welfare state.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Denmark emphasizes hygge lifestyle, sustainability, and social welfare.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Iceland', code: 'IS', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Island, Iceland', history: 'Iceland was settled by Norse Vikings and became independent Nordic island nation.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Iceland combines dramatic nature with renewable energy leadership and cultural innovation.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Ireland', code: 'IE', heroImage: 'https://images.unsplash.com/photo-1590736969955-71cc94901144', motto: 'Ireland Forever', history: 'Ireland has Celtic heritage, colonial struggle, and transformation to modern European nation.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Ireland balances traditional culture with EU membership and tech industry growth.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'United Kingdom', code: 'GB', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', motto: 'God and my right', history: 'The UK evolved from medieval kingdoms to global empire to modern democratic state.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern UK combines constitutional monarchy with multicultural democracy and financial leadership.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Austria', code: 'AT', heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', motto: 'Austria is great', history: 'Austria transitioned from Habsburg Empire center to neutral European democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Austria combines Alpine beauty with cultural heritage and EU integration.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Switzerland', code: 'CH', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'One for all, all for one', history: 'Switzerland developed unique federal democracy and maintained neutrality through major conflicts.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Switzerland leads in banking, pharmaceuticals, and quality of life.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Belgium', code: 'BE', heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11', motto: 'Unity makes strength', history: 'Belgium emerged from medieval commerce to modern federal state and EU headquarters.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Belgium balances Flemish and French cultures while hosting European institutions.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Netherlands', code: 'NL', heroImage: 'https://images.unsplash.com/photo-1459472178402-e9a07b0e0249', motto: 'I will maintain', history: 'Netherlands evolved from maritime trading empire to modern progressive European democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Netherlands leads in tolerance, innovation, and sustainable development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Luxembourg', code: 'LU', heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', motto: 'We want to remain what we are', history: 'Luxembourg transitioned from medieval duchy to modern financial and EU center.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Luxembourg combines banking leadership with EU institutional importance.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Estonia', code: 'EE', heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', motto: 'Land of my fathers, land that I love', history: 'Estonia gained independence from Soviet Union, becoming Baltic digital innovation leader.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Estonia leads in digital governance and technology startups.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Latvia', code: 'LV', heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', motto: 'God bless Latvia', history: 'Latvia regained independence from Soviet Union, joining NATO and EU.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Latvia balances Baltic heritage with European integration.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Lithuania', code: 'LT', heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', motto: 'Unity for Lithuania', history: 'Lithuania was first Soviet republic to declare independence, joining Western institutions.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Lithuania embraces EU membership while preserving Baltic cultural identity.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    // Asia
    { name: 'China', code: 'CN', heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d', motto: 'Serve the People', history: 'China has ancient civilization spanning thousands of years, from dynastic empires to modern communist state.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern China combines ancient traditions with rapid economic development and technological advancement.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'India', code: 'IN', heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da', motto: 'Truth alone triumphs', history: 'India has diverse ancient civilizations, colonial period, and independence to become world\'s largest democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern India balances traditional diversity with technology leadership and economic growth.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Japan', code: 'JP', heroImage: 'https://images.unsplash.com/photo-1480796927426-f609979314bd', motto: 'Peace and prosperity', history: 'Japan evolved from feudal isolation to imperial power to modern democratic technological leader.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Japan combines traditional culture with cutting-edge technology and innovation.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'South Korea', code: 'KR', heroImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451', motto: 'Benefit broadly the human world', history: 'South Korea transformed from war-torn nation to democratic economic powerhouse in decades.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern South Korea leads in technology, entertainment, and cultural exports globally.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Indonesia', code: 'ID', heroImage: 'https://images.unsplash.com/photo-1537519408707-3e3b79c08997', motto: 'Unity in Diversity', history: 'Indonesia united diverse archipelago cultures into world\'s largest archipelagic nation.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Indonesia balances cultural diversity with economic development and democratic governance.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Thailand', code: 'TH', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Nation, Religion, King', history: 'Thailand uniquely avoided European colonization, maintaining independence throughout modern period.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Thailand combines Buddhist traditions with tourism leadership and manufacturing economy.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Vietnam', code: 'VN', heroImage: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b', motto: 'Independence, Freedom, Happiness', history: 'Vietnam struggled for independence from colonial powers, achieving reunification and economic reform.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Vietnam combines traditional culture with rapid economic growth and international integration.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Malaysia', code: 'MY', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Unity is Strength', history: 'Malaysia emerged from British colonization to become diverse multicultural democratic federation.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Malaysia balances ethnic diversity with economic development and Islamic values.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Philippines', code: 'PH', heroImage: 'https://images.unsplash.com/photo-1537519408707-3e3b79c08997', motto: 'For God, People, Nature, and Country', history: 'Philippines experienced Spanish and American colonial periods before independence and democratic development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Philippines combines Spanish, American, and indigenous influences with growing economy.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Singapore', code: 'SG', heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd', motto: 'Onward Singapore', history: 'Singapore transformed from British trading post to independent city-state economic miracle.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Singapore leads in urban planning, finance, and multicultural harmony.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Cambodia', code: 'KH', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Nation, Religion, King', history: 'Cambodia has ancient Khmer empire heritage, surviving modern conflicts to rebuild democratic institutions.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Cambodia combines Angkor heritage with economic development and tourism growth.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Laos', code: 'LA', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Peace, Independence, Democracy, Unity, Prosperity', history: 'Laos maintained Buddhist culture through colonial and modern periods in landlocked Southeast Asia.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Laos preserves traditional way of life while gradually developing tourism and trade.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Dubai', code: 'AE', heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', motto: 'The land of tolerance', history: 'Dubai transformed from pearling village to global business and tourism hub in decades.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Dubai combines traditional Emirati culture with international business and luxury lifestyle.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    // North America
    { name: 'United States', code: 'US', heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74', motto: 'In God We Trust', history: 'The United States gained independence from Britain, expanded westward, and became global superpower.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern America leads in innovation, entertainment, and maintains diverse democratic society.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Canada', code: 'CA', heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56cd3b1', motto: 'From Sea to Sea', history: 'Canada evolved from French and British colonies to independent confederation and multicultural democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Canada emphasizes multiculturalism, natural resources, and progressive social policies.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    // South America
    { name: 'Mexico', code: 'MX', heroImage: 'https://images.unsplash.com/photo-1512813195386-6cf29cb9170c', motto: 'The homeland, the family and work', history: 'Mexico has rich indigenous heritage, Spanish colonial period, and modern democratic development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Mexico balances ancient cultures with North American economic integration.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Costa Rica', code: 'CR', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Forever Costa Rica', history: 'Costa Rica established stable democracy and abolished military, focusing on peace and conservation.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Costa Rica leads in eco-tourism, biodiversity conservation, and peaceful democracy.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Panama', code: 'PA', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Pro Mundi Beneficio', history: 'Panama gained independence to build interoceanic canal, becoming strategic global crossroads.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Panama leverages canal revenues for economic development and regional banking.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Colombia', code: 'CO', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Liberty and Order', history: 'Colombia has diverse geography and cultures, overcoming conflicts to pursue democratic development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Colombia combines cultural richness with economic growth and peace-building efforts.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Venezuela', code: 'VE', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'God and Federation', history: 'Venezuela led South American independence movement, later developing oil-based economy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Venezuela faces economic challenges while maintaining rich cultural heritage.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Ecuador', code: 'EC', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'God, homeland and freedom', history: 'Ecuador gained independence from Spain, later developing diverse economy and Galápagos conservation.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Ecuador balances indigenous heritage with environmental conservation and economic development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Peru', code: 'PE', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Firm and Happy for the Union', history: 'Peru has Inca heritage, Spanish colonial period, and modern democratic development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Peru combines ancient Andean cultures with economic growth and tourism development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Bolivia', code: 'BO', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'Unity, Work, Progress', history: 'Bolivia has indigenous majority, Spanish colonial heritage, and struggles for social justice.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Bolivia emphasizes indigenous rights while developing natural resources and democracy.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Chile', code: 'CL', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'By reason or by force', history: 'Chile developed unique geography and stable institutions, transitioning from military to democratic rule.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Chile leads Latin America in economic development and social progress.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Argentina', code: 'AR', heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', motto: 'In Union and Liberty', history: 'Argentina experienced European immigration, economic growth, and political transitions to democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Argentina combines European influences with Latin American culture and economic development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Brazil', code: 'BR', heroImage: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325', motto: 'Order and Progress', history: 'Brazil is largest Latin American country, with Portuguese colonial heritage and diverse democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Brazil combines cultural diversity with emerging economy and environmental leadership.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    // Africa
    { name: 'South Africa', code: 'ZA', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Unity in diversity', history: 'South Africa overcame apartheid system to become democratic rainbow nation with diverse cultures.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern South Africa leads African democracy while addressing economic inequality and development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Egypt', code: 'EG', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'God, Country, King', history: 'Egypt has ancient Pharaonic civilization, Islamic heritage, and modern Arab republican development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Egypt balances ancient heritage with contemporary Arab leadership and economic development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Kenya', code: 'KE', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'All pull together', history: 'Kenya gained independence from Britain, developing diverse economy and stable democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Kenya leads East African economic development and conservation efforts.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Morocco', code: 'MA', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'God, Country, King', history: 'Morocco maintained independence through most colonial period, blending Arab, Berber, and African cultures.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Morocco combines traditional monarchy with economic modernization and African leadership.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Tunisia', code: 'TN', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Order, Work, Progress', history: 'Tunisia initiated Arab Spring democratic transition from authoritarian to democratic governance.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Tunisia pioneers Arab democratic transition while preserving Mediterranean heritage.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Rwanda', code: 'RW', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Unity, Work, Progress', history: 'Rwanda recovered from 1994 genocide to become model of reconciliation and development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Rwanda leads African development in technology, governance, and gender equality.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Mauritius', code: 'MU', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Star and Key of the Indian Ocean', history: 'Mauritius developed diverse multicultural democracy with successful economic development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Mauritius combines tourism leadership with financial services and cultural diversity.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Botswana', code: 'BW', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Rain', history: 'Botswana transformed from poor landlocked country to stable diamond-rich democracy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Botswana leads African governance while balancing development with conservation.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Namibia', code: 'NA', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Unity, Work, Progress', history: 'Namibia gained independence from South African rule, establishing stable democratic institutions.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Namibia combines desert tourism with mining economy and conservation leadership.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Ghana', code: 'GH', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Freedom and Justice', history: 'Ghana was first African colony to gain independence, developing stable democratic institutions.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Ghana leads West African democracy and gold mining economy.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Nigeria', code: 'NG', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Unity and Faith, Peace and Progress', history: 'Nigeria is Africa\'s most populous country with diverse ethnic groups and oil-based economy.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Nigeria leads African economy and entertainment while managing diversity challenges.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Tanzania', code: 'TZ', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Unity, Work, Progress', history: 'Tanzania united mainland and Zanzibar, developing Swahili culture and stable governance.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Tanzania combines wildlife tourism with cultural preservation and economic development.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Uganda', code: 'UG', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'For God and My Country', history: 'Uganda has diverse ethnic groups, recovering from conflicts to pursue democratic development.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Uganda focuses on agricultural development and regional integration.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Senegal', code: 'SN', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'One People, One Goal, One Faith', history: 'Senegal maintained stable democracy since independence, leading West African integration.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Senegal combines French cultural influence with African traditions and democratic stability.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Ethiopia', code: 'ET', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Ethiopia above all', history: 'Ethiopia is ancient civilization that resisted European colonization, maintaining independence.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Ethiopia leads African Union while pursuing economic development and political reform.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Ivory Coast', code: 'CI', heroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69ea', motto: 'Union, Discipline, Work', history: 'Ivory Coast developed cocoa-based economy, overcoming political conflicts for democratic stability.', culturalImage: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e', modernLife: 'Modern Ivory Coast leads West African economic development and French-speaking Africa.', modernImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' }
];
// German Universities Data - All 25 universities from the guide
const universitiesData = [
    {
        name: 'Ludwig-Maximilians-Universität München (LMU)',
        city: 'Munich',
        website: 'www.uni-muenchen.de',
        applicationUrl: 'www.uni-muenchen.de/studium/administratives/studienplatzbewerbung/index.html',
        specialty: 'Une des plus anciennes universités d\'Allemagne (1472), excellence en recherche médicale',
        programs: [
            { name: 'Médecine humaine', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Sciences économiques', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Géographie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Master en Sciences biomédicales', level: 'Master' },
            { name: 'Master en Physique théorique et mathématique', level: 'Master' },
            { name: 'Master en Informatique', level: 'Master' },
            { name: 'Master en Économie', level: 'Master' },
            { name: 'Master en Psychologie clinique', level: 'Master' },
            { name: 'Master en Relations internationales', level: 'Master' },
            { name: 'Master en Sciences de l\'environnement', level: 'Master' },
            { name: 'Master en Neurosciences', level: 'Master' },
            { name: 'Master en Bioinformatique', level: 'Master' },
            { name: 'Master en Management', level: 'Master' }
        ]
    },
    {
        name: 'Technische Universität München (TUM)',
        city: 'Munich',
        website: 'www.tum.de',
        applicationUrl: 'www.tum.de/studium/bewerbung',
        specialty: 'Excellence technique, forte orientation recherche et innovation',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Biotechnologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Sciences de la vie', level: 'Bachelor' },
            { name: 'Génie aérospatial', level: 'Bachelor' },
            { name: 'Master en Intelligence artificielle', level: 'Master' },
            { name: 'Master en Robotique', level: 'Master' },
            { name: 'Master en Génie biomédical', level: 'Master' },
            { name: 'Master en Sciences des données', level: 'Master' },
            { name: 'Master en Génie énergétique', level: 'Master' },
            { name: 'Master en Nanotechnologie', level: 'Master' },
            { name: 'Master en Management technologique', level: 'Master' },
            { name: 'Master en Génie environnemental', level: 'Master' },
            { name: 'Master en Bioinformatique', level: 'Master' },
            { name: 'Master en Cybersécurité', level: 'Master' }
        ]
    },
    {
        name: 'Ruprecht-Karls-Universität Heidelberg',
        city: 'Heidelberg',
        website: 'www.uni-heidelberg.de',
        applicationUrl: 'www.uni-heidelberg.de/studium/interesse/bewerbung/',
        specialty: 'Plus ancienne université d\'Allemagne (1386), forte réputation en sciences',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie moléculaire', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Études germaniques', level: 'Bachelor' },
            { name: 'Sciences économiques', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Master en Biosciences moléculaires', level: 'Master' },
            { name: 'Master en Physique théorique', level: 'Master' },
            { name: 'Master en Sciences de l\'environnement', level: 'Master' },
            { name: 'Master en Études américaines', level: 'Master' },
            { name: 'Master en Économie', level: 'Master' },
            { name: 'Master en Health and Society', level: 'Master' },
            { name: 'Master en Scientific Computing', level: 'Master' },
            { name: 'Master en Geoarchaeology', level: 'Master' },
            { name: 'Master en Transcultural Studies', level: 'Master' },
            { name: 'Master en Medical Education', level: 'Master' }
        ]
    },
    {
        name: 'Freie Universität Berlin (FU Berlin)',
        city: 'Berlin',
        website: 'www.fu-berlin.de',
        applicationUrl: 'www.fu-berlin.de/studium/bewerbung/',
        specialty: 'Forte orientation internationale, excellence en sciences sociales',
        programs: [
            { name: 'Sciences politiques', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Études théâtrales', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Master en Relations internationales', level: 'Master' },
            { name: 'Master en Sciences politiques européennes', level: 'Master' },
            { name: 'Master en Sociologie', level: 'Master' },
            { name: 'Master en Psychologie clinique', level: 'Master' },
            { name: 'Master en Bioinformatique', level: 'Master' },
            { name: 'Master en Sciences de l\'environnement', level: 'Master' },
            { name: 'Master en Études nord-américaines', level: 'Master' },
            { name: 'Master en Public Policy', level: 'Master' },
            { name: 'Master en Neurobiologie', level: 'Master' },
            { name: 'Master en Études culturelles', level: 'Master' }
        ]
    },
    {
        name: 'Humboldt-Universität zu Berlin (HU Berlin)',
        city: 'Berlin',
        website: 'www.hu-berlin.de',
        applicationUrl: 'www.hu-berlin.de/studium/bewerbung',
        specialty: 'Tradition académique prestigieuse, modèle universitaire humboldtien',
        programs: [
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Littérature allemande', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Master en Philosophie européenne', level: 'Master' },
            { name: 'Master en Histoire contemporaine', level: 'Master' },
            { name: 'Master en Sociologie européenne', level: 'Master' },
            { name: 'Master en Biophysique', level: 'Master' },
            { name: 'Master en Statistiques', level: 'Master' },
            { name: 'Master en Linguistique', level: 'Master' },
            { name: 'Master en Études culturelles', level: 'Master' },
            { name: 'Master en History and Culture of Science', level: 'Master' },
            { name: 'Master en Polymer Science', level: 'Master' },
            { name: 'Master en Survey Methodology', level: 'Master' }
        ]
    },
    {
        name: 'Technische Universität Berlin (TU Berlin)',
        city: 'Berlin',
        website: 'www.tu-berlin.de',
        applicationUrl: 'www.tu-berlin.de/studium/studieninteressierte/bewerbung_zulassung/',
        specialty: 'Excellence en ingénierie, forte coopération industrielle',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Biotechnologie', level: 'Bachelor' },
            { name: 'Planification urbaine', level: 'Bachelor' },
            { name: 'Génie chimique', level: 'Bachelor' },
            { name: 'Physique technique', level: 'Bachelor' },
            { name: 'Mathématiques techniques', level: 'Bachelor' },
            { name: 'Sciences économiques', level: 'Bachelor' },
            { name: 'Master en Génie urbain', level: 'Master' },
            { name: 'Master en Energy Engineering', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Biotechnology', level: 'Master' },
            { name: 'Master en Environmental Engineering', level: 'Master' },
            { name: 'Master en Aerospace Engineering', level: 'Master' },
            { name: 'Master en Transportation Systems', level: 'Master' },
            { name: 'Master en Innovation Management', level: 'Master' },
            { name: 'Master en Sustainable Engineering', level: 'Master' },
            { name: 'Master en Data Engineering', level: 'Master' }
        ]
    },
    {
        name: 'RWTH Aachen University',
        city: 'Aachen',
        website: 'www.rwth-aachen.de',
        applicationUrl: 'www.rwth-aachen.de/go/id/bwrb/',
        specialty: 'Leader européen en ingénierie, forte recherche industrielle',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Génie chimique', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Biotechnologie', level: 'Bachelor' },
            { name: 'Génie minier', level: 'Bachelor' },
            { name: 'Métallurgie', level: 'Bachelor' },
            { name: 'Master en Automotive Engineering', level: 'Master' },
            { name: 'Master en Production Engineering', level: 'Master' },
            { name: 'Master en Software Systems Engineering', level: 'Master' },
            { name: 'Master en Materials Engineering', level: 'Master' },
            { name: 'Master en Chemical Engineering', level: 'Master' },
            { name: 'Master en Biomedical Engineering', level: 'Master' },
            { name: 'Master en Computational Engineering Science', level: 'Master' },
            { name: 'Master en Energy Engineering', level: 'Master' },
            { name: 'Master en Textile Engineering', level: 'Master' },
            { name: 'Master en Metallurgy', level: 'Master' }
        ]
    },
    {
        name: 'Universität Hamburg (UHH)',
        city: 'Hambourg',
        website: 'www.uni-hamburg.de',
        applicationUrl: 'www.uni-hamburg.de/campuscenter/bewerbung.html',
        specialty: 'Excellence en sciences marines, forte dimension internationale',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Géographie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Master en Sciences marines', level: 'Master' },
            { name: 'Master en Climat et environnement', level: 'Master' },
            { name: 'Master en Économie internationale', level: 'Master' },
            { name: 'Master en Peace and Security Studies', level: 'Master' },
            { name: 'Master en Biologie marine', level: 'Master' },
            { name: 'Master en Informatique', level: 'Master' },
            { name: 'Master en Psychologie', level: 'Master' },
            { name: 'Master en European Master in Migration Studies', level: 'Master' },
            { name: 'Master en Journalism and Media', level: 'Master' },
            { name: 'Master en Sustainability Science', level: 'Master' }
        ]
    },
    {
        name: 'Universität zu Köln',
        city: 'Cologne',
        website: 'www.uni-koeln.de',
        applicationUrl: 'www.uni-koeln.de/studium/bewerbung/',
        specialty: 'Excellence en sciences économiques et sociales',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Études théâtrales', level: 'Bachelor' },
            { name: 'Master en Management', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Sociology', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Biological Sciences', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Archaeology', level: 'Master' },
            { name: 'Master en Cultural Studies', level: 'Master' },
            { name: 'Master en Media Culture Analysis', level: 'Master' }
        ]
    },
    {
        name: 'Georg-August-Universität Göttingen',
        city: 'Göttingen',
        website: 'www.uni-goettingen.de',
        applicationUrl: 'www.uni-goettingen.de/studium',
        specialty: 'Tradition scientifique exceptionnelle, nombreux prix Nobel',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Master en Neurosciences', level: 'Master' },
            { name: 'Master en Molecular Biology', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Applied Statistics', level: 'Master' },
            { name: 'Master en Development Economics', level: 'Master' },
            { name: 'Master en Forest Sciences', level: 'Master' },
            { name: 'Master en Archaeology', level: 'Master' },
            { name: 'Master en Digital Humanities', level: 'Master' },
            { name: 'Master en Sustainable Development', level: 'Master' },
            { name: 'Master en Mathematical Sciences', level: 'Master' }
        ]
    },
    {
        name: 'Universität Freiburg',
        city: 'Freiburg im Breisgau',
        website: 'www.uni-freiburg.de',
        applicationUrl: 'www.uni-freiburg.de/studium/bewerbung-und-zulassung/',
        specialty: 'Excellence en sciences environnementales et forestières',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Sciences forestières', level: 'Bachelor' },
            { name: 'Master en Environmental Sciences', level: 'Master' },
            { name: 'Master en Forest Sciences', level: 'Master' },
            { name: 'Master en Neurobiology', level: 'Master' },
            { name: 'Master en European Cultures', level: 'Master' },
            { name: 'Master en Archaeology', level: 'Master' },
            { name: 'Master en Computational Linguistics', level: 'Master' },
            { name: 'Master en Renewable Energy', level: 'Master' },
            { name: 'Master en Medical Microbiology', level: 'Master' },
            { name: 'Master en Sustainable Materials', level: 'Master' },
            { name: 'Master en International Economics', level: 'Master' }
        ]
    },
    {
        name: 'Eberhard Karls Universität Tübingen',
        city: 'Tübingen',
        website: 'www.uni-tuebingen.de',
        applicationUrl: 'www.uni-tuebingen.de/studium/studieninteresse/bewerbung.html',
        specialty: 'Excellence en neurosciences et sciences cognitives',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Biochimie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Théologie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Archéologie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Master en Neurosciences', level: 'Master' },
            { name: 'Master en Biochemistry', level: 'Master' },
            { name: 'Master en Cognitive Science', level: 'Master' },
            { name: 'Master en Archaeology', level: 'Master' },
            { name: 'Master en Philosophy of Science', level: 'Master' },
            { name: 'Master en Evolution and Ecology', level: 'Master' },
            { name: 'Master en Medical Physics', level: 'Master' },
            { name: 'Master en Bioinformatics', level: 'Master' },
            { name: 'Master en Cellular and Molecular Biology', level: 'Master' },
            { name: 'Master en Peace Research', level: 'Master' }
        ]
    },
    {
        name: 'Karlsruher Institut für Technologie (KIT)',
        city: 'Karlsruhe',
        website: 'www.kit.edu',
        applicationUrl: 'www.kit.edu/studieren/bewerbung.php',
        specialty: 'Excellence en technologies et recherche énergétique',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Génie chimique', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Sciences économiques', level: 'Bachelor' },
            { name: 'Génie industriel', level: 'Bachelor' },
            { name: 'Géosciences', level: 'Bachelor' },
            { name: 'Master en Energy Engineering', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Mechanical Engineering', level: 'Master' },
            { name: 'Master en Materials Science', level: 'Master' },
            { name: 'Master en Chemical Engineering', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en Environmental Engineering', level: 'Master' },
            { name: 'Master en Industrial Engineering', level: 'Master' },
            { name: 'Master en Information Systems', level: 'Master' }
        ]
    },
    {
        name: 'Technische Universität Dresden (TU Dresden)',
        city: 'Dresde',
        website: 'www.tu-dresden.de',
        applicationUrl: 'www.tu-dresden.de/studium/vor-dem-studium/bewerbung-einschreibung',
        specialty: 'Excellence en nanotechnologie et sciences des matériaux',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Master en Nanoelectronics', level: 'Master' },
            { name: 'Master en Computational Science', level: 'Master' },
            { name: 'Master en Molecular Bioengineering', level: 'Master' },
            { name: 'Master en Advanced Materials', level: 'Master' },
            { name: 'Master en Hydro Science', level: 'Master' },
            { name: 'Master en Architecture', level: 'Master' },
            { name: 'Master en Transport Sciences', level: 'Master' },
            { name: 'Master en Regenerative Biology', level: 'Master' },
            { name: 'Master en Forest Sciences', level: 'Master' },
            { name: 'Master en Vocational Education', level: 'Master' }
        ]
    },
    {
        name: 'Universität Stuttgart',
        city: 'Stuttgart',
        website: 'www.uni-stuttgart.de',
        applicationUrl: 'www.uni-stuttgart.de/studium/bewerbung/',
        specialty: 'Excellence en ingénierie automobile et aérospatiale',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie aérospatial', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Génie chimique', level: 'Bachelor' },
            { name: 'Sciences économiques', level: 'Bachelor' },
            { name: 'Master en Aerospace Engineering', level: 'Master' },
            { name: 'Master en Automotive Engineering', level: 'Master' },
            { name: 'Master en Software Technology', level: 'Master' },
            { name: 'Master en Computational Mechanics', level: 'Master' },
            { name: 'Master en Materials Science', level: 'Master' },
            { name: 'Master en Architecture and Urban Planning', level: 'Master' },
            { name: 'Master en Environmental Engineering', level: 'Master' },
            { name: 'Master en Information Technology', level: 'Master' },
            { name: 'Master en Renewable Energy', level: 'Master' },
            { name: 'Master en Simulation Technology', level: 'Master' }
        ]
    },
    {
        name: 'Friedrich-Alexander-Universität Erlangen-Nürnberg (FAU)',
        city: 'Erlangen/Nuremberg',
        website: 'www.fau.de',
        applicationUrl: 'www.fau.de/education/international-office/',
        specialty: 'Excellence en sciences des matériaux et ingénierie médicale',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Master en Advanced Materials and Processes', level: 'Master' },
            { name: 'Master en Medical Engineering', level: 'Master' },
            { name: 'Master en Information and Communication Technology', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Chemistry', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en International Business Studies', level: 'Master' },
            { name: 'Master en Political Science', level: 'Master' }
        ]
    },
    {
        name: 'Westfälische Wilhelms-Universität Münster (WWU)',
        city: 'Münster',
        website: 'www.uni-muenster.de',
        applicationUrl: 'www.uni-muenster.de/studium/bewerbung/',
        specialty: 'Excellence en chimie et sciences de la vie',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Master en Chemistry', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en Information Systems', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Political Science', level: 'Master' },
            { name: 'Master en History', level: 'Master' },
            { name: 'Master en Philosophy', level: 'Master' }
        ]
    },
    {
        name: 'Christian-Albrechts-Universität zu Kiel (CAU)',
        city: 'Kiel',
        website: 'www.uni-kiel.de',
        applicationUrl: 'www.uni-kiel.de/studium/bewerbung/',
        specialty: 'Excellence en sciences marines et géosciences',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie marine', level: 'Bachelor' },
            { name: 'Sciences de la terre', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Master en Marine Sciences', level: 'Master' },
            { name: 'Master en Geosciences', level: 'Master' },
            { name: 'Master en Environmental Management', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Chemistry', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Agricultural Sciences', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Sustainability Science', level: 'Master' }
        ]
    },
    {
        name: 'Julius-Maximilians-Universität Würzburg',
        city: 'Würzburg',
        website: 'www.uni-wuerzburg.de',
        applicationUrl: 'www.uni-wuerzburg.de/studium/bewerbung/',
        specialty: 'Excellence en biomédecine et sciences de la vie',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Biomédecine', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Master en Biomedicine', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Chemistry', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en History', level: 'Master' },
            { name: 'Master en Philosophy', level: 'Master' }
        ]
    },
    {
        name: 'Heinrich-Heine-Universität Düsseldorf',
        city: 'Düsseldorf',
        website: 'www.uni-duesseldorf.de',
        applicationUrl: 'www.uni-duesseldorf.de/home/studium-und-lehre/studium/bewerbung.html',
        specialty: 'Excellence en biochimie et études japonaises',
        programs: [
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Biochimie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Master en Biochemistry', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Philosophy', level: 'Master' },
            { name: 'Master en Sociology', level: 'Master' },
            { name: 'Master en Law', level: 'Master' },
            { name: 'Master en Modern Japanese Studies', level: 'Master' }
        ]
    },
    {
        name: 'Universität Mannheim',
        city: 'Mannheim',
        website: 'www.uni-mannheim.de',
        applicationUrl: 'www.uni-mannheim.de/studium/bewerbung/',
        specialty: 'Excellence en économie et gestion d\'entreprise',
        programs: [
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Gestion d\'entreprise', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Sciences politiques', level: 'Bachelor' },
            { name: 'Histoire', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Littérature allemande', level: 'Bachelor' },
            { name: 'Anglais', level: 'Bachelor' },
            { name: 'Romance', level: 'Bachelor' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Management', level: 'Master' },
            { name: 'Master en Business Research', level: 'Master' },
            { name: 'Master en Political Science', level: 'Master' },
            { name: 'Master en Sociology', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Data Science', level: 'Master' },
            { name: 'Master en Information Systems', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en History', level: 'Master' }
        ]
    },
    {
        name: 'Otto-von-Guericke-Universität Magdeburg',
        city: 'Magdeburg',
        website: 'www.ovgu.de',
        applicationUrl: 'www.ovgu.de/studium',
        specialty: 'Excellence en génie des procédés et technologies numériques',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Génie des procédés', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Médecine', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Master en Process Engineering', level: 'Master' },
            { name: 'Master en Electrical Engineering', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Mechanical Engineering', level: 'Master' },
            { name: 'Master en Materials Science', level: 'Master' },
            { name: 'Master en Digital Engineering', level: 'Master' },
            { name: 'Master en Chemical Engineering', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Data Knowledge Engineering', level: 'Master' }
        ]
    },
    {
        name: 'Universität Bremen',
        city: 'Brême',
        website: 'www.uni-bremen.de',
        applicationUrl: 'www.uni-bremen.de/studium/bewerbung-einschreibung',
        specialty: 'Excellence en sciences marines et recherche spatiale',
        programs: [
            { name: 'Sciences marines', level: 'Bachelor' },
            { name: 'Génie environnemental', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Psychologie', level: 'Bachelor' },
            { name: 'Sociologie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Sciences politiques', level: 'Bachelor' },
            { name: 'Linguistique', level: 'Bachelor' },
            { name: 'Master en Marine Sciences', level: 'Master' },
            { name: 'Master en Environmental Physics', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en Chemistry', level: 'Master' },
            { name: 'Master en Psychology', level: 'Master' },
            { name: 'Master en Sociology', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Space Sciences', level: 'Master' }
        ]
    },
    {
        name: 'Leibniz Universität Hannover',
        city: 'Hanovre',
        website: 'www.uni-hannover.de',
        applicationUrl: 'www.uni-hannover.de/de/studium/bewerbung/',
        specialty: 'Excellence en ingénierie et énergies renouvelables',
        programs: [
            { name: 'Génie mécanique', level: 'Bachelor' },
            { name: 'Génie électrique', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Architecture', level: 'Bachelor' },
            { name: 'Génie civil', level: 'Bachelor' },
            { name: 'Génie environnemental', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Master en Mechanical Engineering', level: 'Master' },
            { name: 'Master en Electrical Engineering', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Environmental Engineering', level: 'Master' },
            { name: 'Master en Materials Science', level: 'Master' },
            { name: 'Master en Architecture', level: 'Master' },
            { name: 'Master en Civil Engineering', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en Renewable Energy', level: 'Master' }
        ]
    },
    {
        name: 'Universität Bayreuth',
        city: 'Bayreuth',
        website: 'www.uni-bayreuth.de',
        applicationUrl: 'www.uni-bayreuth.de/studium/bewerbung/',
        specialty: 'Excellence en sciences environnementales et études africaines',
        programs: [
            { name: 'Sciences de l\'environnement', level: 'Bachelor' },
            { name: 'Génie chimique', level: 'Bachelor' },
            { name: 'Sciences des matériaux', level: 'Bachelor' },
            { name: 'Informatique', level: 'Bachelor' },
            { name: 'Mathématiques', level: 'Bachelor' },
            { name: 'Physique', level: 'Bachelor' },
            { name: 'Biologie', level: 'Bachelor' },
            { name: 'Chimie', level: 'Bachelor' },
            { name: 'Économie', level: 'Bachelor' },
            { name: 'Droit', level: 'Bachelor' },
            { name: 'Philosophie', level: 'Bachelor' },
            { name: 'Sciences africaines', level: 'Bachelor' },
            { name: 'Master en Global Change Ecology', level: 'Master' },
            { name: 'Master en Materials Chemistry', level: 'Master' },
            { name: 'Master en Environmental Chemistry', level: 'Master' },
            { name: 'Master en Computer Science', level: 'Master' },
            { name: 'Master en Mathematics', level: 'Master' },
            { name: 'Master en Physics', level: 'Master' },
            { name: 'Master en Biology', level: 'Master' },
            { name: 'Master en African Studies', level: 'Master' },
            { name: 'Master en Economics', level: 'Master' },
            { name: 'Master en Philosophy', level: 'Master' }
        ]
    }
];
const usersData = [
    {
        username: 'midzo',
        email: 'admin@midzo.com',
        password: 'midzolo', // Will be hashed
        firstName: 'Midzo',
        lastName: 'Admin'
    },
    {
        username: 'demo',
        email: 'demo@midzo.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User'
    }
];
async function seedDatabase() {
    console.log('🌱 Starting database seeding with Prisma...');
    try {
        // Connect to database
        await prisma.$connect();
        console.log('✅ Connected to database');
        // Seed categories
        console.log('Seeding categories...');
        for (const category of categoriesData) {
            await prisma.category.upsert({
                where: { id: category.id },
                update: {},
                create: category
            });
        }
        // Seed services
        console.log('Seeding services...');
        for (const service of servicesData) {
            const existingService = await prisma.service.findFirst({
                where: { name: service.name }
            });
            if (existingService) {
                await prisma.service.update({
                    where: { id: existingService.id },
                    data: service
                });
            }
            else {
                await prisma.service.create({
                    data: service
                });
            }
        }
        // Seed countries
        console.log('Seeding countries...');
        const countryMap = {};
        for (const countryData of countriesData) {
            const country = await prisma.country.upsert({
                where: { name: countryData.name },
                update: countryData,
                create: countryData
            });
            countryMap[country.name] = country.id;
        }
        // Seed country quick facts
        console.log('Seeding country quick facts...');
        const quickFacts = [
            // Europe
            { country: 'Spain', facts: [{ title: 'Capital', value: 'Madrid' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '47.4 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'France', facts: [{ title: 'Capital', value: 'Paris' }, { title: 'Language', value: 'French' }, { title: 'Population', value: '67 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Germany', facts: [{ title: 'Capital', value: 'Berlin' }, { title: 'Language', value: 'German' }, { title: 'Population', value: '83.2 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Italy', facts: [{ title: 'Capital', value: 'Rome' }, { title: 'Language', value: 'Italian' }, { title: 'Population', value: '60 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Portugal', facts: [{ title: 'Capital', value: 'Lisbon' }, { title: 'Language', value: 'Portuguese' }, { title: 'Population', value: '10.3 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Greece', facts: [{ title: 'Capital', value: 'Athens' }, { title: 'Language', value: 'Greek' }, { title: 'Population', value: '10.7 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Sweden', facts: [{ title: 'Capital', value: 'Stockholm' }, { title: 'Language', value: 'Swedish' }, { title: 'Population', value: '10.4 million' }, { title: 'Currency', value: 'Swedish Krona (SEK)' }] },
            { country: 'Norway', facts: [{ title: 'Capital', value: 'Oslo' }, { title: 'Language', value: 'Norwegian' }, { title: 'Population', value: '5.4 million' }, { title: 'Currency', value: 'Norwegian Krone (NOK)' }] },
            { country: 'Finland', facts: [{ title: 'Capital', value: 'Helsinki' }, { title: 'Language', value: 'Finnish, Swedish' }, { title: 'Population', value: '5.5 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Denmark', facts: [{ title: 'Capital', value: 'Copenhagen' }, { title: 'Language', value: 'Danish' }, { title: 'Population', value: '5.8 million' }, { title: 'Currency', value: 'Danish Krone (DKK)' }] },
            { country: 'Iceland', facts: [{ title: 'Capital', value: 'Reykjavik' }, { title: 'Language', value: 'Icelandic' }, { title: 'Population', value: '370,000' }, { title: 'Currency', value: 'Icelandic Krona (ISK)' }] },
            { country: 'Ireland', facts: [{ title: 'Capital', value: 'Dublin' }, { title: 'Language', value: 'Irish, English' }, { title: 'Population', value: '5 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'United Kingdom', facts: [{ title: 'Capital', value: 'London' }, { title: 'Language', value: 'English' }, { title: 'Population', value: '67.5 million' }, { title: 'Currency', value: 'British Pound (£)' }] },
            { country: 'Austria', facts: [{ title: 'Capital', value: 'Vienna' }, { title: 'Language', value: 'German' }, { title: 'Population', value: '9 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Switzerland', facts: [{ title: 'Capital', value: 'Bern' }, { title: 'Language', value: 'German, French, Italian' }, { title: 'Population', value: '8.7 million' }, { title: 'Currency', value: 'Swiss Franc (CHF)' }] },
            { country: 'Belgium', facts: [{ title: 'Capital', value: 'Brussels' }, { title: 'Language', value: 'Dutch, French, German' }, { title: 'Population', value: '11.6 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Netherlands', facts: [{ title: 'Capital', value: 'Amsterdam' }, { title: 'Language', value: 'Dutch' }, { title: 'Population', value: '17.5 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Luxembourg', facts: [{ title: 'Capital', value: 'Luxembourg City' }, { title: 'Language', value: 'Luxembourgish, French, German' }, { title: 'Population', value: '630,000' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Estonia', facts: [{ title: 'Capital', value: 'Tallinn' }, { title: 'Language', value: 'Estonian' }, { title: 'Population', value: '1.3 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Latvia', facts: [{ title: 'Capital', value: 'Riga' }, { title: 'Language', value: 'Latvian' }, { title: 'Population', value: '1.9 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            { country: 'Lithuania', facts: [{ title: 'Capital', value: 'Vilnius' }, { title: 'Language', value: 'Lithuanian' }, { title: 'Population', value: '2.8 million' }, { title: 'Currency', value: 'Euro (€)' }] },
            // Asia
            { country: 'China', facts: [{ title: 'Capital', value: 'Beijing' }, { title: 'Language', value: 'Mandarin Chinese' }, { title: 'Population', value: '1.4 billion' }, { title: 'Currency', value: 'Yuan (¥)' }] },
            { country: 'India', facts: [{ title: 'Capital', value: 'New Delhi' }, { title: 'Language', value: 'Hindi, English' }, { title: 'Population', value: '1.4 billion' }, { title: 'Currency', value: 'Indian Rupee (₹)' }] },
            { country: 'Japan', facts: [{ title: 'Capital', value: 'Tokyo' }, { title: 'Language', value: 'Japanese' }, { title: 'Population', value: '125 million' }, { title: 'Currency', value: 'Japanese Yen (¥)' }] },
            { country: 'South Korea', facts: [{ title: 'Capital', value: 'Seoul' }, { title: 'Language', value: 'Korean' }, { title: 'Population', value: '51.7 million' }, { title: 'Currency', value: 'Korean Won (₩)' }] },
            { country: 'Indonesia', facts: [{ title: 'Capital', value: 'Jakarta' }, { title: 'Language', value: 'Indonesian' }, { title: 'Population', value: '273 million' }, { title: 'Currency', value: 'Indonesian Rupiah (Rp)' }] },
            { country: 'Thailand', facts: [{ title: 'Capital', value: 'Bangkok' }, { title: 'Language', value: 'Thai' }, { title: 'Population', value: '69.8 million' }, { title: 'Currency', value: 'Thai Baht (฿)' }] },
            { country: 'Vietnam', facts: [{ title: 'Capital', value: 'Hanoi' }, { title: 'Language', value: 'Vietnamese' }, { title: 'Population', value: '97.3 million' }, { title: 'Currency', value: 'Vietnamese Dong (₫)' }] },
            { country: 'Malaysia', facts: [{ title: 'Capital', value: 'Kuala Lumpur' }, { title: 'Language', value: 'Malay' }, { title: 'Population', value: '32.7 million' }, { title: 'Currency', value: 'Malaysian Ringgit (RM)' }] },
            { country: 'Philippines', facts: [{ title: 'Capital', value: 'Manila' }, { title: 'Language', value: 'Filipino, English' }, { title: 'Population', value: '109 million' }, { title: 'Currency', value: 'Philippine Peso (₱)' }] },
            { country: 'Singapore', facts: [{ title: 'Capital', value: 'Singapore' }, { title: 'Language', value: 'English, Malay, Mandarin, Tamil' }, { title: 'Population', value: '5.9 million' }, { title: 'Currency', value: 'Singapore Dollar (S$)' }] },
            { country: 'Cambodia', facts: [{ title: 'Capital', value: 'Phnom Penh' }, { title: 'Language', value: 'Khmer' }, { title: 'Population', value: '16.7 million' }, { title: 'Currency', value: 'Cambodian Riel (៛)' }] },
            { country: 'Laos', facts: [{ title: 'Capital', value: 'Vientiane' }, { title: 'Language', value: 'Lao' }, { title: 'Population', value: '7.3 million' }, { title: 'Currency', value: 'Lao Kip (₭)' }] },
            { country: 'Dubai', facts: [{ title: 'Capital', value: 'Dubai' }, { title: 'Language', value: 'Arabic, English' }, { title: 'Population', value: '3.4 million' }, { title: 'Currency', value: 'UAE Dirham (AED)' }] },
            // North America
            { country: 'United States', facts: [{ title: 'Capital', value: 'Washington, D.C.' }, { title: 'Language', value: 'English' }, { title: 'Population', value: '331 million' }, { title: 'Currency', value: 'US Dollar ($)' }] },
            { country: 'Canada', facts: [{ title: 'Capital', value: 'Ottawa' }, { title: 'Language', value: 'English, French' }, { title: 'Population', value: '38 million' }, { title: 'Currency', value: 'Canadian Dollar (C$)' }] },
            // South America  
            { country: 'Mexico', facts: [{ title: 'Capital', value: 'Mexico City' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '128 million' }, { title: 'Currency', value: 'Mexican Peso ($)' }] },
            { country: 'Costa Rica', facts: [{ title: 'Capital', value: 'San José' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '5.1 million' }, { title: 'Currency', value: 'Costa Rican Colón (₡)' }] },
            { country: 'Panama', facts: [{ title: 'Capital', value: 'Panama City' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '4.3 million' }, { title: 'Currency', value: 'Panamanian Balboa (B/.)' }] },
            { country: 'Colombia', facts: [{ title: 'Capital', value: 'Bogotá' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '50.9 million' }, { title: 'Currency', value: 'Colombian Peso ($)' }] },
            { country: 'Venezuela', facts: [{ title: 'Capital', value: 'Caracas' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '28.4 million' }, { title: 'Currency', value: 'Venezuelan Bolívar (Bs.)' }] },
            { country: 'Ecuador', facts: [{ title: 'Capital', value: 'Quito' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '17.6 million' }, { title: 'Currency', value: 'US Dollar ($)' }] },
            { country: 'Peru', facts: [{ title: 'Capital', value: 'Lima' }, { title: 'Language', value: 'Spanish, Quechua' }, { title: 'Population', value: '33 million' }, { title: 'Currency', value: 'Peruvian Sol (S/)' }] },
            { country: 'Bolivia', facts: [{ title: 'Capital', value: 'La Paz, Sucre' }, { title: 'Language', value: 'Spanish, Quechua, Aymara' }, { title: 'Population', value: '11.8 million' }, { title: 'Currency', value: 'Bolivian Boliviano (Bs)' }] },
            { country: 'Chile', facts: [{ title: 'Capital', value: 'Santiago' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '19.1 million' }, { title: 'Currency', value: 'Chilean Peso ($)' }] },
            { country: 'Argentina', facts: [{ title: 'Capital', value: 'Buenos Aires' }, { title: 'Language', value: 'Spanish' }, { title: 'Population', value: '45.4 million' }, { title: 'Currency', value: 'Argentine Peso ($)' }] },
            { country: 'Brazil', facts: [{ title: 'Capital', value: 'Brasília' }, { title: 'Language', value: 'Portuguese' }, { title: 'Population', value: '215 million' }, { title: 'Currency', value: 'Brazilian Real (R$)' }] },
            // Africa
            { country: 'South Africa', facts: [{ title: 'Capital', value: 'Cape Town, Pretoria, Bloemfontein' }, { title: 'Language', value: '11 official languages' }, { title: 'Population', value: '60 million' }, { title: 'Currency', value: 'South African Rand (R)' }] },
            { country: 'Egypt', facts: [{ title: 'Capital', value: 'Cairo' }, { title: 'Language', value: 'Arabic' }, { title: 'Population', value: '104 million' }, { title: 'Currency', value: 'Egyptian Pound (£E)' }] },
            { country: 'Kenya', facts: [{ title: 'Capital', value: 'Nairobi' }, { title: 'Language', value: 'Swahili, English' }, { title: 'Population', value: '54 million' }, { title: 'Currency', value: 'Kenyan Shilling (KSh)' }] },
            { country: 'Morocco', facts: [{ title: 'Capital', value: 'Rabat' }, { title: 'Language', value: 'Arabic, Berber' }, { title: 'Population', value: '37.5 million' }, { title: 'Currency', value: 'Moroccan Dirham (MAD)' }] },
            { country: 'Tunisia', facts: [{ title: 'Capital', value: 'Tunis' }, { title: 'Language', value: 'Arabic' }, { title: 'Population', value: '11.8 million' }, { title: 'Currency', value: 'Tunisian Dinar (TND)' }] },
            { country: 'Rwanda', facts: [{ title: 'Capital', value: 'Kigali' }, { title: 'Language', value: 'Kinyarwanda, French, English' }, { title: 'Population', value: '13.3 million' }, { title: 'Currency', value: 'Rwandan Franc (RWF)' }] },
            { country: 'Mauritius', facts: [{ title: 'Capital', value: 'Port Louis' }, { title: 'Language', value: 'English, French, Creole' }, { title: 'Population', value: '1.3 million' }, { title: 'Currency', value: 'Mauritian Rupee (Rs)' }] },
            { country: 'Botswana', facts: [{ title: 'Capital', value: 'Gaborone' }, { title: 'Language', value: 'English, Setswana' }, { title: 'Population', value: '2.4 million' }, { title: 'Currency', value: 'Botswana Pula (P)' }] },
            { country: 'Namibia', facts: [{ title: 'Capital', value: 'Windhoek' }, { title: 'Language', value: 'English' }, { title: 'Population', value: '2.5 million' }, { title: 'Currency', value: 'Namibian Dollar (N$)' }] },
            { country: 'Ghana', facts: [{ title: 'Capital', value: 'Accra' }, { title: 'Language', value: 'English' }, { title: 'Population', value: '32.8 million' }, { title: 'Currency', value: 'Ghana Cedi (₵)' }] },
            { country: 'Nigeria', facts: [{ title: 'Capital', value: 'Abuja' }, { title: 'Language', value: 'English' }, { title: 'Population', value: '218 million' }, { title: 'Currency', value: 'Nigerian Naira (₦)' }] },
            { country: 'Tanzania', facts: [{ title: 'Capital', value: 'Dodoma' }, { title: 'Language', value: 'Swahili, English' }, { title: 'Population', value: '61.5 million' }, { title: 'Currency', value: 'Tanzanian Shilling (TZS)' }] },
            { country: 'Uganda', facts: [{ title: 'Capital', value: 'Kampala' }, { title: 'Language', value: 'English, Swahili' }, { title: 'Population', value: '47.1 million' }, { title: 'Currency', value: 'Ugandan Shilling (UGX)' }] },
            { country: 'Senegal', facts: [{ title: 'Capital', value: 'Dakar' }, { title: 'Language', value: 'French' }, { title: 'Population', value: '17.2 million' }, { title: 'Currency', value: 'West African CFA Franc (XOF)' }] },
            { country: 'Ethiopia', facts: [{ title: 'Capital', value: 'Addis Ababa' }, { title: 'Language', value: 'Amharic' }, { title: 'Population', value: '117 million' }, { title: 'Currency', value: 'Ethiopian Birr (ETB)' }] },
            { country: 'Ivory Coast', facts: [{ title: 'Capital', value: 'Yamoussoukro' }, { title: 'Language', value: 'French' }, { title: 'Population', value: '27.5 million' }, { title: 'Currency', value: 'West African CFA Franc (XOF)' }] }
        ];
        for (const countryFacts of quickFacts) {
            const countryId = countryMap[countryFacts.country];
            if (countryId) {
                for (const fact of countryFacts.facts) {
                    await prisma.countryQuickFact.upsert({
                        where: {
                            countryId_title: {
                                countryId,
                                title: fact.title
                            }
                        },
                        update: { value: fact.value },
                        create: {
                            countryId,
                            title: fact.title,
                            value: fact.value
                        }
                    });
                }
            }
        }
        // Seed sample traditions
        console.log('Seeding country traditions...');
        const traditions = [
            {
                countryId: countryMap['France'],
                name: 'Bastille Day',
                description: 'Annual celebration of the French Revolution with parades, fireworks, and festivities.',
                image: 'https://images.unsplash.com/photo-1534551767192-78b8dd45b51b'
            },
            {
                countryId: countryMap['Italy'],
                name: 'Carnevale',
                description: 'Pre-Lenten carnival with elaborate masks and costumes, especially famous in Venice.',
                image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7'
            }
        ];
        for (const tradition of traditions) {
            if (tradition.countryId) {
                await prisma.countryTradition.upsert({
                    where: {
                        countryId_name: {
                            countryId: tradition.countryId,
                            name: tradition.name
                        }
                    },
                    update: tradition,
                    create: tradition
                });
            }
        }
        // Seed sample cuisine
        console.log('Seeding country cuisine...');
        const cuisine = [
            {
                countryId: countryMap['France'],
                name: 'Croissants',
                description: 'Flaky, buttery pastries that are a staple of French breakfast.',
                image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'
            },
            {
                countryId: countryMap['Italy'],
                name: 'Pizza Napoletana',
                description: 'Traditional Neapolitan pizza with simple, fresh ingredients.',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002'
            }
        ];
        for (const dish of cuisine) {
            if (dish.countryId) {
                await prisma.countryCuisine.upsert({
                    where: {
                        countryId_name: {
                            countryId: dish.countryId,
                            name: dish.name
                        }
                    },
                    update: dish,
                    create: dish
                });
            }
        }
        // Seed sample places
        console.log('Seeding country places...');
        const places = [
            {
                countryId: countryMap['France'],
                name: 'Eiffel Tower',
                description: 'Iconic iron lattice tower on the Champ de Mars in Paris.',
                image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e'
            },
            {
                countryId: countryMap['Italy'],
                name: 'Colosseum',
                description: 'Ancient amphitheater and icon of Rome.',
                image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5'
            }
        ];
        for (const place of places) {
            if (place.countryId) {
                await prisma.countryPlace.upsert({
                    where: {
                        countryId_name: {
                            countryId: place.countryId,
                            name: place.name
                        }
                    },
                    update: place,
                    create: place
                });
            }
        }
        // Seed universities
        console.log('Seeding German universities...');
        for (const universityData of universitiesData) {
            const { programs, ...university } = universityData;
            // First create or update the university
            const createdUniversity = await prisma.university.upsert({
                where: { name: university.name },
                update: university,
                create: university
            });
            // Then create the programs for this university
            for (const program of programs) {
                await prisma.universityProgram.upsert({
                    where: {
                        universityId_name_level: {
                            universityId: createdUniversity.id,
                            name: program.name,
                            level: program.level
                        }
                    },
                    update: program,
                    create: {
                        ...program,
                        universityId: createdUniversity.id
                    }
                });
            }
        }
        // Seed users with hashed passwords
        console.log('Seeding users...');
        for (const user of usersData) {
            const hashedPassword = user.password;
            await prisma.user.upsert({
                where: { username: user.username },
                update: {},
                create: {
                    username: user.username,
                    email: user.email,
                    passwordHash: hashedPassword,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            });
        }
        console.log('✅ Database seeding completed successfully with Prisma!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
    finally {
        // Disconnect from database
        await prisma.$disconnect();
        console.log('🔌 Disconnected from database');
    }
}
// Main execution function
async function main() {
    try {
        await seedDatabase();
        process.exit(0);
    }
    catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}
// Run seeding directly
main();
export { seedDatabase };
//# sourceMappingURL=seed.js.map