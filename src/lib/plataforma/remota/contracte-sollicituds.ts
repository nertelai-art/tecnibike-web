// El contracte de les sol·licituds des de la web (`POST /api/public/requests`): desa una sol·licitud al
// panell de la botiga, sense agent ni conversa, i l'equip en rep l'avís com d'una d'un agent. És a
// nertel-platform, a src/core/schemas/web-requests.ts, però aquell fitxer depèn d'altres esquemes de la
// plataforma i no es pot copiar sol: aquí hi ha **el que la web llegeix de les respostes**. El cos el
// construeix remota/index.ts i el comprova la plataforma (`.strict()`: un camp de més es rebutja).

import { z } from 'zod';

/** `201` nova, `200` la mateixa d'abans (la mateixa `Idempotency-Key` i el mateix cos). */
export const WebRequestResponseSchema = z.object({
  /** La referència curta, la que es pot dir per telèfon: `6DB3FA`. */
  reference: z.string(),
  status: z.enum(['pending', 'confirmed', 'done', 'cancelled', 'no_show']),
});

/** Els errors: `{ error: { code, field?, message } }`. Es decideix pel codi, no per la frase. */
export const WebRequestErrorResponseSchema = z.object({
  error: z.object({ code: z.string(), field: z.string().optional(), message: z.string() }),
});
