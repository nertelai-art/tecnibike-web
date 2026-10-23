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
  pot estar bloquejat). Previsualització: `.claude/launch.json` → `tecnibike-dev`.
- `pnpm check`: typecheck, lint i proves. És el que fa el hook de pre-push (`.githooks/`).
- `pnpm build:local`: build de producció amb webpack.

## Com està fet

- **Idiomes:** `ca` (per defecte), `es`, `en` i `fr`, a `src/messages/`. Una prova obliga que tots
  quatre tinguin les mateixes claus.
- **Plataforma Nertel (app.nertel.ai):** tot el negoci (flota, disponibilitat, taller, reserves)
  passa per `src/lib/plataforma/`. Avui només hi ha la implementació de proves (dades locals,
  reserves en memòria). La plataforma encara no té API pública per a webs; quan n'hi hagi, s'hi
  afegeix la implementació remota i la resta de la web no canvia. El nom del proveïdor no surt de
  `src/lib/plataforma/`.
- **Accions de servidor** (`src/app/[locale]/accions.ts`): tornen a validar-ho tot amb Zod i el
  preu el calcula la plataforma. El rellotge només entra aquí (`araABotiga`), en hora de Madrid.
- **Portada** (`src/components/Portada.tsx`): vídeo en bucle (`public/video/hero*.mp4`) d'un
  ciclista que passa per platja, poble, muntanya i costa.
- **Anatomia** (`src/components/anatomia/`), dins la secció de taller: sobre un fons de taller
  (`public/img/taller/fons-taller.webp`, generat amb IA), un vídeo lligat al scroll
  (`public/video/anatomia*.mp4`, component `ScrollVideo` de la skill `scroll-video`) on una bici
  real es desmunta peça a peça. Desmuntada, surten a l'atzar bàners amb fil que expliquen cada peça
  (es paren amb el ratolí a sobre). Un cop passada de llarg, queda fixa i no es repeteix. La línia de
  temps, les posicions finals i el triador de bàners són a `anatomia-fases.ts`, amb proves.
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
- Connexió real amb app.nertel.ai i els avisos per correu i WhatsApp.
- Validar amb el client les tres rutes proposades i ensenyar-li els vídeos generats amb IA.
