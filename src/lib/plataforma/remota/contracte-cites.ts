// El contracte de les cites des de la web (`/api/public/bookings`), el mateix que fan servir els
// agents de veu i WhatsApp. És a nertel-platform, a src/core/schemas/web-bookings.ts, però aquell
// fitxer depèn d'altres esquemes de la plataforma i no es pot copiar sol com el de lloguer: aquí només
// hi ha **el que la web llegeix de les respostes**, amb els mateixos noms i formes. Les peticions es
// construeixen al codi (remota/index.ts) i les comprova la plataforma. Si el contracte canvia, s'ha
// de tornar a mirar aquell fitxer.

import { z } from 'zod';

/** `GET /api/public/bookings/availability?service=&from=&to=`: les hores d'inici lliures, dia per dia. */
export const WebBookingAvailabilityResponseSchema = z.object({
  timeZone: z.string(),
  today: z.string(),
  service: z.object({
    /** La clau del servei, la que va a `service` en reservar. */
    key: z.string(),
    name: z.string(),
    durationMinutes: z.number().int().positive(),
    priceCents: z.number().int().nonnegative().optional(),
  }),
  days: z.array(z.object({ date: z.string(), closed: z.boolean(), times: z.array(z.string()) })),
});

/** `POST /api/public/bookings` (`201` nova, `200` la mateixa d'abans amb la mateixa `Idempotency-Key`). */
export const WebBookingResponseSchema = z.object({
  /** La referència curta, la que es pot dir per telèfon: `6DB3FA`. */
  reference: z.string(),
  status: z.enum(['pending', 'confirmed', 'done', 'cancelled', 'no_show']),
  /** Cert si el negoci l'ha de confirmar: no es dona per confirmada. */
  pendingConfirmation: z.boolean(),
  service: z.string(),
  date: z.string(),
  time: z.string(),
});

/** Els errors: `{ error: { code, field?, message } }`. La web decideix pel codi, no per la frase. */
export const WebBookingErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    field: z.string().optional(),
    message: z.string(),
  }),
});
