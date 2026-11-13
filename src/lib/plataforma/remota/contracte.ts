// GENERAT per scripts/sincronitza-contracte.mjs a partir de nertel-platform
// (src/core/schemas/rental-api.ts). No s'edita a mà: es torna a generar quan canvia el contracte.
// eslint-disable
import { z } from "zod";

/**
 * # El contracte del lloguer per unitats (docs/103 §5)
 *
 * El que envia qui reserva —la web d'una botiga, i més endavant el panell i els
 * agents— i el que torna la plataforma. Serveix per a qualsevol flota (bicis,
 * caiacs, cotxes, vaixells): cap nom no és d'una flota concreta.
 *
 * ## Les regles
 *
 * - **Imports en cèntims**, enters.
 * - **Dates `YYYY-MM-DD` i hores `HH:MM` locals** del negoci. La plataforma les
 *   passa a instant amb el fus del client (o `Europe/Madrid`), i les respostes
 *   diuen el fus (`timeZone`).
 * - **Els identificadors són els de la plataforma** (`uuid`): un model és un
 *   producte de lloguer del catàleg; una opció, un producte d'una categoria
 *   d'opcions (pedals, casc). La variant és un text (la talla: `"54"`, `"M"`).
 * - **Codis d'error estables, en anglès**, amb el camp que falla (`field`) quan
 *   n'hi ha: vegeu `RENTAL_ERROR_CODES`.
 */

// ── Les peces ───────────────────────────────────────────────────────────────

/** Un dia local: `2026-11-02`. */
export const RentalLocalDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La data ha de ser AAAA-MM-DD.");

/** Una hora local, de rellotge de 24 hores: `09:00`. */
export const RentalLocalTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "L'hora ha de ser HH:MM.");

/** Un moment local: el dia i l'hora, a l'hora del negoci. */
export const RentalMomentSchema = z.object({
  /** El dia, `YYYY-MM-DD`. */
  date: RentalLocalDateSchema,
  /** L'hora, `HH:MM`. Ha de caure al pas del negoci (cada 30 minuts, per defecte). */
  time: RentalLocalTimeSchema,
});
export type RentalMoment = z.infer<typeof RentalMomentSchema>;

/** Una variant (la talla): un text curt, o res si el model no en té. */
const VariantSchema = z
  .string()
  .trim()
  .max(40)
  .nullish()
  .transform((value) => (value ? value : null));

/** Una opció triada per a una unitat. */
export const RentalOptionChoiceSchema = z.object({
  /** L'opció: un producte d'una categoria d'opcions del catàleg (`GET /catalog`, `options[].id`). */
  optionId: z.string().uuid(),
  /** La variant de l'opció (un casc M), si l'opció en té. Si no, res. */
  variant: VariantSchema,
});
export type RentalOptionChoice = z.infer<typeof RentalOptionChoiceSchema>;

/** Qui farà servir la unitat. Tot és opcional: ajuda la botiga a preparar-la. */
export const RentalRiderSchema = z.object({
  /** El nom, com el diu el client. */
  name: z.string().trim().max(80).optional(),
  /** L'alçada de la persona, en centímetres. */
  heightCm: z.number().int().min(50).max(250).optional(),
  /** L'alçada del seient, en centímetres, si la sap. */
  saddleHeightCm: z.number().int().min(30).max(150).optional(),
});
export type RentalRider = z.infer<typeof RentalRiderSchema>;

/** Una unitat que es vol llogar: un model, la seva variant i les seves opcions. */
export const RentalItemSchema = z.object({
  /** El model: un producte de lloguer del catàleg (`GET /catalog`, `models[].id`). */
  modelId: z.string().uuid(),
  /** La variant (la talla), si el model en té. Si no, res. */
  variant: VariantSchema,
  /**
   * Les opcions d'aquesta unitat, una per grup com a molt (diverses d'un grup
   * `multiple`, cadascuna una vegada). Si un grup és obligatori (`required`),
   * n'hi ha d'haver una d'aquell grup.
   */
  options: z.array(RentalOptionChoiceSchema).max(10).default([]),
  /** Qui la farà servir. */
  rider: RentalRiderSchema.optional(),
});
export type RentalItem = z.infer<typeof RentalItemSchema>;

/** El màxim d'unitats d'una sola reserva. */
export const RENTAL_MAX_ITEMS = 20;

/**
 * Una línia de botiga que va amb el lloguer (docs/149 §5.4): un article de `GET /catalog`
 * (`shopItems[].variants[].id`) i quantes en vol. És de la reserva sencera, no d'una unitat. **El preu
 * no s'envia mai**: el posa el servidor. Com a molt `maxPerLine` per línia (10, per defecte).
 */
export const RentalShopItemLineSchema = z.object({
  /** La variant (el sabor), o el producte si no en té: `shopItems[].variants[].id`. */
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
});
export type RentalShopItemLine = z.infer<typeof RentalShopItemLineSchema>;

/** El màxim de línies de botiga d'una reserva. */
export const RENTAL_MAX_SHOP_LINES = 20;

// ── El cos d'un pressupost i d'una reserva ──────────────────────────────────

/**
 * El cos de `POST /quotes`: el preu d'un lloguer, sense reservar res.
 */
export const RentalQuoteRequestSchema = z.object({
  /** Quan es recull, a l'hora del negoci. */
  pickup: RentalMomentSchema,
  /** Quan es torna, a l'hora del negoci. Després de la recollida. */
  return: RentalMomentSchema,
  /** Les unitats, d'una a vint. Dues bicis iguals són dos elements. */
  items: z.array(RentalItemSchema).min(1).max(RENTAL_MAX_ITEMS),
  /**
   * El que s'hi afegeix de botiga (docs/149): de 0 a 20 línies. Opcional: sense, la reserva és la
   * d'abans. La mateixa variant dues vegades és `invalid_request`; si la botiga no ven res amb el
   * lloguer (`GET /settings` → `shopItemsEnabled`), `not_enabled`.
   */
  // Opcional i sense valor per defecte: l'empremta d'idempotència d'un cos que no en porta ha de
  // ser la d'abans (`requestFingerprint`), o un reintent d'una reserva vella faria conflicte.
  shopItems: z.array(RentalShopItemLineSchema).max(RENTAL_MAX_SHOP_LINES).optional(),
});
export type RentalQuoteRequest = z.infer<typeof RentalQuoteRequestSchema>;

/** Qui reserva. */
export const RentalCustomerSchema = z
  .object({
    /** El nom de qui reserva. */
    name: z.string().trim().min(1).max(120),
    /** El telèfon, amb prefix si és de fora (`+34600000000`). Cal el telèfon o el correu. */
    phone: z.string().trim().max(40).optional(),
    /** El correu. Cal el telèfon o el correu. */
    email: z.string().trim().email().max(254).optional(),
    /** La llengua en què vol que li parlin: `ca`, `es`, `en`, `fr`… (ISO 639-1). */
    language: z
      .string()
      .trim()
      .regex(/^[a-z]{2}$/, "La llengua és un codi de dues lletres: ca, es, en…")
      .optional(),
  })
  .refine((customer) => Boolean(customer.phone || customer.email), {
    path: ["phone"],
    message: "Cal el telèfon o el correu.",
  });
export type RentalCustomer = z.infer<typeof RentalCustomerSchema>;

/**
 * El cos de `POST /bookings`: el mateix que el pressupost, i qui reserva. Amb la
 * capçalera `Idempotency-Key`.
 */
export const RentalBookingRequestSchema = RentalQuoteRequestSchema.extend({
  /** Qui reserva. */
  customer: RentalCustomerSchema,
  /** El que el client vol dir a la botiga. */
  notes: z.string().trim().max(1000).optional(),
  /** Que ha acceptat la informació de privacitat de la botiga. Ha de ser `true`. */
  privacyAccepted: z.literal(true),
});
export type RentalBookingRequest = z.infer<typeof RentalBookingRequestSchema>;

// ── Els errors ──────────────────────────────────────────────────────────────

/**
 * Els codis d'error (docs/103 §5.1). Estables: la web els fa servir per decidir
 * què ensenya. Entre parèntesis, l'estat HTTP de les rutes `/api/public/rental/*`.
 *
 * Del que es demana:
 *
 * - `invalid_request` (400 si el cos no és JSON, 422 si no té la forma del
 *   contracte): `field` diu on. També sense la capçalera `Idempotency-Key`.
 * - `unknown_model` (422): el model no existeix, no és d'aquesta botiga o no es lloga.
 * - `unknown_variant` (422): el model no té aquesta variant, o en té i no se n'ha dit cap.
 * - `invalid_option` (422): una opció no existeix, no té preu, és repetida, n'hi
 *   ha dues del mateix grup o falta la d'un grup obligatori.
 * - `outside_hours` (422): la recollida o el retorn són fora de l'horari, en un
 *   dia tancat, en el passat, fora del pas, en ordre invers o massa lluny un de l'altre.
 * - `invalid_duration` (422): cap tarifa del model no admet aquesta durada.
 * - `sold_out` (409): no hi ha prou unitats d'algun model i variant, o d'alguna
 *   opció amb estoc, durant tot l'interval. En reservar pot passar encara que el
 *   pressupost hagi dit que sí: algú s'ha endut l'última.
 * - `idempotency_conflict` (409): la mateixa `Idempotency-Key` amb un cos diferent.
 * - `not_enabled` (409): aquesta botiga no té el lloguer activat.
 * - `hold_expired` (410): la retenció ha caducat o s'ha alliberat i ja no es pot
 *   fer servir; o, en alliberar-la, ja és un lloguer (L6).
 * - `not_found` (404): aquesta retenció no existeix o no és d'aquesta botiga (L6).
 * - `payment_mode_not_allowed` (409): la botiga no cobra així en línia (demana el
 *   senyal i la web demana el total, o al revés) (L7b). Si no cobra res en línia,
 *   `not_enabled`.
 * - `payment_required` (409): la botiga cobra en línia i no deixa pagar a la botiga:
 *   `POST /bookings` no hi serveix, cal retenir i pagar (docs/150 §3bis).
 * - `participants_mismatch`: de la peça de participants (L10); encara no surt.
 * - `unknown_shop_item` (422): una línia de botiga (`shopItems.N.variantId`) no existeix, no és
 *   d'aquesta botiga, està arxivada o no es ven amb el lloguer (docs/149 §5.5). Si no en queda prou
 *   d'una, `sold_out` amb `field: "shopItems.N.quantity"`.
 *
 * De la clau i del servei:
 *
 * - `unauthorized` (401): sense clau, amb una clau dolenta, revocada o caducada,
 *   o amb una clau sense cap abast de lloguer. Totes igual: distingir-les diria
 *   quines claus existeixen.
 * - `forbidden` (403): una clau bona de lloguer sense l'abast que cal (llegir,
 *   `rental_read`, o reservar, `rental_write`).
 * - `key_not_bound` (409): la clau és de tota l'organització; aquestes rutes en
 *   volen una de lligada a la botiga.
 * - `payload_too_large` (413), `rate_limited` (429, amb `Retry-After`),
 *   `unavailable` (503, amb `Retry-After`: torna-ho a provar) i `internal_error` (500).
 */
export const RENTAL_ERROR_CODES = [
  "invalid_request",
  "unknown_model",
  "unknown_variant",
  "sold_out",
  "invalid_option",
  "outside_hours",
  "invalid_duration",
  "not_enabled",
  "idempotency_conflict",
  "hold_expired",
  "participants_mismatch",
  "unauthorized",
  "forbidden",
  "key_not_bound",
  "payload_too_large",
  "rate_limited",
  "unavailable",
  "internal_error",
  "not_found",
  "payment_mode_not_allowed",
  "unknown_shop_item",
  "payment_required",
  "terms_outdated",
  "already_signed",
] as const;
export const RentalErrorCodeSchema = z.enum(RENTAL_ERROR_CODES);
export type RentalErrorCode = z.infer<typeof RentalErrorCodeSchema>;

/** L'estat HTTP de cada codi a les rutes `/api/public/rental/*`. */
export const RENTAL_ERROR_STATUS: Readonly<Record<RentalErrorCode, number>> = {
  invalid_request: 422,
  unknown_model: 422,
  unknown_variant: 422,
  invalid_option: 422,
  outside_hours: 422,
  invalid_duration: 422,
  sold_out: 409,
  idempotency_conflict: 409,
  not_enabled: 409,
  hold_expired: 410,
  participants_mismatch: 422,
  unauthorized: 401,
  forbidden: 403,
  key_not_bound: 409,
  payload_too_large: 413,
  rate_limited: 429,
  unavailable: 503,
  internal_error: 500,
  not_found: 404,
  payment_mode_not_allowed: 409,
  unknown_shop_item: 422,
  payment_required: 409,
  terms_outdated: 409,
  already_signed: 409,
};

/** Un error: el codi, el camp que falla si n'hi ha (`items.0.variant`) i una frase en català. */
export const RentalProblemSchema = z.object({
  /** Què ha passat. */
  code: RentalErrorCodeSchema,
  /** El camp que falla, amb punts: `pickup.time`, `items.1.options.0.optionId`, `Idempotency-Key`. */
  field: z.string().optional(),
  /** Per a qui llegeix els registres. La web hauria de decidir pel codi, no per la frase. */
  message: z.string(),
});
export type RentalProblem = z.infer<typeof RentalProblemSchema>;

/** El cos de qualsevol resposta d'error. */
export const RentalErrorResponseSchema = z.object({ error: RentalProblemSchema });
export type RentalErrorResponse = z.infer<typeof RentalErrorResponseSchema>;

// ── Les rutes (docs/103 §5.2) ───────────────────────────────────────────────
//
// Totes sota `/api/public/rental/`, **servidor a servidor**: la clau va a la
// capçalera `x-api-key` i no ha de sortir mai del servidor de la web. És una
// clau **lligada a la botiga**: la botiga surt de la clau, i cap cos ni cap
// paràmetre no la pot canviar. Llegir demana l'abast `rental_read`; reservar,
// `rental_write`.

/** Un tram d'horari, a l'hora del negoci. */
const OpenRangeSchema = z.object({
  /** Obre, `HH:MM`. */
  opensAt: RentalLocalTimeSchema,
  /** Tanca, `HH:MM` (`24:00` és mitjanit). */
  closesAt: z.string(),
});

/** `GET /hours`: quan es pot recollir i tornar. */
export const RentalHoursResponseSchema = z.object({
  /** El fus de totes les hores: `Europe/Madrid`. */
  timeZone: z.string(),
  /** El pas de les hores de recollida i retorn, en minuts. */
  slotMinutes: z.number().int(),
  /**
   * L'horari de cada setmana, fora dels períodes. `weekday`: 1 és dilluns i 7,
   * diumenge. Un dia sense trams és tancat.
   */
  weekly: z.array(OpenRangeSchema.extend({ weekday: z.number().int().min(1).max(7) })),
  /**
   * Els períodes d'horari que encara no han acabat (L2b): «Horari d'estiu», de
   * `startsOn` a `endsOn` (inclosos), amb la seva setmana. Aquells dies, la seva
   * setmana mana sobre `weekly`; un dia sense trams al període és tancat. No se
   * solapen. Per ordre de data.
   */
  periods: z.array(
    z.object({
      /** El nom que li ha posat la botiga: «Horari d'estiu». */
      name: z.string(),
      /** El primer dia, `YYYY-MM-DD`. */
      startsOn: RentalLocalDateSchema,
      /** L'últim dia, `YYYY-MM-DD`, inclòs. */
      endsOn: RentalLocalDateSchema,
      /** La setmana del període, com `weekly`. */
      weekly: z.array(OpenRangeSchema.extend({ weekday: z.number().int().min(1).max(7) })),
    }),
  ),
  /**
   * Els dies especials d'avui en endavant: tancat (`closed`) o amb uns altres
   * trams. Manen sobre l'horari de la setmana **i sobre els períodes**.
   */
  exceptions: z.array(
    z.object({
      /** El dia, `YYYY-MM-DD`. */
      date: RentalLocalDateSchema,
      /** Si és tancat tot el dia. */
      closed: z.boolean(),
      /** Si no és tancat, els trams d'aquell dia. */
      ranges: z.array(OpenRangeSchema),
      /** El motiu, si se n'ha escrit un: «Festa major». */
      note: z.string().nullable(),
    }),
  ),
});
export type RentalHoursResponse = z.infer<typeof RentalHoursResponseSchema>;

/** `GET /settings`: com funciona el lloguer d'aquesta botiga. */
export const RentalSettingsResponseSchema = z.object({
  /** El fus de totes les hores. */
  timeZone: z.string(),
  /** El pas de les hores de recollida i retorn, en minuts. */
  slotMinutes: z.number().int(),
  /** El lloguer més llarg, en dies de 24 hores. */
  maxDays: z.number().int(),
  /** Amb quanta antelació, com a mínim, es pot recollir, en minuts. */
  minNoticeMinutes: z.number().int(),
  /** El marge de preparació entre dos lloguers d'una unitat, en minuts, si el model no en té un de seu. */
  turnaroundMinutes: z.number().int(),
  /** Fins a quants minuts un lloguer és «mig dia», si el model en té tarifa. */
  halfDayMinutes: z.number().int(),
  /** Quants minuts guarda les unitats una retenció (`POST /holds`, L6): de 5 a 120. */
  holdMinutes: z.number().int(),
  /**
   * El pagament en línia (L7). **Sempre `false`**, per les webs que ja el llegeixen:
   * el que diu si es cobra en línia és `payment` (L7b).
   */
  paymentEnabled: z.literal(false),
  /**
   * Què es cobra en línia i la política de cancel·lació (L7b). Hi és a partir de la
   * L7b; una web feta abans no el llegeix i continua igual.
   *
   * - `mode`: `none` (es paga a la botiga, o la botiga no pot cobrar ara), `deposit`
   *   (un senyal de `depositPercent` %) o `full` (el total). És el `mode` que cal
   *   enviar a `POST /holds/{holdId}/checkout`.
   * - `cancellation`: fins a quantes hores abans de la recollida es cancel·la a
   *   temps, i quin percentatge del pagat es torna a temps i fora de termini. La
   *   devolució la fa una persona de la botiga: aquí no es torna res sol.
   */
  payment: z
    .object({
      mode: z.enum(["none", "deposit", "full"]),
      depositPercent: z.number().int().min(1).max(99).nullable(),
      /**
       * Si es pot reservar sense pagar en línia: «Pagaré a la botiga» (docs/150 §3bis).
       * Sempre `true` amb `mode: "none"`. Amb `deposit` o `full`, la web ofereix les dues
       * opcions si és `true`: pagar ara (`POST /holds/{id}/checkout`) o a la botiga
       * (`POST /bookings`, que queda pendent amb la condició). Si és `false`, `POST
       * /bookings` respon `409 payment_required`.
       */
      payAtShop: z.boolean(),
      cancellation: z.object({
        noticeHours: z.number().int(),
        refundPercentInside: z.number().int(),
        refundPercentOutside: z.number().int(),
      }),
    })
    .optional(),
  /**
   * Els participants i la signatura (L10). **Sempre `false`**, per les webs d'abans: el que diu si la
   * web pot fer signar és `remoteSigning`.
   */
  participantsEnabled: z.literal(false),
  /**
   * Si la web pot fer signar les condicions (12/11/2026): la botiga té encès «Es pot signar des del
   * mòbil». Llavors `GET /terms` dona el text i `POST /bookings/{reference}/participants` el signa.
   * Opcional perquè hi ha respostes d'abans.
   */
  remoteSigning: z.boolean().optional(),
  /**
   * Si la botiga ven articles amb el lloguer (`GET /catalog` → `shopItems`, docs/149 §5.1). Una web
   * feta abans no el llegeix i continua igual.
   */
  shopItemsEnabled: z.boolean(),
});
export type RentalSettingsResponse = z.infer<typeof RentalSettingsResponseSchema>;

/** Una tarifa d'un model. */
const RateSchema = z.object({
  /** La temporada (`seasons[].id`), o `null`: tot l'any. */
  seasonId: z.string().uuid().nullable(),
  /** Per què es cobra: `hour`, `half_day`, `day` o `week`. */
  unit: z.enum(["hour", "half_day", "day", "week"]),
  /** El tram: a partir de quantes unitats del lloguer sencer val aquest preu. */
  fromUnits: z.number().int(),
  /** El preu de cada unitat (cada dia, cada hora…), en cèntims. */
  priceCents: z.number().int(),
});

/** `GET /catalog`: què es lloga i què s'hi pot afegir. */
export const RentalCatalogResponseSchema = z.object({
  /** El fus de totes les hores. */
  timeZone: z.string(),
  /** La moneda de tots els imports: `EUR`. */
  currency: z.literal("EUR"),
  /** Els models: el que es tria per llogar. */
  models: z.array(
    z.object({
      /** L'identificador, el que va a `items[].modelId`. */
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      /** La foto del catàleg, una adreça pública. */
      imageUrl: z.string().nullable(),
      /**
       * Els atributs lliures del catàleg (quadre, grup, frens…), com els ha escrit la botiga. Els camps
       * del catàleg (*Catàleg → Camps*) hi van amb la seva clau, que és el nom en minúscules: un camp
       * «Elèctrica» de tipus «Sí o no» és `attributes["elèctrica"]`, `true` o `false` (docs/147 W-c).
       */
      attributes: z.record(z.string(), z.unknown()),
      /**
       * La referència del catàleg (13/11/2026, docs/147 W-b): un codi estable que tria la botiga
       * (`btt`, `e-urbana`), per traduir el nom a la web o fer-ne l'adreça. Nul si no en té.
       * Opcional perquè hi ha respostes d'abans.
       */
      sku: z.string().nullable().optional(),
      /** La categoria del catàleg (13/11/2026, W-c): «Muntanya», «Carretera»… Nul si no en té. Opcional, per les d'abans. */
      category: z.string().nullable().optional(),
      /**
       * L'ordre que li ha posat la botiga (13/11/2026, W-d): **els models ja surten en aquest ordre**,
       * primer els que en tenen, de més petit a més gran, i després la resta per nom. Nul si no en té.
       * Opcional, per les d'abans.
       */
      position: z.number().int().nullable().optional(),
      /** Les variants que es poden triar (les talles). Buit: no en té, i `variant` va buit. */
      variants: z.array(z.string()),
      /** Les tarifes. El preu d'un lloguer el dona `POST /quotes`: no cal calcular-lo a la web. */
      rates: z.array(RateSchema),
      /** El marge de preparació d'aquest model, en minuts: ja és dins de la disponibilitat. */
      turnaroundMinutes: z.number().int(),
    }),
  ),
  /**
   * Els grups d'opcions. Si `required`, cal triar-ne una per a cada unitat. Si `multiple` (13/11/2026,
   * docs/147 W-a), se'n poden triar diverses per unitat, cadascuna una vegada (casc, cadenat i
   * alforges alhora); si no, una com a molt. `multiple` és opcional perquè hi ha respostes d'abans.
   */
  optionGroups: z.array(z.object({ id: z.string().uuid(), name: z.string(), required: z.boolean(), multiple: z.boolean().optional() })),
  /** Les opcions: el que s'afegeix a una unitat. Una per grup com a molt, llevat dels grups `multiple`. */
  options: z.array(
    z.object({
      /** L'identificador, el que va a `items[].options[].optionId`. */
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      /** La referència del catàleg (13/11/2026, W-b): `casc`, `pedals-spd`. Nul si no en té. Opcional, per les d'abans. */
      sku: z.string().nullable().optional(),
      /** El grup (`optionGroups[].id`). */
      groupId: z.string().uuid(),
      /** El preu, en cèntims. */
      priceCents: z.number().int(),
      /** Per què es cobra: `day` per dia, `hour` per hora, `week` per setmana; qualsevol altre, un cop per reserva. */
      priceUnit: z.string(),
      /** Si és d'estoc i s'esgota (`true`) o no té límit (`false`). */
      limited: z.boolean(),
      /** Les variants (les talles d'un casc). Buit: no en té. */
      variants: z.array(z.string()),
      /**
       * Quina mena d'extra és (12/11/2026): `option`, un servei que va amb cada unitat. A la web, el
       * mateix botó que un article: «Afegeix a la reserva». Opcional perquè hi ha webs d'abans.
       */
      kind: z.literal("option").optional(),
    }),
  ),
  /**
   * Els articles de botiga que es venen amb el lloguer (docs/149 §5.2): els productes amb «Es ven amb
   * el lloguer» encès, actius i amb preu. Buit si la botiga no en ven. Cap camp no és de nutrició: la
   * marca, el format o els al·lèrgens són atributs que escriu la botiga.
   */
  shopItems: z.array(
    z.object({
      /** El producte. */
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      /** La categoria del catàleg, si en té. */
      category: z.string().nullable(),
      /** Els camps propis de la botiga, com els ha escrit. */
      attributes: z.record(z.string(), z.unknown()),
      /** El preu del producte, IVA inclòs, en cèntims. Una variant el pot canviar. */
      priceCents: z.number().int(),
      /** Com a molt quantes per línia. */
      maxPerLine: z.number().int(),
      /** Quina mena d'extra és (12/11/2026): `article`, es ven per unitat amb el lloguer. */
      kind: z.literal("article").optional(),
      /** Per què es cobra (12/11/2026): `unit`, per cada una. Com `options[].priceUnit`. */
      priceUnit: z.literal("unit").optional(),
      /**
       * Les variants (els sabors). **Sempre n'hi ha una com a mínim**: un producte sense variants en
       * surt amb una de sola, amb `label: null`. El seu `id` és el que va a `shopItems[].variantId`.
       */
      variants: z.array(
        z.object({
          id: z.string().uuid(),
          label: z.string().nullable(),
          /** Nul: el del producte. */
          priceCents: z.number().int().nullable(),
        }),
      ),
    }),
  ),
  /**
   * Els productes que la botiga ven (12/11/2026), per ensenyar-los a la web: els del catàleg de venda,
   * actius i que no són extres del lloguer. **No es poden afegir a una reserva**: per a això hi ha
   * `shopItems`. Opcional perquè hi ha respostes d'abans.
   */
  saleProducts: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().nullable(),
        imageUrl: z.string().nullable(),
        category: z.string().nullable(),
        attributes: z.record(z.string(), z.unknown()),
        /** En cèntims. Nul si és a consultar (`priceBasis: "on_request"`). */
        priceCents: z.number().int().nullable(),
        /** `exact` tancat, `from` «des de», `on_request` a consultar. */
        priceBasis: z.enum(["exact", "from", "on_request"]),
        /** Si el preu porta l'IVA. */
        vatIncluded: z.boolean(),
        /**
         * Com en diu la botiga, de les variants (13/11/2026): «Talles», «Colors». Nul: no ho ha dit.
         * Opcional, per les respostes d'abans.
         */
        variantName: z.string().nullable().optional(),
        /**
         * Les variants (13/11/2026): talles, colors, sabors, en l'ordre de la botiga i sense les
         * arxivades. **Buit si el producte no en té.** Opcional, per les respostes d'abans.
         */
        variants: z
          .array(
            z.object({
              id: z.string().uuid(),
              label: z.string(),
              /** Nul: el del producte. */
              priceCents: z.number().int().nullable(),
              /** La referència de la variant, si en té. */
              sku: z.string().nullable(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
  /**
   * Els serveis que fa la botiga, com els del taller (12/11/2026): els del catàleg amb «Servei», actius.
   * Per al diàleg «Demana cita al taller» de la web; els agents llegeixen els mateixos. **Un servei
   * amb «No diguis el preu» surt amb `priceCents: null` i `priceHidden: true`**: la web no l'ha
   * d'ensenyar ni inventar. La peça de la bici, els dies que triga o qualsevol altra dada són
   * `attributes`, com els ha escrit la botiga (`peca`, `dies`). Opcional perquè hi ha respostes d'abans.
   */
  workshopServices: z
    .array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().nullable(),
        imageUrl: z.string().nullable(),
        category: z.string().nullable(),
        attributes: z.record(z.string(), z.unknown()),
        /** En cèntims. Nul si és a consultar o si la botiga no vol que es digui. */
        priceCents: z.number().int().nullable(),
        /** `exact` tancat, `from` «des de», `on_request` a consultar. Amb el preu amagat, `on_request`. */
        priceBasis: z.enum(["exact", "from", "on_request"]),
        /** Per què es cobra: `unit`, `hour`, `session`… com al catàleg. */
        priceUnit: z.string(),
        vatIncluded: z.boolean(),
        /** «No diguis el preu»: la botiga el té, però no es diu. */
        priceHidden: z.boolean(),
      }),
    )
    .optional(),
  /** Les temporades de les tarifes. Si se'n trepitgen dues, mana la de més prioritat. */
  seasons: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      /** El primer dia, `YYYY-MM-DD`, inclòs. */
      startsOn: RentalLocalDateSchema,
      /** L'últim dia, inclòs. */
      endsOn: RentalLocalDateSchema,
      priority: z.number().int(),
    }),
  ),
});
export type RentalCatalogResponse = z.infer<typeof RentalCatalogResponseSchema>;

/**
 * `GET /catalog?category=`: opcional (13/11/2026). Amb una categoria, `saleProducts` només porta els
 * productes d'aquella categoria del catàleg (sense majúscules ni accents); la resta de la resposta no
 * canvia. Sense, tots.
 */
export const RentalCatalogQuerySchema = z.object({
  category: z.string().trim().min(1).max(80).optional(),
});
export type RentalCatalogQuery = z.infer<typeof RentalCatalogQuerySchema>;

/**
 * `GET /availability`: els paràmetres de la consulta. `models`, opcional: els
 * models que interessen, separats per comes; sense, tots.
 *
 *     /api/public/rental/availability?pickupDate=2026-11-02&pickupTime=09:00&returnDate=2026-11-04&returnTime=19:00
 */
export const RentalAvailabilityQuerySchema = z.object({
  pickupDate: RentalLocalDateSchema,
  pickupTime: RentalLocalTimeSchema,
  returnDate: RentalLocalDateSchema,
  returnTime: RentalLocalTimeSchema,
  /** Els models (`models[].id`), separats per comes. */
  models: z
    .string()
    .optional()
    .transform((value) => (value ? value.split(",").map((id) => id.trim()).filter(Boolean) : []))
    .pipe(z.array(z.string().uuid()).max(100)),
});
export type RentalAvailabilityQuery = z.infer<typeof RentalAvailabilityQuerySchema>;

/** Les unitats lliures d'una variant durant tot l'interval. */
const FreeSchema = z.object({
  /** La variant, o `null` si no en té. */
  variant: z.string().nullable(),
  /** Quantes en queden lliures. D'una opció sense límit, `null`. */
  free: z.number().int().nullable(),
});

/** `GET /availability`: el que queda lliure, amb el marge de preparació ja descomptat. */
export const RentalAvailabilityResponseSchema = z.object({
  timeZone: z.string(),
  /** La recollida i el retorn, tal com s'han demanat. */
  pickup: RentalMomentSchema,
  return: RentalMomentSchema,
  models: z.array(z.object({ modelId: z.string().uuid(), variants: z.array(FreeSchema) })),
  options: z.array(z.object({ optionId: z.string().uuid(), variants: z.array(FreeSchema) })),
  /**
   * Quants en queden de cada article de botiga **ara** (docs/149 §5.3): no depèn de les dates.
   * `null`: no se'n porta el compte. Buit si la botiga no en ven.
   */
  shopItems: z.array(z.object({ variantId: z.string().uuid(), free: z.number().int().nullable() })),
});
export type RentalAvailabilityResponse = z.infer<typeof RentalAvailabilityResponseSchema>;

/** `POST /quotes`: el preu, unitat per unitat. No reserva res. */
export const RentalQuoteResponseSchema = z.object({
  timeZone: z.string(),
  currency: z.literal("EUR"),
  pickup: RentalMomentSchema,
  return: RentalMomentSchema,
  /** Quants dies de 24 hores des de la recollida. */
  days: z.number().int(),
  /** El total, en cèntims: el lloguer i la botiga. És el que es paga. */
  totalCents: z.number().int(),
  /** El lloguer: les unitats i les seves opcions. */
  rentalCents: z.number().int(),
  /** Els articles de botiga (`shopItems`). Zero si no n'hi ha. */
  shopCents: z.number().int(),
  /** Cada unitat, en el mateix ordre que `items`. */
  items: z.array(
    z.object({
      modelId: z.string().uuid(),
      variant: z.string().nullable(),
      /** El preu de la unitat sense les opcions. */
      priceCents: z.number().int(),
      options: z.array(z.object({ optionId: z.string().uuid(), variant: z.string().nullable(), priceCents: z.number().int() })),
      /** La unitat i les seves opcions. */
      totalCents: z.number().int(),
    }),
  ),
  /** Cada línia de botiga, en el mateix ordre que `shopItems`. */
  shopItems: z.array(
    z.object({
      variantId: z.string().uuid(),
      productId: z.string().uuid(),
      name: z.string(),
      label: z.string().nullable(),
      quantity: z.number().int(),
      unitPriceCents: z.number().int(),
      totalCents: z.number().int(),
    }),
  ),
});
export type RentalQuoteResponse = z.infer<typeof RentalQuoteResponseSchema>;

/**
 * `POST /bookings`: la reserva feta (`201`) o, amb la mateixa `Idempotency-Key`
 * i el mateix cos, la mateixa reserva (`200`).
 *
 * La capçalera **`Idempotency-Key`** és obligatòria: de 8 a 200 caràcters
 * (lletres, xifres, `-`, `_`, `.` i `:`), una per cada intent d'enviar el
 * formulari (no per cada clic). Amb un cos diferent, `409 idempotency_conflict`.
 */
export const RentalBookingResponseSchema = z.object({
  /** La referència curta, la que la botiga i la persona es diuen per telèfon: `6DB3FA`. */
  reference: z.string().regex(/^[0-9A-F]{6}$/),
  /**
   * L'estat de la reserva. En fer-la, sempre `pending`: la botiga la confirmarà, i es
   * paga a la botiga (fins a la L7). En un reintent, l'estat d'ara.
   */
  status: z.enum(["pending", "confirmed", "done", "cancelled", "no_show"]),
  /** El total, en cèntims: el lloguer i els articles de botiga (docs/149 §5.4). */
  totalCents: z.number().int(),
  currency: z.literal("EUR"),
  /**
   * El testimoni per consultar-la i, més endavant, registrar-hi els
   * participants. Desa'l al servidor de la web: la plataforma només en té el
   * hash i no el pot tornar a donar. **En un reintent amb la mateixa clau se'n
   * dona un de nou i l'anterior deixa de valer**: desa sempre l'últim.
   */
  accessToken: z.string().min(32),
  timeZone: z.string(),
  pickup: RentalMomentSchema,
  return: RentalMomentSchema,
});
export type RentalBookingResponse = z.infer<typeof RentalBookingResponseSchema>;

/** La capçalera `Idempotency-Key` d'un `POST /bookings`. */
export const IdempotencyKeySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9_.:-]{8,200}$/, "L'Idempotency-Key és de 8 a 200 caràcters: lletres, xifres, «-», «_», «.» o «:».");

// ── Les retencions (docs/103 §3.5, L6) ──────────────────────────────────────

/**
 * El cos de `POST /holds`: **el mateix que el de `POST /bookings`**, amb la
 * capçalera `Idempotency-Key`. Guarda les unitats `holdMinutes` minuts
 * (`GET /settings`) mentre es paga; després, o es converteix en lloguer (amb el
 * pagament, L7) o caduca sola i les unitats tornen a quedar lliures.
 */
export const RentalHoldRequestSchema = RentalBookingRequestSchema;
export type RentalHoldRequest = z.infer<typeof RentalHoldRequestSchema>;

/**
 * Una retenció: el que tornen `POST /holds` i `GET /holds/{holdId}`.
 *
 * - `active`: guarda les unitats fins a `expiresAt`.
 * - `expired`: ha passat `expiresAt` sense convertir-se. Les unitats ja són
 *   lliures, encara que ningú no l'hagi alliberada.
 * - `released`: s'ha alliberat (`DELETE /holds/{holdId}`).
 * - `converted`: ja és un lloguer; `booking` en diu la referència i l'estat.
 *
 * Una retenció es pot consultar fins a un dia després de caducar; després, `404`.
 */
export const RentalHoldSchema = z.object({
  /** L'identificador de la retenció, el que va a `/holds/{holdId}`. */
  holdId: z.string().uuid(),
  status: z.enum(["active", "expired", "released", "converted"]),
  /** Fins quan guarda les unitats: un instant ISO 8601 en UTC. */
  expiresAt: z.string(),
  /** El total, en cèntims: el lloguer i els articles de botiga (docs/149 §5.4). */
  totalCents: z.number().int(),
  /** El lloguer: les unitats i les seves opcions. */
  rentalCents: z.number().int(),
  /** Els articles de botiga que guarda la retenció. Zero si no n'hi ha. */
  shopCents: z.number().int(),
  currency: z.literal("EUR"),
  timeZone: z.string(),
  pickup: RentalMomentSchema,
  return: RentalMomentSchema,
  /** El lloguer que n'ha sortit, si ja s'ha convertit. */
  booking: z
    .object({
      reference: z.string().regex(/^[0-9A-F]{6}$/),
      status: z.enum(["pending", "confirmed", "done", "cancelled", "no_show"]),
    })
    .nullable(),
});
export type RentalHold = z.infer<typeof RentalHoldSchema>;

/**
 * `POST /holds`: la retenció feta (`201`) o, amb la mateixa `Idempotency-Key` i
 * el mateix cos, la mateixa retenció (`200`). Amb un cos diferent, `409
 * idempotency_conflict`; si no hi ha prou unitats, `409 sold_out`.
 *
 * `accessToken` és el testimoni de la reserva que en sortirà: com el de
 * `POST /bookings`, desa sempre l'últim (un reintent en dona un de nou).
 */
export const RentalHoldCreatedResponseSchema = RentalHoldSchema.extend({
  accessToken: z.string().min(32),
});
export type RentalHoldCreatedResponse = z.infer<typeof RentalHoldCreatedResponseSchema>;

// ── El pagament d'una retenció (L7b) ────────────────────────────────────────

/**
 * `POST /holds/{holdId}/checkout`: obrir la pàgina de pagament d'una retenció
 * activa. **L'import no s'envia**: el calcula el servidor amb la configuració de la
 * botiga i el total de la retenció.
 *
 * - `mode`: el de `GET /settings` → `payment.mode` (`deposit` o `full`). Un altre,
 *   `409 payment_mode_not_allowed`; si la botiga no cobra en línia, `409 not_enabled`.
 * - `returnUrl`: on torna qui paga, amb `nertel_checkout=success` o `cancel` afegit.
 *   Ha de ser d'una web de la botiga (els orígens que té desats); si no, `422
 *   invalid_request` amb `field: "returnUrl"`.
 *
 * En tornar, la web consulta `GET /holds/{holdId}`: quan el pagament ha arribat, la
 * retenció és `converted` i porta la referència del lloguer. Fins llavors és
 * `active` (obrir la pàgina allarga la retenció fins que caduca).
 */
export const RentalCheckoutRequestSchema = z
  .object({
    mode: z.enum(["deposit", "full"]),
    returnUrl: z.string().url().max(2000),
  })
  .strict();
export type RentalCheckoutRequest = z.infer<typeof RentalCheckoutRequestSchema>;

/** La pàgina de pagament (`201`), o la mateixa si ja n'hi havia una d'oberta (`200`). */
export const RentalCheckoutResponseSchema = z.object({
  /** On s'envia qui paga. */
  checkoutUrl: z.string().url(),
  /** Quan caduca la pàgina; la retenció dura uns minuts més. */
  expiresAt: z.string(),
  /** El que es cobra ara, en cèntims. */
  amountCents: z.number().int(),
  /**
   * El total de la reserva (el lloguer i els articles de botiga): la diferència es paga a la
   * botiga. Si la botiga no cobra en línia els articles (docs/149 D8), el que es cobra ara és només
   * del lloguer.
   */
  totalCents: z.number().int(),
  currency: z.literal("EUR"),
  mode: z.enum(["deposit", "full"]),
});
export type RentalCheckoutResponse = z.infer<typeof RentalCheckoutResponseSchema>;

/**
 * `GET /terms` (12/11/2026): les condicions vigents de la botiga, per ensenyar-les abans de signar.
 * `404 not_found` si encara no n'ha escrit cap. El `termsId` és el que va a `POST /bookings/{reference}
 * /participants`: si mentrestant n'hi ha una de nova, `409 terms_outdated`.
 */
export const RentalTermsResponseSchema = z.object({
  termsId: z.string().uuid(),
  version: z.number().int().positive(),
  body: z.string(),
});
export type RentalTermsResponse = z.infer<typeof RentalTermsResponseSchema>;

/**
 * `POST /bookings/{reference}/participants` (docs/103 §5.2, L10; 12/11/2026): qui farà servir les
 * bicis, qui signa, el traç de la signatura i l'acceptació. Amb la capçalera **`X-Booking-Token`**, el
 * testimoni que es va donar en reservar (`accessToken`): sense, o amb un que no és el darrer, `404`.
 *
 * - **Mai el document d'identitat**: només es demana a la botiga (docs/106 T5). El cos no el porta.
 * - El traç: una llista de traços, cadascun una llista de punts `[x, y]` en un llenç de 600 × 200.
 * - `201 { status: "signed" }`. `409 not_enabled` si la botiga no té encès «Es pot signar des del
 *   mòbil»; `409 already_signed`; `409 terms_outdated`; `422 participants_mismatch` si hi ha més
 *   persones que unitats; `409 not_enabled` també si el lloguer ja no és obert.
 */
const SignaturePointSchema = z.tuple([z.number().finite(), z.number().finite()]);
export const RentalParticipantsRequestSchema = z
  .object({
    termsId: z.string().uuid(),
    participants: z
      .array(z.object({ name: z.string().trim().min(2).max(120) }).strict())
      .min(1)
      .max(50),
    /** Quin dels participants signa, des de 0. */
    signerIndex: z.number().int().min(0).max(49),
    strokes: z.array(z.array(SignaturePointSchema).max(4000)).min(1).max(500),
    accepted: z.literal(true),
  })
  .strict();
export type RentalParticipantsRequest = z.infer<typeof RentalParticipantsRequestSchema>;

export const RentalParticipantsResponseSchema = z.object({ status: z.literal("signed") });
export type RentalParticipantsResponse = z.infer<typeof RentalParticipantsResponseSchema>;
