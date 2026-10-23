# Tecnibike — web nova

Web de Tecnibike Costa Brava (lloguer de bicis, taller i botiga a Sant Antoni de Calonge).
Encàrrec de client, no és una demo per a un lead: no porta el kit de demo.

Abans de tocar res, llegeix [docs/base-coneixement.md](docs/base-coneixement.md) (dades del
client) i [docs/proposta-web.md](docs/proposta-web.md) (decisions, disseny i integració).

## Pila

Next.js 16 (App Router) · React 19 · TypeScript · three.js + React Three Fiber · next-intl ·
Zod · Vitest. CSS propi amb CSS Modules (sense Tailwind). pnpm (versió a `packageManager`).

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
- **Escena 3D** (`src/components/anatomia/`): la bici es construeix per codi
  (`bici-geometria.ts`), sense models externs. three.js només es pot importar en aquesta carpeta
  (regla d'ESLint). Les fases són a `anatomia-fases.ts`, sense three.js, amb proves.
- **Dades de mostra:** tot el que és inventat porta `ficticia: true` a les dades i un `*` a la
  pàgina, amb la nota al peu. Abans de publicar, cap d'aquestes dades pot quedar sense confirmar.

## Pendent abans de publicar

- Confirmar amb el client totes les dades marcades amb `*` (preus del taller, condicions de
  lloguer, models de la flota, rutes).
- Logo en SVG (ara és text compost amb la tipografia del web) i decidir quin logo és el vigent:
  el blau TCNBK o el ciclista taronja de l'Instagram.
- Fotos originals de la botiga a bona resolució.
- Pàgines legals pròpies (ara enllacen a les de la web antiga), galetes i 404 pròpia.
- Connexió real amb app.nertel.ai i els avisos per correu i WhatsApp.
