# Lloguer de bicis per unitats: guia per a la plataforma

**Per a:** l'agent de `nertel-platform` (i l'Enric, que decideix).
**De:** la web de Tecnibike (`nertelai-art/tecnibike-web`).
**Data:** 26-10-2026.

Això és una **proposta, no un contracte tancat**. Explica què necessita el client, què ja fa la web,
què hem vist en un competidor que ho fa bé i quin contracte d'API espera la web. Si la plataforma
té una manera millor de fer-ho, **replantejar-ho és benvingut**: la web s'adapta. L'únic que no
pot canviar és el principi: el negoci viu a la plataforma i la web només hi parla.

---

## 1. Resum en cinc línies

1. Tecnibike lloga unes **85 bicis** i vol reserves en línia de debò: dates i hores, talla, pedals,
   extres i diverses bicis en una reserva, amb **disponibilitat real per unitat**.
2. La plataforma avui no té lloguer per unitats, ni tarifes per durada o temporada, ni retenció
   d'estoc, ni pagament, ni API de reserves per a webs. Detall a la secció 4.
3. **La web ja ho té fet** contra una implementació de proves (`src/lib/plataforma/`). Quan la
   plataforma publiqui l'API, només canvia la implementació de dins d'aquesta carpeta.
4. Proposem que el **mòdul de lloguer sigui de la plataforma**, no un panell a la web. Així el
   veuen el panell de la botiga, l'agent de veu i el de WhatsApp. És l'opció A de l'anàlisi.
5. Hi ha tres peces que necessiten una decisió de la plataforma: la **passarel·la de pagament**, el
   **model d'unitats de flota** i la **signatura del contracte**.

---

## 2. Què demana el client (llista original, resumida)

| # | Requisit | Qui ho fa |
|---|---|---|
| 1 | Web orientada al lloguer, amb fitxa per model | Web ✅ fet |
| 2 | Reserva completa: dates i hores de recollida i retorn, model, talla, pedals, extres, diverses bicis | Web ✅ (formulari) · Plataforma (persistir-ho) |
| 3 | Disponibilitat per **unitat**, preus per **durada** i **temporada**, horaris, tancaments, **marge de preparació** | Plataforma |
| 4 | Pagament (senyal o total), registre de fiança, correu de confirmació | Plataforma (la web ja té el pas preparat i apagat) |
| 5 | Panell de botiga: calendari, reserves presencials i per telèfon, clients, estats, cancel·lacions, **bloquejar una bici per avaria** | Plataforma |
| 6 | Càrrega inicial de 85 bicis des d'un fitxer, configuració, proves i dues formacions | Plataforma (importador) · Nertel (formació) |
| 7 | **Retenir l'estoc mentre es paga** i alliberar-lo si caduca o falla | Plataforma (la web ja ho crida) |
| 8 | WhatsApp i trucada | Plataforma (agents) · Web (botó flotant ✅) |
| 9 | **QR per bici** per a sortides, retorns i incidències | Plataforma |
| 10 | Llista diària de preparació | Plataforma |
| 11 | Dades dels participants i **signatura simple** abans de lliurar | Plataforma (la web ja té el formulari preparat i apagat) |
| 12 | Estat i manteniment per bici (fotos, notes, historial, avisos per ús o per dies; la botiga valida si torna a estar disponible) | Plataforma |
| 13 | Seguiment del negoci: ocupació de la flota, ingressos de lloguer, rendiment per bici, reserves per canal | Plataforma |

---

## 3. El que hem vist a Sescapada (referència del client)

Sescapada (`sescapada.com/rentabike`) no té una reserva pròpia: incrusta **myR3nt**
(`embed.myr3nt.com/sescapada/...`), un SaaS de lloguer de bicis. El vam recórrer el 26-10-2026
fins al pas de dades, sense enviar res. És el llistó que el client té al cap.

**Flux en 5 passos** (l'estat va a la URL):

1. **Cerca:** oficina de recollida i de retorn, data i hora de cadascuna (cada 30 min, de 9:00 a
   18:30) i codi promocional. Botó «Buscar disponibilidad».
2. **Llistat:** «15 productos disponibles», segell «Stock actualizado». Cada model diu **quantes
   talles i quantes unitats** queden («3 tallas · 4 unidades») i el preu «Desde X €» per al període.
3. **Configuració** d'una bici:
   - **Talles en rajoles** amb les unitats de cadascuna («49 · 2 disponibles»).
   - **Alçada del seient** en cm amb − i +: «Si ya conoces tu medida puedes modificarla.
     Prepararemos la bicicleta con esta altura.»
   - Característiques de la talla (quadre, frens, grup).
   - **Extres en grups**: «pedal» **obligatori** (pedals propis, plataforma, Speedplay, Look Keo,
     SPD, SPD-SL) i «normal» opcional múltiple (assegurança, cadenat, casc). Cada extra té **foto,
     preu i estoc** («Stock: 13», «Stock: +15»).
   - Total estimat. No deixa continuar sense pedals.
4. **Cistella:** diverses bicis amb **les mateixes dates i oficina**, cadascuna amb la seva talla,
   alçada de seient i extres. Desglossament: bicis, extres i total.
5. **Dades del client:** nom, cognoms, DNI/NIF, correu, telèfon, adreça completa, comentaris,
   acceptació de condicions i clàusula de consentiment, i newsletter opcional. El pas 6 és el
   pagament, i no hi vam entrar.

**Preus que vam observar** (Tarmac SL8 Comp 105 Di2):

- 2 dies: 76 € (38 €/dia).
- 7 dies: 231 € (33 €/dia). Hi ha **trams per durada**.
- Els extres de 2 € a 2 dies passen a 7 € a 7 dies: es cobren **per dia** (1 €/dia).
- L'assegurança surt a 1,50 €/dia.
- Les unitats lliures de cada talla canvien amb les dates. L'estoc és **per dia**, no global.

**Què n'hem agafat per a Tecnibike:**

- Ho hem fet en una sola pantalla dins de la fitxa del model, no en 5 pàgines.
- Talla amb unitats, alçada del ciclista per suggerir-ne la talla i alçada del seient.
- Pedals obligatoris i extres amb foto, preu (per reserva o per dia) i estoc.
- Diverses bicis amb les mateixes dates i hores.

**Què no hem copiat (encara):**

- Oficines diferents per recollir i tornar: Tecnibike en té una.
- Codi promocional.
- DNI i adreça a la reserva: ho demanem als participants abans de recollir, no per reservar.
- Assegurança: falta saber si el client l'ofereix.

---

## 4. Què hi ha avui a la plataforma i què hi falta

Segons el que ens va explicar la sessió de `nertel-platform` (v0.60.1):

**Ja hi ha:**

- `conversation_outcomes` amb `kind = 'rental'`, i `POST /api/public/outcomes` amb clau `x-api-key`
  (docs/34 i docs/62).
- `client_request_types`: serveis amb preu.
- Taules de restaurant com a **recurs per unitat**, amb una restricció d'exclusió de Postgres que
  impedeix solapaments. És el patró que caldria per a les bicis.
- Calendari de cites, clients, estats.
- Catàleg de productes (CSV i PrestaShop) i comandes.
- Rutes públiques amb clau: `leads` (docs/29), `outcomes`, i catàleg, horaris i coneixement per
  als fluxos (docs/97 §11).

**Hi falta:**

- Flota per unitats.
- Tarifes per durada i per temporada.
- Marge de preparació entre lloguers.
- Retenció d'estoc.
- Passarel·la de pagament.
- API de reserves per a webs.
- QR, signatura, manteniment de flota i informes de lloguer.

---

## 5. Model de dades proposat

Noms orientatius en anglès, com el codi de la plataforma. **Adapteu-los al vostre esquema.**

```
rental_models        id, org_id, name, category (mountain|road|gravel|city), electric, image_url,
                     specs jsonb, active
rental_units         id, model_id, size, serial/frame_no, qr_code, status
                     (available|reserved|out|maintenance|retired), use_count, km?, notes
rental_tariffs       id, model_id, season_id?, min_days, max_days?, price_per_day_cents,
                     half_day_cents?            -- trams: 1 dia, 2–6, 7+…
rental_seasons       id, org_id, name, from_date, to_date          -- alta, mitjana, baixa
rental_extras        id, org_id, group (pedals|extras), name i18n, image_url, price_cents,
                     charge (per_booking|per_day), stock (null = sense límit), required_group?
shop_hours           org_id, weekday, opens, closes                -- diversos blocs per dia
shop_hours_periods   org_id, from_date, to_date, weekday, opens, closes   -- horari d'estiu…
shop_closures        org_id, date, reason
rental_settings      org_id, slot_minutes (30), pickup_margin_minutes (30), prep_minutes,
                     hold_minutes (15), max_days (30), deposit_percent, payment_modes[],
                     participants_required
rental_bookings      id, org_id, code (TB-XXXXXX), client_id, pickup_at, return_at,
                     status (held|pending_payment|confirmed|out|returned|cancelled|no_show),
                     origin (web|voice|whatsapp|manual), total_cents, paid_cents,
                     deposit_cents?, comments, hold_expires_at?
rental_booking_lines id, booking_id, model_id, size, unit_id?, pedals_extra_id, rider_name?,
                     rider_height_cm?, saddle_height_cm?, price_cents
rental_booking_line_extras  line_id, extra_id, price_cents
rental_participants  id, booking_id, line_id?, full_name, id_document, signature_png_url,
                     signed_at, terms_version
rental_unit_events   id, unit_id, kind (out|return|incident|maintenance|note), booking_id?,
                     photos[], notes, by_user, at
rental_maintenance_rules  model_id|unit_id, every_uses?, every_days?, message
payments             id, booking_id, provider, provider_ref, amount_cents, kind
                     (deposit|full|balance|refund), status, at
```

**Tipus, model i unitat (cal no barrejar-los):**

- **Tipus de bici:** el que tarifa el PDF de Tecnibike, com ara «E-bike rígida» o «Gravel». N'hi ha 10, i el preu va per tipus.
- **Model:** la bici concreta, com ara «Cannondale Trail Neo 4». Pot haver-n'hi diversos per tipus. Avui la web en mostra un per tipus, i és **inventat** (`ficticia: true`), perquè el client encara no ha donat la llista.
- **Unitat:** cada bici física, amb la seva talla i el seu QR.

A la web, `biciId` és el **tipus**, i a la fitxa no es tria model perquè encara no n'hi ha de reals. Si la flota real té diversos models per tipus amb el mateix preu, caldrà decidir si el client tria el model o només el tipus i la talla. `rental_tariffs` hauria de penjar del tipus, no del model.

**Decisions de model que us deixem:**

- **Unitat assignada quan?** Proposta: la reserva guarda model i talla; la unitat concreta
  s'assigna en preparar-la (llista del dia) o en llegir el QR a la sortida. La disponibilitat es
  calcula per model i talla comptant unitats `available`.
- **Solapaments:** amb una restricció d'exclusió sobre `tstzrange(pickup_at, return_at + prep)` per
  unitat, com les taules del restaurant, o comptant per model i talla. Vosaltres sabreu què encaixa
  millor amb el que ja teniu.
- **Bloqueig per avaria:** una unitat en `maintenance` no compta. Si tenia reserves, el panell ha
  d'avisar.

---

## 6. El contracte que la web espera

La web ja ho crida a través de la interfície `Plataforma` (`src/lib/plataforma/index.ts`). Els
esquemes exactes, amb Zod, són a `src/lib/plataforma/esquema.ts`, i els tipus en deriven.
**Si publiqueu OpenAPI o Zod, la web genera els tipus a partir del vostre esquema** i el seu
desapareix.

Convencions que hem suposat:

- **Autenticació:** `x-api-key` per organització, **sempre des del servidor** de la web. Mai al
  navegador.
- **Imports en cèntims d'euro**, sempre enters.
- **Dates** com a `AAAA-MM-DD` i **hores** com a `HH:MM`, en hora local de la botiga
  (Europe/Madrid). El lloguer és «el dia 12 a les 9:00», no un instant UTC.
- **Errors amb codi estable** (vegeu la taula de sota) i, si es pot, el camp que falla.
- **Idempotència:** capçalera `Idempotency-Key` als POST de reserva i retenció, perquè un doble
  clic no faci dues reserves.

| Mètode de la web | Crida proposada | Resposta |
|---|---|---|
| `flota()` / `bici(id)` | `GET /api/public/rental/models` | models amb talles, imatge, tarifa i `ficticia` |
| `extres()` | `GET /api/public/rental/extras` | `[{ id, grup: 'pedals'\|'extres', imatge, preu, cobrament: 'perReserva'\|'perDia', estoc }]` |
| `horari()` | `GET /api/public/hours` (potser ja existeix als fluxos, docs/97) | `{ setmana: Bloc[][7], periodes, tancats, pasMinuts }` |
| `configuracioReserves()` | `GET /api/public/rental/settings` | `{ pagament: { actiu, modalitats, senyalPercent }, participants: { actiu }, retencioMinuts }` |
| `disponibilitat(des, fins, ids)` | `GET /api/public/rental/availability?from=&to=&models=` | `{ bicis: { [model]: { [talla]: n } }, extres: { [id]: n\|null } }`: el mínim de cada dia del període |
| `crearReservaLloguer(r)` | `POST /api/public/rental/bookings` | `{ codi, totalCentims }` |
| `retenirReserva(r)` | `POST /api/public/rental/holds` | `{ id, caducaA, totalCentims }` |
| `alliberarRetencio(id)` | `DELETE /api/public/rental/holds/:id` | 204 |
| `iniciarPagament(id, modalitat, tornada)` | `POST /api/public/rental/holds/:id/payment` | `{ url }` de la passarel·la (Redsys/Stripe…) |
| `registrarParticipants(p)` | `POST /api/public/rental/bookings/:code/participants` | 204 |

**Cos de la reserva** (el mateix per a `bookings` i `holds`):

```json
{
  "recollida": { "dia": "2026-11-02", "hora": "09:00" },
  "retorn": { "dia": "2026-11-04", "hora": "19:00" },
  "bicis": [
    {
      "biciId": "carretera",
      "talla": "54",
      "pedals": "pedals-spdSl",
      "extres": ["casc", "comptaquilometres"],
      "ciclista": { "nom": "Jordi", "alcadaCm": 178, "alcadaSeientCm": 74 }
    },
    {
      "biciId": "gravel",
      "talla": "L",
      "pedals": "pedals-plans",
      "extres": ["casc"],
      "ciclista": {}
    }
  ],
  "comentaris": "Arribem en cotxe cap a les 9",
  "nom": "Anna Puig",
  "telefon": "+34 600 000 000",
  "correu": "anna@example.com",
  "idioma": "ca",
  "privacitat": true
}
```

**Codis d'error que la web ja sap mostrar:**

| Codi | Quan |
|---|---|
| `bici` | El model no existeix |
| `talla` | El model no té aquesta talla |
| `esgotat` | No queden prou unitats d'algun model i talla per a algun dia del període |
| `extra` | Un pedal o un extra no existeix, no és del seu grup, està repetit o no en queda |
| `franja` | La recollida o el retorn cauen fora de l'horari, en un dia tancat, en el passat, en ordre invers o passen del màxim de dies |
| `durada` | La tarifa no admet aquesta durada (p. ex. mig dia en una bici que no en té) |
| `noDisponible` | El pagament o els participants no estan activats |
| `participants` | La reserva no existeix o hi ha més participants que bicis |

**Pagament, el flux que la web ja té preparat:**

1. Si `configuracioReserves().pagament.actiu`, la web crida `holds`. La plataforma guarda
   unitats i extres `retencioMinuts` minuts.
2. La web crida `holds/:id/payment` amb la modalitat (`senyal` o `total`) i l'adreça de tornada
   `https://<domini>/<idioma>/reserva/pagament`. La plataforma torna l'adreça de la passarel·la i
   la web hi redirigeix.
3. La passarel·la avisa la plataforma per webhook. La plataforma converteix la retenció en reserva
   `confirmed` i envia el correu i el WhatsApp de confirmació.
4. Si la retenció caduca o el pagament falla, les unitats tornen a quedar lliures soles.
5. Si no es pot iniciar el pagament, la web allibera la retenció de seguida.

**Pendent a la web quan hi hagi pagament:** la pàgina de tornada `/reserva/pagament`, que
consultarà l'estat de la retenció o de la reserva. Necessitarem `GET .../holds/:id` o
`GET .../bookings/:code`.

---

## 7. Regles de negoci (les que la web ja aplica a la implementació de proves)

Les funcions pures són a `src/lib/horari.ts`, `src/lib/preus.ts` i `src/lib/reserva.ts`, amb
proves. Són una bona especificació executable.

- **Graella d'hores:** cada `pasMinuts` (30) dins de cada bloc d'obertura.
  - Es **recull** fins a `pasMinuts` abans de tancar: amb l'horari de 9–13 i 16–20 h, de 9:00 a
    12:30 i de 16:00 a 19:30.
  - Es **torna** fins a l'hora de tancar: fins a les 13:00 i les 20:00.
- **Dies tancats:** diumenges, festius de `tancats` i el que digui el període especial, si n'hi ha.
- **Durada:** dies de calendari, el de recollida i el de retorn inclosos.
  - **Mig dia:** el mateix dia, 4 h o menys, i només si la tarifa en té.
  - **Màxim:** 30 dies.
- **Preu per bici:** preu del tram × dies, més extres. Els extres `perReserva` es cobren un cop i
  els `perDia`, per dia; en mig dia, un sol cop.
  - Trams actuals (PDF 2026): 1 dia, de 2 a 6 dies i més de 6. Un tram en blanc hereta el de
    l'anterior.
  - **Falta:** temporades i marge de preparació.
- **Estoc:** el mínim de cada dia del període. Les línies iguals d'una reserva se sumen, i les
  retencions vives també compten.
- **Retenció:** 15 minuts. Passat aquest temps, no compta.
- **Recalcular-ho tot al servidor.** El preu del navegador només orienta. La plataforma és qui
  mana.

---

## 8. Peces només de la plataforma

### Panell de la botiga

- **Calendari** per dies amb sortides i retorns. **Llista diària de preparació:** quines bicis,
  quina talla, quins pedals, quina alçada de seient i quins extres.
- **Reserves presencials i per telèfon** amb el mateix formulari i les mateixes regles
  (`origin = manual`). Els agents de veu i WhatsApp hi escriuen amb `origin = voice|whatsapp`.
- **Clients**, **estats** (de pendent a no presentat), **cancel·lacions** amb la seva política, i
  **reemborsaments**.
- **Bloquejar una unitat** per avaria o revisió, amb l'avís si tenia reserves.

### QR per bici

- Una etiqueta amb un QR per unitat, que obre la fitxa al mòbil del personal (amb sessió).
- Accions: **sortida** (assigna la unitat a la línia de reserva), **retorn** (amb fotos i notes) i
  **incidència**.

### Manteniment

- Historial per unitat: sortides, retorns, incidències, fotos i notes.
- Regles d'avís per **usos** o per **dies** («revisar frens cada 10 lloguers»).
- La unitat no torna a estar `available` fins que la botiga la valida.

### Participants i signatura

- Abans de lliurar la bici: nom i document de cada ciclista, acceptació de les condicions
  (versionades) i signatura en PNG.
- La web ja té el formulari (`Participants.tsx`) per fer-ho en línia després de reservar. També es
  podria fer a la botiga, en una tauleta, des del panell.
- **Cal decidir:** on es desa la signatura (emmagatzematge privat), quant de temps, i si n'hi ha
  prou amb una signatura simple o cal un proveïdor de signatura avançada.

### Informes

- Ocupació de la flota per dia i per model.
- Ingressos de lloguer.
- Rendiment per unitat: dies llogats, ingressos, incidències.
- Reserves per canal: web, veu, WhatsApp, botiga.

### Càrrega inicial (85 bicis)

Proposta de CSV, un fila per unitat. El client ens l'ha de donar.

```csv
model,categoria,electrica,talla,num_quadre,estat,notes
Cannondale Trail 5,muntanya,no,M,WTU123456,disponible,
Cannondale Trail 5,muntanya,no,L,WTU123457,disponible,
Pinarello X3 105,carretera,no,54,PX3-0042,disponible,seient nou 10/2026
```

Tarifes, temporades i extres en una pestanya o fitxer a part, o directament des del panell.

---

## 9. Què està fet a la web (per si voleu mirar el codi)

| Peça | Fitxer |
|---|---|
| Frontera i implementació de proves | `src/lib/plataforma/index.ts` |
| Esquemes del contracte (Zod) | `src/lib/plataforma/esquema.ts` |
| Dades de prova: flota, extres, horari, configuració | `src/lib/plataforma/dades-prova.ts` |
| Horari, graella i validació de franja | `src/lib/horari.ts` |
| Preus: trams, mig dia, extres per dia | `src/lib/preus.ts` |
| Accions de servidor, on es crida la plataforma | `src/app/[locale]/accions.ts` |
| Formulari: dates, bicis, extres, resum, pagament (apagat) | `src/components/reserva/ReservaLloguer.tsx`, `BiciDelCarro.tsx`, `Extres.tsx` |
| Participants i signatura (apagat) | `src/components/reserva/Participants.tsx`, `Signatura.tsx` |
| Proves | `src/lib/*.test.ts`, `src/lib/plataforma/index.test.ts` |

Quan hi hagi API, s'afegeix `crearPlataformaRemota({ url, clau })` al costat de
`crearPlataformaProva`, i `plataforma` passa a ser la remota. La resta de la web no canvia.

**Mentrestant:** la web pot enviar cada reserva a `POST /api/public/outcomes` com a
`kind = 'rental'`, perquè la botiga la vegi al panell encara que no reservi estoc. **No ho
connectem sense l'autorització explícita de l'usuari**: la web encara té dades de mostra.

---

## 10. Preguntes obertes

**Per a la plataforma (Enric):**

1. Mòdul de lloguer dins la plataforma (opció A), sí o no? Amb quin calendari?
2. Passarel·la: Redsys (la dels bancs d'aquí), Stripe o totes dues? Qui és el titular del
   comerç, el client o Nertel?
3. Unitats amb restricció d'exclusió (com les taules) o recompte per model i talla?
4. Signatura: simple en PNG o un proveïdor? On es desa?
5. Les rutes noves, sota `/api/public/rental/*` o a la família de `flows` (docs/97)?

**Per al client (Tecnibike):**

1. Fitxer de les 85 bicis: model, talla, número de quadre.
2. Temporades i preus per temporada, si en tenen.
3. Marge entre lloguers (p. ex. 1 h per revisar-la).
4. Preus i estoc dels extres i pedals. Avui són inventats i surten amb `*` a la web.
5. Fiança: quant, i si es cobra en línia o a la botiga.
6. Política de cancel·lació i de no presentar-se.
7. Festius que tanquen i horari d'estiu.
8. Assegurança: n'ofereixen?
