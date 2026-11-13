// Fitxes de les marques de bicis, components i equipament: d'on són, què fan i què en destaquen, en
// els quatre idiomes. Recerca de novembre del 2026 a les webs oficials de cada marca (i Viquipèdia
// per a les dates). Les fotos són de les webs de les marques (`font`), convertides a WebP a
// public/img/marques/fitxes. Oakley i Shimano encara no en tenen: la fitxa pinta el logo.
//
// La nutrició no té fitxa: clicar-ne una marca porta al catàleg de nutrició filtrat.

import type { Locale } from '@/i18n/routing';

type Text = Record<Locale, string>;

export type FitxaMarca = {
  slug: string;
  /** Codi ISO del país (el nom el posa Intl.DisplayNames en cada idioma). */
  pais: string;
  any: number | null;
  web: string;
  lema: Text;
  descripcio: Text;
  /** El nom del model, o el de la línia de producte en cada idioma si no és un nom propi. */
  destacats: { nom: string | Text; descripcio: Text }[];
  imatges: { src: string; font: string; descripcio: string }[];
};

export const FITXES_MARQUES: FitxaMarca[] = [
  {
    "slug": "pinarello",
    "pais": "IT",
    "any": 1952,
    "web": "https://pinarello.com",
    "lema": {
      "ca": "Bicicletes de carretera de Treviso, des de 1952",
      "es": "Bicicletas de carretera de Treviso, desde 1952",
      "en": "Road bikes from Treviso since 1952",
      "fr": "Des vélos de route nés à Trévise en 1952"
    },
    "descripcio": {
      "ca": "Giovanni Pinarello va obrir el 1952 una botiga i taller de bicicletes a Treviso (Itàlia), poc després de deixar el ciclisme professional. La marca és coneguda per la família de bicicletes de competició Dogma, amb què s'han guanyat diverses edicions del Tour de França. Fa bicicletes de carretera, gravel, muntanya i elèctriques.",
      "es": "Giovanni Pinarello abrió en 1952 una tienda y taller de bicicletas en Treviso (Italia), poco después de dejar el ciclismo profesional. La marca es conocida por la familia de bicicletas de competición Dogma, con la que se han ganado varias ediciones del Tour de Francia. Fabrica bicicletas de carretera, gravel, montaña y eléctricas.",
      "en": "Giovanni Pinarello opened a bike shop and workshop in Treviso, Italy, in 1952, shortly after leaving professional racing. The brand is known for its Dogma family of race bikes, which have won several editions of the Tour de France. It makes road, gravel, mountain and electric bikes.",
      "fr": "Giovanni Pinarello ouvre en 1952 un magasin-atelier de vélos à Trévise (Italie), peu après avoir quitté le cyclisme professionnel. La marque est connue pour sa famille de vélos de course Dogma, victorieuse de plusieurs Tours de France. Elle fabrique des vélos de route, de gravel, de VTT et électriques."
    },
    "destacats": [
      {
        "nom": "Dogma F",
        "descripcio": {
          "ca": "Bicicleta de carretera de competició, la de gamma més alta de la marca",
          "es": "Bicicleta de carretera de competición, la de gama más alta de la marca",
          "en": "The brand's top-of-the-range road race bike",
          "fr": "Le vélo de route de course haut de gamme de la marque"
        }
      },
      {
        "nom": "Dogma X",
        "descripcio": {
          "ca": "Bicicleta de carretera de resistència, per a rutes llargues",
          "es": "Bicicleta de carretera de resistencia, para rutas largas",
          "en": "Endurance road bike for long rides",
          "fr": "Vélo de route endurance pour les longues sorties"
        }
      },
      {
        "nom": "Dogma GR",
        "descripcio": {
          "ca": "Bicicleta de gravel de la família Dogma",
          "es": "Bicicleta de gravel de la familia Dogma",
          "en": "Gravel bike from the Dogma family",
          "fr": "Vélo gravel de la famille Dogma"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/pinarello-1.webp",
        "font": "https://pinarello.com/global/en/bikes/road/competition/new-dogma-f",
        "descripcio": "Ciclista amb una Dogma F per una carretera de costa (galeria del producte)"
      },
      {
        "src": "/img/marques/fitxes/pinarello-2.webp",
        "font": "https://pinarello.com/global/en/bikes/road/competition/new-dogma-f",
        "descripcio": "Dogma F blanca i taronja, vista lateral, fons transparent"
      }
    ]
  },
  {
    "slug": "colnago",
    "pais": "IT",
    "any": 1954,
    "web": "https://www.colnago.com",
    "lema": {
      "ca": "Bicicletes de Cambiago, a tocar de Milà, des de 1954",
      "es": "Bicicletas de Cambiago, junto a Milán, desde 1954",
      "en": "Bikes from Cambiago, near Milan, since 1954",
      "fr": "Des vélos de Cambiago, près de Milan, depuis 1954"
    },
    "descripcio": {
      "ca": "Ernesto Colnago va fundar la marca el 1954 a Cambiago, a prop de Milà, on encara té la seu. Va ser de les primeres a apostar pel carboni: la C40, de 1994, va guanyar cinc París-Roubaix en sis anys. Des del 2020 el soci majoritari és el fons emiratí Chimera Investments, i fa bicicletes de carretera i gravel.",
      "es": "Ernesto Colnago fundó la marca en 1954 en Cambiago, cerca de Milán, donde todavía tiene su sede. Fue de las primeras en apostar por el carbono: la C40, de 1994, ganó cinco París-Roubaix en seis años. Desde 2020 el socio mayoritario es el fondo emiratí Chimera Investments, y fabrica bicicletas de carretera y gravel.",
      "en": "Ernesto Colnago founded the brand in 1954 in Cambiago, near Milan, where it is still based. It was an early adopter of carbon: the C40 of 1994 won Paris-Roubaix five times in six years. Since 2020 its majority owner has been the UAE fund Chimera Investments, and it makes road and gravel bikes.",
      "fr": "Ernesto Colnago fonde la marque en 1954 à Cambiago, près de Milan, où elle a toujours son siège. Elle a misé tôt sur le carbone : le C40 de 1994 a remporté cinq Paris-Roubaix en six ans. Depuis 2020, son actionnaire majoritaire est le fonds émirien Chimera Investments ; elle fabrique des vélos de route et de gravel."
    },
    "destacats": [
      {
        "nom": "V5Rs",
        "descripcio": {
          "ca": "Bicicleta de carretera de competició, lleugera",
          "es": "Bicicleta de carretera de competición, ligera",
          "en": "Lightweight road race bike",
          "fr": "Vélo de route de course léger"
        }
      },
      {
        "nom": "C72",
        "descripcio": {
          "ca": "Bicicleta de carretera de gamma alta de la família C",
          "es": "Bicicleta de carretera de gama alta de la familia C",
          "en": "High-end road bike from the C family",
          "fr": "Vélo de route haut de gamme de la famille C"
        }
      },
      {
        "nom": "G5X",
        "descripcio": {
          "ca": "Bicicleta de gravel",
          "es": "Bicicleta de gravel",
          "en": "Gravel bike",
          "fr": "Vélo gravel"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/colnago-1.webp",
        "font": "https://www.colnago.com/es-es",
        "descripcio": "Ciclista amb una Colnago G5X per un camí de terra (gravel)"
      },
      {
        "src": "/img/marques/fitxes/colnago-2.webp",
        "font": "https://www.colnago.com/es-es",
        "descripcio": "Colnago V5Rs amb els colors de l'UAE Team Emirates 2026, vista lateral sobre fons negre"
      }
    ]
  },
  {
    "slug": "cannondale",
    "pais": "US",
    "any": 1971,
    "web": "https://www.cannondale.com",
    "lema": {
      "ca": "Bicicletes de Connecticut des de 1971",
      "es": "Bicicletas de Connecticut desde 1971",
      "en": "Bikes from Connecticut since 1971",
      "fr": "Des vélos du Connecticut depuis 1971"
    },
    "descripcio": {
      "ca": "Cannondale va néixer el 1971 als Estats Units i té la seu a Wilton (Connecticut). Es va fer un nom amb els quadres d'alumini CAAD i amb solucions pròpies com la forquilla d'un sol braç Lefty. Des del 2022 forma part del grup neerlandès Pon Holdings, i fa bicicletes de carretera, gravel, muntanya i elèctriques.",
      "es": "Cannondale nació en 1971 en Estados Unidos y tiene su sede en Wilton (Connecticut). Se hizo un nombre con los cuadros de aluminio CAAD y con soluciones propias como la horquilla de un solo brazo Lefty. Desde 2022 forma parte del grupo neerlandés Pon Holdings, y fabrica bicicletas de carretera, gravel, montaña y eléctricas.",
      "en": "Cannondale was founded in the United States in 1971 and is based in Wilton, Connecticut. It made its name with CAAD aluminium frames and its own ideas such as the single-sided Lefty fork. Since 2022 it has been part of the Dutch group Pon Holdings, and it makes road, gravel, mountain and electric bikes.",
      "fr": "Cannondale est née aux États-Unis en 1971 et a son siège à Wilton (Connecticut). Elle s'est fait un nom avec ses cadres aluminium CAAD et des solutions maison comme la fourche monobras Lefty. Depuis 2022, elle appartient au groupe néerlandais Pon Holdings et fabrique des vélos de route, gravel, VTT et électriques."
    },
    "destacats": [
      {
        "nom": "SuperSix EVO",
        "descripcio": {
          "ca": "Bicicleta de carretera de competició",
          "es": "Bicicleta de carretera de competición",
          "en": "Road race bike",
          "fr": "Vélo de route de course"
        }
      },
      {
        "nom": "Synapse",
        "descripcio": {
          "ca": "Bicicleta de carretera de resistència, per a sortides llargues",
          "es": "Bicicleta de carretera de resistencia, para salidas largas",
          "en": "Endurance road bike for long rides",
          "fr": "Vélo de route endurance pour les longues sorties"
        }
      },
      {
        "nom": "Topstone",
        "descripcio": {
          "ca": "Bicicleta de gravel; alguns models porten suspensió Kingpin",
          "es": "Bicicleta de gravel; algunos modelos llevan suspensión Kingpin",
          "en": "Gravel bike; some models have Kingpin rear suspension",
          "fr": "Vélo gravel ; certains modèles ont la suspension Kingpin"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/cannondale-1.webp",
        "font": "https://www.cannondale.com/en-gb/bikes/road/race/supersix-evo",
        "descripcio": "Corredor aixecant una Cannondale SuperSix EVO al cel (bàner de la col·lecció)"
      },
      {
        "src": "/img/marques/fitxes/cannondale-2.webp",
        "font": "https://www.cannondale.com/en-gb/bikes/road/race/supersix-evo",
        "descripcio": "Cannondale SuperSix EVO blanca, vista de tres quarts sobre fons fosc"
      }
    ]
  },
  {
    "slug": "scott",
    "pais": "CH",
    "any": 1958,
    "web": "https://www.scott-sports.com",
    "lema": {
      "ca": "Nascuda als Estats Units el 1958, amb seu a Suïssa",
      "es": "Nacida en Estados Unidos en 1958, con sede en Suiza",
      "en": "Founded in the USA in 1958, based in Switzerland",
      "fr": "Née aux États-Unis en 1958, basée en Suisse"
    },
    "descripcio": {
      "ca": "Ed Scott, enginyer i esquiador de Sun Valley (Idaho, Estats Units), va fundar Scott el 1958. Avui té la seu a Givisiez (Suïssa) i, a més de bicicletes, fa material d'esquí, de córrer i de motocròs. En ciclisme és coneguda per les bicicletes de carretera Addict i les de muntanya Spark i Scale.",
      "es": "Ed Scott, ingeniero y esquiador de Sun Valley (Idaho, Estados Unidos), fundó Scott en 1958. Hoy tiene su sede en Givisiez (Suiza) y, además de bicicletas, fabrica material de esquí, running y motocross. En ciclismo es conocida por las bicicletas de carretera Addict y las de montaña Spark y Scale.",
      "en": "Ed Scott, an engineer and skier from Sun Valley, Idaho, founded Scott in 1958. It is now based in Givisiez, Switzerland, and besides bikes it makes ski, running and motocross gear. In cycling it is known for its Addict road bikes and its Spark and Scale mountain bikes.",
      "fr": "Ed Scott, ingénieur et skieur de Sun Valley (Idaho, États-Unis), fonde Scott en 1958. L'entreprise a aujourd'hui son siège à Givisiez (Suisse) et fabrique, outre des vélos, du matériel de ski, de running et de motocross. En vélo, on la connaît pour ses routiers Addict et ses VTT Spark et Scale."
    },
    "destacats": [
      {
        "nom": "Addict RC",
        "descripcio": {
          "ca": "Bicicleta de carretera de competició, lleugera",
          "es": "Bicicleta de carretera de competición, ligera",
          "en": "Lightweight road race bike",
          "fr": "Vélo de route de course léger"
        }
      },
      {
        "nom": "Spark RC",
        "descripcio": {
          "ca": "Bicicleta de muntanya de doble suspensió per a cross-country",
          "es": "Bicicleta de montaña de doble suspensión para cross-country",
          "en": "Full-suspension cross-country mountain bike",
          "fr": "VTT tout-suspendu de cross-country"
        }
      },
      {
        "nom": "Addict Gravel",
        "descripcio": {
          "ca": "Bicicleta de gravel",
          "es": "Bicicleta de gravel",
          "en": "Gravel bike",
          "fr": "Vélo gravel"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/scott-1.webp",
        "font": "https://www.scott-sports.com/es/es/",
        "descripcio": "Ciclista de BTT amb una Scott Spark RC, foto en blanc i negre amb efecte de moviment"
      },
      {
        "src": "/img/marques/fitxes/scott-2.webp",
        "font": "https://www.scott-sports.com/es/es/product/scott-addict-gravel-10-bike-427613",
        "descripcio": "Scott Addict Gravel 10, vista lateral, fons transparent"
      }
    ]
  },
  {
    "slug": "specialized",
    "pais": "US",
    "any": 1974,
    "web": "https://www.specialized.com",
    "lema": {
      "ca": "De Morgan Hill (Califòrnia), des de 1974",
      "es": "De Morgan Hill (California), desde 1974",
      "en": "From Morgan Hill, California, since 1974",
      "fr": "De Morgan Hill (Californie), depuis 1974"
    },
    "descripcio": {
      "ca": "Mike Sinyard va fundar Specialized el 1974 i la marca té la seu a Morgan Hill (Califòrnia). El 1981 va treure la Stumpjumper, considerada la primera bicicleta de muntanya fabricada en sèrie. Fa bicicletes de carretera, gravel, muntanya i elèctriques, i també equipament per al ciclista.",
      "es": "Mike Sinyard fundó Specialized en 1974 y la marca tiene su sede en Morgan Hill (California). En 1981 lanzó la Stumpjumper, considerada la primera bicicleta de montaña fabricada en serie. Fabrica bicicletas de carretera, gravel, montaña y eléctricas, además de equipamiento para el ciclista.",
      "en": "Mike Sinyard founded Specialized in 1974, and the brand is based in Morgan Hill, California. In 1981 it launched the Stumpjumper, regarded as the first mass-produced mountain bike. It makes road, gravel, mountain and electric bikes, as well as rider gear.",
      "fr": "Mike Sinyard fonde Specialized en 1974 ; la marque a son siège à Morgan Hill (Californie). En 1981, elle lance le Stumpjumper, considéré comme le premier VTT produit en série. Elle fabrique des vélos de route, gravel, VTT et électriques, ainsi que de l'équipement pour le cycliste."
    },
    "destacats": [
      {
        "nom": "Tarmac",
        "descripcio": {
          "ca": "Bicicleta de carretera de competició (generació SL9)",
          "es": "Bicicleta de carretera de competición (generación SL9)",
          "en": "Road race bike (SL9 generation)",
          "fr": "Vélo de route de course (génération SL9)"
        }
      },
      {
        "nom": "Stumpjumper",
        "descripcio": {
          "ca": "Bicicleta de muntanya; el primer model és del 1981",
          "es": "Bicicleta de montaña; el primer modelo es de 1981",
          "en": "Mountain bike; the first one dates from 1981",
          "fr": "VTT ; le premier modèle date de 1981"
        }
      },
      {
        "nom": "Epic",
        "descripcio": {
          "ca": "Bicicleta de muntanya de cross-country",
          "es": "Bicicleta de montaña de cross-country",
          "en": "Cross-country mountain bike",
          "fr": "VTT de cross-country"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/specialized-1.webp",
        "font": "https://www.specialized.com/gb/en/shop/bikes/road-bikes/racing-bikes/tarmac",
        "descripcio": "S-Works Tarmac sobre fons vermell (bàner de la pàgina Tarmac)"
      },
      {
        "src": "/img/marques/fitxes/specialized-2.webp",
        "font": "https://www.specialized.com/gb/en/shop/bikes/road-bikes/racing-bikes/tarmac",
        "descripcio": "S-Works Tarmac SL9 SRAM RED AXS, vista lateral, fons transparent"
      }
    ]
  },
  {
    "slug": "look",
    "pais": "FR",
    "any": 1951,
    "web": "https://www.lookcycle.com",
    "lema": {
      "ca": "De Nevers (França), pioners del pedal automàtic",
      "es": "De Nevers (Francia), pioneros del pedal automático",
      "en": "From Nevers, France: the clipless pedal pioneers",
      "fr": "De Nevers, les pionniers de la pédale automatique"
    },
    "descripcio": {
      "ca": "Jean Beyl va fundar LOOK el 1951 a Nevers (França), on la marca encara té la seu. El 1984 va presentar el PP65, el primer pedal automàtic, i el 1985 Bernard Hinault va guanyar el Tour amb aquests pedals. Avui fa pedals Keo, bicicletes de carretera, gravel i pista, i components.",
      "es": "Jean Beyl fundó LOOK en 1951 en Nevers (Francia), donde la marca sigue teniendo su sede. En 1984 presentó el PP65, el primer pedal automático, y en 1985 Bernard Hinault ganó el Tour con esos pedales. Hoy fabrica pedales Keo, bicicletas de carretera, gravel y pista, y componentes.",
      "en": "Jean Beyl founded LOOK in 1951 in Nevers, France, where the brand is still based. In 1984 it introduced the PP65, the first clipless pedal, and in 1985 Bernard Hinault won the Tour using them. Today it makes Keo pedals, road, gravel and track bikes, and components.",
      "fr": "Jean Beyl fonde LOOK en 1951 à Nevers, où la marque a toujours son siège. En 1984, elle présente la PP65, première pédale automatique, et en 1985 Bernard Hinault gagne le Tour avec. Elle fabrique aujourd'hui les pédales Keo, des vélos de route, gravel et piste, et des composants."
    },
    "destacats": [
      {
        "nom": "Keo",
        "descripcio": {
          "ca": "Pedals automàtics de carretera; la gamma va néixer el 2004",
          "es": "Pedales automáticos de carretera; la gama nació en 2004",
          "en": "Road clipless pedals; the range dates from 2004",
          "fr": "Pédales automatiques route ; la gamme date de 2004"
        }
      },
      {
        "nom": "795 Blade RS",
        "descripcio": {
          "ca": "Bicicleta de carretera de competició",
          "es": "Bicicleta de carretera de competición",
          "en": "Road race bike",
          "fr": "Vélo de route de course"
        }
      },
      {
        "nom": "G85 Cezal",
        "descripcio": {
          "ca": "Bicicleta de gravel",
          "es": "Bicicleta de gravel",
          "en": "Gravel bike",
          "fr": "Vélo gravel"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/look-1.webp",
        "font": "https://www.lookcycle.com/fr-en/795-blade-rs",
        "descripcio": "LOOK 795 Blade RS sobre fons negre (portada de la pàgina del model)"
      },
      {
        "src": "/img/marques/fitxes/look-2.webp",
        "font": "https://www.lookcycle.com/fr-en/",
        "descripcio": "LOOK G85 Cezal RS (gravel), negra i vermella, vista lateral sobre fons blanc"
      }
    ]
  },
  {
    "slug": "shimano",
    "pais": "JP",
    "any": 1921,
    "web": "https://bike.shimano.com",
    "lema": {
      "ca": "Components de bicicleta des de Sakai (Japó), des de 1921",
      "es": "Componentes de bicicleta desde Sakai (Japón), desde 1921",
      "en": "Bike components from Sakai, Japan, since 1921",
      "fr": "Des composants vélo de Sakai (Japon) depuis 1921"
    },
    "descripcio": {
      "ca": "Shozaburo Shimano va fundar l'empresa el 1921 a Sakai (Osaka, Japó), on encara té la seu. Fa canvis, frens, bieles, pedals, rodes i sistemes per a bicicleta elèctrica per a carretera, gravel i muntanya. El 1973 va presentar Dura-Ace, el seu primer grup per a la competició en carretera.",
      "es": "Shozaburo Shimano fundó la empresa en 1921 en Sakai (Osaka, Japón), donde sigue teniendo su sede. Fabrica cambios, frenos, bielas, pedales, ruedas y sistemas para bicicleta eléctrica de carretera, gravel y montaña. En 1973 presentó Dura-Ace, su primer grupo para la competición en carretera.",
      "en": "Shozaburo Shimano founded the company in 1921 in Sakai, Osaka, Japan, where it is still based. It makes derailleurs, brakes, cranksets, pedals, wheels and e-bike systems for road, gravel and mountain riding. In 1973 it launched Dura-Ace, its first groupset for road racing.",
      "fr": "Shozaburo Shimano fonde l'entreprise en 1921 à Sakai (Osaka, Japon), où elle a toujours son siège. Elle fabrique dérailleurs, freins, pédaliers, pédales, roues et systèmes pour vélo électrique, pour la route, le gravel et le VTT. En 1973, elle lance Dura-Ace, son premier groupe pour la course sur route."
    },
    "destacats": [
      {
        "nom": "Dura-Ace",
        "descripcio": {
          "ca": "Grup de carretera de gamma més alta; el primer és del 1973",
          "es": "Grupo de carretera de gama más alta; el primero es de 1973",
          "en": "Top road groupset; the first one dates from 1973",
          "fr": "Groupe route haut de gamme ; le premier date de 1973"
        }
      },
      {
        "nom": "Ultegra",
        "descripcio": {
          "ca": "Grup de carretera, un graó per sota de Dura-Ace",
          "es": "Grupo de carretera, un escalón por debajo de Dura-Ace",
          "en": "Road groupset, one step below Dura-Ace",
          "fr": "Groupe route, juste en dessous de Dura-Ace"
        }
      },
      {
        "nom": "GRX",
        "descripcio": {
          "ca": "Grup específic per a gravel",
          "es": "Grupo específico para gravel",
          "en": "Gravel-specific groupset",
          "fr": "Groupe spécifique gravel"
        }
      }
    ],
    "imatges": []
  },
  {
    "slug": "sram",
    "pais": "US",
    "any": 1987,
    "web": "https://www.sram.com",
    "lema": {
      "ca": "Transmissions i components des de Chicago, des de 1987",
      "es": "Transmisiones y componentes desde Chicago, desde 1987",
      "en": "Drivetrains and components from Chicago since 1987",
      "fr": "Transmissions et composants de Chicago depuis 1987"
    },
    "descripcio": {
      "ca": "SRAM es va fundar el 1987 a Chicago (Estats Units), i el nom surt dels cognoms dels fundadors. Va començar amb el canvi de puny Grip Shift i avui fa transmissions de carretera i muntanya, moltes sense fils amb el sistema AXS. Al grup hi ha RockShox (suspensions), Zipp (rodes), Quarq (potenciòmetres), TIME (pedals) i Hammerhead (GPS).",
      "es": "SRAM se fundó en 1987 en Chicago (Estados Unidos), y el nombre sale de los apellidos de sus fundadores. Empezó con el cambio de puño Grip Shift y hoy fabrica transmisiones de carretera y montaña, muchas inalámbricas con el sistema AXS. En el grupo están RockShox (suspensiones), Zipp (ruedas), Quarq (potenciómetros), TIME (pedales) y Hammerhead (GPS).",
      "en": "SRAM was founded in Chicago in 1987, and its name comes from its founders' names. It started with the Grip Shift twist shifter and now makes road and mountain drivetrains, many of them wireless with AXS. The group includes RockShox (suspension), Zipp (wheels), Quarq (power meters), TIME (pedals) and Hammerhead (GPS).",
      "fr": "SRAM est fondée en 1987 à Chicago, et son nom vient de ceux de ses fondateurs. Elle débute avec la poignée tournante Grip Shift et fabrique aujourd'hui des transmissions route et VTT, souvent sans fil avec AXS. Le groupe comprend RockShox (suspensions), Zipp (roues), Quarq (capteurs de puissance), TIME (pédales) et Hammerhead (GPS)."
    },
    "destacats": [
      {
        "nom": "RED AXS",
        "descripcio": {
          "ca": "Grup de carretera electrònic sense fils, el de gamma més alta",
          "es": "Grupo de carretera electrónico inalámbrico, el de gama más alta",
          "en": "Top-of-the-range wireless electronic road groupset",
          "fr": "Groupe route électronique sans fil haut de gamme"
        }
      },
      {
        "nom": "Force AXS",
        "descripcio": {
          "ca": "Grup de carretera electrònic sense fils, per sota de RED",
          "es": "Grupo de carretera electrónico inalámbrico, por debajo de RED",
          "en": "Wireless electronic road groupset, below RED",
          "fr": "Groupe route électronique sans fil, sous RED"
        }
      },
      {
        "nom": "Eagle",
        "descripcio": {
          "ca": "Transmissió de muntanya 1x12, presentada el 2016",
          "es": "Transmisión de montaña 1x12, presentada en 2016",
          "en": "1x12 mountain bike drivetrain, launched in 2016",
          "fr": "Transmission VTT 1x12, lancée en 2016"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/sram-1.webp",
        "font": "https://www.sram.com/en/sram/road/series/red-axs",
        "descripcio": "Ciclista en un paisatge de marbre blanc (campanya SRAM RED AXS)"
      },
      {
        "src": "/img/marques/fitxes/sram-2.webp",
        "font": "https://www.sram.com/en/sram/models/rd-red-e-e1",
        "descripcio": "Canvi posterior SRAM RED AXS (RD-RED-E-E1), fons transparent"
      }
    ]
  },
  {
    "slug": "continental",
    "pais": "DE",
    "any": 1871,
    "web": "https://www.continental-tires.com/products/bicycle/",
    "lema": {
      "ca": "Cobertes de bicicleta des de 1892",
      "es": "Cubiertas de bicicleta desde 1892",
      "en": "Bicycle tyres since 1892",
      "fr": "Des pneus vélo depuis 1892"
    },
    "descripcio": {
      "ca": "Continental es va fundar el 1871 a Hannover (Alemanya), on encara té la seu, i el 1892 va començar a fabricar cobertes de bicicleta amb cambra d'aire. Avui és sobretot un gran fabricant de pneumàtics per a cotxe, però manté una gamma de cobertes de carretera, gravel, muntanya i ciutat. La família Grand Prix 5000 és la seva gamma de carretera de competició.",
      "es": "Continental se fundó en 1871 en Hannover (Alemania), donde sigue teniendo su sede, y en 1892 empezó a fabricar cubiertas de bicicleta con cámara de aire. Hoy es sobre todo un gran fabricante de neumáticos de coche, pero mantiene una gama de cubiertas de carretera, gravel, montaña y ciudad. La familia Grand Prix 5000 es su gama de carretera de competición.",
      "en": "Continental was founded in 1871 in Hanover, Germany, where it is still based, and began making pneumatic bicycle tyres in 1892. Today it is mainly a large car tyre maker, but it keeps a range of road, gravel, mountain and city bike tyres. The Grand Prix 5000 family is its road racing range.",
      "fr": "Continental est fondée en 1871 à Hanovre (Allemagne), où elle a toujours son siège, et fabrique des pneus vélo à chambre à air depuis 1892. C'est surtout un grand fabricant de pneus auto, mais elle garde une gamme de pneus route, gravel, VTT et ville. La famille Grand Prix 5000 est sa gamme route de compétition."
    },
    "destacats": [
      {
        "nom": "Grand Prix 5000 S TR",
        "descripcio": {
          "ca": "Coberta de carretera tubeless de la família GP5000",
          "es": "Cubierta de carretera tubeless de la familia GP5000",
          "en": "Tubeless road tyre from the GP5000 family",
          "fr": "Pneu route tubeless de la famille GP5000"
        }
      },
      {
        "nom": "Grand Prix 5000 AllSeason TR",
        "descripcio": {
          "ca": "Versió per a tot l'any, també amb pluja i fred",
          "es": "Versión para todo el año, también con lluvia y frío",
          "en": "All-year version, including rain and cold",
          "fr": "Version toute l'année, pluie et froid compris"
        }
      },
      {
        "nom": "Grand Prix 5000 TT TR",
        "descripcio": {
          "ca": "Versió per a contrarellotge i triatló",
          "es": "Versión para contrarreloj y triatlón",
          "en": "Time-trial and triathlon version",
          "fr": "Version contre-la-montre et triathlon"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/continental-1.webp",
        "font": "https://www.continental-tires.com/products/bicycle/Grand-Prix-5000-Range/",
        "descripcio": "Ciclista amb una bici de carretera vermella en un passeig de costa (campanya Grand Prix 5000)"
      },
      {
        "src": "/img/marques/fitxes/continental-2.webp",
        "font": "https://www.continental-tires.com/products/bicycle/Grand-Prix-5000-Range/",
        "descripcio": "Coberta Continental Grand Prix 5000 S TR, fons transparent"
      }
    ]
  },
  {
    "slug": "pirelli",
    "pais": "IT",
    "any": 1872,
    "web": "https://www.pirelli.com/tyres/en-gb/bike",
    "lema": {
      "ca": "Cobertes de bicicleta fetes a Bollate, a prop de Milà",
      "es": "Cubiertas de bicicleta fabricadas en Bollate, cerca de Milán",
      "en": "Bike tyres made in Bollate, near Milan",
      "fr": "Des pneus vélo fabriqués à Bollate, près de Milan"
    },
    "descripcio": {
      "ca": "Pirelli es va fundar el 1872 a Milà, i el 1890 el seu primer pneumàtic va ser una coberta de bicicleta. Després de dècades fora del ciclisme, hi va tornar el 2017 amb la gamma P Zero Velo, i avui fabrica les cobertes de bicicleta a la planta de Bollate, a prop de Milà. Fa cobertes de carretera (P Zero), gravel (Cinturato), muntanya (Scorpion) i ciutat (Angel).",
      "es": "Pirelli se fundó en 1872 en Milán, y en 1890 su primer neumático fue una cubierta de bicicleta. Tras décadas fuera del ciclismo, volvió en 2017 con la gama P Zero Velo, y hoy fabrica las cubiertas de bicicleta en la planta de Bollate, cerca de Milán. Hace cubiertas de carretera (P Zero), gravel (Cinturato), montaña (Scorpion) y ciudad (Angel).",
      "en": "Pirelli was founded in Milan in 1872, and its first tyre, in 1890, was a bicycle tyre. After decades away from cycling it returned in 2017 with the P Zero Velo range, and it now makes its bike tyres at its Bollate plant near Milan. It offers road (P Zero), gravel (Cinturato), mountain (Scorpion) and city (Angel) tyres.",
      "fr": "Pirelli est fondée à Milan en 1872 et, en 1890, son premier pneu est un pneu de vélo. Après des décennies loin du cyclisme, elle revient en 2017 avec la gamme P Zero Velo et fabrique aujourd'hui ses pneus vélo à l'usine de Bollate, près de Milan. Elle propose des pneus route (P Zero), gravel (Cinturato), VTT (Scorpion) et ville (Angel)."
    },
    "destacats": [
      {
        "nom": "P Zero Race TLR",
        "descripcio": {
          "ca": "Coberta de carretera tubeless per a competició",
          "es": "Cubierta de carretera tubeless para competición",
          "en": "Tubeless road racing tyre",
          "fr": "Pneu route tubeless de compétition"
        }
      },
      {
        "nom": "Cinturato Gravel",
        "descripcio": {
          "ca": "Cobertes de gravel",
          "es": "Cubiertas de gravel",
          "en": "Gravel tyres",
          "fr": "Pneus gravel"
        }
      },
      {
        "nom": "Scorpion XC",
        "descripcio": {
          "ca": "Cobertes de muntanya per a cross-country",
          "es": "Cubiertas de montaña para cross-country",
          "en": "Cross-country mountain bike tyres",
          "fr": "Pneus VTT de cross-country"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/pirelli-1.webp",
        "font": "https://www.pirelli.com/tyres/en-gb/bike",
        "descripcio": "Dues rodes amb cobertes de gravel Pirelli Cinturato (portada de la web de ciclisme)"
      },
      {
        "src": "/img/marques/fitxes/pirelli-2.webp",
        "font": "https://www.pirelli.com/tyres/en-gb/bike/tyres/catalogue/p-zero-race-tlr",
        "descripcio": "Coberta Pirelli P Zero Race TLR, detall del flanc sobre fons blanc"
      }
    ]
  },
  {
    "slug": "muc-off",
    "pais": "GB",
    "any": 1994,
    "web": "https://muc-off.com",
    "lema": {
      "ca": "Neteja i manteniment de la bici, des del Regne Unit",
      "es": "Limpieza y mantenimiento de la bici, desde Reino Unido",
      "en": "Bike cleaning and care from the UK",
      "fr": "Nettoyage et entretien du vélo, depuis le Royaume-Uni"
    },
    "descripcio": {
      "ca": "Muc-Off va néixer el 1994 al Regne Unit, a partir del negoci de components de bicicleta de la família Trimnell, amb un netejador de bicicletes en ampolla rosa. Avui fa productes de neteja, lubricants, kits tubeless i accessoris per a bicicleta i moto.",
      "es": "Muc-Off nació en 1994 en Reino Unido, a partir del negocio de componentes de bicicleta de la familia Trimnell, con un limpiador de bicicletas en botella rosa. Hoy fabrica productos de limpieza, lubricantes, kits tubeless y accesorios para bicicleta y moto.",
      "en": "Muc-Off was born in the UK in 1994, out of the Trimnell family's bike components business, with a bike cleaner in a pink bottle. Today it makes cleaning products, lubricants, tubeless kits and accessories for bikes and motorbikes.",
      "fr": "Muc-Off naît au Royaume-Uni en 1994, issue de l'entreprise de composants vélo de la famille Trimnell, avec un nettoyant vélo en flacon rose. Elle fabrique aujourd'hui des produits de nettoyage, des lubrifiants, des kits tubeless et des accessoires pour vélo et moto."
    },
    "destacats": [
      {
        "nom": "Nano Tech Bike Cleaner",
        "descripcio": {
          "ca": "Netejador de bicicletes en esprai, d'1 litre",
          "es": "Limpiador de bicicletas en espray, de 1 litro",
          "en": "1-litre spray bike cleaner",
          "fr": "Nettoyant vélo en spray, 1 litre"
        }
      },
      {
        "nom": {"ca":"Lubricants de cadena","es":"Lubricantes de cadena","en":"Chain lubes","fr":"Lubrifiants de chaîne"},
        "descripcio": {
          "ca": "Lubricants de cadena per a diferents condicions",
          "es": "Lubricantes de cadena para distintas condiciones",
          "en": "Chain lubes for different conditions",
          "fr": "Lubrifiants chaîne pour différentes conditions"
        }
      },
      {
        "nom": "Tubeless",
        "descripcio": {
          "ca": "Líquid antipunxades i vàlvules per a muntatges tubeless",
          "es": "Líquido antipinchazos y válvulas para montajes tubeless",
          "en": "Sealant and valves for tubeless set-ups",
          "fr": "Préventif et valves pour montages tubeless"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/muc-off-1.webp",
        "font": "https://muc-off.com/",
        "descripcio": "Estoigs de protecció Muc-Off en quatre colors sobre fons fosc (bàner d'article)"
      },
      {
        "src": "/img/marques/fitxes/muc-off-2.webp",
        "font": "https://muc-off.com/products/bike-cleaner",
        "descripcio": "Netejador Muc-Off Nano Tech Bike Cleaner d'1 litre, fons blanc"
      }
    ]
  },
  {
    "slug": "x-sauce",
    "pais": "ES",
    "any": null,
    "web": "https://x-sauce.com",
    "lema": {
      "ca": "Marca espanyola de líquids antipunxades i tubeless",
      "es": "Marca española de líquidos antipinchazos y tubeless",
      "en": "Spanish brand of tubeless sealants",
      "fr": "Marque espagnole de préventifs et de tubeless"
    },
    "descripcio": {
      "ca": "X-Sauce és una marca espanyola (X-Sauce Factory Sport, S.L.) especialitzada en el muntatge tubeless. Fa líquids antipunxades per a carretera, gravel i muntanya, vàlvules, cintes de llanta, metxes de reparació i productes de neteja i lubricació, i dona suport a diversos equips de BTT.",
      "es": "X-Sauce es una marca española (X-Sauce Factory Sport, S.L.) especializada en el montaje tubeless. Fabrica líquidos antipinchazos para carretera, gravel y montaña, válvulas, cintas de llanta, mechas de reparación y productos de limpieza y lubricación, y apoya a varios equipos de BTT.",
      "en": "X-Sauce is a Spanish brand (X-Sauce Factory Sport, S.L.) specialising in tubeless set-ups. It makes sealants for road, gravel and mountain bikes, valves, rim tapes, repair plugs and cleaning and lubrication products, and supports several mountain bike teams.",
      "fr": "X-Sauce est une marque espagnole (X-Sauce Factory Sport, S.L.) spécialisée dans le tubeless. Elle fabrique des préventifs pour la route, le gravel et le VTT, des valves, des fonds de jante, des mèches de réparation et des produits de nettoyage et de lubrification, et soutient plusieurs équipes de VTT."
    },
    "destacats": [
      {
        "nom": "Gravel & Road",
        "descripcio": {
          "ca": "Líquid antipunxades per a cobertes de carretera i gravel",
          "es": "Líquido antipinchazos para cubiertas de carretera y gravel",
          "en": "Sealant for road and gravel tyres",
          "fr": "Préventif pour pneus route et gravel"
        }
      },
      {
        "nom": {"ca":"Líquid MTB","es":"Líquido MTB","en":"MTB sealant","fr":"Liquide VTT"},
        "descripcio": {
          "ca": "Líquid antipunxades per a cobertes de muntanya",
          "es": "Líquido antipinchazos para cubiertas de montaña",
          "en": "Sealant for mountain bike tyres",
          "fr": "Préventif pour pneus VTT"
        }
      },
      {
        "nom": {"ca":"Kit de metxes","es":"Kit de mechas","en":"Tubeless plug kit","fr":"Kit de mèches"},
        "descripcio": {
          "ca": "Metxes per tapar punxades sense desmuntar la coberta",
          "es": "Mechas para tapar pinchazos sin desmontar la cubierta",
          "en": "Plugs to fix punctures without removing the tyre",
          "fr": "Mèches pour réparer sans démonter le pneu"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/x-sauce-1.webp",
        "font": "https://x-sauce.com/",
        "descripcio": "Corredors d'un equip patrocinat amb les seves bicis de muntanya (bàner de la portada)"
      },
      {
        "src": "/img/marques/fitxes/x-sauce-2.webp",
        "font": "https://x-sauce.com/",
        "descripcio": "Ampolla de 500 ml de líquid antipunxades X-Sauce Gravel & Road, fons transparent"
      }
    ]
  },
  {
    "slug": "thule",
    "pais": "SE",
    "any": 1942,
    "web": "https://www.thule.com",
    "lema": {
      "ca": "Portabicis i equipatge des de Suècia, des de 1942",
      "es": "Portabicicletas y equipaje desde Suecia, desde 1942",
      "en": "Bike carriers and luggage from Sweden since 1942",
      "fr": "Porte-vélos et bagagerie de Suède depuis 1942"
    },
    "descripcio": {
      "ca": "Erik Thulin va fundar Thule el 1942 a Hillerstorp (Suècia), i avui el grup té la seu a Malmö. El 1962 va fer les primeres baques de sostre, i actualment és coneguda pels portabicis de sostre, d'enganxall i de portó, a més de cofres, motxilles i remolcs per portar nens amb la bici (Chariot).",
      "es": "Erik Thulin fundó Thule en 1942 en Hillerstorp (Suecia), y hoy el grupo tiene su sede en Malmö. En 1962 hizo sus primeras barras de techo, y actualmente es conocida por sus portabicicletas de techo, de bola y de portón, además de cofres, mochilas y remolques para llevar niños en bici (Chariot).",
      "en": "Erik Thulin founded Thule in 1942 in Hillerstorp, Sweden; the group is now based in Malmö. It made its first roof racks in 1962 and is known today for roof, towbar and trunk bike carriers, as well as roof boxes, backpacks and Chariot child trailers.",
      "fr": "Erik Thulin fonde Thule en 1942 à Hillerstorp (Suède) ; le groupe a aujourd'hui son siège à Malmö. Ses premières barres de toit datent de 1962, et elle est connue pour ses porte-vélos de toit, d'attelage et de hayon, ses coffres, ses sacs à dos et ses remorques enfants Chariot."
    },
    "destacats": [
      {
        "nom": "Epos",
        "descripcio": {
          "ca": "Portabicis d'enganxall de plataforma",
          "es": "Portabicicletas de bola de plataforma",
          "en": "Platform towbar bike carrier",
          "fr": "Porte-vélos d'attelage à plateforme"
        }
      },
      {
        "nom": "TopRide",
        "descripcio": {
          "ca": "Portabicis de sostre",
          "es": "Portabicicletas de techo",
          "en": "Roof bike carrier",
          "fr": "Porte-vélo de toit"
        }
      },
      {
        "nom": "Chariot",
        "descripcio": {
          "ca": "Remolcs per portar nens amb la bici",
          "es": "Remolques para llevar niños en bici",
          "en": "Trailers for carrying children by bike",
          "fr": "Remorques pour transporter les enfants à vélo"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/thule-1.webp",
        "font": "https://www.thule.com/en-gb",
        "descripcio": "Barres de sostre Thule muntades sobre un cotxe (bàner del menú; 960 px)"
      },
      {
        "src": "/img/marques/fitxes/thule-2.webp",
        "font": "https://www.thule.com/en-gb/bike-rack/towbar-bike-racks/thule-epos-2bike-13pin-_-978200",
        "descripcio": "Portabicis d'enganxall Thule Epos per a dues bicis, fons transparent"
      }
    ]
  },
  {
    "slug": "poc",
    "pais": "SE",
    "any": 2005,
    "web": "https://poc.com",
    "lema": {
      "ca": "Cascs i protecció, des d'Estocolm",
      "es": "Cascos y protección, desde Estocolmo",
      "en": "Helmets and protection from Stockholm",
      "fr": "Casques et protections, depuis Stockholm"
    },
    "descripcio": {
      "ca": "POC es va fundar el 2005 a Estocolm (Suècia), amb Stefan Ytterborn al capdavant, i va començar fent cascs i protectors per a l'esquí de competició. El 2008 va entrar en el ciclisme de muntanya, i avui fa cascs, ulleres, roba i protecció per a carretera, gravel, muntanya i esquí.",
      "es": "POC se fundó en 2005 en Estocolmo (Suecia), con Stefan Ytterborn al frente, y empezó haciendo cascos y protecciones para el esquí de competición. En 2008 entró en el ciclismo de montaña, y hoy fabrica cascos, gafas, ropa y protecciones para carretera, gravel, montaña y esquí.",
      "en": "POC was founded in Stockholm, Sweden, in 2005, led by Stefan Ytterborn, and started out making helmets and protectors for ski racing. It moved into mountain biking in 2008 and now makes helmets, eyewear, clothing and protection for road, gravel, mountain biking and skiing.",
      "fr": "POC est fondée à Stockholm (Suède) en 2005, sous la direction de Stefan Ytterborn, et commence par des casques et protections pour le ski de compétition. Elle arrive en VTT en 2008 et fabrique aujourd'hui casques, lunettes, vêtements et protections pour la route, le gravel, le VTT et le ski."
    },
    "destacats": [
      {
        "nom": "Cytal",
        "descripcio": {
          "ca": "Casc de carretera",
          "es": "Casco de carretera",
          "en": "Road helmet",
          "fr": "Casque route"
        }
      },
      {
        "nom": "Ventral Air",
        "descripcio": {
          "ca": "Casc de carretera molt ventilat",
          "es": "Casco de carretera muy ventilado",
          "en": "Well-ventilated road helmet",
          "fr": "Casque route très ventilé"
        }
      },
      {
        "nom": "Octal MIPS",
        "descripcio": {
          "ca": "Casc de carretera amb sistema MIPS",
          "es": "Casco de carretera con sistema MIPS",
          "en": "Road helmet with MIPS",
          "fr": "Casque route avec système MIPS"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/poc-1.webp",
        "font": "https://poc.com/en/cycling",
        "descripcio": "Casc de carretera POC amb llum posterior vermella sobre fons negre (portada de ciclisme)"
      },
      {
        "src": "/img/marques/fitxes/poc-2.webp",
        "font": "https://poc.com/en/product/cytal-uranium-black-matt",
        "descripcio": "Casc POC Cytal Uranium Black Matt, fons transparent (porta un segell de valoració a dalt a l'esquerra)"
      }
    ]
  },
  {
    "slug": "kask",
    "pais": "IT",
    "any": 2004,
    "web": "https://www.kask.com",
    "lema": {
      "ca": "Cascs de Bergamo, des de 2004",
      "es": "Cascos de Bérgamo, desde 2004",
      "en": "Helmets from Bergamo since 2004",
      "fr": "Des casques de Bergame depuis 2004"
    },
    "descripcio": {
      "ca": "Angelo Gotti va fundar Kask el 2004 a Chiuduno, a prop de Bergamo (Itàlia). Els seus cascs de carretera els han portat els corredors de l'equip Sky, l'actual INEOS Grenadiers, i la marca fa cascs per a ciclisme, esquí, hípica i treball.",
      "es": "Angelo Gotti fundó Kask en 2004 en Chiuduno, cerca de Bérgamo (Italia). Sus cascos de carretera los han llevado los corredores del equipo Sky, el actual INEOS Grenadiers, y la marca fabrica cascos para ciclismo, esquí, hípica y trabajo.",
      "en": "Angelo Gotti founded Kask in 2004 in Chiuduno, near Bergamo, Italy. Its road helmets have been worn by Team Sky, now INEOS Grenadiers, and the brand makes helmets for cycling, skiing, horse riding and work.",
      "fr": "Angelo Gotti fonde Kask en 2004 à Chiuduno, près de Bergame (Italie). Ses casques route ont été portés par l'équipe Sky, aujourd'hui INEOS Grenadiers, et la marque fabrique des casques pour le vélo, le ski, l'équitation et le travail."
    },
    "destacats": [
      {
        "nom": "Protone Icon",
        "descripcio": {
          "ca": "Casc de carretera entre l'aerodinàmica i la ventilació",
          "es": "Casco de carretera entre la aerodinámica y la ventilación",
          "en": "Road helmet balancing aerodynamics and ventilation",
          "fr": "Casque route entre aérodynamisme et ventilation"
        }
      },
      {
        "nom": "Valegro",
        "descripcio": {
          "ca": "Casc de carretera lleuger i molt ventilat",
          "es": "Casco de carretera ligero y muy ventilado",
          "en": "Light, well-ventilated road helmet",
          "fr": "Casque route léger et très ventilé"
        }
      },
      {
        "nom": "Utopia Y",
        "descripcio": {
          "ca": "Casc aerodinàmic de carretera",
          "es": "Casco aerodinámico de carretera",
          "en": "Aero road helmet",
          "fr": "Casque route aérodynamique"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/kask-1.webp",
        "font": "https://www.kask.com/es-es/Cycling",
        "descripcio": "Corredors de l'equip INEOS Grenadiers amb cascos Kask en ruta (vertical, 900x1125)"
      },
      {
        "src": "/img/marques/fitxes/kask-2.webp",
        "font": "https://www.kask.com/es-es/Protone-Icon/CHE00097-CE-WG-495.58.html",
        "descripcio": "Casc Kask Valegro negre sobre fons clar (render de producte, vertical)"
      }
    ]
  },
  {
    "slug": "oakley",
    "pais": "US",
    "any": 1975,
    "web": "https://www.oakley.com",
    "lema": {
      "ca": "Ulleres esportives nord-americanes, des de 1975",
      "es": "Gafas deportivas estadounidenses, desde 1975",
      "en": "American sports eyewear since 1975",
      "fr": "Lunettes de sport américaines depuis 1975"
    },
    "descripcio": {
      "ca": "Jim Jannard va fundar Oakley el 1975 als Estats Units; al principi feia punys per a motos de motocròs i més tard màscares i ulleres. Des del 2007 forma part de Luxottica, avui EssilorLuxottica. En ciclisme és coneguda per les ulleres amb lents Prizm, i també fa cascs i roba.",
      "es": "Jim Jannard fundó Oakley en 1975 en Estados Unidos; al principio hacía puños para motos de motocross y más tarde máscaras y gafas. Desde 2007 forma parte de Luxottica, hoy EssilorLuxottica. En ciclismo es conocida por sus gafas con lentes Prizm, y también fabrica cascos y ropa.",
      "en": "Jim Jannard founded Oakley in the United States in 1975; it first made motocross grips, then goggles and sunglasses. Since 2007 it has been part of Luxottica, now EssilorLuxottica. In cycling it is known for its sunglasses with Prizm lenses, and it also makes helmets and clothing.",
      "fr": "Jim Jannard fonde Oakley aux États-Unis en 1975 ; elle fabrique d'abord des poignées de motocross, puis des masques et des lunettes. Depuis 2007, elle appartient à Luxottica, aujourd'hui EssilorLuxottica. En vélo, on la connaît pour ses lunettes à verres Prizm ; elle fait aussi des casques et des vêtements."
    },
    "destacats": [
      {
        "nom": "Sutro",
        "descripcio": {
          "ca": "Ulleres de pantalla gran per a ciclisme",
          "es": "Gafas de pantalla grande para ciclismo",
          "en": "Large-shield cycling sunglasses",
          "fr": "Lunettes à grand écran pour le vélo"
        }
      },
      {
        "nom": "Radar",
        "descripcio": {
          "ca": "Família d'ulleres esportives per a ciclisme i córrer",
          "es": "Familia de gafas deportivas para ciclismo y running",
          "en": "Sports sunglasses family for cycling and running",
          "fr": "Famille de lunettes de sport pour le vélo et la course"
        }
      },
      {
        "nom": "Prizm",
        "descripcio": {
          "ca": "Tecnologia de lents que realça el contrast",
          "es": "Tecnología de lentes que realza el contraste",
          "en": "Lens technology that enhances contrast",
          "fr": "Technologie de verres qui renforce le contraste"
        }
      }
    ],
    "imatges": []
  },
  {
    "slug": "bliz",
    "pais": "SE",
    "any": null,
    "web": "https://www.bliz.com",
    "lema": {
      "ca": "Ulleres esportives sueques, nascudes a l'esquí de fons",
      "es": "Gafas deportivas suecas, nacidas en el esquí de fondo",
      "en": "Swedish sports eyewear with cross-country skiing roots",
      "fr": "Lunettes de sport suédoises, nées en ski de fond"
    },
    "descripcio": {
      "ca": "Bliz és una marca sueca d'ulleres esportives que es va donar a conèixer en l'esquí de fons. Fa ulleres per a ciclisme, córrer i esquí, màscares i cascs, i des del gener del 2024 forma part d'EssilorLuxottica.",
      "es": "Bliz es una marca sueca de gafas deportivas que se dio a conocer en el esquí de fondo. Fabrica gafas para ciclismo, running y esquí, máscaras y cascos, y desde enero de 2024 forma parte de EssilorLuxottica.",
      "en": "Bliz is a Swedish sports eyewear brand that made its name in cross-country skiing. It makes sunglasses for cycling, running and skiing, as well as goggles and helmets, and has been part of EssilorLuxottica since January 2024.",
      "fr": "Bliz est une marque suédoise de lunettes de sport qui s'est fait connaître en ski de fond. Elle fabrique des lunettes pour le vélo, la course et le ski, des masques et des casques, et appartient à EssilorLuxottica depuis janvier 2024."
    },
    "destacats": [
      {
        "nom": "Matrix",
        "descripcio": {
          "ca": "Model d'ulleres esportives de la marca",
          "es": "Modelo de gafas deportivas de la marca",
          "en": "One of the brand's sports sunglasses",
          "fr": "Modèle de lunettes de sport de la marque"
        }
      },
      {
        "nom": "Fusion",
        "descripcio": {
          "ca": "Model d'ulleres esportives de la marca",
          "es": "Modelo de gafas deportivas de la marca",
          "en": "One of the brand's sports sunglasses",
          "fr": "Modèle de lunettes de sport de la marque"
        }
      },
      {
        "nom": {"ca":"Màscares d'esquí","es":"Máscaras de esquí","en":"Ski goggles","fr":"Masques de ski"},
        "descripcio": {
          "ca": "Màscares per a esquí i snowboard",
          "es": "Máscaras para esquí y snowboard",
          "en": "Ski and snowboard goggles",
          "fr": "Masques de ski et de snowboard"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/bliz-1.webp",
        "font": "https://www.bliz.com/es-es",
        "descripcio": "Esquiador amb màscara Bliz sobre un fons de neu (bàner de la portada; és d'esquí i porta l'etiqueta NEW)"
      },
      {
        "src": "/img/marques/fitxes/bliz-2.webp",
        "font": "https://www.bliz.com/es-es",
        "descripcio": "Ulleres esportives Bliz de pantalla única amb lent blava (ref. 0ZB7004), fons transparent"
      }
    ]
  },
  {
    "slug": "eassun",
    "pais": "ES",
    "any": null,
    "web": "https://eassun.com",
    "lema": {
      "ca": "Ulleres i cascs esportius de Barcelona",
      "es": "Gafas y cascos deportivos de Barcelona",
      "en": "Sports eyewear and helmets from Barcelona",
      "fr": "Lunettes et casques de sport de Barcelone"
    },
    "descripcio": {
      "ca": "Eassun és una marca barcelonina d'ulleres i cascs esportius, de l'empresa Plaintex, S.L.U. Fa ulleres per a ciclisme, córrer i golf, moltes amb lents fotocromàtiques, ulleres esportives graduades i cascs i màscares d'esquí.",
      "es": "Eassun es una marca barcelonesa de gafas y cascos deportivos, de la empresa Plaintex, S.L.U. Fabrica gafas para ciclismo, running y golf, muchas con lentes fotocromáticas, gafas deportivas graduadas y cascos y máscaras de esquí.",
      "en": "Eassun is a Barcelona brand of sports eyewear and helmets, owned by Plaintex, S.L.U. It makes sunglasses for cycling, running and golf, many with photochromic lenses, as well as prescription sports glasses and ski helmets and goggles.",
      "fr": "Eassun est une marque barcelonaise de lunettes et de casques de sport, de la société Plaintex, S.L.U. Elle fabrique des lunettes pour le vélo, la course et le golf, souvent à verres photochromiques, des lunettes de sport à la vue et des casques et masques de ski."
    },
    "destacats": [
      {
        "nom": "Paradiso",
        "descripcio": {
          "ca": "Ulleres fotocromàtiques i ventilades per a ciclisme",
          "es": "Gafas fotocromáticas y ventiladas para ciclismo",
          "en": "Photochromic, ventilated cycling sunglasses",
          "fr": "Lunettes photochromiques ventilées pour le vélo"
        }
      },
      {
        "nom": "Sprint",
        "descripcio": {
          "ca": "Ulleres fotocromàtiques i ajustables",
          "es": "Gafas fotocromáticas y ajustables",
          "en": "Adjustable photochromic sunglasses",
          "fr": "Lunettes photochromiques réglables"
        }
      },
      {
        "nom": "Armour",
        "descripcio": {
          "ca": "Ulleres fotocromàtiques i lleugeres",
          "es": "Gafas fotocromáticas y ligeras",
          "en": "Light photochromic sunglasses",
          "fr": "Lunettes photochromiques légères"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/eassun-1.webp",
        "font": "https://eassun.com/es/",
        "descripcio": "Corredora de muntanya amb ulleres Eassun en un corriol (bàner de la portada; no és ciclisme)"
      },
      {
        "src": "/img/marques/fitxes/eassun-2.webp",
        "font": "https://eassun.com/es/",
        "descripcio": "Ulleres Eassun Paradiso fotocromàtiques, fons blanc"
      }
    ]
  },
  {
    "slug": "assos",
    "pais": "CH",
    "any": 1976,
    "web": "https://www.assos.com",
    "lema": {
      "ca": "Roba de ciclisme suïssa des de 1976",
      "es": "Ropa de ciclismo suiza desde 1976",
      "en": "Swiss cycling clothing since 1976",
      "fr": "Vêtements de cyclisme suisses depuis 1976"
    },
    "descripcio": {
      "ca": "ASSOS fa roba de ciclisme des del 1976, quan Toni Maier es va proposar fer més aerodinàmica la roba del ciclista. Té la seu a Stabio, al cantó suís del Ticino, i fa mallots, culottes, jaquetes i capes interiors per a carretera, gravel i muntanya.",
      "es": "ASSOS fabrica ropa de ciclismo desde 1976, cuando Toni Maier se propuso hacer más aerodinámica la ropa del ciclista. Tiene su sede en Stabio, en el cantón suizo del Tesino, y fabrica maillots, culotes, chaquetas y capas interiores para carretera, gravel y montaña.",
      "en": "ASSOS has made cycling clothing since 1976, when Toni Maier set out to make riders' clothing more aerodynamic. It is based in Stabio, in the Swiss canton of Ticino, and makes jerseys, bib shorts, jackets and base layers for road, gravel and mountain riding.",
      "fr": "ASSOS fabrique des vêtements de cyclisme depuis 1976, quand Toni Maier a voulu rendre la tenue du cycliste plus aérodynamique. La marque a son siège à Stabio, dans le canton suisse du Tessin, et fait maillots, cuissards, vestes et sous-couches pour la route, le gravel et le VTT."
    },
    "destacats": [
      {
        "nom": "MILLE GT",
        "descripcio": {
          "ca": "Línia de roba de carretera per a entrenament i rutes",
          "es": "Línea de ropa de carretera para entrenamiento y rutas",
          "en": "Road clothing line for training and long rides",
          "fr": "Ligne route pour l'entraînement et les sorties"
        }
      },
      {
        "nom": "EQUIPE RS",
        "descripcio": {
          "ca": "Línia de roba de carretera orientada a la competició",
          "es": "Línea de ropa de carretera orientada a la competición",
          "en": "Race-oriented road clothing line",
          "fr": "Ligne route orientée compétition"
        }
      },
      {
        "nom": "UMA GT",
        "descripcio": {
          "ca": "Línia de roba de carretera per a dona",
          "es": "Línea de ropa de carretera para mujer",
          "en": "Women's road clothing line",
          "fr": "Ligne route pour femme"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/assos-1.webp",
        "font": "https://www.assos.com/es/",
        "descripcio": "Dos ciclistes sortint d'un túnel en un paisatge nevat, en blanc i negre (bàner de la portada)"
      },
      {
        "src": "/img/marques/fitxes/assos-2.webp",
        "font": "https://www.assos.com/es/",
        "descripcio": "Culotte llarg ASSOS EQUIPE RS Spring Fall Bib Tights S11 EVO, fons gris clar"
      }
    ]
  },
  {
    "slug": "gobik",
    "pais": "ES",
    "any": 2010,
    "web": "https://gobik.com",
    "lema": {
      "ca": "Roba de ciclisme de Yecla (Múrcia), des de 2010",
      "es": "Ropa de ciclismo de Yecla (Murcia), desde 2010",
      "en": "Cycling clothing from Yecla, Spain, since 2010",
      "fr": "Vêtements de cyclisme de Yecla (Espagne) depuis 2010"
    },
    "descripcio": {
      "ca": "Gobik va néixer el 2010 a Yecla (Múrcia) fent equipacions a mida per a un club ciclista local. Avui fa roba tècnica de ciclisme per a carretera, gravel i muntanya, i també de córrer i triatló, i continua fent equipacions personalitzades per a clubs.",
      "es": "Gobik nació en 2010 en Yecla (Murcia) haciendo equipaciones a medida para un club ciclista local. Hoy fabrica ropa técnica de ciclismo para carretera, gravel y montaña, además de running y triatlón, y sigue haciendo equipaciones personalizadas para clubes.",
      "en": "Gobik was born in 2010 in Yecla, Murcia, making custom kit for a local cycling club. Today it makes technical cycling clothing for road, gravel and mountain biking, plus running and triathlon, and still makes custom kit for clubs.",
      "fr": "Gobik naît en 2010 à Yecla (Murcie) en confectionnant des tenues sur mesure pour un club cycliste local. Elle fabrique aujourd'hui des vêtements techniques de cyclisme pour la route, le gravel et le VTT, ainsi que pour la course et le triathlon, et fait toujours des tenues personnalisées pour les clubs."
    },
    "destacats": [
      {
        "nom": "Attitude 2.0",
        "descripcio": {
          "ca": "Mallot de màniga curta",
          "es": "Maillot de manga corta",
          "en": "Short-sleeve jersey",
          "fr": "Maillot manches courtes"
        }
      },
      {
        "nom": "Hyder",
        "descripcio": {
          "ca": "Mallot de màniga llarga",
          "es": "Maillot de manga larga",
          "en": "Long-sleeve jersey",
          "fr": "Maillot manches longues"
        }
      },
      {
        "nom": {"ca":"Equipacions a mida","es":"Equipaciones a medida","en":"Custom kits","fr":"Tenues sur mesure"},
        "descripcio": {
          "ca": "Roba personalitzada per a clubs i equips, l'origen de la marca",
          "es": "Ropa personalizada para clubes y equipos, el origen de la marca",
          "en": "Custom kit for clubs and teams, where the brand began",
          "fr": "Tenues personnalisées pour clubs et équipes, à l'origine de la marque"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/gobik-1.webp",
        "font": "https://gobik.com/en",
        "descripcio": "Ciclista de gravel amb roba Gobik, foto amb efecte de moviment (bàner de col·lecció)"
      },
      {
        "src": "/img/marques/fitxes/gobik-2.webp",
        "font": "https://gobik.com/en",
        "descripcio": "Model amb el mallot de màniga curta Gobik Attitude 2.0, fons blanc"
      }
    ]
  },
  {
    "slug": "pissei",
    "pais": "IT",
    "any": null,
    "web": "https://www.pissei.com",
    "lema": {
      "ca": "Roba de ciclisme italiana",
      "es": "Ropa de ciclismo italiana",
      "en": "Italian cycling clothing",
      "fr": "Vêtements de cyclisme italiens"
    },
    "descripcio": {
      "ca": "Pissei és una marca italiana de roba de ciclisme amb una línia important d'equipacions a mida per a clubs i equips. Fa mallots, culottes, jaquetes i accessoris per a carretera i triatló, i ha vestit l'UAE Team Emirates.",
      "es": "Pissei es una marca italiana de ropa de ciclismo con una línea importante de equipaciones a medida para clubes y equipos. Fabrica maillots, culotes, chaquetas y accesorios para carretera y triatlón, y ha vestido al UAE Team Emirates.",
      "en": "Pissei is an Italian cycling clothing brand with a strong custom kit line for clubs and teams. It makes jerseys, bib shorts, jackets and accessories for road cycling and triathlon, and has dressed UAE Team Emirates.",
      "fr": "Pissei est une marque italienne de vêtements de cyclisme, avec une importante ligne de tenues sur mesure pour clubs et équipes. Elle fabrique maillots, cuissards, vestes et accessoires pour la route et le triathlon, et a habillé l'équipe UAE Team Emirates."
    },
    "destacats": [
      {
        "nom": "Primapelle",
        "descripcio": {
          "ca": "Línia de mallots i culottes de carretera",
          "es": "Línea de maillots y culotes de carretera",
          "en": "Road jerseys and bib shorts line",
          "fr": "Ligne de maillots et cuissards route"
        }
      },
      {
        "nom": "Sanremo",
        "descripcio": {
          "ca": "Línia de jaquetes i malles d'hivern",
          "es": "Línea de chaquetas y mallas de invierno",
          "en": "Winter jackets and tights line",
          "fr": "Ligne de vestes et collants d'hiver"
        }
      },
      {
        "nom": "Magistrale",
        "descripcio": {
          "ca": "Línia d'equipacions a mida (Custom Lab)",
          "es": "Línea de equipaciones a medida (Custom Lab)",
          "en": "Custom kit line (Custom Lab)",
          "fr": "Ligne de tenues sur mesure (Custom Lab)"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/pissei-1.webp",
        "font": "https://www.pissei.com/en",
        "descripcio": "Ciclista amb roba d'hivern Pissei en una carretera de muntanya nevada (bàner de la portada)"
      },
      {
        "src": "/img/marques/fitxes/pissei-2.webp",
        "font": "https://www.pissei.com/en",
        "descripcio": "Mallot de màniga llarga Pissei Primapelle, color granat, fons clar"
      }
    ]
  },
  {
    "slug": "dmt",
    "pais": "IT",
    "any": 1978,
    "web": "https://dmtcycling.com",
    "lema": {
      "ca": "Sabates de ciclisme italianes, des de 1978",
      "es": "Zapatillas de ciclismo italianas, desde 1978",
      "en": "Italian cycling shoes since 1978",
      "fr": "Chaussures de cyclisme italiennes depuis 1978"
    },
    "descripcio": {
      "ca": "Federico Zecchetto va fundar el 1978 una petita empresa de calçat, Diamant, i el 1986 va crear la marca DMT per fer sabates de ciclisme professional. Fa sabates de carretera, gravel, muntanya i triatló, moltes amb empenya de teixit 3D, i des del 2020 les porta Tadej Pogačar.",
      "es": "Federico Zecchetto fundó en 1978 una pequeña empresa de calzado, Diamant, y en 1986 creó la marca DMT para fabricar zapatillas de ciclismo profesional. Hace zapatillas de carretera, gravel, montaña y triatlón, muchas con empeine de tejido 3D, y desde 2020 las lleva Tadej Pogačar.",
      "en": "Federico Zecchetto founded a small shoe company, Diamant, in 1978 and created the DMT brand in 1986 to make professional cycling shoes. It makes road, gravel, mountain and triathlon shoes, many with 3D knit uppers, and Tadej Pogačar has worn them since 2020.",
      "fr": "Federico Zecchetto fonde en 1978 une petite entreprise de chaussures, Diamant, puis crée en 1986 la marque DMT pour fabriquer des chaussures de cyclisme professionnel. Elle fait des chaussures route, gravel, VTT et triathlon, souvent à tige en tricot 3D, que Tadej Pogačar porte depuis 2020."
    },
    "destacats": [
      {
        "nom": "KR0 SL",
        "descripcio": {
          "ca": "Sabata de carretera de gamma alta",
          "es": "Zapatilla de carretera de gama alta",
          "en": "High-end road shoe",
          "fr": "Chaussure route haut de gamme"
        }
      },
      {
        "nom": "Pogi's",
        "descripcio": {
          "ca": "Línia de sabates creada amb Tadej Pogačar",
          "es": "Línea de zapatillas creada con Tadej Pogačar",
          "en": "Shoe line created with Tadej Pogačar",
          "fr": "Ligne de chaussures créée avec Tadej Pogačar"
        }
      },
      {
        "nom": "KM4",
        "descripcio": {
          "ca": "Sabata per a muntanya i gravel",
          "es": "Zapatilla para montaña y gravel",
          "en": "Mountain bike and gravel shoe",
          "fr": "Chaussure VTT et gravel"
        }
      }
    ],
    "imatges": [
      {
        "src": "/img/marques/fitxes/dmt-1.webp",
        "font": "https://dmtcycling.com/",
        "descripcio": "Sabates de carretera DMT suspeses a l'aire (bàner de la portada)"
      },
      {
        "src": "/img/marques/fitxes/dmt-2.webp",
        "font": "https://dmtcycling.com/",
        "descripcio": "Sabata de carretera DMT KR0 SL blanca i plata, fons clar"
      }
    ]
  }
];

export function fitxaMarca(slug: string): FitxaMarca | undefined {
  return FITXES_MARQUES.find((f) => f.slug === slug);
}
