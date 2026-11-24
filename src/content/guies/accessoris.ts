// Guia dels accessoris: bidons, llums, manteniment (lubricants, netejadors, líquid antipunxades) i
// portabicis. Les normes (llums, portabicis) són les de la DGT i el Reglament General de Vehicles;
// el manteniment, el de Park Tool i Muc-Off; la suor en bici, de la GSSI. Recerca del novembre del 2026.

import type { GuiaEquipament } from './tipus';

export const accessoris: GuiaEquipament = {
  categoria: 'accessoris',
  lema: {
    ca: "Les petites coses que fan que cada sortida acabi bé i sense ensurts",
    es: "Las pequeñas cosas que hacen que cada salida acabe bien y sin sustos",
    en: "The small things that get every ride home without a hitch",
    fr: "Ces petits accessoires qui font que chaque sortie se termine sans encombre",
  },
  intro: {
    ca: "A la Costa Brava es pedala tot l'any, però a l'estiu la calor apreta: un bidó s'acaba de pressa i la pols dels camins s'enganxa a la cadena si no la cuides. Una punxada lluny del cotxe o una tarda que s'allarga fins al vespre poden convertir una bona sortida en un mal tràngol.\n\nEls accessoris són això: bidons per beure prou, llums per veure-hi i que et vegin, lubricant i netejador per a la transmissió, líquid antipunxades per a les rodes tubeless i un portabicis per arribar a l'inici de la ruta. Ben triats, no hi penses fins que et fan falta.",
    es: "En la Costa Brava se pedalea todo el año, pero en verano el calor aprieta: un bidón se acaba rápido y el polvo de los caminos se pega a la cadena si no la cuidas. Un pinchazo lejos del coche o una tarde que se alarga hasta el anochecer pueden convertir una buena salida en un mal trago.\n\nLos accesorios son eso: bidones para beber lo suficiente, luces para ver y que te vean, lubricante y limpiador para la transmisión, líquido antipinchazos para las ruedas tubeless y un portabicis para llegar al inicio de la ruta. Bien elegidos, no piensas en ellos hasta que te hacen falta.",
    en: "On the Costa Brava you can ride all year, but summer heat is no joke: a bottle runs dry fast, and trail dust sticks to your chain if you don't look after it. A puncture far from the car, or an afternoon that stretches into dusk, can turn a good ride into a bad one.\n\nThat's what accessories are for: bottles so you drink enough, lights to see and be seen, lube and cleaner for the drivetrain, sealant for tubeless wheels and a bike rack to get you to the start of the route. Choose them well and you won't think about them until you need them.",
    fr: "Sur la Costa Brava, on roule toute l'année, mais l'été la chaleur se fait sentir : un bidon se vide vite et la poussière des chemins colle à la chaîne si vous ne l'entretenez pas. Une crevaison loin de la voiture ou une après-midi qui se prolonge jusqu'au soir peuvent gâcher une belle sortie.\n\nC'est à cela que servent les accessoires : des bidons pour boire assez, un éclairage pour voir et être vu, du lubrifiant et du nettoyant pour la transmission, du liquide préventif pour les roues tubeless et un porte-vélos pour rejoindre le départ du parcours. Bien choisis, vous n'y pensez plus jusqu'au jour où ils servent.",
  },
  tipus: [
    {
      nom: { ca: "Bidons", es: "Bidones", en: "Bottles", fr: "Bidons" },
      text: {
        ca: "Els més habituals són de 500 i 750 ml i van al portabidons del quadre. En carretera se sol suar de mig litre a dos litres per hora, i més amb calor: a l'estiu, un sol bidó pot no arribar ni a l'hora, així que pensa on el tornaràs a omplir.",
        es: "Los más habituales son de 500 y 750 ml y van en el portabidones del cuadro. En carretera se suele sudar de medio litro a dos litros por hora, y más con calor: en verano, un solo bidón puede no llegar ni a la hora, así que piensa dónde lo volverás a llenar.",
        en: "The usual sizes are 500 and 750 ml, carried in a cage on the frame. Road riders typically sweat half a litre to two litres an hour, more in the heat: in summer a single bottle may not last an hour, so plan where you'll refill.",
        fr: "Les formats les plus courants sont 500 et 750 ml, dans un porte-bidon sur le cadre. Sur route, on transpire en général d'un demi-litre à deux litres par heure, davantage quand il fait chaud : l'été, un seul bidon peut ne pas tenir une heure, alors prévoyez où le remplir.",
      },
    },
    {
      nom: { ca: "Llums", es: "Luces", en: "Lights", fr: "Éclairage" },
      text: {
        ca: "Un llum blanc davant i un de vermell darrere. Els de davant potents serveixen per veure-hi en carreteres i camins sense llum; els petits i amb intermitència, sobretot perquè et vegin, també de dia.",
        es: "Una luz blanca delante y una roja detrás. Las delanteras potentes sirven para ver en carreteras y caminos sin luz; las pequeñas y con intermitencia, sobre todo para que te vean, también de día.",
        en: "A white light at the front and a red one at the back. Powerful front lights let you see on unlit roads and trails; small flashing ones are mainly there so others see you, by day as well.",
        fr: "Une lumière blanche à l'avant et une rouge à l'arrière. Les phares puissants servent à voir sur les routes et chemins non éclairés ; les petites lumières clignotantes servent surtout à être vu, de jour aussi.",
      },
    },
    {
      nom: { ca: "Manteniment i antipunxades", es: "Mantenimiento y antipinchazos", en: "Maintenance and sealant", fr: "Entretien et préventif anti-crevaison" },
      text: {
        ca: "Lubricant de cadena (sec o humit, segons el temps), desgreixant i netejador per a la bici, i líquid antipunxades per a les rodes tubeless, que tapa sol els forats petits mentre rodes.",
        es: "Lubricante de cadena (seco o húmedo, según el tiempo), desengrasante y limpiador para la bici, y líquido antipinchazos para las ruedas tubeless, que tapa solo los agujeros pequeños mientras ruedas.",
        en: "Chain lube (dry or wet, depending on the weather), degreaser and bike cleaner, plus sealant for tubeless wheels, which plugs small holes on its own while you ride.",
        fr: "Lubrifiant de chaîne (sec ou humide, selon la météo), dégraissant et nettoyant vélo, et liquide préventif pour roues tubeless, qui bouche tout seul les petits trous pendant que vous roulez.",
      },
    },
    {
      nom: { ca: "Portabicis", es: "Portabicis", en: "Bike racks", fr: "Porte-vélos" },
      text: {
        ca: "De ganxo (a la bola de remolc), de sostre o de porta del darrere. El de ganxo carrega a poca alçada i és el que Thule aconsella per a bicis pesades com les elèctriques; el de sostre deixa el maleter lliure.",
        es: "De enganche (en la bola de remolque), de techo o de portón trasero. El de enganche carga a poca altura y es el que Thule recomienda para bicis pesadas como las eléctricas; el de techo deja el maletero libre.",
        en: "Towbar, roof or rear-door mounted. A towbar rack loads at a low height and is what Thule recommends for heavy bikes such as e-bikes; a roof rack keeps the boot free.",
        fr: "Sur attelage, sur le toit ou sur le hayon. Le porte-vélos d'attelage se charge à faible hauteur et c'est celui que Thule conseille pour les vélos lourds comme les VAE ; celui de toit laisse le coffre libre.",
      },
    },
  ],
  consells: [
    {
      titol: { ca: "Lubricant segons el temps", es: "Lubricante según el tiempo", en: "Match the lube to the weather", fr: "Le lubrifiant selon la météo" },
      text: {
        ca: "El sec atrapa menys pols i va bé quan no plou; l'humit aguanta la pluja i el fang, però amb sequera s'embruta més. Posa'l a la cadena neta i seca, una gota a cada baula, i eixuga'n l'excés amb un drap.",
        es: "El seco atrapa menos polvo y va bien cuando no llueve; el húmedo aguanta la lluvia y el barro, pero con tiempo seco se ensucia más. Ponlo en la cadena limpia y seca, una gota en cada eslabón, y quita el exceso con un trapo.",
        en: "Dry lube picks up less dust and suits dry weather; wet lube survives rain and mud but gets grimier when it's dry. Apply it to a clean, dry chain, one drop per link, and wipe off the excess with a rag.",
        fr: "Le lubrifiant sec retient moins la poussière et convient par temps sec ; l'humide résiste à la pluie et à la boue, mais s'encrasse davantage par temps sec. Appliquez-le sur une chaîne propre et sèche, une goutte par maillon, puis essuyez l'excédent avec un chiffon.",
      },
    },
    {
      titol: { ca: "Renta-la amb poca pressió", es: "Lávala con poca presión", en: "Wash it gently", fr: "Lavez-le en douceur" },
      text: {
        ca: "Si fas servir mànega, que sigui amb poca pressió i el raig obert, i no apuntis als rodaments amb aire comprimit. En acabar de rentar-la, torna a greixar la cadena.",
        es: "Si usas manguera, que sea con poca presión y el chorro abierto, y no apuntes a los rodamientos con aire comprimido. Al acabar de lavarla, vuelve a engrasar la cadena.",
        en: "If you use a hose, keep the pressure low with a wide spray, and don't blast the bearings with compressed air. Once it's clean, lube the chain again.",
        fr: "Si vous utilisez un tuyau, gardez une faible pression et un jet large, et ne dirigez pas l'air comprimé sur les roulements. Après le lavage, relubrifiez la chaîne.",
      },
    },
    {
      titol: { ca: "Revisa el líquid antipunxades", es: "Revisa el líquido antipinchazos", en: "Check your sealant", fr: "Vérifiez le liquide préventif" },
      text: {
        ca: "S'asseca amb el temps, i més de pressa com més calor fa. Muc-Off aconsella revisar-lo i reposar-lo cada sis mesos, i altres fabricants parlen d'una durada mitjana de 2 a 6 mesos segons la temperatura i la humitat: a l'estiu, mira'l més sovint.",
        es: "Se seca con el tiempo, y más rápido cuanto más calor hace. Muc-Off recomienda revisarlo y reponerlo cada seis meses, y otros fabricantes hablan de una duración media de 2 a 6 meses según la temperatura y la humedad: en verano, míralo más a menudo.",
        en: "Sealant dries out over time, faster the hotter it gets. Muc-Off recommends checking and topping it up every six months, and other makers quote an average life of 2 to 6 months depending on temperature and humidity: in summer, check it more often.",
        fr: "Il sèche avec le temps, d'autant plus vite qu'il fait chaud. Muc-Off conseille de le vérifier et de le compléter tous les six mois, et d'autres fabricants parlent d'une durée moyenne de 2 à 6 mois selon la température et l'humidité : l'été, contrôlez-le plus souvent.",
      },
    },
    {
      titol: { ca: "Llums: el que diu la llei", es: "Luces: lo que dice la ley", en: "Lights: what the law says", fr: "Éclairage : ce que dit la loi" },
      text: {
        ca: "De nit, als túnels o amb poca visibilitat, és obligatori dur llum blanc davant, llum vermell darrere i un catadiòptric vermell al darrere; fora de poblat, també una peça reflectant. Apunta el llum de davant cap a terra, uns metres endavant, perquè no enlluerni.",
        es: "De noche, en túneles o con poca visibilidad, es obligatorio llevar luz blanca delante, luz roja detrás y un catadióptrico rojo detrás; en vías interurbanas, también una prenda reflectante. Apunta la luz delantera al suelo, unos metros por delante, para no deslumbrar.",
        en: "In Spain, at night, in tunnels or in poor visibility, you must have a white front light, a red rear light and a red rear reflector; outside towns, a reflective garment too. Aim your front light at the road a few metres ahead so it doesn't dazzle.",
        fr: "En Espagne, de nuit, dans les tunnels ou par mauvaise visibilité, il faut un feu blanc à l'avant, un feu rouge à l'arrière et un catadioptre rouge arrière ; hors agglomération, un vêtement réfléchissant en plus. Orientez le phare vers la route, quelques mètres devant, pour ne pas éblouir.",
      },
    },
  ],
  aTecnibike: {
    ca: "A la botiga tenim bidons, llums, líquid antipunxades i productes de manteniment i portabicis de Muc-Off, X-Sauce i Thule, i t'aconsellem en la compra. El taller és a la mateixa botiga. De moment no venem en línia: vine a la botiga o truca'ns.",
    es: "En la tienda tenemos bidones, luces, líquido antipinchazos y productos de mantenimiento y portabicis de Muc-Off, X-Sauce y Thule, y te asesoramos en la compra. El taller está en la misma tienda. De momento no vendemos en línea: ven a la tienda o llámanos.",
    en: "In the shop we have bottles, lights, tubeless sealant, and maintenance products and bike racks from Muc-Off, X-Sauce and Thule, and we'll help you choose. The workshop is in the same shop. We don't sell online yet: come to the shop or give us a call.",
    fr: "En boutique, nous avons des bidons, de l'éclairage, du liquide préventif, ainsi que des produits d'entretien et des porte-vélos Muc-Off, X-Sauce et Thule, et nous vous conseillons dans votre achat. L'atelier se trouve dans la même boutique. Pour l'instant, nous ne vendons pas en ligne : passez à la boutique ou appelez-nous.",
  },
  preguntes: [
    {
      pregunta: {
        ca: "Cada quant he de reposar el líquid antipunxades?",
        es: "¿Cada cuánto hay que reponer el líquido antipinchazos?",
        en: "How often should I top up tubeless sealant?",
        fr: "Tous les combien faut-il refaire le liquide préventif ?",
      },
      resposta: {
        ca: "Depèn del líquid, de la coberta i de la calor. Muc-Off aconsella revisar-lo cada sis mesos i altres fabricants parlen d'una durada mitjana de 2 a 6 mesos. Amb l'estiu de la costa s'asseca abans: si sacseges la roda i no el sents, toca posar-ne.",
        es: "Depende del líquido, de la cubierta y del calor. Muc-Off recomienda revisarlo cada seis meses y otros fabricantes hablan de una duración media de 2 a 6 meses. Con el verano de la costa se seca antes: si agitas la rueda y no lo oyes, toca poner más.",
        en: "It depends on the sealant, the tyre and the heat. Muc-Off recommends checking it every six months, and other makers quote an average life of 2 to 6 months. A coastal summer dries it out sooner: if you shake the wheel and can't hear it sloshing, it's time to add more.",
        fr: "Cela dépend du liquide, du pneu et de la chaleur. Muc-Off conseille de le vérifier tous les six mois et d'autres fabricants parlent d'une durée moyenne de 2 à 6 mois. Avec l'été sur la côte, il sèche plus vite : si vous secouez la roue sans l'entendre, il est temps d'en remettre.",
      },
    },
    {
      pregunta: {
        ca: "Quin lubricant de cadena va millor a l'estiu?",
        es: "¿Qué lubricante de cadena va mejor en verano?",
        en: "Which chain lube is best for summer?",
        fr: "Quel lubrifiant de chaîne choisir en été ?",
      },
      resposta: {
        ca: "Amb temps sec, un lubricant sec, que atrapa menys pols. Si plou o passes per fang, un d'humit, que l'aigua no s'endú tan fàcilment. Sigui quin sigui, posa'l a la cadena neta i eixuga'n el que sobri.",
        es: "Con tiempo seco, un lubricante seco, que atrapa menos polvo. Si llueve o pasas por barro, uno húmedo, que el agua no se lleva tan fácilmente. Sea cual sea, ponlo en la cadena limpia y quita lo que sobre.",
        en: "In dry weather, a dry lube, which picks up less dust. If it rains or you ride through mud, a wet lube, which doesn't wash off as easily. Whichever you use, apply it to a clean chain and wipe off the excess.",
        fr: "Par temps sec, un lubrifiant sec, qui retient moins la poussière. S'il pleut ou si vous passez dans la boue, un lubrifiant humide, que l'eau emporte moins facilement. Dans tous les cas, appliquez-le sur une chaîne propre et essuyez l'excédent.",
      },
    },
    {
      pregunta: {
        ca: "És obligatori portar llums a la bici?",
        es: "¿Es obligatorio llevar luces en la bici?",
        en: "Do I have to use lights on my bike in Spain?",
        fr: "L'éclairage est-il obligatoire à vélo en Espagne ?",
      },
      resposta: {
        ca: "Sí, de nit, als túnels i passos inferiors, i quan el temps redueix molt la visibilitat: llum blanc davant, vermell darrere i un catadiòptric vermell darrere. Fora de poblat, en aquestes situacions també cal una peça reflectant. De dia no és obligatori, però un llum de darrere amb intermitència ajuda que et vegin.",
        es: "Sí, de noche, en túneles y pasos inferiores, y cuando el tiempo reduce mucho la visibilidad: luz blanca delante, roja detrás y un catadióptrico rojo detrás. En vías interurbanas, en esas situaciones también hace falta una prenda reflectante. De día no es obligatorio, pero una luz trasera con intermitencia ayuda a que te vean.",
        en: "Yes: at night, in tunnels and underpasses, and whenever the weather seriously cuts visibility, you need a white front light, a red rear light and a red rear reflector. Outside towns, a reflective garment is also required in those conditions. It isn't compulsory by day, but a flashing rear light helps others see you.",
        fr: "Oui : de nuit, dans les tunnels et passages inférieurs, et quand la météo réduit fortement la visibilité, il faut un feu blanc à l'avant, un feu rouge et un catadioptre rouge à l'arrière. Hors agglomération, un vêtement réfléchissant est aussi exigé dans ces situations. De jour, ce n'est pas obligatoire, mais un feu arrière clignotant aide à être vu.",
      },
    },
    {
      pregunta: {
        ca: "Què cal per dur les bicis en un portabicis de ganxo?",
        es: "¿Qué hace falta para llevar las bicis en un portabicis de enganche?",
        en: "What do I need to carry bikes on a towbar rack in Spain?",
        fr: "Que faut-il pour transporter des vélos sur un porte-vélos d'attelage en Espagne ?",
      },
      resposta: {
        ca: "La matrícula i els llums del cotxe s'han de veure; si les bicis els tapen, cal una placa suplementària amb matrícula i llums. El que sobresurt pel darrere es senyalitza amb la placa V-20, fins i tot amb el portabicis buit, i pot sobresortir com a màxim un 15 % de la llargada del cotxe. El pes de les bicis i el portabicis no pot passar el límit del ganxo.",
        es: "La matrícula y las luces del coche tienen que verse; si las bicis las tapan, hace falta una placa supletoria con matrícula y luces. Lo que sobresale por detrás se señaliza con la placa V-20, incluso con el portabicis vacío, y puede sobresalir como máximo un 15 % de la longitud del coche. El peso de las bicis y el portabicis no puede superar el límite del enganche.",
        en: "The car's number plate and lights must stay visible; if the bikes hide them, you need an extra plate with lights. Anything sticking out at the back must carry a V-20 warning panel, even an empty rack, and it can overhang by no more than 15% of the car's length. The bikes plus the rack must not exceed the towbar's load limit.",
        fr: "La plaque d'immatriculation et les feux de la voiture doivent rester visibles ; si les vélos les masquent, il faut une plaque supplémentaire avec éclairage. Ce qui dépasse à l'arrière se signale avec le panneau V-20, même quand le porte-vélos est vide, et ne peut dépasser de plus de 15 % de la longueur du véhicule. Le poids des vélos et du porte-vélos ne doit pas dépasser la charge autorisée de l'attelage.",
      },
    },
  ],
  fonts: [
    {
      nom: "DGT: 20 normes que tot ciclista ha de conèixer (llums i peça reflectant)",
      url: "https://www.dgt.es/comunicacion/noticias/20-normas-que-todo-ciclista-debe-conocer/",
    },
    {
      nom: "BOE: Reglament General de Vehicles (RD 2822/1998), art. 22 i annex",
      url: "https://www.boe.es/buscar/act.php?id=BOE-A-1999-1826",
    },
    {
      nom: "Revista DGT: com transportar la bici al cotxe (portabicis, V-20, matrícula i càrrega)",
      url: "https://revista.dgt.es/es/sabia-que/normas/2017/0707-Como-llevar-la-bici-correctamente-en-el-coche.shtml",
    },
    {
      nom: "Revista DGT: Els dubtes dels lectors (portabicis buit i V-20)",
      url: "https://revista.dgt.es/es/reportajes/2022/03MARZO/0323-Dudas-lectores-3.shtml",
    },
    {
      nom: "Thule: How to choose the best bike rack for your car",
      url: "https://www.thule.com/en-gb/articles/guides/how-to-pick-the-best-bike-rack-for-you",
    },
    {
      nom: "Park Tool: How to Clean and Lubricate a Chain",
      url: "https://www.parktool.com/en-us/blog/repair-help/chain-cleaning-with-a-park-tool-chain-scrubber",
    },
    {
      nom: "Park Tool: How to Wash a Bicycle",
      url: "https://www.parktool.com/en-us/blog/repair-help/bike-washing-and-cleaning",
    },
    {
      nom: "Muc-Off: Our Complete Guide to Chain Lube",
      url: "https://muc-off.com/blogs/how-to-hub/muc-off-s-guide-to-chain-lube",
    },
    {
      nom: "Muc-Off: How and when to add Tubeless Sealant",
      url: "https://muc-off.com/blogs/how-to-hub/how-to-use-muc-off-no-puncture-hassle-tubeless-sealant",
    },
    {
      nom: "Lennard Zinn: Tubeless sealant refresh and replacement (durada del líquid de Stan's NoTubes)",
      url: "https://lennardzinn.substack.com/p/tubeless-sealant-refresh-and-replacement",
    },
    {
      nom: "BikeRadar: How many lumens do you need for a front light?",
      url: "https://www.bikeradar.com/advice/buyers-guides/how-many-lumens-do-you-need-for-a-front-light",
    },
    {
      nom: "Hydration and Nutrition Considerations for Endurance Cycling Exercise in the Heat. Gatorade Sports Science Institute, SSE #262 (taxa de suor en bici de carretera)",
      url: "https://www.gssiweb.org/en/sports-science-exchange/article/hydration-and-nutrition-considerations-forendurance-cycling-exercise-in-the-heat",
    },
  ],
};
