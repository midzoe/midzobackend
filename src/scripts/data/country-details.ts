// Catalogue des fiches pays — source de vérité du seed (story 1.6).
// Recopié depuis midzoweb/src/data (fichiers statiques supprimés depuis).

export interface CountryTranslationSeed {
  motto: string;
  quickFacts: { title: string; value: string }[];
  history: string;
  traditions: { name: string; description: string }[];
  cuisine: { name: string; description: string }[];
  modernLife: string;
  trends: string[];
  places: { name: string; description: string }[];
}

export interface CountryDetailSeed {
  heroImage: string;
  motto: string;
  quickFacts: { title: string; value: string }[];
  history: string;
  culturalImage: string;
  traditions: { name: string; description: string; image: string }[];
  cuisine: { name: string; description: string; image: string }[];
  modernLife: string;
  trends: string[];
  modernImage: string;
  places: { name: string; description: string; image: string }[];
  fr?: CountryTranslationSeed;
  de?: CountryTranslationSeed;
}

export const countryDetailsSeed: { [country: string]: CountryDetailSeed } = {
  "France": {
    "heroImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Liberty, Equality, Fraternity",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Paris"
      },
      {
        "title": "Language",
        "value": "French"
      },
      {
        "title": "Population",
        "value": "67 million"
      },
      {
        "title": "Currency",
        "value": "Euro (€)"
      }
    ],
    "history": "France has a rich history spanning over two millennia, from ancient Roman Gaul to the powerful French monarchy, the French Revolution, and its current position as a leading global power. The country has been at the forefront of European art, science, and culture for centuries.",
    "culturalImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Bastille Day",
        "description": "Annual celebration of the French Revolution with parades, fireworks, and festivities.",
        "image": "https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Wine Harvest Festival",
        "description": "Traditional celebration of grape harvest season in wine-producing regions.",
        "image": "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Christmas Markets",
        "description": "Traditional winter markets featuring local crafts, food, and festive atmosphere.",
        "image": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Croissants",
        "description": "Flaky, buttery pastries that are a staple of French breakfast.",
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Coq au Vin",
        "description": "Traditional dish of chicken braised in wine, lardons, mushrooms, and garlic.",
        "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Macarons",
        "description": "Colorful meringue-based sandwich cookies with various flavored fillings.",
        "image": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern France blends traditional values with contemporary lifestyle. The country maintains its reputation for fashion, gastronomy, and art while embracing innovation in technology and sustainable living.",
    "trends": [
      "Growing focus on sustainable fashion and eco-friendly practices",
      "Rise of modern French cuisine fusion",
      "Expanding startup and tech scene",
      "Emphasis on work-life balance"
    ],
    "modernImage": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Eiffel Tower",
        "description": "Iconic iron lattice tower on the Champ de Mars in Paris.",
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Palace of Versailles",
        "description": "Opulent royal château and gardens that symbolize French monarchy.",
        "image": "https://images.unsplash.com/photo-1524396309943-e03f5249f002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Mont Saint-Michel",
        "description": "Medieval monastery perched on a tidal island in Normandy.",
        "image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Liberté, Égalité, Fraternité",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Paris"
        },
        {
          "title": "Langue",
          "value": "Français"
        },
        {
          "title": "Population",
          "value": "67 millions"
        },
        {
          "title": "Monnaie",
          "value": "Euro (€)"
        }
      ],
      "history": "La France a une riche histoire couvrant plus de deux millénaires, de la Gaule romaine à la puissante monarchie française, la Révolution française, et sa position actuelle de grande puissance mondiale. Le pays a été à l'avant-garde de l'art, des sciences et de la culture européens pendant des siècles.",
      "traditions": [
        {
          "name": "Fête Nationale",
          "description": "Célébration annuelle de la Révolution française avec défilés, feux d'artifice et festivités le 14 juillet."
        },
        {
          "name": "Fête des vendanges",
          "description": "Célébration traditionnelle de la saison des récoltes dans les régions viticoles de France."
        },
        {
          "name": "Marchés de Noël",
          "description": "Marchés d'hiver traditionnels proposant artisanat local, gastronomie et ambiance festive."
        }
      ],
      "cuisine": [
        {
          "name": "Croissants",
          "description": "Viennoiseries feuilletées et beurrées, incontournables du petit-déjeuner français."
        },
        {
          "name": "Coq au Vin",
          "description": "Plat traditionnel de poulet braisé au vin avec lardons, champignons et ail."
        },
        {
          "name": "Macarons",
          "description": "Colorés biscuits à base de meringue avec diverses garnitures parfumées."
        }
      ],
      "modernLife": "La France moderne mêle valeurs traditionnelles et mode de vie contemporain. Le pays maintient sa réputation dans la mode, la gastronomie et l'art tout en embrassant l'innovation technologique et le développement durable.",
      "trends": [
        "Focus croissant sur la mode durable et les pratiques écologiques",
        "Essor de la cuisine fusion française moderne",
        "Développement de la scène startup et tech",
        "Accent sur l'équilibre travail-vie personnelle"
      ],
      "places": [
        {
          "name": "Tour Eiffel",
          "description": "Tour en treillis de fer emblématique sur le Champ de Mars à Paris."
        },
        {
          "name": "Château de Versailles",
          "description": "Château royal somptueux et jardins symbolisant la monarchie française."
        },
        {
          "name": "Mont Saint-Michel",
          "description": "Monastère médiéval perché sur un îlot marémoteur en Normandie."
        }
      ]
    },
    "de": {
      "motto": "Freiheit, Gleichheit, Brüderlichkeit",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Paris"
        },
        {
          "title": "Sprache",
          "value": "Französisch"
        },
        {
          "title": "Bevölkerung",
          "value": "67 Millionen"
        },
        {
          "title": "Währung",
          "value": "Euro (€)"
        }
      ],
      "history": "Frankreich hat eine reiche Geschichte, die über zwei Jahrtausende zurückreicht, von der Gallia romana über die Monarchie und die Französische Revolution bis zu seiner heutigen Position als führende Weltmacht.",
      "traditions": [
        {
          "name": "Nationalfeiertag",
          "description": "Jährliche Feier der Französischen Revolution am 14. Juli mit Paraden, Feuerwerk und Festivitäten."
        },
        {
          "name": "Weinernte-Festival",
          "description": "Traditionelle Feier der Traubenerntesaison in den weinproduzierenden Regionen."
        },
        {
          "name": "Weihnachtsmärkte",
          "description": "Traditionelle Wintermärkte mit lokalem Kunsthandwerk und festlicher Atmosphäre."
        }
      ],
      "cuisine": [
        {
          "name": "Croissants",
          "description": "Blätteriges Buttergebäck, ein Grundnahrungsmittel des französischen Frühstücks."
        },
        {
          "name": "Coq au Vin",
          "description": "Traditionelles Hühnchengericht in Wein mit Speckwürfeln und Champignons geschmort."
        },
        {
          "name": "Macarons",
          "description": "Bunte Baiser-Sandwichkekse mit verschiedenen Geschmacksfüllungen."
        }
      ],
      "modernLife": "Das moderne Frankreich verbindet traditionelle Werte mit zeitgemäßem Lebensstil in Mode, Gastronomie und Kunst und setzt gleichzeitig auf technologische Innovation und Nachhaltigkeit.",
      "trends": [
        "Wachsender Fokus auf nachhaltige Mode",
        "Aufstieg der modernen Fusionsküche",
        "Expandierende Startup- und Tech-Szene",
        "Betonung der Work-Life-Balance"
      ],
      "places": [
        {
          "name": "Eiffelturm",
          "description": "Ikonischer Eisengitterturm am Champ de Mars in Paris."
        },
        {
          "name": "Schloss Versailles",
          "description": "Prunkvolles königliches Schloss und Gärten als Symbol der französischen Monarchie."
        },
        {
          "name": "Mont Saint-Michel",
          "description": "Mittelalterliches Kloster auf einer Gezeitinsel in der Normandie."
        }
      ]
    }
  },
  "United Kingdom": {
    "heroImage": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Dieu et mon droit",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "London"
      },
      {
        "title": "Language",
        "value": "English"
      },
      {
        "title": "Population",
        "value": "67 million"
      },
      {
        "title": "Currency",
        "value": "Pound Sterling (£)"
      }
    ],
    "history": "The United Kingdom has a rich history spanning from ancient Celtic settlements through Roman occupation, the Norman Conquest of 1066, the British Empire, and two World Wars, to its current role as a leading global democracy and cultural power.",
    "culturalImage": "https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Changing of the Guard",
        "description": "Ceremonial military tradition at Buckingham Palace, a symbol of the British monarchy.",
        "image": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Afternoon Tea",
        "description": "A beloved British tradition of tea served with scones, sandwiches, and cakes in the afternoon.",
        "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Guy Fawkes Night",
        "description": "Annual bonfire and fireworks celebration on November 5th commemorating the Gunpowder Plot of 1605.",
        "image": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Fish and Chips",
        "description": "Iconic British dish of battered fried fish served with thick-cut chips.",
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sunday Roast",
        "description": "Traditional weekly meal of roasted meat, potatoes, vegetables, and Yorkshire pudding.",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Scones",
        "description": "Classic British baked goods served with clotted cream and jam, a staple of afternoon tea.",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern Britain is a vibrant multicultural society that balances deep-rooted traditions with cutting-edge innovation. London is a global hub for finance, fashion, arts, and technology, while the rest of the country thrives in creativity and enterprise.",
    "trends": [
      "Thriving tech and fintech startup ecosystem in London",
      "Sustainable living and green energy investment",
      "Multicultural cuisine and food scene growth",
      "University innovation and research excellence"
    ],
    "modernImage": "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Big Ben & Houses of Parliament",
        "description": "Iconic Gothic Revival parliament buildings on the Thames in Westminster.",
        "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Buckingham Palace",
        "description": "Official residence of the British monarch and a major tourist landmark.",
        "image": "https://images.unsplash.com/photo-1520986606214-8b456906c813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Stonehenge",
        "description": "Prehistoric monument on Salisbury Plain, one of the world's most famous archaeological sites.",
        "image": "https://images.unsplash.com/photo-1599833975787-5c143f373c30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Dieu et mon droit",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Londres"
        },
        {
          "title": "Langue",
          "value": "Anglais"
        },
        {
          "title": "Population",
          "value": "67 millions"
        },
        {
          "title": "Monnaie",
          "value": "Livre sterling (£)"
        }
      ],
      "history": "Le Royaume-Uni a une riche histoire allant des anciennes colonies celtiques à l'occupation romaine, la Conquête normande de 1066, l'Empire britannique et deux guerres mondiales, jusqu'à son rôle actuel de démocratie mondiale et de puissance culturelle de premier plan.",
      "traditions": [
        {
          "name": "Relève de la Garde",
          "description": "Tradition militaire cérémonielle au Palais de Buckingham, symbole de la monarchie britannique."
        },
        {
          "name": "Thé de l'après-midi",
          "description": "Chère tradition britannique de thé servi avec scones, sandwichs et gâteaux en après-midi."
        },
        {
          "name": "Nuit de Guy Fawkes",
          "description": "Célébration annuelle de feux de joie et feux d'artifice le 5 novembre commémorant la Conspiration des poudres de 1605."
        }
      ],
      "cuisine": [
        {
          "name": "Fish and Chips",
          "description": "Plat britannique emblématique de poisson frit en pâte servi avec des frites épaisses."
        },
        {
          "name": "Rôti du dimanche",
          "description": "Repas hebdomadaire traditionnel de viande rôtie, pommes de terre, légumes et Yorkshire pudding."
        },
        {
          "name": "Scones",
          "description": "Pâtisseries britanniques classiques servies avec crème caillée et confiture, pilier du thé de l'après-midi."
        }
      ],
      "modernLife": "La Grande-Bretagne moderne est une société multiculturelle vibrante qui équilibre traditions profondes et innovation de pointe. Londres est un hub mondial pour la finance, la mode, les arts et la technologie.",
      "trends": [
        "Écosystème startup tech et fintech florissant à Londres",
        "Investissement dans le mode de vie durable et l'énergie verte",
        "Essor de la cuisine multiculturelle",
        "Excellence universitaire et recherche innovante"
      ],
      "places": [
        {
          "name": "Big Ben et Parlement",
          "description": "Bâtiments parlementaires néogothiques emblématiques sur la Tamise à Westminster."
        },
        {
          "name": "Palais de Buckingham",
          "description": "Résidence officielle du monarque britannique et attraction touristique majeure."
        },
        {
          "name": "Stonehenge",
          "description": "Monument préhistorique dans la plaine de Salisbury, l'un des sites archéologiques les plus célèbres au monde."
        }
      ]
    },
    "de": {
      "motto": "Gott und mein Recht",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "London"
        },
        {
          "title": "Sprache",
          "value": "Englisch"
        },
        {
          "title": "Bevölkerung",
          "value": "67 Millionen"
        },
        {
          "title": "Währung",
          "value": "Pfund Sterling (£)"
        }
      ],
      "history": "Das Vereinigte Königreich hat eine reiche Geschichte von den keltischen Siedlungen über die normannische Eroberung 1066, das Britische Empire und zwei Weltkriege bis zu seiner heutigen Rolle als führende Demokratie und Kulturnation.",
      "traditions": [
        {
          "name": "Wachablösung",
          "description": "Zeremonielle Militärtradition am Buckingham Palace, Symbol der britischen Monarchie."
        },
        {
          "name": "Nachmittagstee",
          "description": "Britische Tradition mit Tee, Scones, Sandwiches und Kuchen am Nachmittag."
        },
        {
          "name": "Guy Fawkes Nacht",
          "description": "Jährliche Feier mit Lagerfeuer und Feuerwerk am 5. November zur Erinnerung an den Pulverplot."
        }
      ],
      "cuisine": [
        {
          "name": "Fish and Chips",
          "description": "Ikonisches britisches Gericht aus frittiertem Fisch in Teig mit dicken Pommes."
        },
        {
          "name": "Sonntagsbraten",
          "description": "Traditionelle wöchentliche Mahlzeit mit gebratenem Fleisch, Kartoffeln und Yorkshire Pudding."
        },
        {
          "name": "Scones",
          "description": "Klassisches britisches Gebäck mit Clotted Cream und Marmelade, ein Grundstein des Nachmittagstees."
        }
      ],
      "modernLife": "Das moderne Großbritannien ist eine vibrierende multikulturelle Gesellschaft, die tiefe Traditionen mit Spitzeninnovation verbindet. London ist ein globaler Hub für Finanzen, Mode, Kunst und Technologie.",
      "trends": [
        "Florierendes Tech- und Fintech-Startup-Ökosystem in London",
        "Investitionen in nachhaltige Energie",
        "Wachsende multikulturelle Küche",
        "Universitäre Innovationsexzellenz"
      ],
      "places": [
        {
          "name": "Big Ben und Parlament",
          "description": "Ikonische neugotische Parlamentsgebäude an der Themse in Westminster."
        },
        {
          "name": "Buckingham Palace",
          "description": "Offizielle Residenz des britischen Monarchen und wichtiges Touristenziel."
        },
        {
          "name": "Stonehenge",
          "description": "Prähistorisches Denkmal in der Salisbury-Ebene, eine der berühmtesten archäologischen Stätten der Welt."
        }
      ]
    }
  },
  "United States": {
    "heroImage": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "In God We Trust",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Washington D.C."
      },
      {
        "title": "Language",
        "value": "English"
      },
      {
        "title": "Population",
        "value": "331 million"
      },
      {
        "title": "Currency",
        "value": "US Dollar ($)"
      }
    ],
    "history": "The United States was founded in 1776 after declaring independence from Britain. It expanded westward throughout the 19th century, survived a Civil War, emerged as a global superpower after World War II, and continues to lead in innovation, culture, and international affairs.",
    "culturalImage": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Thanksgiving",
        "description": "Annual harvest festival celebrated on the fourth Thursday of November with family gatherings and feasting.",
        "image": "https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Fourth of July",
        "description": "Independence Day celebration with fireworks, parades, and barbecues across the country.",
        "image": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Halloween",
        "description": "Spooky celebration on October 31st with costumes, trick-or-treating, and pumpkin carving.",
        "image": "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Burgers",
        "description": "The classic American hamburger, a cultural icon found from diners to gourmet restaurants.",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "BBQ Ribs",
        "description": "Slow-smoked barbecue ribs with regional variations from Texas to Memphis to the Carolinas.",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Apple Pie",
        "description": "Quintessential American dessert made with spiced apple filling in a flaky pastry crust.",
        "image": "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "The United States is a global leader in technology, entertainment, and innovation. Silicon Valley drives the digital economy, Hollywood shapes world culture, and world-class universities attract students from across the globe.",
    "trends": [
      "Leading innovation in AI, tech, and space exploration",
      "Diverse and rapidly growing startup ecosystem",
      "Expanding renewable energy and sustainability focus",
      "Cultural diversity driving creative industries"
    ],
    "modernImage": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Grand Canyon",
        "description": "Stunning natural wonder carved by the Colorado River in Arizona.",
        "image": "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Statue of Liberty",
        "description": "Iconic symbol of freedom and democracy in New York Harbor.",
        "image": "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Yellowstone National Park",
        "description": "World's first national park, famous for geysers, hot springs, and wildlife.",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "En Dieu nous croyons",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Washington D.C."
        },
        {
          "title": "Langue",
          "value": "Anglais"
        },
        {
          "title": "Population",
          "value": "331 millions"
        },
        {
          "title": "Monnaie",
          "value": "Dollar américain ($)"
        }
      ],
      "history": "Les États-Unis ont été fondés en 1776 après leur indépendance de la Grande-Bretagne. Le pays s'est étendu vers l'ouest au XIXe siècle, a survécu à une Guerre civile, émergé comme superpuissance mondiale après la Seconde Guerre mondiale, et continue de mener en innovation, culture et affaires internationales.",
      "traditions": [
        {
          "name": "Thanksgiving",
          "description": "Fête de la récolte célébrée le quatrième jeudi de novembre avec des rassemblements familiaux et des festins."
        },
        {
          "name": "Fête du 4 juillet",
          "description": "Fête de l'Indépendance avec feux d'artifice, défilés et barbecues dans tout le pays."
        },
        {
          "name": "Halloween",
          "description": "Célébration le 31 octobre avec costumes, tournée des bonbons et sculpture de citrouilles."
        }
      ],
      "cuisine": [
        {
          "name": "Burgers",
          "description": "Le hamburger américain classique, une icône culturelle des diners aux restaurants gastronomiques."
        },
        {
          "name": "Côtes BBQ",
          "description": "Côtes de barbecue fumées lentement avec des variations régionales du Texas au Tennessee."
        },
        {
          "name": "Tarte aux pommes",
          "description": "Dessert américain par excellence avec une garniture de pommes épicées dans une croûte feuilletée."
        }
      ],
      "modernLife": "Les États-Unis sont un leader mondial de la technologie, du divertissement et de l'innovation. La Silicon Valley anime l'économie numérique, Hollywood façonne la culture mondiale, et les universités de renommée mondiale attirent des étudiants du monde entier.",
      "trends": [
        "Leader de l'innovation en IA, tech et exploration spatiale",
        "Écosystème startup diversifié et en forte croissance",
        "Expansion des énergies renouvelables et focus durabilité",
        "Diversité culturelle stimulant les industries créatives"
      ],
      "places": [
        {
          "name": "Grand Canyon",
          "description": "Merveille naturelle spectaculaire creusée par le fleuve Colorado en Arizona."
        },
        {
          "name": "Statue de la Liberté",
          "description": "Symbole emblématique de la liberté et de la démocratie dans le port de New York."
        },
        {
          "name": "Parc national de Yellowstone",
          "description": "Premier parc national au monde, célèbre pour ses geysers, sources chaudes et faune sauvage."
        }
      ]
    },
    "de": {
      "motto": "In Gott vertrauen wir",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Washington D.C."
        },
        {
          "title": "Sprache",
          "value": "Englisch"
        },
        {
          "title": "Bevölkerung",
          "value": "331 Millionen"
        },
        {
          "title": "Währung",
          "value": "US-Dollar ($)"
        }
      ],
      "history": "Die USA wurden 1776 nach der Unabhängigkeit von Großbritannien gegründet, expandierten westwärts im 19. Jahrhundert, überlebten einen Bürgerkrieg und wurden nach dem Zweiten Weltkrieg zur globalen Supermacht.",
      "traditions": [
        {
          "name": "Erntedankfest",
          "description": "Jährliches Ernte-Fest am vierten Donnerstag im November mit Familientreffen und Festmahl."
        },
        {
          "name": "4. Juli",
          "description": "Unabhängigkeitstag mit Feuerwerk, Paraden und Grillpartys im ganzen Land."
        },
        {
          "name": "Halloween",
          "description": "Gruselige Feier am 31. Oktober mit Kostümen, Trick-or-Treating und Kürbisschnitzen."
        }
      ],
      "cuisine": [
        {
          "name": "Burger",
          "description": "Der klassische amerikanische Hamburger, eine Kulturikone von Diners bis Gourmet-Restaurants."
        },
        {
          "name": "BBQ-Ribs",
          "description": "Langsam geräucherte Barbecue-Ribs mit regionalen Variationen von Texas bis Tennessee."
        },
        {
          "name": "Apfelkuchen",
          "description": "Quintessentielles amerikanisches Dessert mit gewürzter Apfelfüllung in knusprigem Teig."
        }
      ],
      "modernLife": "Die USA sind weltführend in Technologie, Unterhaltung und Innovation. Silicon Valley treibt die Digitalwirtschaft an, Hollywood prägt die Weltkultur und Spitzenuniversitäten ziehen Studenten aus aller Welt an.",
      "trends": [
        "Führend bei KI, Tech und Weltraumforschung",
        "Diverses und wachsendes Startup-Ökosystem",
        "Ausbau erneuerbarer Energien",
        "Kulturelle Vielfalt als Kreativmotor"
      ],
      "places": [
        {
          "name": "Grand Canyon",
          "description": "Atemberaubendes Naturwunder, vom Colorado River in Arizona geformt."
        },
        {
          "name": "Freiheitsstatue",
          "description": "Ikonisches Symbol für Freiheit und Demokratie im New Yorker Hafen."
        },
        {
          "name": "Yellowstone Nationalpark",
          "description": "Erster Nationalpark der Welt, berühmt für Geysire, heiße Quellen und Wildtiere."
        }
      ]
    }
  },
  "Canada": {
    "heroImage": "https://images.unsplash.com/photo-1534430480872-3498386e7856?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "A Mari Usque Ad Mare",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Ottawa"
      },
      {
        "title": "Language",
        "value": "English & French"
      },
      {
        "title": "Population",
        "value": "38 million"
      },
      {
        "title": "Currency",
        "value": "Canadian Dollar (CAD)"
      }
    ],
    "history": "Canada's history spans thousands of years of Indigenous cultures, followed by French and British colonization, Confederation in 1867, and its growth into a prosperous bilingual, multicultural nation known for peacekeeping and humanitarian values.",
    "culturalImage": "https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Canada Day",
        "description": "National day celebrated on July 1st with fireworks, parades, and festivities marking Confederation in 1867.",
        "image": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Maple Syrup Festival",
        "description": "Spring celebration of Canada's iconic maple syrup harvest in sugar bush forests.",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Caribana",
        "description": "Toronto's vibrant Caribbean festival, one of North America's largest cultural celebrations.",
        "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Poutine",
        "description": "Canadian comfort food of french fries topped with cheese curds and rich gravy.",
        "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Maple Syrup",
        "description": "Canada produces over 70% of the world's maple syrup, used in everything from pancakes to glazes.",
        "image": "https://images.unsplash.com/photo-1551529834-525807d6b4f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Butter Tarts",
        "description": "Traditional Canadian pastry with a flaky shell filled with sweet buttery custard.",
        "image": "https://images.unsplash.com/photo-1509461399763-ae67a981b254?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Canada is celebrated for its high quality of life, multiculturalism, and stunning natural landscapes. Its cities rank among the world's most livable, with strong public services, a welcoming immigration policy, and thriving tech and creative industries.",
    "trends": [
      "Growing AI and tech hub in Toronto and Vancouver",
      "Strong commitment to environmental conservation",
      "Multicultural society embracing diversity",
      "World-leading universities attracting global students"
    ],
    "modernImage": "https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Niagara Falls",
        "description": "Spectacular waterfall system on the border of Ontario and New York, one of the world's most visited natural wonders.",
        "image": "https://images.unsplash.com/photo-1489447068241-b3490214e879?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Banff National Park",
        "description": "Breathtaking Rocky Mountain park in Alberta with turquoise lakes and dramatic peaks.",
        "image": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Old Quebec City",
        "description": "UNESCO-listed historic fortified city with French colonial architecture and cobblestone streets.",
        "image": "https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "D'un océan à l'autre",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Ottawa"
        },
        {
          "title": "Langue",
          "value": "Anglais & Français"
        },
        {
          "title": "Population",
          "value": "38 millions"
        },
        {
          "title": "Monnaie",
          "value": "Dollar canadien (CAD)"
        }
      ],
      "history": "L'histoire du Canada couvre des milliers d'années de cultures autochtones, suivies de la colonisation française et britannique, la Confédération en 1867, et sa croissance en une nation bilingue multiculturelle prospère connue pour le maintien de la paix et les valeurs humanitaires.",
      "traditions": [
        {
          "name": "Fête du Canada",
          "description": "Fête nationale le 1er juillet avec feux d'artifice, défilés et célébrations marquant la Confédération de 1867."
        },
        {
          "name": "Festival du sirop d'érable",
          "description": "Célébration printanière de la récolte du sirop d'érable canadien dans les érablières."
        },
        {
          "name": "Caribana",
          "description": "Le vibrant festival caribéen de Toronto, l'une des plus grandes célébrations culturelles d'Amérique du Nord."
        }
      ],
      "cuisine": [
        {
          "name": "Poutine",
          "description": "Plat réconfortant canadien de frites nappées de fromage en grains et de sauce brune."
        },
        {
          "name": "Sirop d'érable",
          "description": "Le Canada produit plus de 70% du sirop d'érable mondial, utilisé de la crêpe à la marinade."
        },
        {
          "name": "Tartelettes au beurre",
          "description": "Pâtisserie traditionnelle canadienne avec une croûte feuilletée remplie de crème pâtissière sucrée."
        }
      ],
      "modernLife": "Le Canada est célébré pour sa haute qualité de vie, son multiculturalisme et ses paysages naturels époustouflants. Ses villes figurent parmi les plus agréables à vivre au monde, avec de solides services publics et une politique d'immigration accueillante.",
      "trends": [
        "Hub IA et tech en croissance à Toronto et Vancouver",
        "Fort engagement pour la protection de l'environnement",
        "Société multiculturelle accueillant la diversité",
        "Universités de renommée mondiale attirant des étudiants internationaux"
      ],
      "places": [
        {
          "name": "Chutes du Niagara",
          "description": "Spectaculaire système de chutes sur la frontière Ontario-New York, l'une des merveilles naturelles les plus visitées."
        },
        {
          "name": "Parc national de Banff",
          "description": "Magnifique parc des Rocheuses en Alberta avec des lacs turquoise et des pics dramatiques."
        },
        {
          "name": "Vieux-Québec",
          "description": "Ville fortifiée historique inscrite à l'UNESCO avec architecture coloniale française et rues pavées."
        }
      ]
    },
    "de": {
      "motto": "Von Meer zu Meer",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Ottawa"
        },
        {
          "title": "Sprache",
          "value": "Englisch & Französisch"
        },
        {
          "title": "Bevölkerung",
          "value": "38 Millionen"
        },
        {
          "title": "Währung",
          "value": "Kanadischer Dollar (CAD)"
        }
      ],
      "history": "Kanadas Geschichte umfasst Jahrtausende indigener Kulturen, gefolgt von französischer und britischer Kolonisierung, dem Zusammenschluss 1867 und dem Wachstum zu einer wohlhabenden bilingualen, multikulturellen Nation.",
      "traditions": [
        {
          "name": "Kanada-Tag",
          "description": "Nationalfeiertag am 1. Juli mit Feuerwerk, Paraden und Festen zum Gedenken an die Konföderation 1867."
        },
        {
          "name": "Ahornsirup-Festival",
          "description": "Frühlingsfest zur Ahornsirup-Ernte in den Zuckerwäldern Kanadas."
        },
        {
          "name": "Caribana",
          "description": "Torontos lebhaftes Karibik-Festival, eines der größten Kulturfeste Nordamerikas."
        }
      ],
      "cuisine": [
        {
          "name": "Poutine",
          "description": "Kanadisches Comfort-Food aus Pommes mit Käsebruch und Soße."
        },
        {
          "name": "Ahornsirup",
          "description": "Kanada produziert über 70% des weltweiten Ahornsirups für Pfannkuchen und Marinaden."
        },
        {
          "name": "Butter-Törtchen",
          "description": "Traditionelles kanadisches Gebäck mit butterig süßer Fülung in einer knusprigen Hülle."
        }
      ],
      "modernLife": "Kanada ist bekannt für hohe Lebensqualität, Multikulturalismus und atemberaubende Natur. Seine Städte gehören zu den lebenswertesten weltweit mit starken Sozialdiensten und offener Einwanderungspolitik.",
      "trends": [
        "Wachsendes KI- und Tech-Zentrum in Toronto und Vancouver",
        "Starkes Umweltschutzenagement",
        "Multikulturelle Gesellschaft mit gelebter Vielfalt",
        "Weltklasse-Universitäten für internationale Studenten"
      ],
      "places": [
        {
          "name": "Niagarafälle",
          "description": "Spektakuläres Wasserfallsystem an der Grenze Ontario-New York, eines der meistbesuchten Naturwunder."
        },
        {
          "name": "Banff Nationalpark",
          "description": "Atemberaubender Rocky-Mountain-Park in Alberta mit türkisfarbenen Seen und dramatischen Gipfeln."
        },
        {
          "name": "Alt-Québec-Stadt",
          "description": "UNESCO-gelistete historische Festungsstadt mit französischer Kolonialarchitektur."
        }
      ]
    }
  },
  "Germany": {
    "heroImage": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Einigkeit und Recht und Freiheit",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Berlin"
      },
      {
        "title": "Language",
        "value": "German"
      },
      {
        "title": "Population",
        "value": "83 million"
      },
      {
        "title": "Currency",
        "value": "Euro (€)"
      }
    ],
    "history": "Germany's history spans from the Germanic tribes of antiquity, through the Holy Roman Empire, the unification under Bismarck in 1871, two World Wars, division into East and West, and reunification in 1990 to become Europe's largest economy and a pillar of the European Union.",
    "culturalImage": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Oktoberfest",
        "description": "World-famous annual beer festival held in Munich, celebrating Bavarian culture with food, music, and beer.",
        "image": "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Christmas Markets",
        "description": "Traditional Weihnachtsmärkte held across Germany, filled with crafts, mulled wine, and festive lights.",
        "image": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Carnival (Karneval)",
        "description": "Colorful pre-Lenten festival celebrated in Cologne and Düsseldorf with parades and costumes.",
        "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Bratwurst",
        "description": "Grilled pork sausage, a staple of German cuisine served at markets and festivals nationwide.",
        "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Schnitzel",
        "description": "Thin breaded and pan-fried meat cutlet, a beloved German classic served with lemon and potatoes.",
        "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Black Forest Cake",
        "description": "Iconic German dessert of chocolate sponge, cherries, and whipped cream from the Schwarzwald region.",
        "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern Germany is Europe's economic powerhouse, renowned for engineering excellence, automotive innovation, and a strong social market economy. Berlin has also emerged as a world-class hub for startups, arts, and nightlife.",
    "trends": [
      "Leading Europe's green energy and Energiewende transition",
      "Berlin's thriving startup and creative tech scene",
      "Engineering innovation in automotive and industrial sectors",
      "Strong social welfare system and work-life balance culture"
    ],
    "modernImage": "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Brandenburg Gate",
        "description": "Neoclassical landmark in Berlin, symbol of German reunification and European unity.",
        "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Neuschwanstein Castle",
        "description": "Fairy-tale Romanesque Revival castle in Bavaria, inspiring Walt Disney's Sleeping Beauty castle.",
        "image": "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Black Forest",
        "description": "Dense forested mountain range in southwest Germany, rich in folklore and natural beauty.",
        "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Unité, Justice et Liberté",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Berlin"
        },
        {
          "title": "Langue",
          "value": "Allemand"
        },
        {
          "title": "Population",
          "value": "83 millions"
        },
        {
          "title": "Monnaie",
          "value": "Euro (€)"
        }
      ],
      "history": "L'histoire de l'Allemagne s'étend des tribus germaniques de l'Antiquité au Saint Empire romain germanique, l'unification sous Bismarck en 1871, deux guerres mondiales, la division Est-Ouest et la réunification en 1990 pour devenir la plus grande économie d'Europe.",
      "traditions": [
        {
          "name": "Oktoberfest",
          "description": "Célèbre festival annuel de la bière à Munich, célébrant la culture bavaroise avec gastronomie, musique et bière."
        },
        {
          "name": "Marchés de Noël",
          "description": "Marchés de Noël traditionnels (Weihnachtsmärkte) dans toute l'Allemagne, avec artisanat, vin chaud et lumières festives."
        },
        {
          "name": "Karneval",
          "description": "Coloré festival pré-carnavalesque célébré à Cologne et Düsseldorf avec défilés et costumes."
        }
      ],
      "cuisine": [
        {
          "name": "Bratwurst",
          "description": "Saucisse de porc grillée, pilier de la cuisine allemande servie dans les marchés et festivals."
        },
        {
          "name": "Schnitzel",
          "description": "Fine escalope panée et poêlée, un classique allemand servi avec citron et pommes de terre."
        },
        {
          "name": "Gâteau Forêt-Noire",
          "description": "Emblématique dessert allemand de génoise chocolat, cerises et crème chantilly de la région du Schwarzwald."
        }
      ],
      "modernLife": "L'Allemagne moderne est la puissance économique de l'Europe, réputée pour son excellence ingénieure, son innovation automobile et son économie sociale de marché robuste. Berlin s'est imposée comme hub mondial pour les startups, les arts et la vie nocturne.",
      "trends": [
        "Leader de la transition énergétique verte en Europe (Energiewende)",
        "Scène startup créative et tech florissante à Berlin",
        "Innovation ingénieure dans les secteurs automobile et industriel",
        "Fort système de protection sociale et culture d'équilibre travail-vie"
      ],
      "places": [
        {
          "name": "Porte de Brandebourg",
          "description": "Monument néoclassique à Berlin, symbole de la réunification allemande et de l'unité européenne."
        },
        {
          "name": "Château de Neuschwanstein",
          "description": "Château conte de fées de style roman en Bavière, inspirant le château de la Belle au Bois Dormant de Disney."
        },
        {
          "name": "Forêt-Noire",
          "description": "Dense massif forestier montagneux au sud-ouest de l'Allemagne, riche en folklore et beauté naturelle."
        }
      ]
    },
    "de": {
      "motto": "Einigkeit und Recht und Freiheit",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Berlin"
        },
        {
          "title": "Sprache",
          "value": "Deutsch"
        },
        {
          "title": "Bevölkerung",
          "value": "83 Millionen"
        },
        {
          "title": "Währung",
          "value": "Euro (€)"
        }
      ],
      "history": "Deutschlands Geschichte reicht von den germanischen Stämmen der Antike über das Heilige Römische Reich, die Einigung unter Bismarck 1871, zwei Weltkriege, die Teilung Ost-West bis zur Wiedervereinigung 1990 und dem Aufstieg zur größten Volkswirtschaft Europas.",
      "traditions": [
        {
          "name": "Oktoberfest",
          "description": "Weltberühmtes jährliches Bierfest in München, das bayerische Kultur mit Essen, Musik und Bier feiert."
        },
        {
          "name": "Weihnachtsmärkte",
          "description": "Traditionelle Weihnachtsmärkte in ganz Deutschland mit Kunsthandwerk, Glühwein und festlichem Licht."
        },
        {
          "name": "Karneval",
          "description": "Buntes Vorfastenfest in Köln und Düsseldorf mit Umzügen und Kostümen."
        }
      ],
      "cuisine": [
        {
          "name": "Bratwurst",
          "description": "Gegrillte Schweinswurst, Grundnahrungsmittel der deutschen Küche auf Märkten und Festen."
        },
        {
          "name": "Schnitzel",
          "description": "Dünnes paniertes und gebratenes Fleischschnitzel, ein deutscher Klassiker mit Zitrone und Kartoffeln."
        },
        {
          "name": "Schwarzwälder Kirschtorte",
          "description": "Ikonische Schokoladenbiskuittorte mit Kirschen und Sahne aus der Schwarzwaldregion."
        }
      ],
      "modernLife": "Das moderne Deutschland ist Europas Wirtschaftsmacht, bekannt für Ingenieurexzellenz, Automobilinnovation und eine starke soziale Marktwirtschaft. Berlin hat sich als weltweiter Hub für Startups, Kunst und Nachtleben etabliert.",
      "trends": [
        "Führend in Europas grüner Energiewende",
        "Florierendes Startup- und Kreativ-Tech-Ökosystem in Berlin",
        "Ingenieusinnovation in der Automobil- und Industriebranche",
        "Starkes Sozialsystem und Work-Life-Balance-Kultur"
      ],
      "places": [
        {
          "name": "Brandenburger Tor",
          "description": "Neoklassizistisches Wahrzeichen in Berlin, Symbol der deutschen Wiedervereinigung."
        },
        {
          "name": "Schloss Neuschwanstein",
          "description": "Märchenhaftes romanisches Schloss in Bayern, Vorbild für Disneys Dornröschen-Schloss."
        },
        {
          "name": "Schwarzwald",
          "description": "Dichtes bewaldetes Gebirge im Südwesten Deutschlands, reich an Folklore und Naturschönheit."
        }
      ]
    }
  },
  "Netherlands": {
    "heroImage": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Je maintiendrai",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Amsterdam"
      },
      {
        "title": "Language",
        "value": "Dutch"
      },
      {
        "title": "Population",
        "value": "17 million"
      },
      {
        "title": "Currency",
        "value": "Euro (€)"
      }
    ],
    "history": "The Netherlands has a rich maritime history as a global trading power in the 17th-century Golden Age. Known for its fight against water through innovative engineering, it has grown into a progressive, open society and one of Europe's most prosperous nations.",
    "culturalImage": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "King's Day",
        "description": "National celebration on April 27th when the Dutch dress in orange and fill the streets with outdoor markets and parties.",
        "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Tulip Festival",
        "description": "Annual spring festival celebrating the Netherlands' iconic tulip fields and flower industry.",
        "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sinterklaas",
        "description": "Traditional Dutch winter festival celebrating the arrival of Sinterklaas with gifts and pepernoten.",
        "image": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Stroopwafel",
        "description": "Iconic Dutch caramel waffle cookie made from two thin waffles sandwiching a syrup filling.",
        "image": "https://images.unsplash.com/photo-1509461399763-ae67a981b254?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Haring",
        "description": "Traditional Dutch raw herring eaten with onions and pickles, a street food staple.",
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dutch Cheese",
        "description": "World-famous cheeses including Gouda and Edam, enjoyed worldwide and sold in traditional markets.",
        "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "The Netherlands is celebrated for its progressive values, cycling culture, and innovative design. Amsterdam is a global tech and startup hub while the country leads in water management, sustainable agriculture, and international trade.",
    "trends": [
      "World leader in circular economy and sustainability",
      "Cycling infrastructure as a model for cities worldwide",
      "Thriving tech startup scene in Amsterdam and Eindhoven",
      "Innovative water management and climate adaptation"
    ],
    "modernImage": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Anne Frank House",
        "description": "Historic museum in Amsterdam where Anne Frank wrote her famous diary during WWII.",
        "image": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Keukenhof Gardens",
        "description": "World's largest flower garden showcasing millions of tulips, daffodils, and hyacinths each spring.",
        "image": "https://images.unsplash.com/photo-1548366086-7f1b76106622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kinderdijk Windmills",
        "description": "UNESCO-listed network of 19 historic windmills, an iconic symbol of Dutch water management.",
        "image": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Je maintiendrai",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Amsterdam"
        },
        {
          "title": "Langue",
          "value": "Néerlandais"
        },
        {
          "title": "Population",
          "value": "17 millions"
        },
        {
          "title": "Monnaie",
          "value": "Euro (€)"
        }
      ],
      "history": "Les Pays-Bas ont une riche histoire maritime en tant que puissance commerciale mondiale au Siècle d'or du XVIIe siècle. Connus pour leur lutte contre la mer grâce à une ingénierie innovante, ils sont devenus une société progressiste parmi les plus prospères d'Europe.",
      "traditions": [
        {
          "name": "Fête du Roi",
          "description": "Célébration nationale le 27 avril où les Néerlandais se vêtent d'orange et animent les rues de marchés et fêtes."
        },
        {
          "name": "Festival des tulipes",
          "description": "Festival printanier annuel célébrant les champs de tulipes iconiques des Pays-Bas et l'industrie florale."
        },
        {
          "name": "Sinterklaas",
          "description": "Festival d'hiver traditionnel néerlandais célébrant l'arrivée de Sinterklaas avec cadeaux et pepernoten."
        }
      ],
      "cuisine": [
        {
          "name": "Stroopwafel",
          "description": "Emblématique biscuit gaufre hollandais composé de deux fines gaufres avec garniture au caramel."
        },
        {
          "name": "Haring",
          "description": "Hareng cru traditionnel néerlandais mangé avec des oignons et des cornichons, un incontournable de rue."
        },
        {
          "name": "Fromages hollandais",
          "description": "Fromages mondialement célèbres incluant Gouda et Edam, vendus dans les marchés traditionnels."
        }
      ],
      "modernLife": "Les Pays-Bas sont célébrés pour leurs valeurs progressistes, leur culture cycliste et leur design innovant. Amsterdam est un hub mondial tech et startup tandis que le pays excelle dans la gestion de l'eau, l'agriculture durable et le commerce international.",
      "trends": [
        "Leader mondial de l'économie circulaire et du développement durable",
        "Infrastructure cyclable comme modèle pour les villes du monde",
        "Scène startup tech florissante à Amsterdam et Eindhoven",
        "Gestion innovante de l'eau et adaptation climatique"
      ],
      "places": [
        {
          "name": "Maison d'Anne Frank",
          "description": "Musée historique à Amsterdam où Anne Frank a écrit son célèbre journal pendant la Seconde Guerre mondiale."
        },
        {
          "name": "Jardins de Keukenhof",
          "description": "Le plus grand jardin fleuri au monde avec des millions de tulipes, narcisses et jacinthes chaque printemps."
        },
        {
          "name": "Moulins de Kinderdijk",
          "description": "Réseau de 19 moulins historiques inscrit à l'UNESCO, symbole emblématique de la gestion de l'eau néerlandaise."
        }
      ]
    },
    "de": {
      "motto": "Ich werde aufrechterhalten",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Amsterdam"
        },
        {
          "title": "Sprache",
          "value": "Niederländisch"
        },
        {
          "title": "Bevölkerung",
          "value": "17 Millionen"
        },
        {
          "title": "Währung",
          "value": "Euro (€)"
        }
      ],
      "history": "Die Niederlande haben eine reiche Seefahrtsgeschichte als globale Handelsmacht im Goldenen Zeitalter des 17. Jahrhunderts. Bekannt für ihren Kampf gegen das Wasser durch innovative Technik, entwickelten sie sich zu einer progressiven, offenen Gesellschaft.",
      "traditions": [
        {
          "name": "Königstag",
          "description": "Nationalfeiertag am 27. April, wenn die Niederländer Orange tragen und die Straßen mit Märkten und Feiern füllen."
        },
        {
          "name": "Tulpenfest",
          "description": "Jährliches Frühlingsfest zur Feier der ikonischen Tulpenfelder und Blumenindustrie der Niederlande."
        },
        {
          "name": "Sinterklaas",
          "description": "Traditionelles niederländisches Winterfest mit Geschenken und Pepernoten zur Ankunft des Sinterklaas."
        }
      ],
      "cuisine": [
        {
          "name": "Stroopwafel",
          "description": "Ikonisches niederländisches Karamell-Waffelgebäck aus zwei dünnen Waffeln mit Sirupfüllung."
        },
        {
          "name": "Haring",
          "description": "Traditioneller roher niederländischer Hering mit Zwiebeln und Gurken, ein Straßenimbiss-Klassiker."
        },
        {
          "name": "Holländischer Käse",
          "description": "Weltberühmte Käsesorten wie Gouda und Edam, auf traditionellen Märkten verkauft."
        }
      ],
      "modernLife": "Die Niederlande sind bekannt für progressive Werte, Fahrradkultur und innovatives Design. Amsterdam ist ein globaler Tech- und Startup-Hub, während das Land bei Wasserwirtschaft und nachhaltigem Anbau führend ist.",
      "trends": [
        "Weltführend in Kreislaufwirtschaft und Nachhaltigkeit",
        "Fahrradinfrastruktur als Modell für Städte weltweit",
        "Florierendes Tech-Startup-Ökosystem in Amsterdam und Eindhoven",
        "Innovative Wasserwirtschaft und Klimaanpassung"
      ],
      "places": [
        {
          "name": "Anne-Frank-Haus",
          "description": "Historisches Museum in Amsterdam, wo Anne Frank ihr berühmtes Tagebuch schrieb."
        },
        {
          "name": "Keukenhof-Gärten",
          "description": "Größter Blumengarten der Welt mit Millionen von Tulpen, Narzissen und Hyazinthen im Frühling."
        },
        {
          "name": "Kinderdijk-Windmühlen",
          "description": "UNESCO-gelistetes Netz von 19 historischen Windmühlen, ikonisches Symbol des niederländischen Wassermanagements."
        }
      ]
    }
  },
  "Spain": {
    "heroImage": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Plus Ultra",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Madrid"
      },
      {
        "title": "Language",
        "value": "Spanish"
      },
      {
        "title": "Population",
        "value": "47 million"
      },
      {
        "title": "Currency",
        "value": "Euro (€)"
      }
    ],
    "history": "Spain's history includes ancient Iberian civilizations, Roman conquest, Moorish rule for nearly 800 years, the Reconquista, and the Spanish Empire that shaped the Americas. Today Spain is a vibrant democracy and major European cultural force.",
    "culturalImage": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "La Tomatina",
        "description": "World's biggest tomato fight held in Buñol each August, attracting thousands of participants.",
        "image": "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Flamenco",
        "description": "Passionate Spanish dance and music art form originating in Andalusia, a UNESCO cultural heritage.",
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "San Fermín (Running of the Bulls)",
        "description": "Famous festival in Pamplona featuring the iconic bull run through the city's streets each July.",
        "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Paella",
        "description": "Iconic Spanish rice dish from Valencia, cooked with saffron, vegetables, and seafood or meat.",
        "image": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Tapas",
        "description": "Small savory dishes shared among friends — from patatas bravas to jamón ibérico — a social dining tradition.",
        "image": "https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Churros",
        "description": "Fried dough pastry served with thick hot chocolate, a beloved Spanish breakfast and street snack.",
        "image": "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern Spain is a dynamic country blending tradition with innovation. Barcelona and Madrid are world-class cities for architecture, fashion, and gastronomy, while Spain's beaches and warm climate attract millions of tourists each year.",
    "trends": [
      "Booming tourism and hospitality industry",
      "Growing renewable energy sector — solar and wind leader in Europe",
      "Vibrant arts and architecture scene",
      "Startup growth in Barcelona and Madrid tech hubs"
    ],
    "modernImage": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Sagrada Família",
        "description": "Gaudí's extraordinary unfinished basilica in Barcelona, a UNESCO World Heritage Site.",
        "image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Alhambra",
        "description": "Stunning Moorish palace and fortress complex in Granada, a masterpiece of Islamic architecture.",
        "image": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Park Güell",
        "description": "Colorful public park in Barcelona designed by Gaudí, filled with mosaic sculptures and terraces.",
        "image": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Plus Ultra",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Madrid"
        },
        {
          "title": "Langue",
          "value": "Espagnol"
        },
        {
          "title": "Population",
          "value": "47 millions"
        },
        {
          "title": "Monnaie",
          "value": "Euro (€)"
        }
      ],
      "history": "L'histoire de l'Espagne inclut les anciennes civilisations ibériques, la conquête romaine, la domination maure pendant près de 800 ans, la Reconquista et l'Empire espagnol qui a façonné les Amériques. Aujourd'hui l'Espagne est une démocratie vibrante et une force culturelle européenne majeure.",
      "traditions": [
        {
          "name": "La Tomatina",
          "description": "La plus grande bataille de tomates au monde tenue à Buñol chaque août, attirant des milliers de participants."
        },
        {
          "name": "Flamenco",
          "description": "Art passionné de danse et musique espagnole originaire d'Andalousie, patrimoine culturel immatériel de l'UNESCO."
        },
        {
          "name": "San Fermín (Lâcher de taureaux)",
          "description": "Célèbre festival à Pampelune avec l'emblématique course de taureaux dans les rues chaque juillet."
        }
      ],
      "cuisine": [
        {
          "name": "Paella",
          "description": "Emblématique plat espagnol de riz de Valence cuisiné au safran avec légumes et fruits de mer ou viande."
        },
        {
          "name": "Tapas",
          "description": "Petits plats salés partagés entre amis — des patatas bravas au jamón ibérico — une tradition de convivialité."
        },
        {
          "name": "Churros",
          "description": "Pâte frite servie avec du chocolat chaud épais, apprécié au petit-déjeuner et comme snack espagnol."
        }
      ],
      "modernLife": "L'Espagne moderne est un pays dynamique mêlant tradition et innovation. Barcelone et Madrid sont des villes de classe mondiale pour l'architecture, la mode et la gastronomie, tandis que les plages et le climat chaleureux attirent des millions de touristes.",
      "trends": [
        "Industrie touristique et hôtelière en plein essor",
        "Secteur des énergies renouvelables en croissance — leader solaire et éolien en Europe",
        "Scène artistique et architecturale vibrante",
        "Croissance des startups dans les hubs tech de Barcelone et Madrid"
      ],
      "places": [
        {
          "name": "Sagrada Família",
          "description": "Extraordinaire basilique inachevée de Gaudí à Barcelone, site du patrimoine mondial de l'UNESCO."
        },
        {
          "name": "Alhambra",
          "description": "Magnifique palais et forteresse mauresques à Grenade, chef-d'œuvre de l'architecture islamique."
        },
        {
          "name": "Parc Güell",
          "description": "Parc public coloré à Barcelone conçu par Gaudí, rempli de sculptures en mosaïque et terrasses panoramiques."
        }
      ]
    },
    "de": {
      "motto": "Plus Ultra",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Madrid"
        },
        {
          "title": "Sprache",
          "value": "Spanisch"
        },
        {
          "title": "Bevölkerung",
          "value": "47 Millionen"
        },
        {
          "title": "Währung",
          "value": "Euro (€)"
        }
      ],
      "history": "Spaniens Geschichte umfasst ibero-antike Zivilisationen, römische Eroberung, maurische Herrschaft fast 800 Jahre, die Reconquista und das Spanische Imperium, das Amerika prägte. Heute ist Spanien eine lebhafte Demokratie.",
      "traditions": [
        {
          "name": "La Tomatina",
          "description": "Größte Tomatenschlacht der Welt in Buñol jeden August mit Tausenden von Teilnehmern."
        },
        {
          "name": "Flamenco",
          "description": "Leidenschaftliche spanische Tanz- und Musikkunst aus Andalusien, UNESCO-Kulturerbe."
        },
        {
          "name": "San Fermín (Stierrennen)",
          "description": "Berühmtes Festival in Pamplona mit dem ikonischen Stierlauf durch die Straßen jeden Juli."
        }
      ],
      "cuisine": [
        {
          "name": "Paella",
          "description": "Ikonisches spanisches Reisgericht aus Valencia mit Safran, Gemüse und Meeresfrüchten oder Fleisch."
        },
        {
          "name": "Tapas",
          "description": "Kleine herzhafte Gerichte zum Teilen — von Patatas Bravas bis Jamón Ibérico — eine soziale Esstradition."
        },
        {
          "name": "Churros",
          "description": "Frittierter Teig mit heißer Schokolade, ein beliebtes spanisches Frühstück und Straßensnack."
        }
      ],
      "modernLife": "Das moderne Spanien ist ein dynamisches Land, das Tradition und Innovation verbindet. Barcelona und Madrid sind Weltklasse-Städte für Architektur, Mode und Gastronomie, während Strände und Klima Millionen Touristen anziehen.",
      "trends": [
        "Boomende Tourismus- und Gastgewerbebranche",
        "Wachsender Sektor erneuerbarer Energien in Europa",
        "Vibrierende Kunst- und Architekturszene",
        "Startup-Wachstum in Barcelona und Madrid"
      ],
      "places": [
        {
          "name": "Sagrada Família",
          "description": "Gaudís außergewöhnliche unfertige Basilika in Barcelona, UNESCO-Weltkulturerbe."
        },
        {
          "name": "Alhambra",
          "description": "Atemberaubender maurischer Palast und Festungskomplex in Granada, Meisterwerk der islamischen Architektur."
        },
        {
          "name": "Park Güell",
          "description": "Bunter öffentlicher Park in Barcelona von Gaudí, gefüllt mit Mosaik-Skulpturen und Terrassen."
        }
      ]
    }
  },
  "Sweden": {
    "heroImage": "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "För Sverige – i tiden",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Stockholm"
      },
      {
        "title": "Language",
        "value": "Swedish"
      },
      {
        "title": "Population",
        "value": "10 million"
      },
      {
        "title": "Currency",
        "value": "Swedish Krona (SEK)"
      }
    ],
    "history": "Sweden has a history spanning Viking Age exploration, a powerful medieval kingdom, and the Swedish Empire of the 17th century. Today it is a model welfare state known for innovation, gender equality, and a high standard of living.",
    "culturalImage": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Midsommar",
        "description": "Sweden's most beloved festival celebrating the summer solstice with dancing, flower crowns, and traditional songs.",
        "image": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Saint Lucia Day",
        "description": "Celebration on December 13th where a girl dressed in white with candles in her crown leads a procession.",
        "image": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Walpurgis Night",
        "description": "Traditional spring celebration on April 30th with bonfires and student choirs welcoming the coming of spring.",
        "image": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Swedish Meatballs",
        "description": "Classic dish of seasoned pork and beef meatballs served with creamy gravy, lingonberry jam, and mashed potatoes.",
        "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Gravlax",
        "description": "Traditional cured salmon marinated with dill, salt, and sugar, served as a classic Nordic appetizer.",
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Kanelbullar",
        "description": "Swedish cinnamon rolls, a beloved fika staple enjoyed with coffee throughout the day.",
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Sweden is a global leader in sustainability, innovation, and quality of life. Stockholm is one of Europe's top startup cities, home to Spotify, IKEA, and Volvo. The Swedish concept of 'lagom' — balance and moderation — shapes daily life.",
    "trends": [
      "World leader in sustainability and clean technology",
      "Thriving startup ecosystem (Spotify, King, Klarna born here)",
      "Fika culture promoting work-life balance",
      "Strong focus on gender equality and social welfare"
    ],
    "modernImage": "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Stockholm Old Town (Gamla Stan)",
        "description": "Medieval island city center with colorful 17th-century buildings, cobblestone streets, and royal palace.",
        "image": "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Northern Lights in Lapland",
        "description": "Spectacular aurora borealis visible in northern Sweden, best seen from Abisko National Park.",
        "image": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Vasa Museum",
        "description": "Extraordinary Stockholm museum housing a fully preserved 17th-century warship that sank on its maiden voyage.",
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Pour la Suède — avec notre époque",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Stockholm"
        },
        {
          "title": "Langue",
          "value": "Suédois"
        },
        {
          "title": "Population",
          "value": "10 millions"
        },
        {
          "title": "Monnaie",
          "value": "Couronne suédoise (SEK)"
        }
      ],
      "history": "La Suède a une histoire couvrant l'exploration Viking, un puissant royaume médiéval et l'Empire suédois du XVIIe siècle. Aujourd'hui c'est un État-providence modèle connu pour l'innovation, l'égalité des sexes et un niveau de vie élevé.",
      "traditions": [
        {
          "name": "Midsommar",
          "description": "Le festival le plus aimé de Suède célébrant le solstice d'été avec danses, couronnes de fleurs et chants traditionnels."
        },
        {
          "name": "Fête de Sainte-Lucie",
          "description": "Célébration le 13 décembre où une jeune fille habillée en blanc avec une couronne de bougies dirige une procession."
        },
        {
          "name": "Nuit de Walpurgis",
          "description": "Célébration printanière le 30 avril avec feux de joie et chorales d'étudiants accueillant l'arrivée du printemps."
        }
      ],
      "cuisine": [
        {
          "name": "Boulettes de viande suédoises",
          "description": "Plat classique de boulettes assaisonnées servies avec sauce crémeuse, confiture de lingon et purée de pommes de terre."
        },
        {
          "name": "Gravlax",
          "description": "Saumon cru traditionnel mariné à l'aneth, sel et sucre, servi comme classique entrée nordique."
        },
        {
          "name": "Kanelbullar",
          "description": "Petits pains à la cannelle suédois, incontournables du fika appréciés avec le café."
        }
      ],
      "modernLife": "La Suède est un leader mondial en développement durable, innovation et qualité de vie. Stockholm est l'une des meilleures villes startup d'Europe, berceau de Spotify, IKEA et Volvo. Le concept suédois de 'lagom' — équilibre et modération — façonne la vie quotidienne.",
      "trends": [
        "Leader mondial en durabilité et technologies propres",
        "Écosystème startup florissant (Spotify, King, Klarna nés ici)",
        "Culture Fika promouvant l'équilibre travail-vie",
        "Fort accent sur l'égalité des sexes et le bien-être social"
      ],
      "places": [
        {
          "name": "Vieille Ville de Stockholm (Gamla Stan)",
          "description": "Île médiévale au centre-ville avec bâtiments colorés du XVIIe siècle, rues pavées et palais royal."
        },
        {
          "name": "Aurores boréales en Laponie",
          "description": "Spectaculaire aurora borealis visible dans le nord de la Suède, mieux observée depuis le Parc national d'Abisko."
        },
        {
          "name": "Musee Vasa",
          "description": "Extraordinaire musee de Stockholm abritant un navire de guerre du XVIIe siecle entierement preserve."
        }
      ]
    },
    "de": {
      "motto": "Fur Schweden - mit der Zeit",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Stockholm"
        },
        {
          "title": "Sprache",
          "value": "Schwedisch"
        },
        {
          "title": "Bevolkerung",
          "value": "10 Millionen"
        },
        {
          "title": "Wahrung",
          "value": "Schwedische Krone (SEK)"
        }
      ],
      "history": "Schweden hat eine Geschichte von der Wikingerzeit uber ein machtiges Konigreich und das Schwedische Reich des 17. Jahrhunderts bis zum heutigen Wohlfahrtsstaat, bekannt fur Innovation und Gleichstellung.",
      "traditions": [
        {
          "name": "Mittsommerfest",
          "description": "Schwedens beliebtestes Fest zur Sommersonnenwende mit Tanzen, Blumenkranzen und Volksliedern."
        },
        {
          "name": "Lucia-Tag",
          "description": "Feier am 13. Dezember, bei der ein weissgekleidetes Madchen mit Kerzenkrone eine Prozession anfuhrt."
        },
        {
          "name": "Walpurgisnacht",
          "description": "Traditionelles Fruhlingsfest am 30. April mit Lagerfeuern und Studentenchoren."
        }
      ],
      "cuisine": [
        {
          "name": "Schwedische Fleischballe",
          "description": "Klassisches Gericht aus gewurzten Fleischballen mit Sahnesosse, Preiselbeerkonfiture und Kartoffelpuree."
        },
        {
          "name": "Gravlax",
          "description": "Traditioneller gebeizter Lachs mit Dill, Salz und Zucker, als nordische Vorspeise serviert."
        },
        {
          "name": "Kanelbullar",
          "description": "Schwedische Zimtschnecken, beliebtes Fika-Gebac zum Kaffee."
        }
      ],
      "modernLife": "Schweden ist ein Weltfuhrer in Nachhaltigkeit, Innovation und Lebensqualitat. Stockholm ist eine Top-Startup-Stadt Europas, Heimat von Spotify, IKEA und Volvo. Das Konzept Lagom praegt den schwedischen Alltag.",
      "trends": [
        "Weltfuhrend in Nachhaltigkeit und sauberer Technologie",
        "Florierendes Startup-Okosystem (Spotify, King, Klarna)",
        "Fika-Kultur fordert Work-Life-Balance",
        "Starker Fokus auf Gleichstellung und soziales Wohlbefinden"
      ],
      "places": [
        {
          "name": "Stockholmer Altstadt (Gamla Stan)",
          "description": "Mittelalterliche Inselstadt mit bunten Gebauden des 17. Jahrhunderts, Kopfsteinpflaster und Konigspalast."
        },
        {
          "name": "Nordlichter in Lappland",
          "description": "Spektakulares Nordlicht in Nordschweden, am besten im Abisko Nationalpark zu beobachten."
        },
        {
          "name": "Vasa-Museum",
          "description": "Aussergewohnliches Stockholmer Museum mit einem vollstandig erhaltenen Kriegsschiff des 17. Jahrhunderts."
        }
      ]
    }
  },
  "Switzerland": {
    "heroImage": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Unus pro omnibus, omnes pro uno",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Bern"
      },
      {
        "title": "Language",
        "value": "German, French, Italian, Romansh"
      },
      {
        "title": "Population",
        "value": "8.5 million"
      },
      {
        "title": "Currency",
        "value": "Swiss Franc (CHF)"
      }
    ],
    "history": "Switzerland's history began with the Federal Charter of 1291, forming one of the world's oldest democracies. Its long tradition of neutrality, humanitarian leadership (home of the Red Cross), and banking excellence has made it one of the world's most prosperous nations.",
    "culturalImage": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Swiss National Day",
        "description": "Celebrated on August 1st with bonfires, fireworks, and speeches commemorating the 1291 Federal Charter.",
        "image": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Fasnacht",
        "description": "Basel's extraordinary carnival with elaborate costumes, lantern processions, and drum and fife music.",
        "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Alpabzug (Cow Parade)",
        "description": "Traditional autumn procession of decorated cows descending from Alpine pastures to valley farms.",
        "image": "https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Fondue",
        "description": "Melted Swiss cheese dip served with bread, a beloved communal dish from the Alpine regions.",
        "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Raclette",
        "description": "Melted cheese scraped over potatoes, pickles, and charcuterie — a traditional Swiss Alpine dinner.",
        "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Swiss Chocolate",
        "description": "World-renowned Swiss chocolate, perfected since the 19th century by brands like Lindt, Toblerone, and Nestlé.",
        "image": "https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Switzerland consistently tops global rankings for quality of life, innovation, and competitiveness. It is home to major international organizations, leading pharmaceutical companies, and a world-class financial sector, all set against breathtaking Alpine scenery.",
    "trends": [
      "Global hub for international diplomacy and organizations (UN, Red Cross)",
      "Leader in pharmaceutical and biotech research",
      "Innovation in precision engineering and watchmaking",
      "Sustainable Alpine tourism and eco-friendly transport"
    ],
    "modernImage": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Matterhorn",
        "description": "Iconic pyramid-shaped peak on the Swiss-Italian border, one of the most photographed mountains in the world.",
        "image": "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Lake Geneva",
        "description": "Europe's largest Alpine lake, bordered by vineyards and the cities of Geneva and Lausanne.",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Jungfrau Region",
        "description": "Spectacular high Alpine area in the Bernese Oberland, home to glaciers, ski resorts, and panoramic railways.",
        "image": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Un pour tous, tous pour un",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Berne"
        },
        {
          "title": "Langue",
          "value": "Allemand, Français, Italien, Romanche"
        },
        {
          "title": "Population",
          "value": "8,5 millions"
        },
        {
          "title": "Monnaie",
          "value": "Franc suisse (CHF)"
        }
      ],
      "history": "L'histoire de la Suisse a commencé avec la Charte fédérale de 1291, formant l'une des plus anciennes démocraties du monde. Sa longue tradition de neutralité, de leadership humanitaire (berceau de la Croix-Rouge) et d'excellence bancaire en a fait l'une des nations les plus prospères.",
      "traditions": [
        {
          "name": "Fête nationale suisse",
          "description": "Célébrée le 1er août avec des feux de joie, des feux d'artifice et des discours commémorant la Charte fédérale de 1291."
        },
        {
          "name": "Fasnacht",
          "description": "L'extraordinaire carnaval de Bâle avec des costumes élaborés, des processions aux lanternes et de la musique de tambours."
        },
        {
          "name": "Alpabzug (Défilé des vaches)",
          "description": "Procession automnale traditionnelle de vaches décorées descendant des alpages vers les fermes de vallée."
        }
      ],
      "cuisine": [
        {
          "name": "Fondue",
          "description": "Fromage suisse fondu servi avec du pain, un plat convivial apprécié dans les régions alpines."
        },
        {
          "name": "Raclette",
          "description": "Fromage fondu raclé sur des pommes de terre, cornichons et charcuterie — un dîner alpin traditionnel suisse."
        },
        {
          "name": "Chocolat suisse",
          "description": "Chocolat de renommée mondiale, perfectionné depuis le XIXe siècle par des marques comme Lindt et Toblerone."
        }
      ],
      "modernLife": "La Suisse se classe constamment parmi les premiers mondiaux pour la qualité de vie, l'innovation et la compétitivité. Elle accueille d'importantes organisations internationales, des entreprises pharmaceutiques de pointe et un secteur financier de classe mondiale.",
      "trends": [
        "Hub mondial pour la diplomatie internationale (ONU, Croix-Rouge)",
        "Leader en recherche pharmaceutique et biotech",
        "Innovation en ingénierie de précision et horlogerie",
        "Tourisme alpin durable et transport écologique"
      ],
      "places": [
        {
          "name": "Cervin (Matterhorn)",
          "description": "Pic emblématique en forme de pyramide à la frontière suisse-italienne, l'une des montagnes les plus photographiées au monde."
        },
        {
          "name": "Lac Léman",
          "description": "Le plus grand lac alpin d'Europe, bordé de vignobles et des villes de Genève et Lausanne."
        },
        {
          "name": "Region de la Jungfrau",
          "description": "Spectaculaire zone alpine dans l'Oberland bernois, avec glaciers, stations de ski et chemins de fer panoramiques."
        }
      ]
    },
    "de": {
      "motto": "Einer fur alle, alle fur einen",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Bern"
        },
        {
          "title": "Sprache",
          "value": "Deutsch, Franzosisch, Italienisch, Ratoromanisch"
        },
        {
          "title": "Bevolkerung",
          "value": "8,5 Millionen"
        },
        {
          "title": "Wahrung",
          "value": "Schweizer Franken (CHF)"
        }
      ],
      "history": "Die Geschichte der Schweiz begann mit dem Bundesbrief von 1291, einer der altesten Demokratien der Welt. Ihre Neutralitat, humanitare Fuhrerschaft (Heimat des Roten Kreuzes) und Bankexzellenz machten sie zu einer der wohlhabendsten Nationen.",
      "traditions": [
        {
          "name": "Schweizer Nationalfeiertag",
          "description": "Am 1. August mit Lagerfeuern, Feuerwerk und Reden zum Gedenken an den Bundesbrief von 1291 gefeiert."
        },
        {
          "name": "Fasnacht",
          "description": "Aussergewohnlicher Basler Karneval mit aufwendigen Kostumen, Laternenumzugen und Trommelmusik."
        },
        {
          "name": "Alpabzug (Kuhparade)",
          "description": "Traditioneller Herbstumzug verzierter Kuhe von den Alpweiden ins Tal."
        }
      ],
      "cuisine": [
        {
          "name": "Fondue",
          "description": "Geschmolzener Schweizer Kase mit Brot, ein geselliges Gericht aus den Alpenregionen."
        },
        {
          "name": "Raclette",
          "description": "Uber Kartoffeln, Gurken und Charcuterie geschabter Kase - ein alpines Schweizer Abendessen."
        },
        {
          "name": "Schweizer Schokolade",
          "description": "Weltberuhmte Schweizer Schokolade, seit dem 19. Jahrhundert perfektioniert von Lindt und Toblerone."
        }
      ],
      "modernLife": "Die Schweiz belegt konstant Spitzenplatze fur Lebensqualitat, Innovation und Wettbewerbsfahigkeit. Sie beherbergt grosse internationale Organisationen, fuhrende Pharmaunternehmen und einen erstklassigen Finanzsektor.",
      "trends": [
        "Globaler Hub fur internationale Diplomatie (UNO, Rotes Kreuz)",
        "Fuhrender in Pharma- und Biotechforschung",
        "Innovation in Przisionsingenieurwesen und Uhrmacherei",
        "Nachhaltiger Alpentourismus und okologischer Transport"
      ],
      "places": [
        {
          "name": "Matterhorn",
          "description": "Ikonischer pyramidenformiger Gipfel an der Schweizer-Italienischen Grenze, einer der fotogensten Berge der Welt."
        },
        {
          "name": "Genfersee",
          "description": "Grosster Alpensee Europas, umgeben von Weinbergen und den Stadten Genf und Lausanne."
        },
        {
          "name": "Jungfrau Region",
          "description": "Spektakulares hochalpines Gebiet im Berner Oberland mit Gletschern, Skigebieten und Panoramabahnen."
        }
      ]
    }
  },
  "Portugal": {
    "heroImage": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Esta é a ditosa pátria minha amada",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Lisbon"
      },
      {
        "title": "Language",
        "value": "Portuguese"
      },
      {
        "title": "Population",
        "value": "10 million"
      },
      {
        "title": "Currency",
        "value": "Euro (€)"
      }
    ],
    "history": "Portugal is one of the world's oldest nations, with a rich history of maritime exploration in the Age of Discovery. Portuguese explorers like Vasco da Gama opened sea routes to India and Brazil, building a global empire that shaped modern world history.",
    "culturalImage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Fado Music",
        "description": "Soulful traditional Portuguese music expressing longing and melancholy, recognized as UNESCO intangible heritage.",
        "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Santos Populares",
        "description": "June popular saints festivals in Lisbon and Porto, with street parties, grilled sardines, and dancing.",
        "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Carnaval de Torres Vedras",
        "description": "Portugal's most famous carnival, known for its satirical floats and vibrant street celebrations.",
        "image": "https://images.unsplash.com/photo-1534951009808-766178b47a4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Pastel de Nata",
        "description": "Iconic Portuguese custard tart with a flaky pastry shell, best enjoyed warm with cinnamon.",
        "image": "https://images.unsplash.com/photo-1509461399763-ae67a981b254?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Bacalhau",
        "description": "Salt cod, the cornerstone of Portuguese cuisine with over 365 different preparation methods.",
        "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Francesinha",
        "description": "Porto's famous sandwich layered with meats, covered in melted cheese and spicy tomato sauce.",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern Portugal is a welcoming, safe country with a booming tourism industry and a growing tech startup scene. Lisbon and Porto have become major European destinations for digital nomads, expats, and students attracted by quality of life and affordable living.",
    "trends": [
      "Lisbon emerging as a top European startup and tech hub",
      "Growing digital nomad and expat community",
      "Sustainable wine and food tourism in the Douro Valley",
      "Thriving surf and outdoor adventure tourism"
    ],
    "modernImage": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Belém Tower",
        "description": "UNESCO-listed 16th-century fortified tower in Lisbon, a symbol of the Age of Discovery.",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Sintra",
        "description": "Fairy-tale hilltop town near Lisbon with colorful palaces and lush forested hills.",
        "image": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Douro Valley",
        "description": "UNESCO-listed terraced wine region along the Douro River, home to some of the world's finest port wine.",
        "image": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Esta é a ditosa pátria minha amada",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Lisbonne"
        },
        {
          "title": "Langue",
          "value": "Portugais"
        },
        {
          "title": "Population",
          "value": "10 millions"
        },
        {
          "title": "Monnaie",
          "value": "Euro (€)"
        }
      ],
      "history": "Le Portugal est l'une des plus vieilles nations du monde, avec une riche histoire d'exploration maritime à l'ère des Grandes Découvertes. Des explorateurs comme Vasco de Gama ont ouvert des routes maritimes vers l'Inde et le Brésil, construisant un empire mondial qui a façonné l'histoire moderne.",
      "traditions": [
        {
          "name": "Fado",
          "description": "Musique portugaise traditionnelle exprimant la nostalgie et la mélancolie, reconnue comme patrimoine immatériel de l'UNESCO."
        },
        {
          "name": "Santos Populares",
          "description": "Festivals populaires de juin à Lisbonne et Porto avec fêtes de rue, sardines grillées et danses."
        },
        {
          "name": "Carnaval de Torres Vedras",
          "description": "Le carnaval le plus célèbre du Portugal, connu pour ses chars satiriques et ses célébrations de rue vibrantes."
        }
      ],
      "cuisine": [
        {
          "name": "Pastel de Nata",
          "description": "Tarte aux œufs portugaise emblématique avec une croûte feuilletée, à déguster chaud saupoudré de cannelle."
        },
        {
          "name": "Bacalhau",
          "description": "Morue salée, pierre angulaire de la cuisine portugaise avec plus de 365 façons différentes de la préparer."
        },
        {
          "name": "Francesinha",
          "description": "Le célèbre sandwich de Porto garni de viandes, recouvert de fromage fondu et sauce tomate épicée."
        }
      ],
      "modernLife": "Le Portugal moderne est un pays accueillant et sûr avec une industrie touristique en plein essor et une scène startup tech croissante. Lisbonne et Porto sont devenues des destinations européennes majeures pour les nomades numériques et les étudiants.",
      "trends": [
        "Lisbonne émerge comme principal hub startup et tech européen",
        "Communauté croissante de nomades numériques et d'expatriés",
        "Tourisme viticole et gastronomique durable dans la vallée du Douro",
        "Tourisme de surf et d'aventure en plein essor"
      ],
      "places": [
        {
          "name": "Tour de Belém",
          "description": "Tour fortifiée du XVIe siècle inscrite à l'UNESCO à Lisbonne, symbole de l'ère des Grandes Découvertes."
        },
        {
          "name": "Sintra",
          "description": "Ville de conte de fées sur les collines près de Lisbonne avec des palais colorés et des collines verdoyantes."
        },
        {
          "name": "Vallee du Douro",
          "description": "Region viticole en terrasses inscrite a l'UNESCO le long du fleuve Douro."
        }
      ]
    },
    "de": {
      "motto": "Portugal, mein geliebtes Land",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Lissabon"
        },
        {
          "title": "Sprache",
          "value": "Portugiesisch"
        },
        {
          "title": "Bevolkerung",
          "value": "10 Millionen"
        },
        {
          "title": "Wahrung",
          "value": "Euro (€)"
        }
      ],
      "history": "Portugal ist eine der altesten Nationen der Welt mit einer reichen Seefahrtsgeschichte im Zeitalter der Entdeckungen. Forscher wie Vasco da Gama eroffneten Seewege nach Indien und Brasilien und bauten ein globales Reich auf.",
      "traditions": [
        {
          "name": "Fado-Musik",
          "description": "Traditionelle portugiesische Musik, die Sehnsucht und Melancholie ausdruckt, UNESCO-Weltkulturerbe."
        },
        {
          "name": "Santos Populares",
          "description": "Junivolksfeste in Lissabon und Porto mit Strassenfeiern, gegrillten Sardinen und Tanzen."
        },
        {
          "name": "Karneval von Torres Vedras",
          "description": "Portugals beruhmtester Karneval, bekannt fur satirische Festwagen und lebhafte Strassenfeiern."
        }
      ],
      "cuisine": [
        {
          "name": "Pastel de Nata",
          "description": "Ikonische portugiesische Eiercreme-Torte mit Blatterteig, warm mit Zimt genossen."
        },
        {
          "name": "Bacalhau",
          "description": "Stockfisch, Grundlage der portugiesischen Kuche mit uber 365 verschiedenen Zubereitungsarten."
        },
        {
          "name": "Francesinha",
          "description": "Das beruhmte Sandwich aus Porto mit Fleischlagen, uberbacken mit Kase und pikanter Tomatensauce."
        }
      ],
      "modernLife": "Das moderne Portugal ist ein gastfreundliches, sicheres Land mit einer boomenden Tourismusindustrie. Lissabon und Porto sind zu europaischen Hauptzielen fur digitale Nomaden und Studenten geworden.",
      "trends": [
        "Lissabon entwickelt sich zum fuhrenden europaischen Startup-Hub",
        "Wachsende digitale Nomaden-Gemeinschaft",
        "Nachhaltiger Wein- und Gastronomietourismus im Douro-Tal",
        "Surf- und Abenteuertourismus im Aufschwung"
      ],
      "places": [
        {
          "name": "Belem-Turm",
          "description": "UNESCO-gelisteter befestigter Turm des 16. Jahrhunderts in Lissabon, Symbol des Entdeckungszeitalters."
        },
        {
          "name": "Sintra",
          "description": "Marchenhaftes Hugeldorf in der Nahe Lissabons mit bunten Palsten und bewaldeten Hugeln."
        },
        {
          "name": "Douro-Tal",
          "description": "UNESCO-gelistete Weinbergterrassen entlang des Douro-Flusses, Heimat des weltberuhmten Portweins."
        }
      ]
    }
  },
  "China": {
    "heroImage": "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "Serve the People",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Beijing"
      },
      {
        "title": "Language",
        "value": "Mandarin Chinese"
      },
      {
        "title": "Population",
        "value": "1.4 billion"
      },
      {
        "title": "Currency",
        "value": "Chinese Yuan (CNY)"
      }
    ],
    "history": "China is home to one of the world's oldest continuous civilizations, with over 5,000 years of history. From ancient dynasties like the Qin and Han to the modern People's Republic founded in 1949, China has shaped global culture, science, and trade throughout the ages.",
    "culturalImage": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Chinese New Year",
        "description": "The most important festival in China, celebrated with fireworks, dragon dances, red envelopes, and family feasts.",
        "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Mid-Autumn Festival",
        "description": "Harvest moon festival celebrated with mooncakes, lanterns, and family gatherings under the full moon.",
        "image": "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dragon Boat Festival",
        "description": "Ancient festival honoring poet Qu Yuan with dragon boat races and sticky rice dumplings (zongzi).",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Peking Duck",
        "description": "Beijing's most famous dish — crispy roasted duck served with thin pancakes, scallions, and hoisin sauce.",
        "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Dim Sum",
        "description": "Cantonese tradition of small steamed and fried dumplings, buns, and rolls enjoyed with tea.",
        "image": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Hot Pot",
        "description": "Communal Chinese meal of broth bubbling at the table, with diners cooking meats, vegetables, and noodles.",
        "image": "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern China is the world's second-largest economy and a global leader in technology, manufacturing, and innovation. Cities like Shanghai and Shenzhen are futuristic megacities, while the country invests massively in AI, renewable energy, and infrastructure.",
    "trends": [
      "World leader in AI, 5G, and electric vehicle technology",
      "Rapid urbanization and smart city development",
      "Growing middle class and consumer culture",
      "Massive investment in renewable energy and green infrastructure"
    ],
    "modernImage": "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Great Wall of China",
        "description": "Ancient defensive fortification stretching over 13,000 miles across northern China, a UNESCO World Heritage Site.",
        "image": "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Forbidden City",
        "description": "Imperial palace complex in Beijing housing 980 buildings, home to Chinese emperors for 500 years.",
        "image": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "West Lake, Hangzhou",
        "description": "UNESCO-listed freshwater lake surrounded by temples, pagodas, and gardens, celebrated in Chinese poetry.",
        "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "Servir le Peuple",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Pékin"
        },
        {
          "title": "Langue",
          "value": "Mandarin"
        },
        {
          "title": "Population",
          "value": "1,4 milliard"
        },
        {
          "title": "Monnaie",
          "value": "Yuan chinois (CNY)"
        }
      ],
      "history": "La Chine abrite l'une des civilisations continues les plus anciennes du monde, avec plus de 5 000 ans d'histoire. Des dynasties Qin et Han à la République populaire moderne fondée en 1949, la Chine a façonné la culture, la science et le commerce mondiaux à travers les âges.",
      "traditions": [
        {
          "name": "Nouvel An chinois",
          "description": "Le festival le plus important en Chine, célébré avec feux d'artifice, danses du dragon, enveloppes rouges et festins familiaux."
        },
        {
          "name": "Fête de la Mi-Automne",
          "description": "Festival de la lune de la récolte célébré avec des gâteaux de lune, des lanternes et des rassemblements familiaux sous la pleine lune."
        },
        {
          "name": "Fête des Bateaux-Dragons",
          "description": "Festival ancien en l'honneur du poète Qu Yuan avec des courses de bateaux-dragons et des boulettes de riz gluant (zongzi)."
        }
      ],
      "cuisine": [
        {
          "name": "Canard laqué de Pékin",
          "description": "Le plat le plus célèbre de Pékin — canard rôti croustillant servi avec des crêpes fines, oignons verts et sauce hoisin."
        },
        {
          "name": "Dim Sum",
          "description": "Tradition cantonaise de petits dumplings vapeur et frits, petits pains et rouleaux appréciés avec du thé."
        },
        {
          "name": "Hot Pot",
          "description": "Repas communautaire chinois de bouillon bouillonnant à table, où les convives cuisent viandes, légumes et nouilles."
        }
      ],
      "modernLife": "La Chine moderne est la deuxième plus grande économie du monde et un leader mondial en technologie, fabrication et innovation. Des villes comme Shanghai et Shenzhen sont des mégapoles futuristes investissant massivement dans l'IA, les énergies renouvelables et les infrastructures.",
      "trends": [
        "Leader mondial en IA, 5G et véhicules électriques",
        "Urbanisation rapide et développement de villes intelligentes",
        "Classe moyenne croissante et culture de consommation",
        "Investissement massif dans les énergies renouvelables et infrastructures vertes"
      ],
      "places": [
        {
          "name": "Grande Muraille de Chine",
          "description": "Forteresse défensive antique s'étendant sur plus de 21 000 km dans le nord de la Chine, site du patrimoine mondial de l'UNESCO."
        },
        {
          "name": "Cité Interdite",
          "description": "Complexe palatin impérial à Pékin abritant 980 bâtiments, résidence des empereurs chinois pendant 500 ans."
        },
        {
          "name": "Lac de l'Ouest, Hangzhou",
          "description": "Lac d'eau douce inscrit à l'UNESCO entouré de temples, pagodes et jardins, célébré dans la poésie chinoise."
        }
      ]
    },
    "de": {
      "motto": "Dem Volk dienen",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Peking"
        },
        {
          "title": "Sprache",
          "value": "Mandarin"
        },
        {
          "title": "Bevolkerung",
          "value": "1,4 Milliarden"
        },
        {
          "title": "Wahrung",
          "value": "Chinesischer Yuan (CNY)"
        }
      ],
      "history": "China beherbergt eine der altesten Zivilisationen mit uber 5.000 Jahren Geschichte. Von den Dynastien Qin und Han bis zur Volksrepublik 1949 hat China Weltkultur, Wissenschaft und Handel gepragt.",
      "traditions": [
        {
          "name": "Chinesisches Neujahr",
          "description": "Das wichtigste Fest in China mit Feuerwerk, Drachentanzen, roten Umschlagen und Familienfesten."
        },
        {
          "name": "Mittherbstfest",
          "description": "Erntemondfest mit Mondkuchen, Laternen und Familientreffen unter dem Vollmond."
        },
        {
          "name": "Drachenbootfest",
          "description": "Altes Fest zu Ehren des Dichters Qu Yuan mit Drachenbootrennen und Klebreisklossen."
        }
      ],
      "cuisine": [
        {
          "name": "Pekinger Ente",
          "description": "Pekings beruhmtestes Gericht - knusprig gebratene Ente mit dunnen Pfannkuchen und Hoisin-Sauce."
        },
        {
          "name": "Dim Sum",
          "description": "Kantonesische Tradition kleiner gedampfter und gebratener Knodel mit Tee geniessen."
        },
        {
          "name": "Hot Pot",
          "description": "Chinesisches Gemeinschaftsessen mit brubbelnder Bruhe, wo Fleisch und Gemuse selbst gegart wird."
        }
      ],
      "modernLife": "China ist die zweitgroste Volkswirtschaft der Welt und Fuhrer in Technologie. Stadte wie Shanghai sind futuristische Megastadte mit Investitionen in KI und erneuerbare Energien.",
      "trends": [
        "Weltfuhrer in KI, 5G und Elektrofahrzeugen",
        "Schnelle Urbanisierung und Smart Cities",
        "Wachsende Mittelklasse",
        "Massive Investitionen in erneuerbare Energien"
      ],
      "places": [
        {
          "name": "Chinesische Mauer",
          "description": "Antike Verteidigungsbefestigung uber 21.000 km, UNESCO-Weltkulturerbe."
        },
        {
          "name": "Verbotene Stadt",
          "description": "Kaiserlicher Palastkomplex in Peking mit 980 Gebauden fur 500 Jahre chinesischer Kaiser."
        },
        {
          "name": "Westsee, Hangzhou",
          "description": "UNESCO-gelisteter See umgeben von Tempeln, Pagoden und Garten der chinesischen Poesie."
        }
      ]
    }
  },
  "Italy": {
    "heroImage": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "motto": "L'Italia è cultura (Italy is culture)",
    "quickFacts": [
      {
        "title": "Capital",
        "value": "Rome"
      },
      {
        "title": "Language",
        "value": "Italian"
      },
      {
        "title": "Population",
        "value": "60 million"
      },
      {
        "title": "Currency",
        "value": "Euro (€)"
      }
    ],
    "history": "Italy's rich history spans from the Roman Empire through the Renaissance to modern times. The country has been a cradle of Western civilization, art, and culture, influencing the world through its contributions to architecture, art, fashion, and cuisine.",
    "culturalImage": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "traditions": [
      {
        "name": "Carnevale",
        "description": "Pre-Lenten carnival with elaborate masks and costumes, especially famous in Venice.",
        "image": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Palio di Siena",
        "description": "Historic horse race held twice each summer in Siena's main square.",
        "image": "https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Opera",
        "description": "Traditional Italian art form combining music and drama.",
        "image": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "cuisine": [
      {
        "name": "Pizza Napoletana",
        "description": "Traditional Neapolitan pizza with simple, fresh ingredients.",
        "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Pasta alla Carbonara",
        "description": "Classic Roman pasta dish with eggs, pecorino cheese, guanciale, and black pepper.",
        "image": "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Gelato",
        "description": "Italian-style ice cream made with high-quality ingredients.",
        "image": "https://images.unsplash.com/photo-1557142046-c704a3adf364?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "modernLife": "Modern Italy balances its rich historical heritage with contemporary innovation in fashion, design, and technology. The country maintains its reputation for style, craftsmanship, and la dolce vita while embracing modern developments.",
    "trends": [
      "Sustainable fashion initiatives",
      "Slow food movement",
      "Digital innovation in traditional industries",
      "Green tourism development"
    ],
    "modernImage": "https://images.unsplash.com/photo-1534445867742-43195f401b6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "places": [
      {
        "name": "Colosseum",
        "description": "Ancient amphitheater and icon of Rome.",
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Venice Canals",
        "description": "Historic waterways and gondolas of Venice.",
        "image": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      {
        "name": "Tuscany",
        "description": "Rolling hills, vineyards, and historic villages.",
        "image": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      }
    ],
    "fr": {
      "motto": "L'Italie est culture",
      "quickFacts": [
        {
          "title": "Capitale",
          "value": "Rome"
        },
        {
          "title": "Langue",
          "value": "Italien"
        },
        {
          "title": "Population",
          "value": "60 millions"
        },
        {
          "title": "Monnaie",
          "value": "Euro (€)"
        }
      ],
      "history": "La riche histoire de l'Italie s'étend de l'Empire romain à la Renaissance jusqu'aux temps modernes. Le pays a été un berceau de la civilisation occidentale, influençant le monde par ses contributions à l'architecture, l'art, la mode et la cuisine.",
      "traditions": [
        {
          "name": "Carnevale",
          "description": "Carnaval pré-carême avec masques et costumes élaborés, particulièrement célèbre à Venise."
        },
        {
          "name": "Palio de Sienne",
          "description": "Historique course de chevaux tenue deux fois chaque été sur la place principale de Sienne."
        },
        {
          "name": "Opéra",
          "description": "Forme d'art italienne traditionnelle combinant musique et théâtre, berceau de Verdi et Puccini."
        }
      ],
      "cuisine": [
        {
          "name": "Pizza Napolitaine",
          "description": "Pizza napolitaine traditionnelle avec des ingrédients frais et simples, reconnue par l'UNESCO."
        },
        {
          "name": "Pasta alla Carbonara",
          "description": "Classique pâtes romaines aux œufs, pecorino, guanciale et poivre noir."
        },
        {
          "name": "Gelato",
          "description": "Glace à l'italienne préparée avec des ingrédients de haute qualité, plus dense et crémeuse que la glace classique."
        }
      ],
      "modernLife": "L'Italie moderne équilibre son riche patrimoine historique avec l'innovation contemporaine dans la mode, le design et la technologie. Le pays maintient sa réputation pour le style, l'artisanat et la dolce vita tout en embrassant les développements modernes.",
      "trends": [
        "Initiatives de mode durable et éco-responsable",
        "Mouvement slow food et gastronomie locale",
        "Innovation numérique dans les industries traditionnelles",
        "Développement du tourisme vert et durable"
      ],
      "places": [
        {
          "name": "Colisée",
          "description": "Amphithéâtre antique emblématique de Rome, l'une des plus grandes réalisations de l'ingénierie romaine."
        },
        {
          "name": "Canaux de Venise",
          "description": "Les voies navigables historiques et gondoles de Venise, classées au patrimoine mondial de l'UNESCO."
        },
        {
          "name": "Toscane",
          "description": "Collines verdoyantes, vignobles et villages historiques formant l'un des paysages les plus beaux d'Europe."
        }
      ]
    },
    "de": {
      "motto": "Italien ist Kultur",
      "quickFacts": [
        {
          "title": "Hauptstadt",
          "value": "Rom"
        },
        {
          "title": "Sprache",
          "value": "Italienisch"
        },
        {
          "title": "Bevolkerung",
          "value": "60 Millionen"
        },
        {
          "title": "Wahrung",
          "value": "Euro (€)"
        }
      ],
      "history": "Italiens reiche Geschichte erstreckt sich vom Romischen Reich uber die Renaissance bis in die Moderne. Das Land war Wiege der westlichen Zivilisation mit Beitragen zu Architektur, Kunst, Mode und Kuche.",
      "traditions": [
        {
          "name": "Karneval",
          "description": "Vorosterlicher Karneval mit aufwendigen Masken und Kostumen, besonders beruhmt in Venedig."
        },
        {
          "name": "Palio von Siena",
          "description": "Historisches Pferderennen zweimal jahrlich auf dem Hauptplatz von Siena."
        },
        {
          "name": "Oper",
          "description": "Traditionelle italienische Kunstform, die Musik und Theater verbindet, Heimat von Verdi und Puccini."
        }
      ],
      "cuisine": [
        {
          "name": "Neapolitanische Pizza",
          "description": "Traditionelle neapolitanische Pizza mit einfachen frischen Zutaten, UNESCO-anerkannt."
        },
        {
          "name": "Pasta alla Carbonara",
          "description": "Klassische romische Pasta mit Eiern, Pecorino, Guanciale und schwarzem Pfeffer."
        },
        {
          "name": "Gelato",
          "description": "Italienisches Eis aus hochwertigen Zutaten, dichter und cremiger als normale Eiscreme."
        }
      ],
      "modernLife": "Das moderne Italien verbindet reiches historisches Erbe mit zeitgenossischer Innovation in Mode, Design und Technologie und pflegt seinen Ruf fur Stil und Handwerkskunst.",
      "trends": [
        "Nachhaltige Modeinitiativen",
        "Slow-Food-Bewegung",
        "Digitale Innovation in traditionellen Industrien",
        "Okotourismus-Entwicklung"
      ],
      "places": [
        {
          "name": "Kolosseum",
          "description": "Antikes Amphitheater und Ikone Roms, eines der grossten Bauwerke der romischen Ingenieurskunst."
        },
        {
          "name": "Venezianische Kanale",
          "description": "Historische Wasserwege und Gondeln Venedigs, UNESCO-Weltkulturerbe."
        },
        {
          "name": "Toskana",
          "description": "Hugelige Landschaft mit Weinbergen und historischen Dorfern, eines der schonsten Landschaften Europas."
        }
      ]
    }
  }
};
