# Tecnibike — proposta de web nova

Esborrany del 23-10-2026, abans de dissenyar. Parteix de
[base-coneixement.md](base-coneixement.md).

## Decisions preses (23-10-2026)

- **Idiomes:** català, castellà, anglès i francès.
- **Flota:** de moment, la que surt a la web d'ara (9 bicis, 10 tarifes del PDF).
- **Fotos:** les de la web i les reals de l'Instagram
  ([recursos/instagram](../recursos/instagram/README.md)).
- **La resta (preus del taller, condicions, models, rutes…): dades fictícies** perquè es
  vegi com queda. Al codi, cada dada fictícia porta la marca `ficticia: true` i un
  comentari, perquè no se'n publiqui cap per error.
- **Accent: el taronja `#F85A00`** del logo de l'Instagram (el ciclista), en lloc del
  llima de Scott. Surt del client, i amb el blau TCNBK fa parella de complementaris.

## Estat (23-10-2026, segona volta)

Fet i provat al navegador, amb dades de mostra:

- **Portada:** vídeo en bucle d'un ciclista amb la Pinarello que travessa la platja, un poble de
  pedra, la muntanya de les Gavarres i la costa, sense talls. Indicador de l'entorn que es veu.
- **Taller amb anatomia:** una bici real es desmunta peça a peça amb el scroll (rodes, frens,
  transmissió, direcció, seient i quadre). A cada aturada, una etiqueta assenyala la peça i la
  fitxa explica què fa, què hi guanyes si la millores, el servei de taller amb preu i els productes
  de la botiga per millorar-la, amb un enllaç a WhatsApp.
- **Rutes reals:** mapa de veritat (MapLibre + OpenFreeMap) amb tres traçats calculats per BRouter
  sobre OpenStreetMap, amb distància, desnivell i perfil d'alçada reals: volta per Romanyà
  (34,5 km, 383 m+), pistes de Fitor en gravel (42,6 km, 922 m+) i el Puig d'Arques en BTT
  (21,2 km, 638 m+).
- **Reserva de lloguer** i **cita al taller** com a la primera volta.
- **Idiomes:** català, castellà, anglès i francès.
- Portes: 54 proves, typecheck, lint i build de producció en verd.

Com s'han fet els vídeos (cost real: uns 70 crèdits de Higgsfield):

1. Fotogrames clau amb Nano Banana 2.1 a partir de les fotos de la Pinarello de l'Instagram.
2. Vídeos entre fotogrames amb Kling 4.0 (inici i final fixats), a 1080p.
3. Unió dels quatre trams del hero amb fosos de 0,3 s, i codificació amb ffmpeg: hero de 5 MB
   (escriptori) i 2,3 MB (mòbil); anatomia de 4 MB i 2,5 MB amb GOP curt per poder-la recórrer.

**Honestedat:** són imatges generades, no gravacions. El client ho ha de saber i ha de veure-les
abans de publicar. El model s'inventa detalls; s'han revisat fotograma a fotograma, però una
persona de la botiga hauria de mirar que la bici desmuntada no tingui res que un mecànic trobi
estrany.

No fet encara: connexió amb app.nertel.ai (no hi ha API), avisos per correu i WhatsApp,
pagament, botiga en línia, pàgines legals pròpies i logo en SVG.

## Estat (23-10-2026, tercera volta)

- **Taller:** l'anatomia va més suau i sura (més inèrcia, vídeo més petit que flota), amb índex de
  peces clicable i, sempre a la vista, «Demana cita» i «Parla per WhatsApp». La cita s'obre en un
  diàleg a la mateixa pàgina, amb la peça ja triada si es ve d'una fitxa.
- **Equipament:** secció nova amb cascs, ulleres, roba, sabates, nutrició i accessoris, les marques
  que en té la botiga i un enllaç a WhatsApp per preguntar talles i estoc. Les fotos són de
  Wikimedia Commons (CC BY i BY-SA), amb els crèdits a la mateixa secció; s'han de canviar per
  fotos de la botiga. Unsplash ja no deixa cercar sense clau i Openverse anava massa lent.
- **Marques:** carrusel que es passa amb fletxes, arrossegant o amb el dit, filtrable per bicis,
  components, equipament i nutrició. Logos en SVG de Wikimedia Commons (domini públic) i, per a la
  resta, els de la web antiga del client retallats. El logo de «SiS» de la web antiga era el de
  Shimano Index System: s'ha deixat el nom en text fins que hi hagi el bo.
- **Correccions:** el logo de la capçalera porta a dalt de tot (abans duia al peu), la columna
  dreta del detall de lloguer és la que fa scroll, i la barra de scroll té els colors de la web
  amb una bici vista des de dalt.
- Portes: 59 proves, typecheck, lint i build de producció en verd.

## Estat (23-10-2026, quarta volta)

- **Barra de scroll de l'inici:** en lloc de la icona, la Pinarello de la flota (foto real separada
  en quadre i rodes) baixa per la vora dreta i les rodes giren el que recorre. Es pot arrossegar.
- **Taller:** text i vídeo junts i centrats; el vídeo ja no sura sol i s'atura quan s'atura el
  scroll (menys inèrcia i vídeo amb fotogrames clau cada 3 fotogrames, sense salts). Les fitxes
  ensenyen les millors peces i les reparacions, sense preus ni descripcions. Botons de cita i
  WhatsApp grans. Fora la llista d'avantatges i la taula de preus.
- **Equipament:** cada targeta és un enllaç a la seva categoria de la botiga, amb els articles de
  la plataforma (ara de mostra) i reserva per WhatsApp, a punt per a la venda en línia.
- **Marques:** el carrusel passa sol i sense final, s'atura amb el ratolí, i en canviar de
  categoria les targetes surten i entren amb un fos.

## Estat (23-10-2026, cinquena volta)

- **Taller nou:** fons d'un taller de bicis (imatge generada amb IA; no és la botiga), la bici que es
  desmunta amb el scroll i, un cop desmuntada, bàners que surten a l'atzar d'una peça amb un fil i
  n'expliquen la qualitat; amb el ratolí a sobre es queden quiets. Botó de cita taronja i gran. Un
  cop vista, l'escena queda desmuntada i no es torna a reproduir.
- **WhatsApp:** fora del taller; ara és la icona flotant de sempre, a baix a la dreta de la landing.
- **Lloguer:** tota la targeta porta a la fitxa; en canviar de tipus de bici, sortida i entrada suaus.
- **Marques:** el carrusel ocupa tota l'amplada, sense el text d'ajuda.
- **Barra de la bici:** sense restes blanques (fons tret per zones, menys les lletres del quadre).

## 1. Objectiu

Que un ciclista **reservi una bici o una cita al taller en menys de dos minuts**, des del
mòbil i en el seu idioma, sense trucar.

- **Conversions:** reserva de lloguer confirmada i cita de taller confirmada. Com a
  secundàries: comprar o reservar un producte, demanar una ruta guiada i obrir el WhatsApp.
- **Les tres objeccions d'avui:** «no sé si hi haurà bici de la meva talla», «no sé quant
  em costarà» i «m'hauria de trucar en castellà».
- **Proves:** 4,3 ★ amb 123 ressenyes, més de 15 anys, les cinc marques de gamma alta i les
  bicis que lloguen, que són de botiga i no de flota de turistes.

## 2. Referència: Scott, fitxa de la Spark RC SL

El que n'agafem, i per què serveix aquí:

| Recurs de Scott | Ús a Tecnibike |
|---|---|
| Escenari gris molt clar (`#F5F5F5`) amb la bici enorme i res més | Fitxa de cada bici de lloguer i de botiga, i l'escena 3D de l'inici |
| Panell de compra enganxós a la dreta: etiqueta NEW, nom, una ratlla curta, preu, *key features*, color i talles en botons amb un punt de disponibilitat | **Panell de reserva**: talla amb punt verd, taronja o vermell segons la disponibilitat del dia, dates, pedals, accessoris, i el preu total que es recalcula a l'acte |
| Galeria «1/11» amb fletxes i pantalla completa | Galeria de cada model |
| Seccions plegables: especificacions, geometria, tecnologia, documents | Fitxa tècnica i taula de talles per alçada («fas 1,78 m? → talla L») |
| Carrusel «Matching Equipment» | «Afegeix a la reserva»: casc, cadenat, alforges… |
| Franja de color llampant amb avantatges («Devoluciones gratuitas…») | «Recollida a la botiga · Cancel·lació gratuita fins a 48 h · Casc inclòs» (**condicions PENDENTS**) |
| Navegació flotant blanca, molt neta | La mateixa idea, amb el botó «Reserva» sempre a la vista |

Tipografia de Scott: Alcyone (geomètrica, negreta) per als titulars i Open Sans per al text.
Color del text: `#020817`. Accent: llima `#E9FE45`.

**No copiem** ni la marca ni els colors de Scott: n'agafem el *sistema* (escenari, panell,
xips de talla, plegables), que és el que el client ha dit que li agrada.

## 3. Direcció visual (cinc línies, cadascuna amb d'on surt)

1. **Fons:** escenari clar `#F4F5F7` per als productes i grafit `#121417` per a les
   seccions d'impacte i el peu. *Origen:* l'escenari de Scott i la capçalera negra de la
   web actual de Tecnibike.
2. **Color de marca:** blau TCNBK `#6689C6`, mesurat al logo, per al logo, els titulars
   grans i les cotes de l'escena 3D. Per a text petit i botons es fa servir una versió
   fosca, `#3D5F9E`. *Per què:* `#6689C6` sobre blanc només arriba a un contrast de 3,5:1 i
   no serveix per a text normal; `#3D5F9E` arriba a 6,3:1.
3. **Accent:** taronja **`#F85A00`**, només per a l'etiqueta «Disponible» o «Nou», el punt
   de reserva i les línies de cota actives. *Origen:* el segon logo de Tecnibike, el ciclista
   taronja de l'Instagram. Sobre blanc arriba a 3,3:1, així que s'usa en formes i en text
   gran, mai en text petit.
4. **Tipografia:** **Archivo**, una sola família variable amb eix d'amplada. Titulars en
   condensada i molt negra, com «TCNBK»; text en amplada normal; xifres tabulars als preus.
   *Origen:* el logo és una pal sec condensada. Archivo no surt a cap de les últimes webs
   de Nertel (Calvet: Besley; Casamoner: Fraunces; Servei Tècnic: Poppins).
5. **Motiu gràfic:** línies de cota i de plànol tècnic, línies de crida amb el nom de cada
   peça i taules de geometria. *Origen:* el «TECNI» del nom, les taules de geometria dels
   fabricants i l'escena d'anatomia (vegeu el punt 5).

Pendent de validar amb el client. El logo es redibuixarà en SVG i es compararà superposat
amb el PNG.

## 4. Mapa de la web

```
/                      Inici
/lloguer               Flota per categories, tarifes i com funciona
/lloguer/[model]       Fitxa a l'estil Scott amb el panell de reserva
/taller                Serveis, preus orientatius i reserva de cita
/taller/reserva        Assistent de cita
/botiga                Catàleg (venut des de la plataforma)
/botiga/[producte]     Fitxa a l'estil Scott
/rutes                 Rutes per la Costa Brava, guies i viatges guiats per Europa
/nosaltres             Equip, botiga, coffee zone i marques
/contacte              Mapa, horari, WhatsApp i telèfon
/reserva/[codi]        Estat i gestió de la reserva (canviar o cancel·lar)
/legal/...             Avís legal, privacitat, galetes i condicions de lloguer
```

**Idiomes proposats:** català, castellà, anglès, alemany i francès, amb `/ca`, `/es`, `/en`,
`/de` i `/fr`. **PENDENT:** quins i en quin ordre.

## 5. Inici, secció per secció

| # | Secció | Contingut | Tècnica |
|---|---|---|---|
| 1 | **Primera pantalla** | Bici 3D muntada sobre l'escenari clar, girant a poc a poc. Titular de proposta: «Lloga-la. Repara-la. Roda la Costa Brava.» Dos botons: **Reserva una bici** (el principal) i **Demana cita al taller**. Prova: 4,3 ★ · 123 ressenyes · des del 2010 (**any PENDENT**). | 3D en temps real (`scroll-3d-scenes`) |
| 2 | **Anatomia d'una bici** (l'escena estrella) | En fer scroll, la bici s'**esbotza en peces**: quadre, forquilla i suspensió, rodes i pneumàtics, transmissió (plat, cassette, cadena, canvi), frens, manillar, seient i, a l'e-bike, motor i bateria. Cada peça surt amb la seva cota i **el servei de taller que li correspon** («Transmissió → ajust i substitució, des de X €»). En clicar una peça s'obre la cita amb aquell servei ja triat. | 3D lligat al scroll, amb línies de cota en SVG |
| 3 | **Tria la teva bici** | Pestanyes Muntanya, Carretera, Gravel, Passeig i E-bike. Targetes a l'estil Scott: bici sobre escenari, «des de 28 €/dia», talles disponibles avui. | CSS i `IntersectionObserver` |
| 4 | **Com funciona el lloguer** | 3 passos: tria bici i talla → tria dates → recull-la a la botiga, amb el casc ja ajustat. | Entrades discretes |
| 5 | **Taller** | Fons fosc. Llista de serveis amb preu orientatiu, «la tens a punt en X dies» i l'avís per WhatsApp quan està llesta. Coffee zone. | Comptadors i entrades |
| 6 | **Rutes per la Costa Brava** | 3 o 4 rutes de la zona (Gavarres, Camí de Ronda, Ardenya…) amb distància, desnivell i bici recomanada; guies i viatges per Europa. | Mapa estilitzat que es dibuixa en fer scroll (traç SVG) |
| 7 | **Marques** | Mur net de logos: Cannondale, Scott, Specialized, Pinarello, Colnago. Al darrere, una segona línia més petita de components, roba i nutrició. | Estàtic |
| 8 | **Ressenyes** | 3 ressenyes reals de Google amb la nota global. | Estàtic |
| 9 | **Preguntes freqüents** | Talles, pedals, fiança, cancel·lació, entrega a l'hotel, quant triga el taller… | `<details>`, amb dades `FAQPage` |
| 10 | **Vine a la botiga** | Mapa, horari, telèfon, WhatsApp i el mateix botó de reserva. | — |

Una sola escena forta (la 2) i la primera pantalla, que la prepara. La resta, entrades
discretes. Totes respecten `prefers-reduced-motion`: sense moviment, l'anatomia es mostra
com una imatge esbotzada estàtica amb les mateixes crides.

### Sobre el model 3D de la bici

Fer-la amb formes simples de three.js no donaria la qualitat d'una web de Pinarello i
Scott. Opcions, de més a menys recomanada:

1. **Un model GLB realista amb les peces separades** (de compra o amb llicència CC,
   Sketchfab / CGTrader), optimitzat amb Draco i en menys de 3 MB. Cada peça és un *mesh*
   amb nom, i l'esbotzat és moure-les per l'eix que toca. Són les millors garanties de
   qualitat i de temps.
2. Un model genèric que es repinta amb el blau TCNBK i no és de cap marca. Evita problemes
   de marca registrada si la bici s'assembla a un model concret.
3. Un model generat amb IA (Higgsfield 3D) a partir d'una foto de la flota. Ràpid, però
   difícilment queda separat en peces netes: serveix per a la primera pantalla, no per a
   l'anatomia.

## 6. Fluxos de reserva

### Lloguer (assistent de 4 passos, també dins del panell de la fitxa)

1. **Bici:** categoria → model. Elèctrica sí o no.
2. **Tu:** alçada → talla suggerida (XS–XL o 48–58 en carretera) · pedals (plans, SPD,
   SPD-SL, Look).
3. **Quan:** data de recollida i de retorn, o mig dia si el model ho permet · nombre de bicis
   (cada bici pot tenir la seva talla).
4. **Extres i dades:** casc, cadenat, cadira per a nadó, alforges, comptaquilòmetres, ruta
   guiada · nom, telèfon i correu · condicions · confirmació.

- **Preu en directe** amb els trams de la taula 2026 (1 dia / 2–6 / +6, i mig dia).
- **Disponibilitat real** per model, talla i dia (de la plataforma).
- Confirmació per correu i per WhatsApp, amb un enllaç per gestionar la reserva.
- **PENDENT:** pagament o senyal en línia, o pagar a la botiga.

### Cita al taller (assistent de 3 passos)

1. **Quina bici:** tipus (carretera, BTT, gravel, e-bike, urbana) i marca.
2. **Què li passa:** servei (revisió bàsica, posada a punt completa, punxada o tubeless,
   frens, transmissió, suspensió, diagnosi d'e-bike, «no ho sé, fa un soroll»). Es pot
   afegir una foto o una nota.
3. **Quan la portes:** franges de recepció segons l'horari de la botiga · dades ·
   confirmació. Avís per WhatsApp quan la bici està llesta.

## 7. Integració amb app.nertel.ai (les bases, ara)

La web **no ha de tenir dades pròpies de negoci**: el catàleg, la flota, la disponibilitat,
les cites, les reserves i les comandes viuen a la plataforma, la mateixa que faran servir
l'agent de veu i el de WhatsApp. Així, si l'agent reserva una bici per telèfon, la web la
veu ocupada.

Com ho deixem preparat des del primer dia:

- **Una frontera única** a `src/lib/plataforma/`, amb una interfície de domini
  (`llistaFlota`, `disponibilitat`, `crearReservaLloguer`, `crearCitaTaller`, `catàleg`,
  `crearComanda`). El nom del proveïdor només apareix aquí dins.
- **Dues implementacions:** una de proves, amb les dades de `base-coneixement.md` (tarifes
  2026 reals i flota d'exemple), per poder dissenyar i provar ara; i la de debò contra l'API
  de la plataforma, quan la connectem.
- **Tipus derivats de l'esquema** de la plataforma (OpenAPI o Zod), mai escrits a mà.
- **Les crides amb clau es fan al servidor** (Route Handlers o Server Actions). La clau
  de la plataforma no arriba mai al navegador.
- **Webhooks de tornada** (reserva creada per l'agent, bici llesta al taller) per refrescar
  la memòria cau i avisar.
- El **widget de veu i xat** de Nertel s'hi incrusta, i el botó de WhatsApp obre el número
  de l'agent.

### Què hi ha avui a la plataforma (`nertel-platform`, v0.56.0, revisat el 23-10-2026)

- **No hi ha cap API pública per a webs de client.** Les rutes `api/tools/<eina>/[agentId]`
  (`catalog`, `booking-availability`, `booking`, `booking-change`, `order`…) són per als
  agents. Van amb `x-api-key` per organització i esquemes Zod pensats per a un agent:
  el catàleg torna 10 resultats com a màxim per a una cerca de text.
- **El model de dades ja encaixa:**
  - Els productes tenen `offer` = `sale` | `rental` | `service`. Per tant, la flota de
    lloguer, la botiga i els serveis del taller poden viure a la mateixa taula, amb
    `attributes` (jsonb) per a les talles, els pedals i els trams de preu.
  - Les reserves són peticions amb inici i fi, amb places i franges per client.
- **Falta, i s'ha de fer a la plataforma:**
  - API de lectura per a webs: catàleg sencer, fitxa de producte i disponibilitat per
    model, talla i dates.
  - Escriptura des de la web: reserva de lloguer i cita, amb `origin = 'web'`, que avui
    la restricció de `orders` no admet (`manual`, `voice`, `whatsapp`).
  - Lloguer amb **estoc per unitat i per talla** al llarg de diversos dies (el model de
    reserves d'ara és de franges i places).
  - Pagaments: no n'hi ha cap a la plataforma.
- **Giny de veu:** ja existeix. Es posa amb una sola línia:
  `<script src="https://app.nertel.ai/api/public/voice/widget.js" data-key="wk_…" async>`.
  Requisits: la clau `wk_` (és pública), el domini a la llista d'orígens permesos i el
  mòdul `web_voice` al pla. Es pot obrir des d'un botó propi amb `data-nertel-open`.
  Guia: `nertel-platform/docs/46-giny-de-veu.md` §10.1.
- **Patró que es pot copiar:** `nertel-marketing-web` envia leads a `api/public/leads`
  des del servidor, amb clau i validació Zod.
- La plataforma mateixa ho apunta (`docs/51-top-sailing-charter.md`): el bon camí és que la
  web del client **llegeixi de Nertel**.

**Conseqüència:** comencem la web amb la implementació de proves de `src/lib/plataforma/`
i, en paral·lel, cal una feina a la plataforma: «API pública per a webs de client» (lectura
del catàleg, disponibilitat de lloguer per unitat, i reserves i comandes amb origen web).
Quan existeixi, només canvia la implementació de dins de la frontera.

## 8. Pila tècnica proposada

Next.js (App Router) amb TypeScript, Tailwind, three.js + React Three Fiber + drei per a
l'escena, i `next-intl` per als idiomes. Tot a l'última versió comprovada al registre el dia
que es creï el projecte. pnpm. Vercel amb previsualitzacions; producció només quan ho diguis.
Repositori `tecnibike` a GitHub, públic (web de client sense secrets), amb branca `developer`.

## 9. Preguntes per al client (a fer totes de cop)

1. Fotos i vídeos originals: botiga, taller, equip, flota (Google Maps i Instagram en tenen).
2. Flota exacta: models, talles i unitats de cadascuna.
3. Preus del taller i temps habituals.
4. Condicions de lloguer: fiança, document, cancel·lació, pagament en línia o a la botiga,
   entrega a l'hotel.
5. Botiga en línia amb enviament, o reservar i recollir?
6. Idiomes.
7. Scott: en són distribuïdors? El volen destacar?
8. Kit Digital: encara han de mostrar el bàner?
9. Any d'obertura (per al «des del…»).
10. Rutes guiades: preus, durada i nivells.
