// Catalogue des actualités — source de vérité du seed (story 1.6).
// Recopié depuis midzoweb/src/data (fichiers statiques supprimés depuis).

export interface NewsSeed {
  id: number;
  title: string;
  titleFr: string;
  titleDe: string;
  description: string;
  descriptionFr: string;
  descriptionDe: string;
  category: string;
  categoryKey: string;
  image: string;
  date: string;
  link?: string;
}

export const newsSeed: NewsSeed[] = [
  {
    "id": 1,
    "title": "FIFA World Cup 2026 — Plan Your Trip Now",
    "titleFr": "Coupe du Monde FIFA 2026 — Planifiez Votre Voyage Maintenant",
    "titleDe": "FIFA Weltmeisterschaft 2026 — Planen Sie Ihre Reise Jetzt",
    "description": "The 2026 World Cup spans USA, Canada and Mexico. 48 teams, 16 venues, and an unforgettable atmosphere. Midzoe builds your complete package: flights, accommodation, and match tickets.",
    "descriptionFr": "La Coupe du Monde 2026 se déroule aux USA, Canada et Mexique. 48 équipes, 16 stades, une atmosphère inoubliable. Midzoe vous construit votre package complet : vols, hébergement et billets de match.",
    "descriptionDe": "Die WM 2026 findet in den USA, Kanada und Mexiko statt. 48 Teams, 16 Spielorte, unvergessliche Atmosphäre. Midzoe erstellt Ihr komplettes Paket: Flüge, Unterkunft und Spieltickets.",
    "category": "Events",
    "categoryKey": "tourism",
    "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "date": "2026-01-15",
    "link": "/services/tourism-events"
  },
  {
    "id": 2,
    "title": "Safari in Botswana — The Okavango Delta Experience",
    "titleFr": "Safari au Botswana — L'Expérience du Delta de l'Okavango",
    "titleDe": "Safari in Botswana — Das Okavango-Delta Erlebnis",
    "description": "Discover one of Africa's last untouched wilderness areas. Boat rides through the delta, lion tracking, and stargazing under the African sky. Midzoe curates authentic experiences for true explorers.",
    "descriptionFr": "Découvrez l'une des dernières zones sauvages intactes d'Afrique. Balades en bateau dans le delta, pistage de lions et observation des étoiles sous le ciel africain. Midzoe crée des expériences authentiques pour les vrais explorateurs.",
    "descriptionDe": "Entdecken Sie eines der letzten unberührten Wildgebiete Afrikas. Bootsfahrten durch das Delta, Löwentracking und Sternbeobachtung unter dem afrikanischen Himmel. Midzoe kuratiert authentische Erlebnisse für echte Entdecker.",
    "category": "Safari",
    "categoryKey": "tourism",
    "image": "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "date": "2026-03-10",
    "link": "/services/tourism-safari"
  },
  {
    "id": 3,
    "title": "Lesotho — The Kingdom in the Sky",
    "titleFr": "Lesotho — Le Royaume dans le Ciel",
    "titleDe": "Lesotho — Das Königreich in den Wolken",
    "description": "Entirely surrounded by South Africa, Lesotho is Africa's best kept secret. Pony trekking through the Maluti Mountains, traditional villages and spectacular landscapes. A unique destination that Midzoe knows inside out.",
    "descriptionFr": "Entièrement entouré par l'Afrique du Sud, le Lesotho est le secret le mieux gardé d'Afrique. Randonnées à poney dans les montagnes Maluti, villages traditionnels et paysages spectaculaires. Une destination unique que Midzoe connaît sur le bout des doigts.",
    "descriptionDe": "Vollständig von Südafrika umgeben, ist Lesotho Afrikas bestgehütetes Geheimnis. Ponyreiten durch die Maluti-Berge, traditionelle Dörfer und spektakuläre Landschaften. Ein einzigartiges Reiseziel, das Midzoe in- und auswendig kennt.",
    "category": "Safari",
    "categoryKey": "tourism",
    "image": "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "date": "2026-02-20",
    "link": "/services/tourism-safari"
  },
  {
    "id": 4,
    "title": "Study Abroad — New Opportunities for 2026",
    "titleFr": "Études à l'Étranger — Nouvelles Opportunités pour 2026",
    "titleDe": "Auslandsstudium — Neue Möglichkeiten für 2026",
    "description": "Universities across Europe, Asia and North America are opening new international programs for 2026. Midzoe guides you through selection, application, visa and accommodation — one complete journey.",
    "descriptionFr": "Des universités d'Europe, d'Asie et d'Amérique du Nord ouvrent de nouveaux programmes internationaux pour 2026. Midzoe vous guide à travers la sélection, la candidature, le visa et le logement — un parcours complet.",
    "descriptionDe": "Universitäten in Europa, Asien und Nordamerika öffnen 2026 neue internationale Programme. Midzoe begleitet Sie durch Auswahl, Bewerbung, Visum und Unterkunft — eine vollständige Reise.",
    "category": "Study",
    "categoryKey": "study",
    "image": "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "date": "2026-01-05",
    "link": "/services"
  },
  {
    "id": 5,
    "title": "Sports Tourism — Travel Around Your Passion",
    "titleFr": "Tourisme Sportif — Voyagez Autour de Votre Passion",
    "titleDe": "Sporttourismus — Reisen rund um Ihre Leidenschaft",
    "description": "Marathons, tennis grand slams, rugby world cups — Midzoe organizes your entire sports travel experience. Transport, accommodation near the venue, and tickets. Your passion, our expertise.",
    "descriptionFr": "Marathons, grands chelems de tennis, coupes du monde de rugby — Midzoe organise toute votre expérience de voyage sportif. Transport, hébergement près du stade et billets. Votre passion, notre expertise.",
    "descriptionDe": "Marathons, Tennis-Grand-Slams, Rugby-Weltmeisterschaften — Midzoe organisiert Ihr gesamtes Sport-Reiseerlebnis. Transport, Unterkunft in der Nähe des Veranstaltungsorts und Tickets. Ihre Leidenschaft, unsere Expertise.",
    "category": "Sports",
    "categoryKey": "tourism",
    "image": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "date": "2026-02-01",
    "link": "/services/tourism-sports"
  }
];
