// Guia de la categoria d'ulleres. Recerca del novembre del 2026: categories de filtre de la norma
// EN ISO 12312-1:2022 i protecció UV segons la fitxa de l'Oficina Federal de Salut Pública suïssa,
// fotocromàtiques (Wikipedia) i consells de compra de BikeRadar.

import type { GuiaEquipament } from './tipus';

export const ulleres: GuiaEquipament = {
  categoria: 'ulleres',
  lema: {
    ca: "Ulleres per al sol de la costa i per a l'ombra del bosc",
    es: 'Gafas para el sol de la costa y para la sombra del bosque',
    en: 'Glasses for the coastal sun and the shade of the woods',
    fr: "Des lunettes pour le soleil de la côte et l'ombre des sous-bois",
  },
  intro: {
    ca: "Les ulleres de ciclisme no són només per al sol. A la Costa Brava la llum és forta bona part de l'any i el mar la reflecteix, però també et protegeixen de la pols dels camins, dels insectes i de les pedretes que aixequen els cotxes.\n\nEl problema és que la llum canvia contínuament: en pocs segons passes del sol d'una carretera de costa a l'ombra d'una pineda o d'una sureda de les Gavarres. Unes lents massa fosques et deixen sense veure-hi just on hi ha arrels i sots.\n\nAquí tens els tipus d'ulleres, com llegir la categoria del filtre i què mirar perquè no s'entelin ni topin amb el casc.",
    es: 'Las gafas de ciclismo no son solo para el sol. En la Costa Brava la luz es fuerte buena parte del año y el mar la refleja, pero también te protegen del polvo de los caminos, de los insectos y de las piedrecitas que levantan los coches.\n\nEl problema es que la luz cambia todo el rato: en pocos segundos pasas del sol de una carretera de costa a la sombra de un pinar o de un alcornocal de las Gavarres. Unas lentes demasiado oscuras te dejan sin ver justo donde hay raíces y baches.\n\nAquí tienes los tipos de gafas, cómo leer la categoría del filtro y qué mirar para que no se empañen ni choquen con el casco.',
    en: "Cycling glasses aren't just for the sun. On the Costa Brava the light is strong for much of the year and the sea reflects it, but your glasses also keep out trail dust, insects and the small stones that cars flick up.\n\nThe catch is that the light keeps changing: in a few seconds you go from a sunny coast road into the shade of a pine wood or a cork oak forest in the Gavarres. Lenses that are too dark leave you squinting right where the roots and potholes are.\n\nHere are the types of glasses, how to read the filter category, and what to look for so they don't fog up or clash with your helmet.",
    fr: "Les lunettes de vélo ne servent pas qu'au soleil. Sur la Costa Brava, la lumière est forte une bonne partie de l'année et la mer la renvoie, mais elles vous protègent aussi de la poussière des chemins, des insectes et des gravillons projetés par les voitures.\n\nLe problème, c'est que la lumière change sans arrêt : en quelques secondes, vous passez du soleil d'une route côtière à l'ombre d'une pinède ou d'une forêt de chênes-lièges des Gavarres. Des verres trop foncés vous laissent dans le noir précisément là où il y a des racines et des trous.\n\nVoici les types de lunettes, comment lire la catégorie de filtre et ce qu'il faut vérifier pour qu'elles ne s'embuent pas et ne gênent pas avec le casque.",
  },
  tipus: [
    {
      nom: {
        ca: 'De pantalla',
        es: 'De pantalla',
        en: 'Shield',
        fr: 'Écran',
      },
      text: {
        ca: "Una sola lent gran que cobreix els dos ulls i bona part dels costats. Protegeix més del vent, la pols i la llum lateral, i és la més habitual a carretera i a muntanya.",
        es: 'Una sola lente grande que cubre los dos ojos y buena parte de los lados. Protege más del viento, el polvo y la luz lateral, y es la más habitual en carretera y en montaña.',
        en: 'A single large lens covering both eyes and much of the sides. It keeps out more wind, dust and side light, and is the most common choice on the road and on the trails.',
        fr: "Un seul grand verre qui couvre les deux yeux et une bonne partie des côtés. Il protège mieux du vent, de la poussière et de la lumière latérale : c'est le modèle le plus courant sur route comme en VTT.",
      },
    },
    {
      nom: {
        ca: 'De dues lents',
        es: 'De dos lentes',
        en: 'Two-lens',
        fr: 'Deux verres',
      },
      text: {
        ca: "Més petites i discretes, s'assemblen a unes ulleres de sol normals. Van bé per a sortides tranquil·les o si te les vols deixar posades després de la bici, però cobreixen menys els costats.",
        es: 'Más pequeñas y discretas, se parecen a unas gafas de sol normales. Van bien para salidas tranquilas o si te las quieres dejar puestas después de la bici, pero cubren menos los lados.',
        en: "Smaller and more low-key, they look like ordinary sunglasses. Good for easy rides or if you want to keep them on after the ride, but they cover less at the sides.",
        fr: "Plus petites et discrètes, elles ressemblent à des lunettes de soleil classiques. Idéales pour les sorties tranquilles ou si vous voulez les garder après le vélo, mais elles couvrent moins les côtés.",
      },
    },
    {
      nom: {
        ca: 'Fotocromàtiques',
        es: 'Fotocromáticas',
        en: 'Photochromic',
        fr: 'Photochromiques',
      },
      text: {
        ca: "La lent s'enfosqueix amb la llum ultraviolada i s'aclareix a l'ombra, sovint entre les categories 1 i 3. Són pràctiques quan entres i surts del bosc; amb molta calor, però, s'enfosqueixen menys.",
        es: 'La lente se oscurece con la luz ultravioleta y se aclara a la sombra, a menudo entre las categorías 1 y 3. Son prácticas cuando entras y sales del bosque; con mucho calor, eso sí, se oscurecen menos.',
        en: "The lens darkens in UV light and clears in the shade, often between categories 1 and 3. Handy when you're in and out of the woods, though in strong heat they don't get as dark.",
        fr: "Le verre fonce sous les UV et s'éclaircit à l'ombre, souvent entre les catégories 1 et 3. Pratique quand vous entrez et sortez des bois ; par forte chaleur, en revanche, il fonce moins.",
      },
    },
    {
      nom: {
        ca: 'Màscares',
        es: 'Máscaras',
        en: 'Goggles',
        fr: 'Masques',
      },
      text: {
        ca: "Per anar amb casc integral, en enduro i descens. Tanquen tot el contorn dels ulls i aguanten millor el fang i la pols que unes ulleres.",
        es: 'Para ir con casco integral, en enduro y descenso. Cierran todo el contorno de los ojos y aguantan mejor el barro y el polvo que unas gafas.',
        en: 'For riding with a full-face helmet, in enduro and downhill. They seal all around your eyes and cope with mud and dust better than glasses.',
        fr: "Pour rouler avec un casque intégral, en enduro et en descente. Ils ferment tout le contour des yeux et résistent mieux à la boue et à la poussière que des lunettes.",
      },
    },
  ],
  consells: [
    {
      titol: {
        ca: 'La categoria del filtre',
        es: 'La categoría del filtro',
        en: 'The filter category',
        fr: 'La catégorie de filtre',
      },
      text: {
        ca: "Va del 0 (gairebé transparent) al 4 (molt fosca), segons la llum que deixa passar la lent (norma EN ISO 12312-1). Per al sol fort de l'estiu, una 3; per a dies ennuvolats o bosc, una 1 o una 2. La 4 no serveix per a la carretera: és tan fosca que no deixa reconèixer bé els semàfors.",
        es: 'Va del 0 (casi transparente) al 4 (muy oscura), según la luz que deja pasar la lente (norma EN ISO 12312-1). Para el sol fuerte del verano, una 3; para días nublados o bosque, una 1 o una 2. La 4 no sirve para la carretera: es tan oscura que no deja reconocer bien los semáforos.',
        en: "It runs from 0 (almost clear) to 4 (very dark), depending on how much light the lens lets through (EN ISO 12312-1). For strong summer sun, a category 3; for cloudy days or woodland, a 1 or a 2. Category 4 isn't for the road: it's so dark you can't reliably make out traffic lights.",
        fr: "Elle va de 0 (presque transparent) à 4 (très foncé), selon la lumière que laisse passer le verre (norme EN ISO 12312-1). Pour le plein soleil d'été, une catégorie 3 ; par temps couvert ou en forêt, une 1 ou une 2. La 4 ne convient pas à la route : elle est si foncée qu'on distingue mal les feux de circulation.",
      },
    },
    {
      titol: {
        ca: 'Protecció UV, no només color',
        es: 'Protección UV, no solo color',
        en: 'UV protection, not just tint',
        fr: 'Protection UV, pas seulement teinte',
      },
      text: {
        ca: "La protecció contra els raigs ultraviolats depèn del material de la lent, no de com és de fosca. Busca el marcatge CE i «UV400» o «100% UV». L'assaig de la norma està pensat per a uns dos anys d'ús, unes dues hores al dia, i una lent ratllada protegeix menys.",
        es: 'La protección contra los rayos ultravioleta depende del material de la lente, no de lo oscura que sea. Busca el marcado CE y «UV400» o «100% UV». El ensayo de la norma está pensado para unos dos años de uso, unas dos horas al día, y una lente rayada protege menos.',
        en: "Protection from ultraviolet rays depends on the lens material, not on how dark it is. Look for the CE mark and UV400 or 100% UV. The standard's ageing test is designed for about two years of use at around two hours a day, and a scratched lens protects less.",
        fr: "La protection contre les UV dépend du matériau du verre, pas de sa teinte. Cherchez le marquage CE et la mention « UV400 » ou « 100 % UV ». L'essai de vieillissement de la norme est prévu pour environ deux ans d'usage, à raison de deux heures par jour, et un verre rayé protège moins.",
      },
    },
    {
      titol: {
        ca: 'Prova-les amb el casc',
        es: 'Pruébalas con el casco',
        en: 'Try them with your helmet',
        fr: 'Essayez-les avec votre casque',
      },
      text: {
        ca: "Les patilles han de passar per sota de les cintes del casc sense que les pressionin, i la vora de dalt no ha de topar amb el casc. Unes ulleres que van bé soles poden lliscar pel nas quan el cordes; un pont nasal ajustable ajuda.",
        es: 'Las patillas tienen que pasar por debajo de las cintas del casco sin que las presionen, y el borde de arriba no debe chocar con el casco. Unas gafas que van bien solas pueden resbalar por la nariz cuando lo abrochas; un puente nasal ajustable ayuda.',
        en: "The arms should slide under the helmet straps without being squeezed, and the top edge shouldn't touch the helmet. Glasses that fit well on their own can slip down your nose once the helmet is buckled; an adjustable nose bridge helps.",
        fr: "Les branches doivent passer sous les sangles du casque sans être comprimées, et le bord supérieur ne doit pas toucher le casque. Des lunettes qui tiennent bien seules peuvent glisser sur le nez une fois le casque attaché ; un pont de nez réglable aide.",
      },
    },
    {
      titol: {
        ca: "Que hi passi l'aire",
        es: 'Que pase el aire',
        en: 'Let the air through',
        fr: "Laissez passer l'air",
      },
      text: {
        ca: "A les pujades lentes l'aire gairebé no corre, i la lent s'entela si queda massa a prop de la cara. Les que tenen ventilacions a la lent o al marc, i queden una mica separades de les galtes, s'entelen menys.",
        es: 'En las subidas lentas el aire casi no corre, y la lente se empaña si queda demasiado cerca de la cara. Las que tienen ventilaciones en la lente o en la montura, y quedan algo separadas de las mejillas, se empañan menos.',
        en: "On slow climbs there's hardly any airflow, and the lens fogs if it sits too close to your face. Models with vents in the lens or frame, sitting a little away from your cheeks, fog up less.",
        fr: "Dans les montées lentes, l'air ne circule presque plus et le verre s'embue s'il est trop près du visage. Les modèles avec des aérations dans le verre ou la monture, un peu décollés des joues, s'embuent moins.",
      },
    },
  ],
  aTecnibike: {
    ca: "A la botiga te les pots provar, millor amb el teu casc posat, i t'assessorem sobre quina lent et convé segons on i quan surts. Treballem ulleres de POC, Oakley, Bliz i Eassun. De moment no venem en línia: passa per Sant Antoni de Calonge o truca'ns.",
    es: 'En la tienda te las puedes probar, mejor con tu casco puesto, y te asesoramos sobre qué lente te conviene según dónde y cuándo sales. Trabajamos gafas de POC, Oakley, Bliz y Eassun. De momento no vendemos en línea: pásate por Sant Antoni de Calonge o llámanos.',
    en: "You can try them on in the shop, ideally with your own helmet on, and we'll help you pick the right lens for where and when you ride. We stock glasses from POC, Oakley, Bliz and Eassun. We don't sell online yet, so drop by in Sant Antoni de Calonge or give us a call.",
    fr: "En boutique, vous pouvez les essayer, idéalement avec votre casque, et nous vous conseillons sur le verre qui vous convient selon vos parcours et vos horaires. Nous travaillons les lunettes POC, Oakley, Bliz et Eassun. Pour l'instant, pas de vente en ligne : passez nous voir à Sant Antoni de Calonge ou appelez-nous.",
  },
  preguntes: [
    {
      pregunta: {
        ca: 'Quina categoria de lent necessito per anar en bici?',
        es: '¿Qué categoría de lente necesito para ir en bici?',
        en: 'What lens category do I need for cycling?',
        fr: 'Quelle catégorie de verre faut-il pour le vélo ?',
      },
      resposta: {
        ca: "Depèn de la llum. Per a la majoria de sortides d'estiu per la costa, una categoria 3; si surts d'hora, tard o per bosc, una 1 o una 2, o unes fotocromàtiques que passin de l'una a l'altra. De nit o amb poca llum, lents clares: les tintades no estan pensades per a aquestes condicions.",
        es: 'Depende de la luz. Para la mayoría de salidas de verano por la costa, una categoría 3; si sales temprano, tarde o por bosque, una 1 o una 2, o unas fotocromáticas que pasen de una a otra. De noche o con poca luz, lentes claras: las tintadas no están pensadas para esas condiciones.',
        en: "It depends on the light. For most summer rides along the coast, a category 3; if you ride early, late or in the woods, a 1 or a 2, or photochromic lenses that move between them. At night or in poor light, use clear lenses: tinted ones aren't designed for those conditions.",
        fr: "Tout dépend de la lumière. Pour la plupart des sorties d'été sur la côte, une catégorie 3 ; si vous partez tôt, tard ou en forêt, une 1 ou une 2, ou des photochromiques qui passent de l'une à l'autre. De nuit ou par faible luminosité, des verres clairs : les verres teintés ne sont pas prévus pour ces conditions.",
      },
    },
    {
      pregunta: {
        ca: 'Fotocromàtiques o polaritzades?',
        es: '¿Fotocromáticas o polarizadas?',
        en: 'Photochromic or polarised?',
        fr: 'Photochromiques ou polarisantes ?',
      },
      resposta: {
        ca: "Les fotocromàtiques s'adapten soles quan la llum canvia, i per això agraden tant per a rutes amb sol i ombra. Les polaritzades treuen els reflexos de l'asfalt mullat o del mar, però segons com inclines el cap la pantalla del GPS o del mòbil es pot veure fosca, i amaguen la brillantor que delata una taca mullada a la carretera.",
        es: 'Las fotocromáticas se adaptan solas cuando cambia la luz, y por eso gustan tanto para rutas con sol y sombra. Las polarizadas quitan los reflejos del asfalto mojado o del mar, pero según cómo inclines la cabeza la pantalla del GPS o del móvil puede verse oscura, y esconden el brillo que delata una mancha mojada en la carretera.',
        en: "Photochromic lenses adjust by themselves when the light changes, which is why they're so popular for rides that mix sun and shade. Polarised lenses cut glare from wet tarmac or the sea, but depending on how you tilt your head your GPS or phone screen can look dark, and they hide the shine that gives away a wet patch on the road.",
        fr: "Les photochromiques s'adaptent seules quand la lumière change, d'où leur succès pour les parcours entre soleil et ombre. Les polarisantes suppriment les reflets de la route mouillée ou de la mer, mais selon l'inclinaison de la tête l'écran du GPS ou du téléphone peut paraître sombre, et elles masquent la brillance qui trahit une plaque humide sur la route.",
      },
    },
    {
      pregunta: {
        ca: 'Quin color de lent va millor?',
        es: '¿Qué color de lente va mejor?',
        en: 'Which lens colour works best?',
        fr: 'Quelle couleur de verre choisir ?',
      },
      resposta: {
        ca: "Les grises i les marrons alteren poc els colors i van bé amb sol. Les grogues o rosades donen més contrast amb poca llum i al bosc, i les transparents són per a la nit o per a dies molt foscos. Les de mirall només tenen sentit amb molt de sol.",
        es: 'Las grises y las marrones alteran poco los colores y van bien con sol. Las amarillas o rosadas dan más contraste con poca luz y en el bosque, y las transparentes son para la noche o para días muy oscuros. Las de espejo solo tienen sentido con mucho sol.',
        en: 'Grey and brown lenses change colours very little and work well in sunshine. Yellow or rose lenses add contrast in low light and in the woods, and clear ones are for night or very dull days. Mirrored lenses only make sense in bright sun.',
        fr: "Les verres gris et marron modifient peu les couleurs et conviennent au soleil. Les jaunes ou rosés apportent du contraste par faible luminosité et en forêt, et les transparents servent la nuit ou par temps très sombre. Les verres miroir n'ont d'intérêt qu'en plein soleil.",
      },
    },
    {
      pregunta: {
        ca: 'Puc fer servir ulleres de ciclisme si porto ulleres graduades?',
        es: '¿Puedo usar gafas de ciclismo si llevo gafas graduadas?',
        en: 'Can I use cycling glasses if I wear prescription glasses?',
        fr: 'Peut-on porter des lunettes de vélo quand on a une correction ?',
      },
      resposta: {
        ca: "Sí. Hi ha models que admeten lents graduades o un suplement graduat per dins de la lent. Abans de comprar-ne unes, consulta a la teva òptica si la teva graduació s'hi pot adaptar.",
        es: 'Sí. Hay modelos que admiten lentes graduadas o un suplemento graduado por dentro de la lente. Antes de comprar unas, consulta en tu óptica si tu graduación se puede adaptar.',
        en: "Yes. Some models take prescription lenses or a prescription insert behind the main lens. Before you buy, check with your optician whether your prescription can be fitted.",
        fr: "Oui. Certains modèles acceptent des verres correcteurs ou un insert correcteur derrière l'écran. Avant d'acheter, demandez à votre opticien si votre correction peut s'y adapter.",
      },
    },
  ],
  fonts: [
    {
      nom: 'Oficina Federal de Salut Pública de Suïssa (BAG/OFSP): fitxa sobre ulleres de sol (EN ISO 12312-1:2022)',
      url: 'https://www.bag.admin.ch/dam/en/sd-web/SRRA-pHbch8q/faktenblatt-sonnenbrillen.pdf',
    },
    { nom: 'Photochromic lens (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Photochromic_lens' },
    {
      nom: 'BikeRadar: Best cycling glasses',
      url: 'https://www.bikeradar.com/advice/buyers-guides/best-glasses-for-cycling',
    },
    {
      nom: 'BikeRadar: Best mountain bike sunglasses',
      url: 'https://www.bikeradar.com/advice/buyers-guides/best-mountain-bike-sunglasses',
    },
    {
      nom: 'Trieye: Cycling glasses for rain, fog and spray',
      url: 'https://trieye.com/blogs/news/cycling-glasses-rain',
    },
    {
      nom: 'Trieye: How to choose cycling sunglasses lenses (fotocromàtiques i polaritzades)',
      url: 'https://trieye.com/blogs/news/how-to-choose-cycling-sunglasses-lenses',
    },
  ],
};
