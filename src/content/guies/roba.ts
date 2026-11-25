// Guia de la roba de ciclisme. Recerca del novembre del 2026: BikeRadar (roba d’estiu i culots),
// road.cc (protecció solar i UPF), les instruccions de rentat d’Assos, Roadman Cycling (cura de la
// badana) i evo (roba de muntanya). De la botiga només s’hi diu el que el client ja diu.

import type { GuiaEquipament } from './tipus';

export const roba: GuiaEquipament = {
  categoria: 'roba',
  lema: {
    ca: 'Roba que no frega, que respira i que et tapa del sol',
    es: 'Ropa que no roza, que transpira y que te protege del sol',
    en: 'Kit that doesn’t chafe, lets you breathe and keeps the sun off',
    fr: 'Des vêtements qui ne frottent pas, respirent et vous protègent du soleil',
  },
  intro: {
    ca: 'A la Costa Brava es pedala bona part de l’any amb sol i calor, i a la primavera i la tardor les matinades poden ser fresques encara que al migdia vagis en màniga curta. La roba de ciclisme serveix per passar bé aquestes hores: treu la suor, no frega on toques el seient i et protegeix del sol.\n\nEl que més es nota és el culot. La badana és el que fa que tres hores de carretera o de corriols no acabin en rascades, i només funciona si la talla és bona i va directament sobre la pell.\n\nLa resta és qüestió de capes: un mallot lleuger, una capa interior que tregui la suor i una armilla tallavent a la butxaca per a les baixades.',
    es: 'En la Costa Brava se pedalea buena parte del año con sol y calor, y en primavera y otoño las mañanas pueden ser frescas aunque a mediodía vayas en manga corta. La ropa de ciclismo sirve para pasar bien esas horas: evacua el sudor, no roza donde tocas el sillín y te protege del sol.\n\nLo que más se nota es el culotte. La badana es lo que evita que tres horas de carretera o de senderos acaben en rozaduras, y solo funciona si la talla es buena y va directamente sobre la piel.\n\nEl resto es cuestión de capas: un maillot ligero, una camiseta interior que saque el sudor y un chaleco cortavientos en el bolsillo para las bajadas.',
    en: 'On the Costa Brava you ride much of the year in sunshine and heat, and in spring and autumn the mornings can be cool even if you’re in short sleeves by lunchtime. Cycling clothing is there to make those hours comfortable: it moves sweat away, doesn’t rub where you sit on the saddle and shields you from the sun.\n\nThe piece you notice most is your shorts. The chamois is what stops three hours on the road or the trails ending in saddle soreness, and it only works if the size is right and it sits directly against your skin.\n\nThe rest is layering: a light jersey, a base layer that wicks sweat, and a windproof gilet in your pocket for the descents.',
    fr: 'Sur la Costa Brava, on roule une bonne partie de l’année sous le soleil et la chaleur, et au printemps comme à l’automne les matinées peuvent être fraîches même si vous finissez en manches courtes à midi. Les vêtements de vélo sont là pour que ces heures se passent bien : ils évacuent la transpiration, ne frottent pas là où vous touchez la selle et vous protègent du soleil.\n\nLa pièce qui compte le plus, c’est le cuissard. Son chamois évite que trois heures de route ou de sentiers se terminent en irritations, mais il ne fonctionne que si la taille est juste et qu’il est porté à même la peau.\n\nLe reste est une affaire de couches : un maillot léger, un sous-maillot qui évacue la transpiration et un gilet coupe-vent dans la poche pour les descentes.',
  },
  tipus: [
    {
      nom: {
        ca: 'Culot amb tirants i culot de cintura',
        es: 'Culotte con tirantes y culotte de cintura',
        en: 'Bib shorts and waist shorts',
        fr: 'Cuissard à bretelles et cuissard à ceinture',
      },
      text: {
        ca: 'El culot amb tirants és el més habitual a carretera i gravel: els tirants subjecten la badana i no la deixen baixar quan et poses dret sobre els pedals. El de cintura és més fàcil de posar i treure, sobretot per anar al lavabo.',
        es: 'El culotte con tirantes es el más habitual en carretera y gravel: los tirantes sujetan la badana y no dejan que baje cuando te pones de pie sobre los pedales. El de cintura es más fácil de poner y quitar, sobre todo para ir al baño.',
        en: 'Bib shorts are the usual choice for road and gravel: the straps hold the chamois in place so it doesn’t sag when you stand on the pedals. Waist shorts are easier to get on and off, especially for toilet stops.',
        fr: 'Le cuissard à bretelles est le plus courant sur route et en gravel : les bretelles maintiennent le chamois, qui ne descend pas quand vous vous mettez en danseuse. Le cuissard à ceinture s’enfile et s’enlève plus facilement, surtout pour les pauses toilettes.',
      },
    },
    {
      nom: {
        ca: 'Mallot i capa interior',
        es: 'Maillot y camiseta interior',
        en: 'Jersey and base layer',
        fr: 'Maillot et sous-maillot',
      },
      text: {
        ca: 'El mallot d’estiu és lleuger, ajustat i amb panells de malla per ventilar; la cremallera llarga et deixa obrir-lo a les pujades. A sota, una capa interior fina, sintètica o de malla, treu la suor de la pell fins i tot quan fa calor.',
        es: 'El maillot de verano es ligero, ajustado y con paneles de malla para ventilar; la cremallera larga te permite abrirlo en las subidas. Debajo, una camiseta interior fina, sintética o de malla, saca el sudor de la piel incluso cuando hace calor.',
        en: 'A summer jersey is light and close-fitting, with mesh panels for airflow; a full-length zip lets you open it up on the climbs. Underneath, a thin synthetic or mesh base layer pulls sweat off your skin, even on hot days.',
        fr: 'Le maillot d’été est léger, près du corps et doté de panneaux en filet pour ventiler ; la fermeture éclair intégrale permet de l’ouvrir dans les montées. Dessous, un sous-maillot fin, synthétique ou en filet, évacue la transpiration même quand il fait chaud.',
      },
    },
    {
      nom: {
        ca: 'Armilla, manguitos i perneres',
        es: 'Chaleco, manguitos y perneras',
        en: 'Gilet, arm and leg warmers',
        fr: 'Gilet, manchettes et jambières',
      },
      text: {
        ca: 'Són les peces d’entretemps: te les poses a les matinades fresques o a les baixades i te les treus quan escalfa. Una armilla tallavent lleugera cap a la butxaca del mallot.',
        es: 'Son las prendas de entretiempo: te las pones en las mañanas frescas o en las bajadas y te las quitas cuando calienta. Un chaleco cortavientos ligero cabe en el bolsillo del maillot.',
        en: 'These are your in-between pieces: put them on for cool early starts or descents and take them off as it warms up. A light windproof gilet packs into a jersey pocket.',
        fr: 'Ce sont les pièces de mi-saison : vous les enfilez par les matinées fraîches ou dans les descentes, et vous les retirez quand il fait plus chaud. Un gilet coupe-vent léger tient dans la poche du maillot.',
      },
    },
    {
      nom: {
        ca: 'Roba de muntanya',
        es: 'Ropa de montaña',
        en: 'Mountain bike kit',
        fr: 'Tenue de VTT',
      },
      text: {
        ca: 'Per als corriols, molts ciclistes porten un pantaló ample a sobre d’un culot interior amb badana: l’ample aguanta les branques i les caigudes, i té butxaques. La samarreta sol ser més folgada, d’un teixit resistent que tregui la suor.',
        es: 'Para los senderos, muchos ciclistas llevan un pantalón ancho encima de un culotte interior con badana: el ancho aguanta las ramas y las caídas, y tiene bolsillos. La camiseta suele ser más holgada, de un tejido resistente que saque el sudor.',
        en: 'On the trails, many riders wear baggy shorts over a padded liner: the outer layer takes the branches and the crashes and gives you pockets. Jerseys tend to be looser, in a tough fabric that still wicks sweat.',
        fr: 'Sur les sentiers, beaucoup de vététistes portent un short ample par-dessus un cuissard intérieur avec chamois : le short encaisse les branches et les chutes, et offre des poches. Le maillot est souvent plus ample, dans un tissu résistant qui évacue la transpiration.',
      },
    },
  ],
  consells: [
    {
      titol: {
        ca: 'Prova-t’ho en posició de pedalar',
        es: 'Pruébatelo en posición de pedalear',
        en: 'Try it on in the riding position',
        fr: 'Essayez-le en position de pédalage',
      },
      text: {
        ca: 'El culot ha d’anar ajustat com una segona pell, i la badana no s’ha de moure. Prova-te’l inclinat, com si anessis agafat al manillar: si fa arrugues és gran; si fa mal o deixa marques fondes, és petit. Cada marca talla diferent.',
        es: 'El culotte tiene que ir ajustado como una segunda piel, y la badana no se debe mover. Pruébatelo inclinado, como si fueras agarrado al manillar: si hace arrugas es grande; si aprieta o deja marcas profundas, es pequeño. Cada marca talla distinto.',
        en: 'Shorts should fit like a second skin, and the chamois shouldn’t move. Try them on bent over as if you were holding the bars: wrinkles mean they’re too big; pain or deep marks mean they’re too small. Every brand sizes differently.',
        fr: 'Le cuissard doit être ajusté comme une seconde peau, et le chamois ne doit pas bouger. Essayez-le penché en avant, comme si vous teniez le guidon : s’il fait des plis, il est trop grand ; s’il serre ou laisse des marques profondes, il est trop petit. Chaque marque taille différemment.',
      },
    },
    {
      titol: {
        ca: 'La badana, directament sobre la pell',
        es: 'La badana, directamente sobre la piel',
        en: 'Chamois straight against the skin',
        fr: 'Le chamois, à même la peau',
      },
      text: {
        ca: 'Sota el culot no es porta roba interior: les costures freguen just on pressiona el seient i la tela reté la humitat. En rutes llargues o de molta calor, una crema antifregament ajuda.',
        es: 'Debajo del culotte no se lleva ropa interior: las costuras rozan justo donde presiona el sillín y la tela retiene la humedad. En rutas largas o de mucho calor, una crema antirrozaduras ayuda.',
        en: 'Don’t wear underwear under cycling shorts: the seams rub right where the saddle presses and the fabric holds moisture. On long or very hot rides, chamois cream helps.',
        fr: 'On ne porte pas de sous-vêtement sous le cuissard : les coutures frottent là où la selle appuie et le tissu retient l’humidité. Pour les longues sorties ou par forte chaleur, une crème anti-frottements aide.',
      },
    },
    {
      titol: {
        ca: 'Mira l’UPF',
        es: 'Fíjate en el UPF',
        en: 'Check the UPF',
        fr: 'Regardez l’indice UPF',
      },
      text: {
        ca: 'L’UPF diu quanta radiació ultraviolada deixa passar la tela: amb UPF 50, aproximadament un 2 %. Els panells de malla sovint no en tenen i una tela molt fina pot deixar-te cremar; on no arriba la roba (bessons, orelles, nas, dors de les mans), crema solar.',
        es: 'El UPF indica cuánta radiación ultravioleta deja pasar el tejido: con UPF 50, aproximadamente un 2 %. Los paneles de malla a menudo no tienen y una tela muy fina puede dejar que te quemes; donde no llega la ropa (gemelos, orejas, nariz, dorso de las manos), crema solar.',
        en: 'UPF tells you how much ultraviolet radiation the fabric lets through: at UPF 50, about 2%. Mesh panels often aren’t rated and very thin fabric can still let you burn; wherever your kit doesn’t cover (calves, ears, nose, backs of the hands), use sunscreen.',
        fr: 'L’UPF indique la part de rayons ultraviolets que le tissu laisse passer : avec un UPF 50, environ 2 %. Les panneaux en filet n’en ont souvent pas et un tissu très fin peut laisser passer les coups de soleil ; là où les vêtements ne couvrent pas (mollets, oreilles, nez, dos des mains), mettez de la crème solaire.',
      },
    },
    {
      titol: {
        ca: 'Renta-la amb compte',
        es: 'Lávala con cuidado',
        en: 'Wash it gently',
        fr: 'Lavez-les avec soin',
      },
      text: {
        ca: 'Després de cada sortida: del revés, en una bossa de rentar, amb programa delicat a 30 °C com a màxim i sense suavitzant. Deixa-la assecar a l’aire, sense assecadora ni sol directe.',
        es: 'Después de cada salida: del revés, en una bolsa de lavado, con programa delicado a 30 °C como máximo y sin suavizante. Déjala secar al aire, sin secadora ni sol directo.',
        en: 'After every ride: inside out, in a wash bag, on a delicate cycle at 30 °C at most and with no fabric softener. Let it air-dry, with no tumble dryer and out of direct sun.',
        fr: 'Après chaque sortie : à l’envers, dans un filet de lavage, en cycle délicat à 30 °C maximum et sans adoucissant. Faites-les sécher à l’air libre, sans sèche-linge ni soleil direct.',
      },
    },
  ],
  aTecnibike: {
    ca: 'A la botiga treballem amb Assos, Gobik i Pissei. Prova-t’ho aquí: et triem la talla i t’assessorem perquè t’enduguis el que necessites per a les rutes que fas. De moment no venem en línia: vine a la botiga o truca’ns.',
    es: 'En la tienda trabajamos con Assos, Gobik y Pissei. Pruébatelo aquí: te elegimos la talla y te asesoramos para que te lleves lo que necesitas para las rutas que haces. De momento no vendemos en línea: ven a la tienda o llámanos.',
    en: 'In the shop we work with Assos, Gobik and Pissei. Try it on here: we’ll find your size and help you pick what you need for the rides you do. We don’t sell online yet, so come to the shop or give us a call.',
    fr: 'À la boutique, nous travaillons avec Assos, Gobik et Pissei. Venez essayer : nous vous trouvons la bonne taille et vous conseillons pour choisir ce dont vous avez besoin selon vos sorties. Pour l’instant, nous ne vendons pas en ligne : passez à la boutique ou appelez-nous.',
  },
  preguntes: [
    {
      pregunta: {
        ca: 'Es porta roba interior sota el culot?',
        es: '¿Se lleva ropa interior debajo del culotte?',
        en: 'Do you wear underwear under cycling shorts?',
        fr: 'Faut-il porter un sous-vêtement sous le cuissard ?',
      },
      resposta: {
        ca: 'No. La badana està pensada per anar directament sobre la pell: la roba interior hi afegeix costures que freguen i una capa que reté la suor. Amb un culot interior de muntanya, tampoc.',
        es: 'No. La badana está pensada para ir directamente sobre la piel: la ropa interior añade costuras que rozan y una capa que retiene el sudor. Con un culotte interior de montaña, tampoco.',
        en: 'No. The chamois is designed to sit directly against your skin: underwear adds seams that rub and a layer that holds sweat. The same goes for padded mountain bike liners.',
        fr: 'Non. Le chamois est conçu pour être porté à même la peau : un sous-vêtement ajoute des coutures qui frottent et une couche qui retient la transpiration. C’est pareil avec un cuissard intérieur de VTT.',
      },
    },
    {
      pregunta: {
        ca: 'Culot amb tirants o sense tirants?',
        es: '¿Culotte con tirantes o sin tirantes?',
        en: 'Bib shorts or waist shorts?',
        fr: 'Cuissard à bretelles ou sans bretelles ?',
      },
      resposta: {
        ca: 'La majoria de ciclistes de carretera i gravel prefereixen els tirants, perquè subjecten la badana sense una cintura que estrenyi. El de cintura és més pràctic per a sortides curtes i per anar al lavabo. En tots dos casos, el que compta és que la talla sigui bona i la badana no es mogui.',
        es: 'La mayoría de ciclistas de carretera y gravel prefieren los tirantes, porque sujetan la badana sin una cintura que apriete. El de cintura es más práctico para salidas cortas y para ir al baño. En los dos casos, lo que cuenta es que la talla sea buena y la badana no se mueva.',
        en: 'Most road and gravel riders prefer bibs, because the straps hold the chamois in place without a tight waistband. Waist shorts are handier for short rides and toilet stops. Either way, what matters is a good fit and a chamois that stays put.',
        fr: 'La plupart des cyclistes sur route et en gravel préfèrent les bretelles, qui maintiennent le chamois sans ceinture qui serre. Le cuissard à ceinture est plus pratique pour les sorties courtes et les pauses toilettes. Dans les deux cas, l’essentiel est une taille juste et un chamois qui ne bouge pas.',
      },
    },
    {
      pregunta: {
        ca: 'Com es renta la roba de ciclisme?',
        es: '¿Cómo se lava la ropa de ciclismo?',
        en: 'How should you wash cycling clothing?',
        fr: 'Comment laver ses vêtements de vélo ?',
      },
      resposta: {
        ca: 'Després de cada sortida, perquè la suor i els bacteris s’acumulen a la badana. Del revés, en una bossa, amb programa delicat a 30 °C com a màxim, detergent líquid suau i sense suavitzant. S’asseca a l’aire, sense assecadora ni sol directe.',
        es: 'Después de cada salida, porque el sudor y las bacterias se acumulan en la badana. Del revés, en una bolsa, con programa delicado a 30 °C como máximo, detergente líquido suave y sin suavizante. Se seca al aire, sin secadora ni sol directo.',
        en: 'After every ride, because sweat and bacteria build up in the chamois. Inside out, in a wash bag, on a delicate cycle at 30 °C at most, with a mild liquid detergent and no fabric softener. Air-dry it, with no tumble dryer and out of direct sun.',
        fr: 'Après chaque sortie, car la transpiration et les bactéries s’accumulent dans le chamois. À l’envers, dans un filet, en cycle délicat à 30 °C maximum, avec une lessive liquide douce et sans adoucissant. Séchage à l’air libre, sans sèche-linge ni soleil direct.',
      },
    },
    {
      pregunta: {
        ca: 'Quan s’ha de canviar el culot?',
        es: '¿Cuándo hay que cambiar el culotte?',
        en: 'When should you replace your cycling shorts?',
        fr: 'Quand faut-il changer de cuissard ?',
      },
      resposta: {
        ca: 'Quan la badana s’aixafa, fa boletes o ja no recupera la forma: llavors deixa de protegir. Algunes guies parlen d’unes 100–150 sortides, però és orientatiu i depèn del culot i de com el cuidis.',
        es: 'Cuando la badana se aplasta, hace bolitas o ya no recupera la forma: entonces deja de proteger. Algunas guías hablan de unas 100–150 salidas, pero es orientativo y depende del culotte y de cómo lo cuides.',
        en: 'When the chamois goes flat, pills or no longer springs back: at that point it stops protecting you. Some guides suggest around 100–150 rides, but that’s only a rough guide and depends on the shorts and how you look after them.',
        fr: 'Quand le chamois s’affaisse, bouloche ou ne reprend plus sa forme : il ne vous protège plus. Certains guides parlent d’environ 100 à 150 sorties, mais c’est indicatif et cela dépend du cuissard et de son entretien.',
      },
    },
  ],
  fonts: [
    {
      nom: 'BikeRadar: How to dress for summer cycling',
      url: 'https://www.bikeradar.com/advice/buyers-guides/how-to-dress-for-summer-cycling',
    },
    {
      nom: 'BikeRadar: Best cycling shorts (guia de compra)',
      url: 'https://www.bikeradar.com/advice/buyers-guides/best-cycling-shorts',
    },
    {
      nom: 'road.cc: How to protect your skin from the sun when cycling',
      url: 'https://road.cc/content/feature/how-protect-your-skin-sun-when-cycling-238999',
    },
    {
      nom: 'ASSOS: instruccions de cura de la roba',
      url: 'https://en.assosproshop.ch/pflegeanleitung',
    },
    {
      nom: 'Roadman Cycling: Chamois care & saddle hygiene',
      url: 'https://roadmancycling.com/blog/cycling-chamois-care-hygiene-guide',
    },
    {
      nom: 'evo: What to wear mountain biking',
      url: 'https://www.evo.com/blogs/guides/what-to-wear-mountain-biking',
    },
  ],
};
