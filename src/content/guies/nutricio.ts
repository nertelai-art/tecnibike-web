// Guia de la nutrició esportiva. Les xifres generals (carbohidrats per hora, hidratació, sodi,
// recuperació, cafeïna) surten de les guies de l'ACSM i de la GSSI i de l'opinió de l'EFSA; les dels
// productes (grams per gel, gels sense aigua), de les webs de les marques (docs/nutricio-productes.md).
// Recerca del novembre del 2026.

import type { GuiaEquipament } from './tipus';

export const nutricio: GuiaEquipament = {
  categoria: 'nutricio',
  lema: {
    ca: "Menja i beu abans de tenir gana i set, sobretot amb calor",
    es: "Come y bebe antes de tener hambre y sed, sobre todo con calor",
    en: "Eat and drink before you're hungry or thirsty, especially in the heat",
    fr: "Mangez et buvez avant d'avoir faim et soif, surtout quand il fait chaud",
  },
  intro: {
    ca: "A la Costa Brava, una sortida de tres o quatre hores suma pujades, sol i, a l'estiu, molta calor. El cos crema carbohidrats i perd aigua i sal amb la suor, i si no els reposes a temps t'enfonses: les cames es buiden i costa pensar amb claredat.\n\nLa nutrició esportiva no fa miracles, però et deixa menjar i beure en marxa sense aturar-te: gels, barretes, begudes i sals que caben a la butxaca del mallot o al bidó. El que compta és quants grams de carbohidrats prens cada hora, quant beus i si el teu estómac ho tolera. Això s'aprèn entrenant, no el dia de la marxa.",
    es: "En la Costa Brava, una salida de tres o cuatro horas suma subidas, sol y, en verano, mucho calor. El cuerpo quema carbohidratos y pierde agua y sal con el sudor, y si no los repones a tiempo llega la pájara: las piernas se vacían y cuesta pensar con claridad.\n\nLa nutrición deportiva no hace milagros, pero te permite comer y beber en marcha sin parar: geles, barritas, bebidas y sales que caben en el bolsillo del maillot o en el bidón. Lo que cuenta es cuántos gramos de carbohidratos tomas cada hora, cuánto bebes y si tu estómago lo tolera. Eso se aprende entrenando, no el día de la marcha.",
    en: "On the Costa Brava, a three- or four-hour ride means climbs, sun and, in summer, serious heat. Your body burns through carbohydrate and loses water and salt in sweat, and if you don't replace them in time you bonk: your legs go empty and it gets hard to think straight.\n\nSports nutrition isn't magic, but it lets you eat and drink on the move without stopping: gels, bars, drinks and salts that fit in a jersey pocket or a bottle. What matters is how many grams of carbohydrate you take each hour, how much you drink and whether your stomach copes. You learn that in training, not on event day.",
    fr: "Sur la Costa Brava, une sortie de trois ou quatre heures enchaîne montées, soleil et, l'été, fortes chaleurs. Votre corps brûle des glucides et perd de l'eau et du sel en transpirant ; si vous ne les remplacez pas à temps, c'est la fringale : les jambes se vident et il devient difficile de garder les idées claires.\n\nLa nutrition sportive ne fait pas de miracles, mais elle vous permet de manger et de boire sans vous arrêter : gels, barres, boissons et sels qui tiennent dans une poche de maillot ou dans un bidon. Ce qui compte, c'est le nombre de grammes de glucides par heure, ce que vous buvez et ce que votre estomac tolère. Cela s'apprend à l'entraînement, pas le jour de la cyclosportive.",
  },
  tipus: [
    {
      nom: { ca: "Gels", es: "Geles", en: "Gels", fr: "Gels" },
      text: {
        ca: "Carbohidrats concentrats en un sobre petit, que entren de pressa. N'hi ha que cal acompanyar amb aigua i d'altres, com els isotònics, que es prenen sols; mira els grams de cadascun, perquè van d'uns 20 a uns 60.",
        es: "Carbohidratos concentrados en un sobre pequeño, que entran rápido. Hay que acompañar algunos con agua; otros, como los isotónicos, se toman solos. Mira los gramos de cada uno, porque van de unos 20 a unos 60.",
        en: "Concentrated carbohydrate in a small sachet that goes down fast. Some need water with them; others, like isotonic gels, are taken on their own. Check the grams on each one, as they range from about 20 to about 60.",
        fr: "Des glucides concentrés dans un petit sachet, vite assimilés. Certains se prennent avec de l'eau, d'autres, comme les gels isotoniques, se prennent seuls. Regardez les grammes de chacun : ils vont d'environ 20 à environ 60.",
      },
    },
    {
      nom: { ca: "Barretes i gominoles", es: "Barritas y gominolas", en: "Bars and chews", fr: "Barres et pâtes de fruits" },
      text: {
        ca: "Per a les primeres hores o els trams tranquils, quan encara es mastega bé. Les gominoles es prenen més fàcilment en marxa que una barreta de cereals, i n'hi ha amb sal o amb cafeïna.",
        es: "Para las primeras horas o los tramos tranquilos, cuando todavía se mastica bien. Las gominolas se toman más fácilmente en marcha que una barrita de cereales, y las hay con sal o con cafeína.",
        en: "For the first hours or the easy stretches, while chewing is still comfortable. Chews are easier to take on the move than a cereal bar, and some come with salt or caffeine.",
        fr: "Pour les premières heures ou les passages tranquilles, quand on mâche encore facilement. Les pâtes de fruits se prennent plus facilement en roulant qu'une barre de céréales, et certaines contiennent du sel ou de la caféine.",
      },
    },
    {
      nom: { ca: "Begudes i sals", es: "Bebidas y sales", en: "Drink mixes and electrolytes", fr: "Boissons et électrolytes" },
      text: {
        ca: "Pols per dissoldre al bidó, amb carbohidrats, electròlits o totes dues coses, i pastilles efervescents de sals. Amb calor, és la manera més senzilla de reposar l'aigua i el sodi que perds suant.",
        es: "Polvos para disolver en el bidón, con carbohidratos, electrolitos o ambas cosas, y pastillas efervescentes de sales. Con calor, es la forma más sencilla de reponer el agua y el sodio que pierdes sudando.",
        en: "Powders to mix in your bottle, with carbohydrate, electrolytes or both, plus effervescent electrolyte tablets. In the heat, they're the simplest way to replace the water and sodium you sweat out.",
        fr: "Des poudres à diluer dans le bidon, avec des glucides, des électrolytes ou les deux, et des pastilles effervescentes. Par forte chaleur, c'est le moyen le plus simple de remplacer l'eau et le sodium perdus en transpirant.",
      },
    },
    {
      nom: { ca: "Recuperadors", es: "Recuperadores", en: "Recovery drinks", fr: "Boissons de récupération" },
      text: {
        ca: "Begudes en pols amb carbohidrats i proteïna per prendre en acabar, sobretot si l'endemà tornes a sortir. Ajuden a refer les reserves, però no substitueixen un bon àpat.",
        es: "Bebidas en polvo con carbohidratos y proteína para tomar al acabar, sobre todo si al día siguiente vuelves a salir. Ayudan a rehacer las reservas, pero no sustituyen una buena comida.",
        en: "Powdered drinks with carbohydrate and protein to take when you finish, especially if you're riding again the next day. They help refill your stores, but they don't replace a proper meal.",
        fr: "Des boissons en poudre avec glucides et protéines, à prendre à l'arrivée, surtout si vous roulez encore le lendemain. Elles aident à refaire les réserves, mais ne remplacent pas un vrai repas.",
      },
    },
  ],
  consells: [
    {
      titol: { ca: "Compta grams, no gels", es: "Cuenta gramos, no geles", en: "Count grams, not gels", fr: "Comptez les grammes, pas les gels" },
      text: {
        ca: "Orientativament, de 30 a 60 g de carbohidrats per hora en sortides d'1 a 2,5 hores, i fins a 90 g/h si passes de 2,5–3 hores, amb productes que barregen glucosa i fructosa. Llegeix els grams de cada envàs i suma'ls.",
        es: "Como orientación, de 30 a 60 g de carbohidratos por hora en salidas de 1 a 2,5 horas, y hasta 90 g/h si pasas de 2,5–3 horas, con productos que mezclan glucosa y fructosa. Lee los gramos de cada envase y súmalos.",
        en: "As a rough guide, 30–60 g of carbohydrate per hour on rides of 1 to 2.5 hours, and up to 90 g/h beyond 2.5–3 hours, using products that mix glucose and fructose. Read the grams on each pack and add them up.",
        fr: "À titre indicatif, 30 à 60 g de glucides par heure pour une sortie de 1 h à 2 h 30, et jusqu'à 90 g/h au-delà de 2 h 30–3 h, avec des produits qui associent glucose et fructose. Lisez les grammes sur chaque emballage et additionnez-les.",
      },
    },
    {
      titol: { ca: "Prova-ho abans", es: "Pruébalo antes", en: "Test it first", fr: "Testez avant" },
      text: {
        ca: "Entre un 30 i un 50 % dels esportistes tenen molèsties d'estómac sovint, i la calor les empitjora. Menja i beu als entrenaments com ho faràs el dia de la marxa, i aquell dia no estrenis cap gel ni cap beguda.",
        es: "Entre un 30 y un 50 % de los deportistas tienen molestias de estómago a menudo, y el calor las empeora. Come y bebe en los entrenamientos como lo harás el día de la marcha, y ese día no estrenes ningún gel ni ninguna bebida.",
        en: "Between 30 and 50% of athletes regularly get stomach trouble, and heat makes it worse. Eat and drink in training the way you will on event day, and don't try a new gel or drink on the day itself.",
        fr: "Entre 30 et 50 % des sportifs ont régulièrement des troubles digestifs, et la chaleur les aggrave. Mangez et buvez à l'entraînement comme le jour J, et ce jour-là, ne testez aucun nouveau gel ni aucune nouvelle boisson.",
      },
    },
    {
      titol: { ca: "Amb calor, aigua i sal", es: "Con calor, agua y sal", en: "In the heat, water and salt", fr: "Par la chaleur, de l'eau et du sel" },
      text: {
        ca: "Intenta no perdre més del 2 % del pes durant la sortida, i beu begudes amb electròlits. Si et peses abans i després, cada quilo perdut és sobretot aigua: per recuperar-te, beu-ne d'1,25 a 1,5 litres per quilo.",
        es: "Intenta no perder más del 2 % del peso durante la salida, y toma bebidas con electrolitos. Si te pesas antes y después, cada kilo perdido es sobre todo agua: para recuperarte, bebe de 1,25 a 1,5 litros por kilo.",
        en: "Try not to lose more than 2% of your body weight during the ride, and drink something with electrolytes. If you weigh yourself before and after, each kilo lost is mostly water: drink 1.25–1.5 litres per kilo to recover.",
        fr: "Essayez de ne pas perdre plus de 2 % de votre poids pendant la sortie, et buvez une boisson avec des électrolytes. Si vous vous pesez avant et après, chaque kilo perdu est surtout de l'eau : pour récupérer, buvez 1,25 à 1,5 litre par kilo.",
      },
    },
    {
      titol: { ca: "Vigila la cafeïna", es: "Ojo con la cafeína", en: "Watch the caffeine", fr: "Attention à la caféine" },
      text: {
        ca: "Molts gels en porten, i cada un en posa una quantitat diferent: mira els mil·ligrams a l'envàs. Per a adults sans, l'EFSA considera segures les dosis úniques de fins a 200 mg i fins a 400 mg al dia, i recorda que pot costar dormir si la prens tard.",
        es: "Muchos geles la llevan, y cada uno en una cantidad distinta: mira los miligramos en el envase. Para adultos sanos, la EFSA considera seguras las dosis únicas de hasta 200 mg y hasta 400 mg al día, y recuerda que puede costar dormir si la tomas tarde.",
        en: "Many gels contain it, each in a different amount: check the milligrams on the pack. For healthy adults, EFSA considers single doses of up to 200 mg and up to 400 mg a day safe, and notes that it can disturb your sleep if you take it late.",
        fr: "Beaucoup de gels en contiennent, chacun en quantité différente : regardez les milligrammes sur l'emballage. Pour un adulte en bonne santé, l'EFSA juge sûres les doses uniques jusqu'à 200 mg et jusqu'à 400 mg par jour, et rappelle qu'elle peut perturber le sommeil si vous la prenez tard.",
      },
    },
  ],
  aTecnibike: {
    ca: "A la botiga treballem amb Maurten, 226ERS, SiS i Nutrinovex. Explica'ns la ruta que faràs i et diem quina nutrició et convé. De moment no venem en línia: vine a la botiga o truca'ns.",
    es: "En la tienda trabajamos con Maurten, 226ERS, SiS y Nutrinovex. Cuéntanos la ruta que vas a hacer y te decimos qué nutrición te conviene. De momento no vendemos en línea: ven a la tienda o llámanos.",
    en: "In the shop we stock Maurten, 226ERS, SiS and Nutrinovex. Tell us the route you're planning and we'll tell you which nutrition suits it. We don't sell online yet: come to the shop or give us a call.",
    fr: "En boutique, nous travaillons avec Maurten, 226ERS, SiS et Nutrinovex. Dites-nous quel parcours vous prévoyez et nous vous conseillerons la nutrition adaptée. Pour l'instant, nous ne vendons pas en ligne : passez à la boutique ou appelez-nous.",
  },
  preguntes: [
    {
      pregunta: {
        ca: "Quants carbohidrats he de prendre per hora en bici?",
        es: "¿Cuántos carbohidratos tengo que tomar por hora en bici?",
        en: "How many carbs should I eat per hour on the bike?",
        fr: "Combien de glucides faut-il prendre par heure à vélo ?",
      },
      resposta: {
        ca: "Depèn de quant duri la sortida. Les recomanacions de referència parlen de 30 a 60 g per hora entre 1 i 2,5 hores, i de fins a 90 g per hora en esforços de més de 2,5–3 hores, amb mescles de glucosa i fructosa. Són xifres orientatives: el que toleri el teu estómac també compta.",
        es: "Depende de cuánto dure la salida. Las recomendaciones de referencia hablan de 30 a 60 g por hora entre 1 y 2,5 horas, y de hasta 90 g por hora en esfuerzos de más de 2,5–3 horas, con mezclas de glucosa y fructosa. Son cifras orientativas: lo que tolere tu estómago también cuenta.",
        en: "It depends on how long you're riding. The main guidelines suggest 30–60 g per hour for 1 to 2.5 hours, and up to 90 g per hour for efforts over 2.5–3 hours, using glucose and fructose blends. These are rough figures: what your stomach tolerates matters too.",
        fr: "Cela dépend de la durée de la sortie. Les recommandations de référence indiquent 30 à 60 g par heure entre 1 h et 2 h 30, et jusqu'à 90 g par heure au-delà de 2 h 30–3 h, avec des mélanges de glucose et de fructose. Ce sont des ordres de grandeur : ce que tolère votre estomac compte aussi.",
      },
    },
    {
      pregunta: {
        ca: "Quants gels he de prendre per hora?",
        es: "¿Cuántos geles tengo que tomar por hora?",
        en: "How many gels should I take per hour?",
        fr: "Combien de gels prendre par heure ?",
      },
      resposta: {
        ca: "Depèn dels grams de cada gel. Amb gels d'uns 25 g, per arribar a 60 g per hora te'n caldrien entre dos i tres; amb gels de 50 g, n'hi ha prou amb un i una mica més. Suma-hi el que portis al bidó i les barretes.",
        es: "Depende de los gramos de cada gel. Con geles de unos 25 g, para llegar a 60 g por hora necesitarías entre dos y tres; con geles de 50 g, basta con uno y algo más. Súmale lo que lleves en el bidón y las barritas.",
        en: "It depends on the grams in each gel. With gels of about 25 g, reaching 60 g per hour takes two to three; with 50 g gels, one plus a little extra is enough. Add in whatever is in your bottle and any bars.",
        fr: "Cela dépend des grammes de chaque gel. Avec des gels d'environ 25 g, il en faut deux à trois pour atteindre 60 g par heure ; avec des gels de 50 g, un seul et un petit complément suffisent. Ajoutez-y ce que contient votre bidon et les barres.",
      },
    },
    {
      pregunta: {
        ca: "Cal menjar en una sortida d'una hora?",
        es: "¿Hace falta comer en una salida de una hora?",
        en: "Do I need to eat on a one-hour ride?",
        fr: "Faut-il manger pendant une sortie d'une heure ?",
      },
      resposta: {
        ca: "En esforços de menys de 45 minuts no cal. Entre 45 i 75 minuts a bon ritme, n'hi ha prou amb quantitats petites, com uns glops de beguda esportiva. A partir d'una hora, ja convé anar menjant.",
        es: "En esfuerzos de menos de 45 minutos no hace falta. Entre 45 y 75 minutos a buen ritmo, basta con cantidades pequeñas, como unos tragos de bebida deportiva. A partir de una hora, ya conviene ir comiendo.",
        en: "For efforts under 45 minutes, no. Between 45 and 75 minutes at a good pace, small amounts are enough, like a few sips of a sports drink. Beyond an hour, it's worth eating as you go.",
        fr: "Pour un effort de moins de 45 minutes, ce n'est pas nécessaire. Entre 45 et 75 minutes à bonne allure, de petites quantités suffisent, comme quelques gorgées de boisson d'effort. Au-delà d'une heure, mieux vaut manger en route.",
      },
    },
    {
      pregunta: {
        ca: "Què he de prendre en acabar la sortida?",
        es: "¿Qué tengo que tomar al acabar la salida?",
        en: "What should I have after a ride?",
        fr: "Que prendre après une sortie ?",
      },
      resposta: {
        ca: "Si l'endemà tornes a pedalar, interessa refer de pressa les reserves: les guies parlen d'1 a 1,2 g de carbohidrats per quilo de pes cada hora durant les primeres quatre hores. Beu també per reposar el líquid perdut, amb electròlits. Un recuperador ajuda si no tens un àpat a mà.",
        es: "Si al día siguiente vuelves a pedalear, interesa rehacer rápido las reservas: las guías hablan de 1 a 1,2 g de carbohidratos por kilo de peso cada hora durante las primeras cuatro horas. Bebe también para reponer el líquido perdido, con electrolitos. Un recuperador ayuda si no tienes una comida a mano.",
        en: "If you're riding again the next day, refill your stores quickly: guidelines suggest 1–1.2 g of carbohydrate per kilo of body weight each hour for the first four hours. Drink to replace lost fluid too, with electrolytes. A recovery drink helps if a meal isn't to hand.",
        fr: "Si vous roulez à nouveau le lendemain, refaites vite vos réserves : les recommandations parlent de 1 à 1,2 g de glucides par kilo de poids et par heure pendant les quatre premières heures. Buvez aussi pour compenser les pertes, avec des électrolytes. Une boisson de récupération aide si vous n'avez pas de repas sous la main.",
      },
    },
  ],
  fonts: [
    {
      nom: "Thomas, Erdman i Burke (2016). Nutrition and Athletic Performance. Posicionament conjunt de l'ACSM, l'Academy of Nutrition and Dietetics i Dietitians of Canada",
      url: "https://doi.org/10.1249/MSS.0000000000000852",
    },
    {
      nom: "Wallis i Podlogar (2022). Dietary Carbohydrate and the Endurance Athlete. Gatorade Sports Science Institute, SSE #231",
      url: "https://www.gssiweb.org/sports-science-exchange/article/dietary-carbohydrate-and-the-endurance-athlete-contemporary-perspectives",
    },
    {
      nom: "Hydration and Nutrition Considerations for Endurance Cycling Exercise in the Heat. Gatorade Sports Science Institute, SSE #262",
      url: "https://www.gssiweb.org/en/sports-science-exchange/article/hydration-and-nutrition-considerations-forendurance-cycling-exercise-in-the-heat",
    },
    {
      nom: "Jeukendrup (2018). Training the Gut for Athletes. Gatorade Sports Science Institute, SSE #178",
      url: "https://www.gssiweb.org/sports-science-exchange/article/training-the-gut-for-athletes",
    },
    {
      nom: "EFSA (2015). Scientific Opinion on the safety of caffeine",
      url: "https://doi.org/10.2903/j.efsa.2015.4102",
    },
    {
      nom: "Maurten: Gel 100 (fitxa del producte)",
      url: "https://www.maurten.com/products/gel-100-box-ca",
    },
    {
      nom: "SiS: gels GO Isotonic Energy (fitxa del producte)",
      url: "https://www.scienceinsport.com/es/shop-sis/go-range/go-gels/geles-go-energia-isotonica-sis",
    },
  ],
};
