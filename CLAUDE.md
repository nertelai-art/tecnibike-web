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
  llegir cada 5 minuts; la disponibilitat i les reserves, sempre en directe). Dues implementacions:
  - `remota/`: l'API de lloguer de la plataforma. S'activa amb `PLATAFORMA_API_URL` i
    `PLATAFORMA_API_CLAU` (només servidor, mai `NEXT_PUBLIC_`; noms a `.env.example`, valors a
    Vercel). La clau és de la botiga, amb els abasts `rental_read` i `rental_write`.
  - `proves.ts`: dades locals (`dades-prova.ts`) i reserves en memòria. És la que corre si falta
    qualsevol de les dues variables.

  El contracte de la plataforma (`remota/contracte.ts`) és generat: es copia del repositori de la
  plataforma amb `node scripts/sincronitza-contracte.mjs [camí]` i no es toca a mà. Taller, botiga,
  ressenyes i participants encara van per les dades de proves, perquè l'API no en té. Limitacions:
  el preu de la fitxa és orientatiu (mana el que torna la plataforma), només hi ha un grup obligatori (els pedals) i els noms de models i extres surten en un sol idioma.
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
- **Variants d'extres:** un extra pot tenir variants (la talla del casc), cadascuna amb el seu estoc.
  Un cop triat, la rajola demana quina; la plataforma les rep a `items[].options[].variant`.
- **Nutrició esportiva** (`src/components/nutricio/`, recerca a
  [docs/nutricio-productes.md](docs/nutricio-productes.md)). A la portada, després de Rutes, hi ha els
  quatre expositors de la botiga (Maurten, 226ERS, Nutrinovex i SiS). Pugen amb el scroll en CSS
  amb línia de temps de vista, cadascun amb els colors de la seva marca (`src/content/nutricio.ts`).
  Després ve l'explorador per marca i moment de la ruta. A la reserva, la nutrició és de la reserva
  sencera, no d'una bici: línies `{producteId, sabor, quantitat}`. Els sabors són variants amb estoc
  propi, i l'estoc es ven i no torna (no depèn de les dates). Està **apagada**
  (`configuracioReserves.nutricio.actiu`) a producció, a les previsualitzacions i amb la plataforma
  real: és feina nova fora del pressupost i l'ha de decidir l'Enric (coordinadora de la plataforma,
  11-11-2026). Només s'encén amb `pnpm dev` (`index.ts`), per ensenyar-la. Apagada, la portada
  demana la nutrició per WhatsApp i una reserva que en porti es rebutja. Si tira endavant, la
  plataforma provarà de reutilitzar el catàleg i les comandes que ja té (una reserva amb una comanda
  de botiga lligada, amb estoc per variant), i el contracte es tornarà a copiar. Els paquets són il·lustracions pròpies (`Paquet.tsx`): no són fotos
  ni dissenys de les marques. Abans de posar-hi fotos de producte cal decidir-ne l'origen (vegeu el
  document). Els preus són el PVP de la marca, no els de la botiga, i porten `*`.
- **WhatsApp:** icona flotant a baix a la dreta a tota la pàgina d'inici (`WhatsappFlotant.tsx`).
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
- **Botiga d'equipament:** la plataforma ja té `articles(categoria)` i cada categoria té pàgina a
  `/[locale]/botiga/[categoria]`. Ara es reserva per WhatsApp; quan es pugui vendre en línia, el botó
  es canvia per la cistella. Les fotos són de Wikimedia Commons, amb els crèdits al peu.
- **Dades de mostra:** tot el que és inventat porta `ficticia: true` a les dades i un `*` a la
  pàgina, amb la nota al peu. Abans de publicar, cap d'aquestes dades pot quedar sense confirmar.

## Repositori i Vercel

- GitHub: `nertelai-art/tecnibike-web` (públic). Només hi ha `developer`; a `main` s'hi arriba per
  promoció, mai a mà.
- Vercel: projecte `tecnibike-web` (equip nertelai-7298's projects), amb l'avatar TCNBK. URL:
  https://tecnibike-web.vercel.app. El primer desplegament (en importar, 23-10-2026) és de producció.
- **Cap push publica sol a producció:** Vercel encara té `developer` com a branca de producció (no
  accepta `main` fins que existeixi), i per això l'«Ignored Build Step» és «Only build
  pre-production». Quan existeixi `main`, cal posar-la com a branca de producció (Settings →
  Environments → Production) i tornar l'Ignored Build Step a «Automatic».
- **Publicar a producció** (només quan l'usuari ho digui, cada vegada): posar l'Ignored Build Step a
  «Automatic», crear el desplegament de producció del commit (API de Vercel, `target: production`) i,
  quan ja construeix, tornar-lo a «Only build pre-production». Últim: `4553481` (30-10-2026).

## Pendent abans de publicar

- Confirmar amb el client totes les dades marcades amb `*` (preus del taller, condicions de
  lloguer, models de la flota, rutes).
- Logo en SVG (ara és text compost amb la tipografia del web) i decidir quin logo és el vigent:
  el blau TCNBK o el ciclista taronja de l'Instagram.
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
