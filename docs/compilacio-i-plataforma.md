# La compilació i la plataforma Nertel

Nota del 16-11-2026, després que la plataforma (`app.nertel.ai`) s'alentís per culpa de les
compilacions d'aquesta web.

## Què va passar

Les dues previsualitzacions de Vercel de les 12:36 i les 12:43 (branca
`feat/rental-extras-and-bikes-for-sale`) van fer 593 crides a `GET /api/public/rental/catalog`
de producció en pocs minuts, a més de `settings` i `hours`. Cada crida fa unes 17 consultes a la base
de dades, i tota la plataforma es va alentir: les eines dels agents de veu van passar de 0,5 s a
12–16 s.

## Per què: a Vercel, la memòria de `fetch` no serveix durant la compilació

Les lectures del catàleg, l'horari i els ajustos porten `next: { revalidate: 300 }`. En local, Next
les guarda en fitxers i les ajunta: una compilació amb 12 bicis (177 pàgines) en fa **9** al catàleg.

A Vercel, no. Vercel hi posa el seu propi gestor de memòria («Applying modifyConfig from Vercel» als
registres), i durant la compilació no torna res: cada pàgina torna a la plataforma. El bloqueig de
Next per a una mateixa adreça només les posa en fila, una darrere l'altra a cada treballador. Els
registres de la compilació de les 12:36 ho diuen: 3 treballadors, 189 pàgines i **2,8 minuts**
generant pàgines, que és el que triguen ~300 crides d'1–2 s posades en fila de tres en tres. En local,
la mateixa generació dura 3 s.

Es reprodueix amb `node scripts/compta-crides-build.mjs --sense-cau`, que compila contra una
plataforma falsa en aquesta màquina, amb un gestor de memòria buit com el de Vercel:

| Lectures en una compilació (12 bicis, 177 pàgines) | Abans | Ara |
| -------------------------------------------------- | ----: | --: |
| `GET /catalog`                                     |    80 |   5 |
| `GET /hours`                                       |    48 |   3 |
| `GET /settings`                                    |    72 |   4 |

(A la branca de la PR #2 n'hi ha més, perquè hi ha més pàgines que llegeixen el catàleg: d'aquí
les ~300 per compilació.)

## Què s'hi ha fet

- **Una sola lectura per procés mentre es compila** (`compilant` a
  `src/lib/plataforma/remota/index.ts`). Amb `NEXT_PHASE=phase-production-build`, el catàleg,
  l'horari i els ajustos es demanen una vegada a cada procés de Next i serveixen per a totes les
  pàgines. Queda com a molt una lectura per treballador. No depèn de cap memòria de Next ni de
  Vercel.
- **Fora de la compilació**, les lectures simultànies d'un mateix procés esperen la mateixa resposta,
  i la següent torna a llegir com sempre (amb `revalidate: 300`). La disponibilitat, les reserves i
  les cites no es comparteixen mai: sempre en directe.
- **Les pàgines que llegeixen la plataforma diuen `export const revalidate = 300`.** Una pàgina que
  aprofita la lectura d'una altra no fa el seu `fetch`, i Next la donaria per estàtica per sempre. De
  fet, la portada ja quedava així abans d'aquest canvi: una foto o un preu canviat a la plataforma no
  hi arribava fins al desplegament següent. Una prova (`src/app/revalida.test.ts`) obliga que cada
  pàgina nova que llegeixi la plataforma ho digui.

## Les previsualitzacions haurien d'apuntar a la plataforma de producció?

**Decisió de l'Enric.** No s'ha canviat cap variable de Vercel. Aquesta sessió no les ha pogut ni
llistar (la clau de l'API de Vercel no en té permís): el que se'n sap és que les previsualitzacions
criden `app.nertel.ai`.

Avui, una previsualització fa servir la mateixa clau que producció. Això té dos costos:

1. **Càrrega.** Cada push a qualsevol branca compila contra producció. Amb aquest canvi, la
   compilació passa de centenars de lectures a unes quantes, però continua sent producció.
2. **Escriptura, que és el més delicat.** La clau porta `rental_write` i `web_booking_write`. Una
   reserva o una cita de prova feta en una previsualització és una reserva o una cita **de veritat** a
   l'agenda de Tecnibike, la mateixa que fan servir els agents de veu i WhatsApp.

Opcions, de menys a més feina:

| Opció | Què veu la previsualització | Què cal |
| ----- | --------------------------- | ------- |
| **A. Sense plataforma** | Les dades de proves (`dades-prova.ts`), no el catàleg real. Reserves en memòria; cites no, perquè el formulari demana que truquin. | Treure `PLATAFORMA_API_URL` i `PLATAFORMA_API_CLAU` de l'entorn *Preview* de Vercel. Cap canvi de codi. |
| **B. Producció, només lectura** (recomanada) | El catàleg, l'horari i les fotos reals. Reservar o demanar cita hi dona error. | Una clau nova de la botiga **només amb `rental_read`**, creada al panell de la plataforma, posada a *Preview*. La de producció, només a *Production*. A la plataforma, un límit de crides per clau. |
| **C. Una plataforma de proves** | Tot, amb dades de proves i sense tocar producció. | Una previsualització de `nertel-platform` amb una branca de Supabase i dades de Tecnibike. És la més aïllada, i la que més costa de mantenir. |

La B és la que fa servir una clau de lectura, que no pot crear res, i deixa veure a la
previsualització el que veurà el client. Amb una clau de només lectura, l'hora del taller no s'ensenya
(la web ja demana que truquin quan la plataforma no respon) i reservar una bici dona un error de la
plataforma. Per a una previsualització, n'hi ha prou.

Sigui quina sigui l'opció, a la plataforma ja hi ha una PR (`perf/rental-web-catalog-shared-read`)
perquè les crides simultànies per a la mateixa botiga comparteixin una sola lectura. Va bé com a
segona barrera.

## Com comprovar-ho

```bash
node scripts/compta-crides-build.mjs --sense-cau
```

Compila contra una plataforma falsa a `127.0.0.1` i compta les crides. Mai contra producció: les
variables `PLATAFORMA_*` de la compilació apunten al servidor fals i manen sobre qualsevol
`.env.local`. `--webpack` compila com `pnpm build:local`; `--bicis` i `--retard` canvien la mida del
catàleg i el temps de resposta.
