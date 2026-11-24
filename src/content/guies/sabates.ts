// Guia de les sabates de ciclisme. Recerca del novembre del 2026: Shimano (SPD-SL), BikeRadar (SPD i
// SPD-SL, dolor de peus, quan canviar les cales), Ergon (muntatge de la cala), Pearl Izumi (com
// triar-ne la talla), evo (sabates per a pedals plans) i la web de DMT. De la botiga només s’hi diu el
// que el client ja diu.

import type { GuiaEquipament } from './tipus';

export const sabates: GuiaEquipament = {
  categoria: 'sabates',
  lema: {
    ca: 'Les sabates i la cala decideixen com arriba la força al pedal',
    es: 'Las zapatillas y la cala deciden cómo llega la fuerza al pedal',
    en: 'Your shoes and cleats decide how your effort reaches the pedals',
    fr: 'Chaussures et cales : c’est par elles que votre force passe à la pédale',
  },
  intro: {
    ca: 'Les sabates són el punt on la cama empeny la bici. Una sola rígida i una cala ben posada fan que la força vagi al pedal; una talla equivocada o una cala mal col·locada es paguen amb peus adormits o panxells carregats al cap d’unes hores.\n\nAquí les rutes combinen pujades llargues, carreteres de costa i pistes de muntanya, sovint amb calor, i amb la calor el peu s’infla. Per això la talla s’ha de triar pensant en la tercera hora de ruta, no en el primer minut.\n\nAbans de mirar sabates, però, mira quins pedals portes: el sistema de cala decideix quina sola necessites.',
    es: 'Las zapatillas son el punto donde la pierna empuja la bici. Una suela rígida y una cala bien puesta hacen que la fuerza vaya al pedal; una talla equivocada o una cala mal colocada se pagan con pies dormidos o gemelos cargados al cabo de unas horas.\n\nAquí las rutas combinan subidas largas, carreteras de costa y pistas de montaña, a menudo con calor, y con el calor el pie se hincha. Por eso la talla se elige pensando en la tercera hora de ruta, no en el primer minuto.\n\nAntes de mirar zapatillas, eso sí, mira qué pedales llevas: el sistema de cala decide qué suela necesitas.',
    en: 'Your shoes are where your legs push the bike. A stiff sole and a well-placed cleat send your effort into the pedal; the wrong size or a badly set cleat costs you numb feet or tight calves a few hours in.\n\nRides here mix long climbs, coast roads and mountain tracks, often in the heat, and heat makes your feet swell. So choose your size with the third hour of the ride in mind, not the first minute.\n\nBefore you look at shoes, though, check which pedals you ride: the cleat system decides which sole you need.',
    fr: 'Les chaussures sont l’endroit où la jambe pousse le vélo. Une semelle rigide et une cale bien placée envoient votre force dans la pédale ; une mauvaise pointure ou une cale mal réglée se paient par des pieds engourdis ou des mollets durs au bout de quelques heures.\n\nIci, les sorties mêlent longues montées, routes côtières et pistes de montagne, souvent sous la chaleur, et la chaleur fait gonfler le pied. Choisissez donc la pointure en pensant à la troisième heure de sortie, pas à la première minute.\n\nAvant de regarder les chaussures, vérifiez d’abord vos pédales : c’est le système de cale qui décide de la semelle qu’il vous faut.',
  },
  tipus: [
    {
      nom: {
        ca: 'Carretera',
        es: 'Carretera',
        en: 'Road',
        fr: 'Route',
      },
      text: {
        ca: 'Sola rígida, sovint de carboni, i cala de plàstic de tres cargols (Shimano SPD-SL o Look Keo, que no són compatibles entre si). La cala sobresurt de la sola: són per pedalar, no per caminar.',
        es: 'Suela rígida, a menudo de carbono, y cala de plástico de tres tornillos (Shimano SPD-SL o Look Keo, que no son compatibles entre sí). La cala sobresale de la suela: son para pedalear, no para caminar.',
        en: 'A stiff sole, often carbon, and a three-bolt plastic cleat (Shimano SPD-SL or Look Keo, which don’t work with each other). The cleat sticks out from the sole: they’re made for pedalling, not walking.',
        fr: 'Semelle rigide, souvent en carbone, et cale en plastique à trois vis (Shimano SPD-SL ou Look Keo, incompatibles entre elles). La cale dépasse de la semelle : elles sont faites pour pédaler, pas pour marcher.',
      },
    },
    {
      nom: {
        ca: 'Muntanya (XC)',
        es: 'Montaña (XC)',
        en: 'Mountain bike (XC)',
        fr: 'VTT (cross-country)',
      },
      text: {
        ca: 'Cala petita de metall i dos cargols (SPD i compatibles), encastada en una sola amb tacs. Pots baixar de la bici i caminar per un tram de pedres o de fang.',
        es: 'Cala pequeña de metal y dos tornillos (SPD y compatibles), encastrada en una suela con tacos. Puedes bajarte de la bici y caminar por un tramo de piedras o de barro.',
        en: 'A small two-bolt metal cleat (SPD and compatibles) recessed into a lugged sole. You can get off the bike and walk a rocky or muddy section.',
        fr: 'Petite cale métallique à deux vis (SPD et compatibles), encastrée dans une semelle à crampons. Vous pouvez descendre du vélo et marcher sur un passage de cailloux ou de boue.',
      },
    },
    {
      nom: {
        ca: 'Gravel i passeig',
        es: 'Gravel y paseo',
        en: 'Gravel and touring',
        fr: 'Gravel et balade',
      },
      text: {
        ca: 'També porten la cala de dos cargols, amb una sola pensada per caminar. Van bé si fas parades o comences amb pedals automàtics: els pedals SPD solen tenir dues cares per enganxar-s’hi.',
        es: 'También llevan la cala de dos tornillos, con una suela pensada para caminar. Van bien si haces paradas o empiezas con pedales automáticos: los pedales SPD suelen tener dos caras para engancharse.',
        en: 'These also take the two-bolt cleat, with a sole made for walking. They suit you if you stop often or are new to clipless pedals: SPD pedals are usually double-sided, so they’re easy to clip into.',
        fr: 'Elles utilisent aussi la cale à deux vis, avec une semelle pensée pour marcher. Elles conviennent si vous faites des pauses ou si vous débutez avec les pédales automatiques : les pédales SPD ont généralement deux faces pour s’enclencher.',
      },
    },
    {
      nom: {
        ca: 'Per a pedals plans',
        es: 'Para pedales de plataforma',
        en: 'Flat pedal shoes',
        fr: 'Pour pédales plates',
      },
      text: {
        ca: 'Sense cala: una sola de goma adherent que s’agafa als pius del pedal, prou rígida per empènyer. Són habituals en enduro i trail, i per a qui no vol anar enganxat al pedal.',
        es: 'Sin cala: una suela de goma adherente que se agarra a los pines del pedal, lo bastante rígida para empujar. Son habituales en enduro y trail, y para quien no quiere ir enganchado al pedal.',
        en: 'No cleat: a sticky rubber sole that grips the pedal pins and is stiff enough to push through. They’re common in enduro and trail riding, and for anyone who doesn’t want to be clipped in.',
        fr: 'Sans cale : une semelle en gomme adhérente qui accroche les picots de la pédale, assez rigide pour pousser. Elles sont courantes en enduro et en trail, et pour ceux qui ne veulent pas être attachés à la pédale.',
      },
    },
  ],
  consells: [
    {
      titol: {
        ca: 'Primer, el pedal',
        es: 'Primero, el pedal',
        en: 'Start with the pedal',
        fr: 'D’abord, la pédale',
      },
      text: {
        ca: 'La sabata ha d’admetre la cala dels teus pedals: les de carretera porten tres forats en triangle, i les de muntanya i gravel, dos en línia. Shimano SPD-SL i Look Keo fan servir tots dos tres cargols, però les cales no s’intercanvien.',
        es: 'La zapatilla tiene que admitir la cala de tus pedales: las de carretera llevan tres agujeros en triángulo, y las de montaña y gravel, dos en línea. Shimano SPD-SL y Look Keo usan los dos tres tornillos, pero las calas no se intercambian.',
        en: 'The shoe has to take the cleat for your pedals: road shoes have three holes in a triangle, mountain and gravel shoes two in a line. Shimano SPD-SL and Look Keo both use three bolts, but their cleats aren’t interchangeable.',
        fr: 'La chaussure doit accepter la cale de vos pédales : celles de route ont trois trous en triangle, celles de VTT et de gravel deux trous alignés. Shimano SPD-SL et Look Keo utilisent tous deux trois vis, mais leurs cales ne sont pas interchangeables.',
      },
    },
    {
      titol: {
        ca: 'La talla, a la tarda',
        es: 'La talla, por la tarde',
        en: 'Size them in the afternoon',
        fr: 'La pointure, l’après-midi',
      },
      text: {
        ca: 'El peu s’infla amb les hores i la calor: prova-te-les a la tarda i amb els mitjons que hi portaràs. Han d’agafar bé el taló sense punts de pressió, i no esperis que cedeixin: si molesten als pocs minuts, no milloraran en ruta. Si et van estretes, busca un model ample en lloc de pujar de talla.',
        es: 'El pie se hincha con las horas y el calor: pruébatelas por la tarde y con los calcetines que llevarás. Tienen que sujetar bien el talón sin puntos de presión, y no esperes que cedan: si molestan a los pocos minutos, no mejorarán en ruta. Si te van estrechas, busca un modelo ancho en lugar de subir de talla.',
        en: 'Feet swell over the hours and in the heat: try shoes on in the afternoon, with the socks you’ll ride in. They should hold your heel with no pressure points, and don’t expect them to break in: if they bother you after a few minutes, they won’t get better on the ride. If they’re too narrow, look for a wide model instead of going up a size.',
        fr: 'Le pied gonfle au fil des heures et avec la chaleur : essayez-les l’après-midi, avec les chaussettes que vous porterez. Elles doivent bien tenir le talon sans points de pression, et n’attendez pas qu’elles se fassent : si elles gênent au bout de quelques minutes, ce ne sera pas mieux en sortie. Si elles sont trop étroites, cherchez un modèle large plutôt que de prendre une pointure au-dessus.',
      },
    },
    {
      titol: {
        ca: 'La cala, ben posada i ben estreta',
        es: 'La cala, bien puesta y bien apretada',
        en: 'Set the cleat and tighten it',
        fr: 'La cale, bien placée et bien serrée',
      },
      text: {
        ca: 'Com a punt de partida, la línia que uneix l’articulació del dit gros i la del dit petit ha de quedar sobre l’eix del pedal. Els cargols, al parell que indica el fabricant (Shimano en dona uns 5–6 N·m): una cala que gira pot no deixar-te desenganxar.',
        es: 'Como punto de partida, la línea que une la articulación del dedo gordo y la del meñique tiene que quedar sobre el eje del pedal. Los tornillos, al par que indica el fabricante (Shimano da unos 5–6 N·m): una cala que gira puede no dejarte desenganchar.',
        en: 'As a starting point, the line between the joints at the base of your big toe and little toe should sit over the pedal axle. Tighten the bolts to the maker’s torque (Shimano gives about 5–6 Nm): a cleat that twists may stop you unclipping.',
        fr: 'Comme point de départ, la ligne qui relie l’articulation du gros orteil à celle du petit orteil doit se trouver au-dessus de l’axe de la pédale. Serrez les vis au couple indiqué par le fabricant (Shimano donne environ 5–6 N·m) : une cale qui tourne peut vous empêcher de déclipser.',
      },
    },
    {
      titol: {
        ca: 'Canvia la cala quan es gasta',
        es: 'Cambia la cala cuando se gasta',
        en: 'Replace worn cleats',
        fr: 'Changez la cale quand elle est usée',
      },
      text: {
        ca: 'Les cales SPD-SL i Look Keo tenen indicadors de desgast: quan desapareix la part de color, toca canviar-les. Les de dos cargols no en tenen: fixa’t si costa més o menys d’enganxar-se i desenganxar-se, o si la cala balla. Caminar-hi les gasta més de pressa.',
        es: 'Las calas SPD-SL y Look Keo tienen indicadores de desgaste: cuando desaparece la parte de color, toca cambiarlas. Las de dos tornillos no tienen: fíjate si cuesta más o menos engancharse y desengancharse, o si la cala baila. Caminar con ellas las gasta más deprisa.',
        en: 'SPD-SL and Look Keo cleats have wear indicators: once the coloured part has worn away, it’s time to replace them. Two-bolt cleats don’t, so watch whether clipping in and out feels harder or easier, or whether the cleat has play. Walking in them wears them faster.',
        fr: 'Les cales SPD-SL et Look Keo ont des témoins d’usure : quand la partie colorée a disparu, il faut les changer. Les cales à deux vis n’en ont pas : soyez attentif si l’enclenchement et le déclenchement deviennent plus durs ou plus faciles, ou si la cale a du jeu. La marche les use plus vite.',
      },
    },
  ],
  aTecnibike: {
    ca: 'Treballem amb DMT, la marca italiana de sabates de carretera, gravel i muntanya. Prova-te-les a la botiga: et triem la talla i te les donem amb la cala muntada i ajustada. De moment no venem en línia: vine a la botiga o truca’ns.',
    es: 'Trabajamos con DMT, la marca italiana de zapatillas de carretera, gravel y montaña. Pruébatelas en la tienda: te elegimos la talla y te las damos con la cala montada y ajustada. De momento no vendemos en línea: ven a la tienda o llámanos.',
    en: 'We work with DMT, the Italian maker of road, gravel and mountain bike shoes. Try them on in the shop: we’ll find your size and hand them over with the cleat fitted and adjusted. We don’t sell online yet, so come to the shop or give us a call.',
    fr: 'Nous travaillons avec DMT, la marque italienne de chaussures de route, de gravel et de VTT. Venez les essayer à la boutique : nous vous trouvons la bonne pointure et vous les remettons avec la cale montée et réglée. Pour l’instant, nous ne vendons pas en ligne : passez à la boutique ou appelez-nous.',
  },
  preguntes: [
    {
      pregunta: {
        ca: 'Quina diferència hi ha entre SPD i SPD-SL?',
        es: '¿Qué diferencia hay entre SPD y SPD-SL?',
        en: 'What’s the difference between SPD and SPD-SL?',
        fr: 'Quelle est la différence entre SPD et SPD-SL ?',
      },
      resposta: {
        ca: 'SPD és el sistema de dos cargols de Shimano, amb una cala petita de metall encastada a la sola: es camina bé i és el més habitual en muntanya, gravel i ciutat. SPD-SL és el de carretera: tres cargols i una cala de plàstic més gran, que dona més superfície de suport però sobresurt i fa caminar malament. No són compatibles entre si.',
        es: 'SPD es el sistema de dos tornillos de Shimano, con una cala pequeña de metal encastrada en la suela: se camina bien y es el más habitual en montaña, gravel y ciudad. SPD-SL es el de carretera: tres tornillos y una cala de plástico más grande, que da más superficie de apoyo pero sobresale y hace caminar mal. No son compatibles entre sí.',
        en: 'SPD is Shimano’s two-bolt system, with a small metal cleat recessed into the sole: it’s easy to walk in and the usual choice for mountain biking, gravel and town riding. SPD-SL is the road system: three bolts and a larger plastic cleat that gives a bigger platform but sticks out and makes walking awkward. The two aren’t compatible.',
        fr: 'Le SPD est le système à deux vis de Shimano, avec une petite cale métallique encastrée dans la semelle : on marche facilement et c’est le plus courant en VTT, en gravel et en ville. Le SPD-SL est le système route : trois vis et une cale en plastique plus grande, qui offre un appui plus large mais dépasse et rend la marche malaisée. Les deux ne sont pas compatibles.',
      },
    },
    {
      pregunta: {
        ca: 'Quina cala trio: groga, blava o vermella?',
        es: '¿Qué cala elijo: amarilla, azul o roja?',
        en: 'Which cleat should I choose: yellow, blue or red?',
        fr: 'Quelle cale choisir : jaune, bleue ou rouge ?',
      },
      resposta: {
        ca: 'Són les cales SPD-SL de Shimano i es diferencien pel flotament, el que pot girar el taló sense que el peu es desenganxi: la groga, 6 graus; la blava, 2; la vermella, cap. La groga és la que dona més marge; la vermella només es recomana amb la bici ben ajustada i una pedalada neta.',
        es: 'Son las calas SPD-SL de Shimano y se diferencian por el flotamiento, lo que puede girar el talón sin que el pie se desenganche: la amarilla, 6 grados; la azul, 2; la roja, ninguno. La amarilla es la que da más margen; la roja solo se recomienda con la bici bien ajustada y una pedalada limpia.',
        en: 'These are Shimano’s SPD-SL cleats, and they differ in float, how far your heel can swing without unclipping: yellow gives 6 degrees, blue 2 and red none. Yellow gives you the most leeway; red is only recommended with a well-fitted bike and a clean pedal stroke.',
        fr: 'Ce sont les cales SPD-SL de Shimano, qui se distinguent par leur liberté angulaire, c’est-à-dire de combien le talon peut pivoter sans déclipser : 6 degrés pour la jaune, 2 pour la bleue, aucun pour la rouge. La jaune laisse le plus de marge ; la rouge n’est conseillée qu’avec un vélo bien réglé et un coup de pédale propre.',
      },
    },
    {
      pregunta: {
        ca: 'Cada quan s’han de canviar les cales?',
        es: '¿Cada cuánto hay que cambiar las calas?',
        en: 'How often should you replace cleats?',
        fr: 'À quelle fréquence faut-il changer les cales ?',
      },
      resposta: {
        ca: 'Depèn dels quilòmetres i, sobretot, de quant hi caminis. A les SPD-SL i Look Keo, quan s’ha gastat la part de color dels indicadors; a les de dos cargols, quan notis que s’enganxen o es desenganxen diferent. Per a les seves cales SPD, Shimano dona com a regla orientativa canviar-les un cop l’any.',
        es: 'Depende de los kilómetros y, sobre todo, de cuánto camines con ellas. En las SPD-SL y Look Keo, cuando se ha gastado la parte de color de los indicadores; en las de dos tornillos, cuando notes que enganchan o desenganchan distinto. Para sus calas SPD, Shimano da como regla orientativa cambiarlas una vez al año.',
        en: 'It depends on your mileage and, above all, on how much you walk in them. On SPD-SL and Look Keo cleats, once the coloured part of the wear indicators has gone; on two-bolt cleats, when clipping in or out starts to feel different. For its SPD cleats, Shimano suggests replacing them once a year as a rule of thumb.',
        fr: 'Cela dépend du kilométrage et surtout de la marche que vous faites avec. Sur les SPD-SL et les Look Keo, quand la partie colorée des témoins d’usure a disparu ; sur les cales à deux vis, quand l’enclenchement ou le déclenchement change. Pour ses cales SPD, Shimano conseille, à titre indicatif, de les changer une fois par an.',
      },
    },
    {
      pregunta: {
        ca: 'Per què se m’adormen o em cremen els peus amb les sabates de ciclisme?',
        es: '¿Por qué se me duermen o me arden los pies con las zapatillas de ciclismo?',
        en: 'Why do my feet go numb or burn in cycling shoes?',
        fr: 'Pourquoi ai-je les pieds engourdis ou brûlants dans mes chaussures de vélo ?',
      },
      resposta: {
        ca: 'Sol ser pressió sobre els nervis de la part davantera del peu, que empitjora en sortides llargues i amb calor, quan el peu s’infla. Sovint ajuda una sabata més ampla, recular la cala de mica en mica o una plantilla que doni suport a l’avantpeu. Si no passa, consulta un especialista en ajust o un podòleg.',
        es: 'Suele ser presión sobre los nervios de la parte delantera del pie, que empeora en salidas largas y con calor, cuando el pie se hincha. A menudo ayuda una zapatilla más ancha, retrasar la cala poco a poco o una plantilla que dé soporte al antepié. Si no se pasa, consulta a un especialista en ajuste o a un podólogo.',
        en: 'It’s usually pressure on the nerves in the front of the foot, which gets worse on long rides and in the heat, when your feet swell. A wider shoe, moving the cleat back a little at a time or an insole that supports the forefoot often helps. If it doesn’t go away, see a bike fitter or a podiatrist.',
        fr: 'C’est en général une pression sur les nerfs de l’avant du pied, qui s’aggrave lors des longues sorties et par la chaleur, quand le pied gonfle. Une chaussure plus large, une cale reculée petit à petit ou une semelle qui soutient l’avant-pied aident souvent. Si cela persiste, consultez un spécialiste de l’étude posturale ou un podologue.',
      },
    },
  ],
  fonts: [
    {
      nom: 'Shimano: SPD-SL pedals & cleats explained',
      url: 'https://ride.shimano.com/blogs/technologies/spd-sl-3-hole-clip-in-pedals-everything-you-want-to-know',
    },
    {
      nom: 'BikeRadar: Shimano SPD vs SPD-SL',
      url: 'https://www.bikeradar.com/advice/buyers-guides/shimano-spd-vs-spd-sl',
    },
    {
      nom: 'Ergon: Shimano SPD-SL cleats, mounting & adjustment guide',
      url: 'https://www.ergonbike.com/en/magazine/shimano-spd-sl-cleats-mounting-and-adjustment-guide',
    },
    {
      nom: 'BikeRadar: When should you replace cycling cleats?',
      url: 'https://www.bikeradar.com/advice/workshop/when-should-you-replace-cleats',
    },
    {
      nom: 'BikeRadar: Cycling foot pain, causes and solutions',
      url: 'https://www.bikeradar.com/advice/sizing-and-fit/cycling-foot-pain',
    },
    {
      nom: 'Pearl Izumi: How to choose cycling shoes',
      url: 'https://www.pearlizumi.com/blogs/pearl-izumi-journal/how-to-choose-cycling-shoes',
    },
    {
      nom: 'evo: What to wear mountain biking',
      url: 'https://www.evo.com/blogs/guides/what-to-wear-mountain-biking',
    },
    {
      nom: 'DMT Cycling',
      url: 'https://www.dmtcycling.com/',
    },
  ],
};
