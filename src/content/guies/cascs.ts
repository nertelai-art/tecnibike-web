// Guia de la categoria de cascs. Recerca del novembre del 2026: norma EN 1078, Reial decret
// 518/2026 (casc obligatori a les vies interurbanes des de l'1-10-2026), guia d'ajust de la NHTSA,
// valoracions STAR de Virginia Tech, Mips i recomanacions de canvi recollides per Cycling Weekly.

import type { GuiaEquipament } from './tipus';

export const cascs: GuiaEquipament = {
  categoria: 'cascs',
  lema: {
    ca: "Un casc que t'encaixi bé, que respiri a l'estiu i que sigui homologat",
    es: 'Un casco que te encaje bien, que respire en verano y que esté homologado',
    en: 'A helmet that fits properly, breathes in summer and meets the standard',
    fr: "Un casque bien ajusté, qui respire en été et qui est homologué",
  },
  intro: {
    ca: "A la Costa Brava es pedala gairebé tot l'any, i a l'estiu el sol apreta de valent. A les pujades de les Gavarres vas a poc a poc i el cap s'escalfa; a les baixades i per les carreteres de costa, entre cotxes, el casc és el que et protegeix si caus.\n\nDes de l'1 d'octubre del 2026 el casc és obligatori per a tots els ciclistes a les vies interurbanes, sense les excepcions que hi havia abans. Però més enllà de la norma, el que compta és que el portis ben ajustat: un casc que balla protegeix menys.\n\nAquí tens els tipus que hi ha, què mirar per triar-ne un i quan toca canviar-lo.",
    es: 'En la Costa Brava se pedalea casi todo el año, y en verano el sol aprieta de verdad. En las subidas de las Gavarres vas despacio y la cabeza se calienta; en las bajadas y por las carreteras de costa, entre coches, el casco es lo que te protege si te caes.\n\nDesde el 1 de octubre de 2026 el casco es obligatorio para todos los ciclistas en vías interurbanas, sin las excepciones que había antes. Pero, más allá de la norma, lo que cuenta es llevarlo bien ajustado: un casco que baila protege menos.\n\nAquí tienes los tipos que hay, qué mirar para elegir uno y cuándo toca cambiarlo.',
    en: "On the Costa Brava you can ride almost all year, and in summer the sun is fierce. On the climbs of the Gavarres you go slowly and your head heats up; on the descents and on the coast roads, in traffic, your helmet is what protects you if you fall.\n\nSince 1 October 2026 a helmet has been compulsory for every cyclist on roads outside towns in Spain, with none of the old exemptions. But beyond the law, what matters is wearing it properly adjusted: a helmet that wobbles protects you less.\n\nHere are the main types, what to look for when choosing one, and when it's time to replace it.",
    fr: "Sur la Costa Brava, on roule presque toute l'année, et en été le soleil tape fort. Dans les montées des Gavarres, vous avancez lentement et la tête chauffe ; dans les descentes et sur les routes côtières, au milieu des voitures, c'est le casque qui vous protège en cas de chute.\n\nDepuis le 1er octobre 2026, le casque est obligatoire en Espagne pour tous les cyclistes hors agglomération, sans les exceptions d'avant. Mais au-delà de la loi, l'essentiel est de le porter bien réglé : un casque qui bouge protège moins.\n\nVoici les principaux types, ce qu'il faut regarder pour en choisir un et quand le remplacer.",
  },
  tipus: [
    {
      nom: {
        ca: 'De carretera',
        es: 'De carretera',
        en: 'Road',
        fr: 'Route',
      },
      text: {
        ca: "Lleuger i ple de ventilacions, perquè l'aire passi per sobre del cap. És el més còmode per a les pujades i els dies de calor.",
        es: 'Ligero y lleno de ventilaciones, para que el aire pase por encima de la cabeza. Es el más cómodo para las subidas y los días de calor.',
        en: 'Light and full of vents, so air flows over your head. The most comfortable choice for climbs and hot days.',
        fr: "Léger et très ventilé, pour que l'air circule sur la tête. C'est le plus confortable dans les montées et par forte chaleur.",
      },
    },
    {
      nom: {
        ca: 'Aero',
        es: 'Aero',
        en: 'Aero',
        fr: 'Aéro',
      },
      text: {
        ca: "Té menys forats i una closca més tancada per tallar l'aire. Fa guanyar uns quants watts quan vas ràpid, però és una mica més calorós, i es nota a les pujades lentes.",
        es: 'Tiene menos agujeros y una carcasa más cerrada para cortar el aire. Ahorra unos cuantos vatios cuando vas rápido, pero es algo más caluroso, y se nota en las subidas lentas.',
        en: "Fewer vents and a more closed shell to cut through the air. It saves a few watts when you're going fast, but it runs a little warmer, which you'll notice on slow climbs.",
        fr: "Moins d'aérations et une coque plus fermée pour mieux fendre l'air. Il fait gagner quelques watts à haute vitesse, mais il est un peu plus chaud, ce qui se sent dans les montées lentes.",
      },
    },
    {
      nom: {
        ca: 'De muntanya i trail',
        es: 'De montaña y trail',
        en: 'Mountain bike and trail',
        fr: 'VTT et trail',
      },
      text: {
        ca: "Cobreix més el clatell i les temples i porta visera per al sol i les branques. És el que toca per als camins de les Gavarres i per al gravel.",
        es: 'Cubre más la nuca y las sienes y lleva visera para el sol y las ramas. Es el indicado para los caminos de las Gavarres y para el gravel.',
        en: 'More coverage at the back of the head and the temples, plus a visor against sun and branches. The one for the Gavarres trails and for gravel.',
        fr: "Il couvre davantage la nuque et les tempes et porte une visière contre le soleil et les branches. C'est celui qu'il faut pour les sentiers des Gavarres et pour le gravel.",
      },
    },
    {
      nom: {
        ca: 'Integral',
        es: 'Integral',
        en: 'Full-face',
        fr: 'Intégral',
      },
      text: {
        ca: "Amb mentonera, per a enduro i descens, on un cop a la cara és ben possible. Alguns models tenen la mentonera desmuntable per pujar més fresc.",
        es: 'Con mentonera, para enduro y descenso, donde un golpe en la cara es bastante probable. Algunos modelos tienen la mentonera desmontable para subir más fresco.',
        en: 'With a chin bar, for enduro and downhill, where a face impact is a real risk. Some models have a removable chin bar so you can climb cooler.',
        fr: "Avec mentonnière, pour l'enduro et la descente, où un choc au visage est bien possible. Certains modèles ont une mentonnière amovible pour monter plus au frais.",
      },
    },
  ],
  consells: [
    {
      titol: {
        ca: 'La talla, amb cinta mètrica',
        es: 'La talla, con cinta métrica',
        en: 'Size it with a tape measure',
        fr: 'La taille, au mètre ruban',
      },
      text: {
        ca: "Mesura el contorn del cap per sobre de les celles i de les orelles, i tria la talla que inclogui aquesta mida. No n'agafis una de més gran per si de cas: el casc t'ha d'anar bé ara.",
        es: 'Mide el contorno de la cabeza por encima de las cejas y de las orejas, y elige la talla que incluya esa medida. No cojas una más grande por si acaso: el casco te tiene que ir bien ahora.',
        en: "Measure around your head just above your eyebrows and ears, and pick the size range that includes that number. Don't size up just in case: the helmet has to fit you now.",
        fr: "Mesurez le tour de tête juste au-dessus des sourcils et des oreilles, et choisissez la taille qui inclut cette mesure. N'en prenez pas une plus grande au cas où : le casque doit vous aller maintenant.",
      },
    },
    {
      titol: {
        ca: 'La regla dels dos dits',
        es: 'La regla de los dos dedos',
        en: 'The two-finger rule',
        fr: 'La règle des deux doigts',
      },
      text: {
        ca: "La vora de davant ha de quedar dos dits per sobre de les celles, i el casc, recte. Les cintes fan una V just sota les orelles, i entre la cinta i la barbeta hi han de cabre dos dits. Cordat, si mous el cap no ha de ballar.",
        es: 'El borde delantero tiene que quedar dos dedos por encima de las cejas, y el casco, recto. Las cintas forman una V justo debajo de las orejas, y entre la cinta y la barbilla tienen que caber dos dedos. Abrochado, si mueves la cabeza no debe bailar.',
        en: "The front edge should sit two fingers above your eyebrows, with the helmet level. The straps form a V just below your ears, and you should fit two fingers between the chin strap and your chin. Once buckled, it shouldn't shift when you move your head.",
        fr: "Le bord avant doit se trouver à deux doigts au-dessus des sourcils, casque bien droit. Les sangles forment un V juste sous les oreilles, et deux doigts doivent passer entre la jugulaire et le menton. Une fois attaché, il ne doit pas bouger quand vous tournez la tête.",
      },
    },
    {
      titol: {
        ca: 'Norma i etiqueta',
        es: 'Norma y etiqueta',
        en: 'Standard and label',
        fr: 'Norme et étiquette',
      },
      text: {
        ca: "Mira que porti el marcatge CE i la norma EN 1078, i la data de fabricació a l'etiqueta de dins. Si vols comparar més, el laboratori de cascs de Virginia Tech els puntua amb estrelles segons com redueixen els cops lineals i de rotació, i recomana triar-ne un de 4 o 5.",
        es: 'Comprueba que lleve el marcado CE y la norma EN 1078, y la fecha de fabricación en la etiqueta interior. Si quieres comparar más, el laboratorio de cascos de Virginia Tech los puntúa con estrellas según cómo reducen los golpes lineales y de rotación, y recomienda elegir uno de 4 o 5.',
        en: "Check for the CE mark and the EN 1078 standard, plus the manufacturing date on the label inside. To compare further, the Virginia Tech Helmet Lab gives helmets star ratings based on how well they reduce linear and rotational impacts, and recommends choosing one with 4 or 5 stars.",
        fr: "Vérifiez le marquage CE et la norme EN 1078, ainsi que la date de fabrication sur l'étiquette intérieure. Pour aller plus loin, le laboratoire de casques de Virginia Tech les note en étoiles selon leur capacité à réduire les chocs linéaires et rotationnels, et conseille d'en choisir un de 4 ou 5 étoiles.",
      },
    },
    {
      titol: {
        ca: 'Quan canviar-lo',
        es: 'Cuándo cambiarlo',
        en: 'When to replace it',
        fr: 'Quand le remplacer',
      },
      text: {
        ca: "Després de qualsevol caiguda en què piquis amb el cap, encara que no s'hi vegi res: l'escuma està feta per absorbir un sol cop. Sense caigudes, la majoria de fabricants recomanen canviar-lo cada 3 a 5 anys, i abans si ha passat molt de sol o de calor, com dins d'un cotxe a l'estiu.",
        es: 'Después de cualquier caída en la que golpees con la cabeza, aunque no se vea nada: la espuma está hecha para absorber un solo golpe. Sin caídas, la mayoría de fabricantes recomiendan cambiarlo cada 3 a 5 años, y antes si ha pasado mucho sol o calor, como dentro de un coche en verano.',
        en: "After any crash where your head hits the ground, even if you can't see any damage: the foam is designed to absorb a single impact. Without crashes, most manufacturers recommend replacing it every 3 to 5 years, and sooner if it has had a lot of sun or heat, such as inside a car in summer.",
        fr: "Après toute chute où la tête a touché, même si rien ne se voit : la mousse est conçue pour absorber un seul choc. Sans chute, la plupart des fabricants conseillent de le changer tous les 3 à 5 ans, et plus tôt s'il a subi beaucoup de soleil ou de chaleur, par exemple dans une voiture en été.",
      },
    },
  ],
  aTecnibike: {
    ca: "Vine a la botiga a provar-te'l: te'l posem i l'ajustem al moment, i t'assessorem perquè triïs el que et va bé per a on i com pedales. Treballem cascs de POC, Kask i Eassun. De moment no venem en línia: passa per Sant Antoni de Calonge o truca'ns.",
    es: 'Ven a la tienda a probártelo: te lo ponemos y te lo ajustamos al momento, y te asesoramos para que elijas el que te va bien según dónde y cómo pedaleas. Trabajamos cascos de POC, Kask y Eassun. De momento no vendemos en línea: pásate por Sant Antoni de Calonge o llámanos.',
    en: "Come to the shop and try it on: we'll fit and adjust your helmet there and then, and help you choose the right one for where and how you ride. We stock helmets from POC, Kask and Eassun. We don't sell online yet, so drop by in Sant Antoni de Calonge or give us a call.",
    fr: "Venez l'essayer en boutique : nous vous le mettons et le réglons sur place, et nous vous conseillons pour choisir celui qui convient à votre façon de rouler et à vos parcours. Nous travaillons les casques POC, Kask et Eassun. Pour l'instant, pas de vente en ligne : passez nous voir à Sant Antoni de Calonge ou appelez-nous.",
  },
  preguntes: [
    {
      pregunta: {
        ca: 'És obligatori portar casc en bici?',
        es: '¿Es obligatorio llevar casco en bici?',
        en: 'Is it compulsory to wear a helmet on a bike in Spain?',
        fr: 'Le casque est-il obligatoire à vélo en Espagne ?',
      },
      resposta: {
        ca: "A carretera, sí. Des de l'1 d'octubre del 2026 (Reial decret 518/2026), tots els ciclistes l'han de portar ben cordat a les vies interurbanes, i ja no hi ha les excepcions d'abans. Els menors de 16 anys l'han de portar a tot arreu, també a ciutat, igual que qui treballa en bici. Ha de ser un casc homologat o certificat.",
        es: 'En carretera, sí. Desde el 1 de octubre de 2026 (Real Decreto 518/2026), todos los ciclistas deben llevarlo bien abrochado en vías interurbanas, y ya no existen las excepciones de antes. Los menores de 16 años deben llevarlo en todas partes, también en ciudad, igual que quien trabaja en bici. Tiene que ser un casco homologado o certificado.',
        en: 'Outside towns, yes. Since 1 October 2026 (Royal Decree 518/2026), every cyclist must wear one, properly buckled, on interurban roads, and the old exemptions no longer apply. Under-16s must wear one everywhere, including in towns, as must anyone cycling for work. It has to be an approved or certified helmet.',
        fr: "Hors agglomération, oui. Depuis le 1er octobre 2026 (décret royal 518/2026), tous les cyclistes doivent le porter bien attaché sur les routes interurbaines, et les anciennes exceptions ont disparu. Les moins de 16 ans doivent le porter partout, y compris en ville, tout comme les personnes qui roulent pour leur travail. Il doit s'agir d'un casque homologué ou certifié.",
      },
    },
    {
      pregunta: {
        ca: 'Val la pena un casc amb MIPS?',
        es: '¿Merece la pena un casco con MIPS?',
        en: 'Is a MIPS helmet worth it?',
        fr: 'Un casque avec MIPS, ça vaut le coup ?',
      },
      resposta: {
        ca: "MIPS és una capa de baixa fricció entre el coixinet i l'escuma que deixa que el casc es mogui una mica respecte al cap en un cop de biaix, per reduir la rotació que arriba al cervell. No és l'únic sistema amb aquesta idea. Si vols comparar, les proves de Virginia Tech mesuren també la rotació, amb sistema o sense.",
        es: 'MIPS es una capa de baja fricción entre el acolchado y la espuma que deja que el casco se mueva un poco respecto a la cabeza en un golpe oblicuo, para reducir la rotación que llega al cerebro. No es el único sistema con esta idea. Si quieres comparar, las pruebas de Virginia Tech miden también la rotación, con sistema o sin él.',
        en: "MIPS is a low-friction layer between the padding and the foam that lets the helmet move slightly relative to your head in an angled impact, to reduce the rotation reaching the brain. It isn't the only system built on this idea. To compare helmets, Virginia Tech's tests also measure rotation, with or without such a system.",
        fr: "MIPS est une couche à faible friction entre le rembourrage et la mousse : lors d'un choc oblique, elle laisse le casque bouger légèrement par rapport à la tête, pour réduire la rotation transmise au cerveau. Ce n'est pas le seul système fondé sur cette idée. Pour comparer, les tests de Virginia Tech mesurent aussi la rotation, avec ou sans système.",
      },
    },
    {
      pregunta: {
        ca: "Cada quant s'ha de canviar el casc?",
        es: '¿Cada cuánto hay que cambiar el casco?',
        en: 'How often should I replace my helmet?',
        fr: 'Tous les combien faut-il changer de casque ?',
      },
      resposta: {
        ca: "Sempre després d'un cop fort o d'una caiguda en què hagis picat amb el cap, encara que sembli intacte. Si no ha patit cap cop, la majoria de fabricants diuen de 3 a 5 anys; el sol, la suor i la calor l'envelleixen abans. Si no saps quants anys té, mira la data de fabricació a l'etiqueta de dins.",
        es: 'Siempre después de un golpe fuerte o de una caída en la que te hayas dado en la cabeza, aunque parezca intacto. Si no ha sufrido ningún golpe, la mayoría de fabricantes dicen de 3 a 5 años; el sol, el sudor y el calor lo envejecen antes. Si no sabes cuántos años tiene, mira la fecha de fabricación en la etiqueta interior.',
        en: "Always after a hard knock or a crash where your head hit the ground, even if it looks fine. If it has never taken a hit, most manufacturers say 3 to 5 years; sun, sweat and heat age it faster. If you don't know how old it is, check the manufacturing date on the label inside.",
        fr: "Toujours après un choc violent ou une chute où la tête a touché, même s'il paraît intact. S'il n'a jamais pris de coup, la plupart des fabricants parlent de 3 à 5 ans ; le soleil, la transpiration et la chaleur le vieillissent plus vite. Si vous ne connaissez pas son âge, regardez la date de fabrication sur l'étiquette intérieure.",
      },
    },
    {
      pregunta: {
        ca: 'Necessito un casc especial per a una bici elèctrica?',
        es: '¿Necesito un casco especial para una bici eléctrica?',
        en: 'Do I need a special helmet for an e-bike?',
        fr: 'Faut-il un casque spécial pour un vélo électrique ?',
      },
      resposta: {
        ca: "Per a una elèctrica normal, que t'ajuda fins a 25 km/h, n'hi ha prou amb un casc de bici amb la norma EN 1078. Per a les speed pedelec, que arriben a 45 km/h, hi ha la norma neerlandesa NTA 8776, amb proves més exigents pensades per a aquesta velocitat.",
        es: 'Para una eléctrica normal, que te ayuda hasta 25 km/h, basta con un casco de bici con la norma EN 1078. Para las speed pedelec, que llegan a 45 km/h, existe la norma neerlandesa NTA 8776, con pruebas más exigentes pensadas para esa velocidad.',
        en: "For a standard e-bike, which assists up to 25 km/h, a bike helmet meeting EN 1078 is enough. For speed pedelecs, which reach 45 km/h, there is the Dutch NTA 8776 standard, with tougher tests designed for that speed.",
        fr: "Pour un vélo électrique classique, qui assiste jusqu'à 25 km/h, un casque vélo conforme à la norme EN 1078 suffit. Pour les speed bikes, qui atteignent 45 km/h, il existe la norme néerlandaise NTA 8776, avec des essais plus exigeants pensés pour cette vitesse.",
      },
    },
  ],
  fonts: [
    { nom: 'EN 1078 (Wikipedia)', url: 'https://en.wikipedia.org/wiki/EN_1078' },
    {
      nom: 'BOE: Real Decreto 518/2026, de 24 de junio (art. 118 del Reglamento General de Circulación)',
      url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2026-13889',
    },
    {
      nom: 'DGT: entra en vigor la reforma del Reglamento de Circulación (30-09-2026)',
      url: 'https://www.dgt.es/comunicacion/notas-de-prensa/20260930-reforma-del-reglamento-de-circulacion-usuarios-vulnerables/',
    },
    {
      nom: 'NHTSA: Bicycle Safety, Fitting a Bicycle Helmet',
      url: 'https://www.nhtsa.gov/sites/nhtsa.gov/files/2024-07/bike-safety-fitting-helmet.pdf',
    },
    {
      nom: 'Virginia Tech Helmet Lab: Bicycle Helmet Ratings',
      url: 'https://www.helmet.beam.vt.edu/bicycle-helmet-ratings.html',
    },
    { nom: 'Mips: Helmet technology', url: 'https://mipsprotection.com/helmet-technology/' },
    {
      nom: 'Multi-directional Impact Protection System (Wikipedia)',
      url: 'https://en.wikipedia.org/wiki/Multi-directional_Impact_Protection_System',
    },
    {
      nom: 'Cycling Weekly: How often should you replace your cycling helmet?',
      url: 'https://www.cyclingweekly.com/products/when-to-replace-it-cycling-helmets',
    },
    {
      nom: 'road.cc: Should you buy an aero road helmet?',
      url: 'https://road.cc/content/feature/should-you-buy-aero-helmet-202070',
    },
    { nom: 'NEN: NTA 8776, helmen voor berijders van S-EPACs', url: 'https://www.nen.nl/en/nta-8776-2016-12-en-228006' },
  ],
};
