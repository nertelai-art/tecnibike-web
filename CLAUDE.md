# Tecnibike — web nova

Web de Tecnibike Costa Brava (lloguer de bicis, taller i botiga a Sant Antoni de Calonge).
Encàrrec de client, no és una demo per a un lead: no porta el kit de demo.

Abans de tocar res, llegeix [docs/base-coneixement.md](docs/base-coneixement.md) (dades del
client) i [docs/proposta-web.md](docs/proposta-web.md) (decisions, disseny i integració).

## Pila

Next.js 16 (App Router) · React 19 · TypeScript · next-intl · Zod · MapLibre GL · Vitest. CSS
propi amb CSS Modules (sense Tailwind). pnpm (versió a `packageManager`).

Versions que **no** són l'última, i per què:

- **TypeScript 6**, no 7: `typescript-eslint` (via `eslint-config-next`) només admet `<6.1`.
- **ESLint 9**, no 10: `eslint-plugin-react` no arriba a ESLint 10.
- **`@types/node` 24**: és el Node que fem servir (`engines`).

## Ordres

- `pnpm dev`: servidor de desenvolupament (`next dev --webpack`; en aquesta màquina el SWC natiu
  pot estar bloquejat). Previsualització: `.claude/launch.json` → `tecnibike-dev`, o
  `tecnibike-dev-node` (Next directament amb Node) si el binari natiu de pnpm no s'executa.
- `pnpm check`: typecheck, lint i proves. És el que fa el hook de pre-push (`.githooks/`).
- `pnpm build:local`: build de producció amb webpack.

## Com està fet

- **Idiomes:** `ca` (per defecte), `es`, `en` i `fr`, a `src/messages/`. Una prova obliga que tots
  quatre tinguin les mateixes claus.
- **Plataforma Nertel (app.nertel.ai):** tot el negoci (flota, disponibilitat, taller, reserves)
  passa per `src/lib/plataforma/` (contracte a `interficie.ts`). La plataforma és la font de veritat:
  si el client hi canvia una foto o un preu, la web canvia (catàleg, horari i ajustos es tornen a
  llegir cada 5 minuts; la disponibilitat i les reserves, sempre en directe). **Una compilació demana el
  catàleg, l'horari i els ajustos una sola vegada per procés** (`compilant`, amb `NEXT_PHASE`): a Vercel,
  la memòria de `fetch` no torna res durant la compilació i el 16-11-2026 cada pàgina va tornar a la
  plataforma (593 crides en dues previsualitzacions, i la plataforma alentida). Per això les pàgines que
  la llegeixen diuen `export const revalidate = 300` (una prova ho obliga). Es comprova amb
  `node scripts/compta-crides-build.mjs --sense-cau`, contra una plataforma falsa; mai contra producció.
  Detalls i què fer amb les previsualitzacions: [docs/compilacio-i-plataforma.md](docs/compilacio-i-plataforma.md).
  Dues implementacions:
  - `remota/`: l'API de lloguer de la plataforma. S'activa amb `PLATAFORMA_API_URL` i
    `PLATAFORMA_API_CLAU` (només servidor, mai `NEXT_PUBLIC_`; noms a `.env.example`, valors a
    Vercel). La clau és de la botiga, amb els abasts `rental_read` i `rental_write`.
  - `proves.ts`: dades locals (`dades-prova.ts`) i reserves en memòria. És la que corre si falta
    qualsevol de les dues variables.

  El contracte de la plataforma (`remota/contracte.ts`) és generat: es copia del repositori de la
  plataforma amb `node scripts/sincronitza-contracte.mjs [camí]` i no es toca a mà. Els productes per
  peça, les ressenyes i els participants encara van per les dades de proves, perquè l'API no en té.
  **Taller** (13-11-2026): els preus surten de `workshopServices` del catàleg, un per peça segons la
  `category` del servei (Rodes, Frens, Transmissió, Direcció, Seient, Quadre o Posada a punt, en
  qualsevol idioma), i respecten `priceHidden` i `priceBasis`; sense, no se n'ensenya cap. Les hores i
  les cites van per `/api/public/bookings` (contracte llegit a `remota/contracte-cites.ts`), la
  mateixa agenda que els agents de veu i WhatsApp, amb la mateixa clau de la web, `PLATAFORMA_API_CLAU`,
  que porta els abasts de lloguer i de cites (`web_booking_read` i `web_booking_write`): una sola clau,
  decisió de l'Enric del 13-11-2026 (`PLATAFORMA_CITES_CLAU`, opcional, mana si hi és). **Sense els
  abasts de cites, el formulari no
  ensenya hores i demana que truquin: una cita no es desa mai en memòria** (fins al 13-11-2026 es
  perdien així a producció). Limitacions:
  el preu de la fitxa és orientatiu (mana el que torna la plataforma), només hi ha un grup obligatori (els pedals) i els noms de models i extres surten en un sol idioma.
  **Des del 25-11-2026, els noms d'extres, grups i sabors que la web ja té traduïts es tradueixen** (`src/lib/claus-cataleg.ts`:
  si el nom de la plataforma, en qualsevol idioma, és un de `reserva.extresNoms`, `reserva.grupsNoms` o `nutricio.sabors`, la
  plataforma de la web en posa la clau i la pàgina n'ensenya la traducció). La resta (descripcions, noms nous) surt com l'escriu la botiga.
  Dels models, la web llegeix els camps del catàleg (13-11-2026, plataforma v1.0.10): l'adreça surt de
  la referència (`sku`) i, si no en té, del nom (les adreces d'abans encara troben la bici); la
  categoria, de `category` («Muntanya», «Carretera»…); si és elèctrica, de `attributes["elèctrica"]`;
  i l'ordre és el de la botiga (`position`, la plataforma ja els envia ordenats). D'un grup d'extres
  `multiple` se'n poden triar diversos. Tots aquests camps poden arribar nuls fins que la botiga els
  ompli, i llavors es dedueixen del nom com abans.
  La primera hora que s'ofereix és ara més l'antelació mínima dels ajustos de la plataforma
  (`antelacioMinuts`; a les dades de proves, 0): la plataforma rebutja qualsevol recollida abans.
  Quan la plataforma rebutja una cosa, el camp i la frase que dona surten als registres de Vercel.
  Les fotos de la plataforma s'optimitzen si són de l'emmagatzematge públic (`next.config.ts`);
  les altres se serveixen tal qual. El nom del proveïdor no surt de `src/lib/plataforma/`.
- **Accions de servidor** (`src/app/[locale]/accions.ts`): tornen a validar-ho tot amb Zod i el
  preu, l'horari i l'estoc els comprova la plataforma. El rellotge només entra aquí (`araABotiga`,
  en hora de Madrid) i, a la plataforma de proves, per paràmetre (`rellotge`).
- **Reserva de lloguer** (`src/components/reserva/`), inspirada en Sescapada (myR3nt). A l'esquerra,
  fixos, la foto, el títol i el preu que es va desglossant; a la dreta, el formulari: dia i hora de
  recollida i retorn dins de l'horari de la botiga (`src/lib/horari.ts`), diverses bicis amb les
  mateixes dates (la primera és sempre la de la fitxa; `biciId` és el **tipus** de bici de la tarifa,
  no un model), talla amb les unitats que queden, alçada del ciclista i del seient, pedals
  obligatoris i extres amb foto, preu (per reserva o per dia) i estoc. El pagament (senyal o
  total, amb retenció de l'estoc) i els participants amb signatura estan fets però **apagats**
  (`configuracioReserves` a `dades-prova.ts`) fins que la plataforma els tingui. Què li cal a la
  plataforma: [docs/guia-plataforma-lloguer.md](docs/guia-plataforma-lloguer.md). Les fotos dels
  extres són de Wikimedia Commons, amb crèdits al peu (`src/content/fotos-extres.ts`).
- **Transició de la flota a la fitxa:** `<ViewTransition>` de React amb el mateix nom (`bici-<id>`) a
  la targeta i a la fitxa, i la coreografia a `globals.css`: la bici creix, s'encaixa i la fitxa es
  construeix al voltant (`construeix`, a `Reserva.module.css`). Sense suport del navegador, navega normal.
- **Portada** (`src/components/Portada.tsx`): vídeo en bucle (`public/video/hero*.mp4`) d'un
  ciclista que passa per platja, poble, muntanya i costa.
- **Taller** (`src/components/anatomia/`): la secció es queda fixa; a l'esquerra, el taller
  (`public/img/taller/fons-taller.webp`, generat amb IA) i el text centrat; a la dreta, en un marc,
  el vídeo original de l'anatomia (`public/video/anatomia*.mp4`, amb la carretera) on la bici es
  desmunta amb el scroll (component `ScrollVideo` de la skill `scroll-video`). Al final surten a
  l'atzar bàners amb fil que expliquen cada peça (es paren amb el ratolí a sobre), en una capa per
  sobre de tot. Un cop passada de llarg, queda desmuntada i no es repeteix. La línia de temps i les
  posicions dels bàners (en % del fotograma) són a `anatomia-fases.ts`, amb proves. (Es va provar
  de retallar la bici i posar-la sobre el taller, però el retall es veia malament.)
- **Seccions plegables de la reserva:** els extres de cada bici i la nutrició es pleguen (`Plegable.tsx`),
  amb el resum del que s'hi ha triat. **Comencen obertes** (16-11-2026): plegades, l'Enric no veia que
  hi hagués extres ni nutrició. Els extres surten agrupats pel grup de la plataforma (`grupNom`, «Pedals»,
  «Accessoris»; `grupsExtres` a `src/lib/reserva.ts`); un grup d'un sol extra no porta títol i els solts
  van junts (a Tecnibike cada extra té el seu grup, i el títol només repetia el nom). Un grup de pedals que no és obligatori a la
  plataforma surt com un grup d'extres més, no com la secció «Pedals». Els extres sense foto a la plataforma porten una icona. En afegir
  una bici, la pàgina hi baixa fins a deixar-la al mig, la ressalta un moment i hi posa el focus.
- **Variants d'extres:** un extra pot tenir variants (la talla del casc), cadascuna amb el seu estoc.
  Un cop triat, la rajola demana quina; la plataforma les rep a `items[].options[].variant`.
- **Nutrició esportiva** (`src/components/nutricio/`, recerca a
  [docs/nutricio-productes.md](docs/nutricio-productes.md)). A la pàgina de la botiga `/[locale]/botiga/nutricio`
  (abans era a la portada; es va moure el 13-11-2026). A dalt, un hero amb una rajola per marca
  (Maurten, 226ERS, Nutrinovex i SiS, amb els seus colors de `src/content/nutricio.ts` i tres productes
  en ventall): cada rajola és un filtre. Triar-ne una ensenya tots els seus productes i tenyeix el hero;
  tornar-hi a clicar ensenya tots els de totes. La marca es guarda a l'adreça (`?marca=`). A sota, la
  graella amb els filtres per marca i moment de la ruta, sencera (sense «Veure'n més»); les targetes
  surten d'una en una amb un bot. (Fins al 13-11-2026 hi havia una escena de scroll amb els productes
  girant; l'usuari la va fer treure.) A la reserva, la nutrició és una secció plegable amb 6 productes
  i «Veure'n més». **Fotos de producte:** baixades de les webs de les marques (`public/img/nutricio/`, retallades
  amb fons transparent, una per sabor quan l'envàs canvia; el sabor canvia la foto). Les va triar
  l'usuari el 11-11-2026, i el mateix dia va dir de pujar-les al repositori (que és públic). Es
  regeneren amb `node scripts/fotos-nutricio.mjs <dir>` i
  `py -3.12 scripts/retalla-fotos-nutricio.py <dir> public/img/nutricio` (Pillow i NumPy). **Abans
  de publicar-les a producció cal el permís de les marques** (vegeu `docs/nutricio-productes.md`). A la reserva, la nutrició és de la reserva
  sencera, no d'una bici: línies `{producteId, sabor, quantitat}`. Els sabors són variants amb estoc
  propi, i l'estoc es ven i no torna (no depèn de les dates). **Des del 16-11-2026 la decideix la
  plataforma:** amb la plataforma real, la nutrició de la reserva són els articles que la botiga ven
  amb el lloguer (`GET /catalog` → `shopItems`, amb els sabors com a variants i el preu de cada sabor),
  l'estoc surt de `GET /availability` → `shopItems`, i la reserva els envia com a `shopItems`
  (`{variantId, quantity}`, sense preu). S'encén sola quan la botiga té «Ven articles amb el lloguer»
  (`GET /settings` → `shopItemsEnabled`) i almenys un article; si no, és apagada, la pàgina la demana
  per WhatsApp i una reserva que en porti es rebutja abans d'enviar-la. La marca, el format, el tipus,
  el moment i els carbohidrats surten dels camps del catàleg (`marca`, `format`, `tipus`, `moment`,
  `carbohidrats`, `cafeïna`); el tipus, si no hi és, es dedueix del nom. La marca, també: si no hi és, surt del començament del nom («226ERS HIGH ENERGY GEL» → 226ERS; el 24-11-2026 la
  botiga no l'omplia i la pàgina sortia sense colors ni logos). Clicar una targeta obre la fitxa del producte en un diàleg
  (`DetallProducte.tsx`): sabor, quan es pren, valors per unitat i textos dels camps del catàleg `kcal`, `sucres`, `proteïnes`,
  `sodi`, `ingredients`, `al·lèrgens` i `ús` (també en castellà o anglès). Sense els camps, no se n'ensenya cap. Sense la clau de la
  plataforma, la de proves l'encén només amb `pnpm dev` (`index.ts`). Mentre la botiga no tingui cap
  article, el catàleg de nutrició de la botiga ensenya els de prova. Si un producte no té foto, surt una il·lustració pròpia (`Paquet.tsx`). Els preus són el PVP de la marca, no els de la botiga, i porten `*`.
- **WhatsApp:** icona flotant a baix a la dreta a tota la pàgina d'inici (`WhatsappFlotant.tsx`). Res més
  es reserva ni es compra per WhatsApp (botiga, venda, nutrició i marques, 18-11-2026).
- **Selector d'idioma** (`SelectorIdioma.tsx`, 18-11-2026): a la barra només es veu l'idioma triat (bandera i
  codi); en clicar-lo, un desplegable amb les quatre banderes (SVG propis) i el nom de cada idioma en la
  seva llengua. Dins del menú de mòbil s'obre en el mateix lloc.
- **Camps dels formularis:** fons blanc amb vora (`--vora-camp` a `Reserva.module.css`), perquè el gris
  de l'escenari no es veia sobre el panell blanc.
- **Vídeos generats amb IA** (Higgsfield: Nano Banana 2.1 per als fotogrames clau i Kling 4.0 per
  als vídeos) a partir de les fotos reals de la Pinarello del client. No són gravacions: s'ha de dir
  al client. Els originals i les tires de control són a `recursos/ia/` (fora del repositori).
- **Rutes** (`src/components/rutes/`): mapa real amb MapLibre i teselles d'OpenFreeMap (sense
  clau). Els traçats els calcula BRouter sobre OpenStreetMap amb `node scripts/rutes.mjs`, que
  escriu `src/content/rutes.json`; la web no crida BRouter en temps d'execució. El worker de
  MapLibre es copia a `public/vendor/` abans de `dev` i `build` (`scripts/copia-maplibre-worker.mjs`).
- **Barra de scroll de l'inici** (`src/components/BarraBici.tsx`): la Pinarello de la flota baixa
  per la vora dreta i les rodes giren el que recorre. Les capes (`public/img/bici-scroll/`) les fa
  `python scripts/capes-bici.py public/img/flota/carretera.jpg public/img/bici-scroll 360` (Pillow i
  NumPy). Només amb ratolí i pantalla ≥ 1000 px; si no, la barra del navegador amb els colors.
- **Botiga d'equipament:** cada categoria té pàgina a `/[locale]/botiga/[categoria]`. Cada pàgina és la guia de la categoria
  (`src/content/guies/`, 24-11-2026): introducció, marques (porten a la fitxa), tipus, com triar-ne i preguntes freqüents.
  Les fonts de la recerca són al contingut però **no es publiquen**, i des del 25-11-2026 la pàgina ja no llista els
  articles de la plataforma («A la botiga»): les marques porten al detall. El que segueix d'articles val per a quan es
  torni a ensenyar el catàleg. Tecnibike de
  moment només fa lloguer i cites de taller, no ven en línia: es ve a la botiga o es truca (l'avís de dalt;
  des del 18-11-2026 els articles ja no porten «Reserva-ho per WhatsApp») i, quan es pugui vendre, cada
  article portarà la cistella. Els articles són els productes de venda de la plataforma
  (`saleProducts`, categoria pel nom: `categoriaVendaDe` a `remota/index.ts`); **el preu només surt si
  ve de la plataforma** (tancat, «des de» o a consultar), perquè l'equip de la botiga sàpiga que el que
  es veu és el que hi ha posat. Mentre no n'hi hagi cap d'una categoria, surten els de mostra, sense
  preu. Les fotos de les categories són de Wikimedia Commons, amb els crèdits al peu.
- **Bicis en venda** (`/[locale]/venda` i `/[locale]/venda/[id]`, 16-11-2026): el llistat i la fitxa
  de cada bici. Surten dels **productes de venda del catàleg de la plataforma** (`saleProducts`) d'una
  categoria de bicis («Bicicletes», «Bicis de segona mà»…: `esCategoriaBicis` a `remota/index.ts`), no
  de la flota de lloguer. La fitxa ensenya la foto, el preu (tancat, «des de» o a consultar, amb l'IVA),
  les variants (talles) amb el seu preu si és diferent, la descripció i la fitxa tècnica, que són els
  camps del catàleg tal com els escriu la botiga (`quadre`, `grup`, `any`…; `marca` va a dalt). Es
  demana amb un **formulari de contacte** (`ContacteVenda.tsx`: nom, telèfon, correu opcional, talla i
  missatge; l'equip truca), no per WhatsApp (18-11-2026). La petició és una **sol·licitud al panell de la botiga**
  (`POST /api/public/requests`, `kind: purchase`, contracte llegit a `remota/contracte-sollicituds.ts`), i
  l'equip en rep l'avís com d'una d'un agent. Fa servir la mateixa clau de la web, que ha de portar l'abast
  `web_request_write`. Si no el porta, la fitxa diu que truquin i no es desa res en memòria: la web ho mira
  (`contacteVendaEnLinia`) amb una crida sense `Idempotency-Key`, que no desa res (401 = no, 422 = sí), un
  cop cada 5 minuts. A producció, la primera petició de prova l'ha de fer l'Enric. Les bicis de mostra no porten ni una cosa ni l'altra. Mentre la botiga no n'hagi donat d'alta cap, surten quatre bicis **de mostra**
  (`bicisVenda` a `dades-prova.ts`, amb fotos de la flota) amb un avís ben visible i sense preu.
  Des de la plataforma v1.0.14 (16-11-2026) també porta si es pot comprar (`availability`: disponible,
  esgotada o per encàrrec), quantes n'hi ha (`stock`, de la bici i de cada talla; nul vol dir que no se'n
  porta el compte, no zero) i totes les fotos (`images`, la principal la primera), que la fitxa ensenya
  en una galeria (`Galeria.tsx`).
- **Selector «Lloguer | Compra»** (`SelectorLloguerCompra.tsx`, 16-11-2026): a dalt de la flota de
  l'inici i de les bicis en venda, on hi havia l'etiqueta de la secció. **A l'inici canvia la graella
  allà mateix** (l'Enric no volia que «Compra» portés a una altra pàgina): les targetes surten i entren
  amb la mateixa animació que en canviar de categoria, i a la compra no hi ha ni filtres ni tarifes.
  L'adreça se'n recorda (`#compra`), i en tornar enrere des d'una fitxa la graella és la que s'havia
  triat. En clicar una bici en venda, la foto creix fins a la fitxa (`<ViewTransition name="venda-<id>">`,
  com les de lloguer). A `/venda` són enllaços. Per petició de l'Enric, cap de les dues capçaleres porta
  descripció sota el títol.
- **Marques:** clicar una marca (carrusel de l'inici o tira d'una categoria) porta a `enllacMarca`: les
  de nutrició, al catàleg de nutrició filtrat (`?marca=`); la resta, a la seva fitxa
  `/[locale]/marques/[slug]` (`src/content/fitxes-marques.ts`: país, any, història, models destacats
  en quatre idiomes, i què se'n pot fer a Tecnibike). Recerca del 13-11-2026 a les webs oficials; els
  dubtes que en van quedar no s'han posat. Les fotos són de les webs de les marques
  (`public/img/marques/fitxes/`, amb la font al peu); Oakley i Shimano encara no en tenen (les webs
  tornaven 403) i pinten el logo. Una prova obliga que cada marca que no és de nutrició tingui fitxa.
- **On som:** mapa MapLibre de la botiga a la secció de visita (`src/components/visita/MapaBotiga.tsx`),
  que es carrega quan s'hi arriba, amb el botó «Com arribar-hi» a Google Maps.
- **Dades de mostra:** tot el que és inventat porta `ficticia: true` a les dades i un `*` a la
  pàgina, amb la nota al peu. Abans de publicar, cap d'aquestes dades pot quedar sense confirmar.

## Repositori i Vercel

- GitHub: `nertelai-art/tecnibike-web` (públic). Branques i fusions, com a servei-tecnic, perquè al
  graf (Fork) es vegi el flux:
  - **Cada feina, en una branca curta** des de `developer` (`feat/…`, `fix/…`, `docs/…`, `ci/…`),
    que hi entra amb un **merge commit** (`git merge --no-ff`, o PR fusionada amb `--merge`). Mai
    squash ni rebase.
  - **`main` és el que hi ha a producció.** A `main` no s'hi puja mai a mà: cada publicació és una
    **release**, que fa el flux **«Release a producció (developer → main)»**
    (`.github/workflows/promou-produccio.yml`) i que només llança l'usuari (Actions → Run workflow).
    Abans, la versió puja a `package.json` amb un commit `chore(release): vX.Y.Z` a `developer`. El
    flux comprova que el commit és de `developer`, que l'etiqueta és nova i que la previsualització de
    Vercel d'aquell commit ha acabat bé; llavors fusiona a `main` amb `--no-ff`
    («release: vX.Y.Z»), hi posa l'etiqueta `vX.Y.Z` i torna `developer` al mateix punt. No construeix
    res ni força res.
- Vercel: projecte `tecnibike-web` (equip nertelai-7298's projects), amb l'avatar TCNBK. URL:
  https://tecnibike-web.vercel.app. El primer desplegament (en importar, 23-10-2026) és de producció.
- **Producció = `main`.** Vercel desplega a producció cada canvi de `main` i fa previsualitzacions
  de `developer` (i de qualsevol altra branca). L'«Ignored Build Step» és «Automatic». Publicar a
  producció és, doncs, fer una release amb el flux, i només quan l’usuari ho digui, cada vegada.
  Configurat i provat el 11-11-2026: un push a `developer` fa una previsualització.
  (Fins al 11-11-2026 la branca de producció de Vercel era `developer` i es publicava canviant
  l'Ignored Build Step a mà; l'últim desplegament així va ser `5a635ac`.) Amb la clau de l'API de
  Vercel no es poden canviar els ajustos del projecte: es fa al tauler.

## Pendent abans de publicar

- Confirmar amb el client totes les dades marcades amb `*` (preus del taller, condicions de
  lloguer, models de la flota, rutes).
- Logo en vectors. Des del 24-11-2026 el logo és el ciclista de l'Instagram pintat del blau de TCNBK (`--blau`): a la
  barra (amb «Tecnibike» a sota), al favicon i a la foto del perfil de WhatsApp (`recursos/whatsapp-perfil.png`). Tot
  surt de `node scripts/logo-ciclista.mjs <png>`, a partir d'un PNG de 165 px: quan el client doni l'original en
  vectors, es torna a executar amb aquell. (El «TCNBK» gran del peu es queda.)
- Fotos originals de la botiga a bona resolució, i fotos de producte per a la botiga d'equipament.
  Les de les categories són de Wikimedia Commons amb crèdits al peu (`src/content/equipament.ts`):
  en canviar-les, treu-ne els crèdits.
- Logo bo de SiS (la web antiga hi tenia el de Shimano Index System; ara surt el nom en text).
- Pàgines legals pròpies (ara enllacen a les de la web antiga), galetes i 404 pròpia.
- Posar la clau de la botiga a Vercel (la connexió ja és feta i provada contra una API falsa, no
  contra la real) i els avisos per correu i WhatsApp. El mòdul de lloguer per
  unitats, el pagament i la signatura són feina de la plataforma (guia a `docs/`).
- Preus de la botiga i estoc de la nutrició, i ingredients i al·lèrgens si es ven en línia
  (Reglament UE 1169/2011; vegeu docs/nutricio-productes.md).
- Preus i estoc dels extres i pedals, festius que tanquen, fiança i política de cancel·lació.
- Validar amb el client les tres rutes proposades i ensenyar-li els vídeos generats amb IA.
