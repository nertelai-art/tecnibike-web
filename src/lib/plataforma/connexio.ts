// La connexió amb la plataforma, de les variables d'entorn del servidor (mai `NEXT_PUBLIC_`; noms a
// .env.example). Una sola clau per a la web, lligada a la botiga, amb els abasts de lloguer
// (`rental_read`, `rental_write`) i de cites (`web_booking_read`, `web_booking_write`): la fa servir
// tant el lloguer com el taller. Una clau de cites a part (`PLATAFORMA_CITES_CLAU`) és opcional i, si
// hi és, mana per a les cites.

type Entorn = Readonly<Record<string, string | undefined>>;

export type Connexio = { url: string; clau: string; clauCites: string; serveiCita?: string };

/** La connexió, o `null` si falta l'adreça o la clau: llavors la web fa servir les dades de prova. */
export function connexioDe(entorn: Entorn): Connexio | null {
  const { PLATAFORMA_API_URL: url, PLATAFORMA_API_CLAU: clau, PLATAFORMA_CITES_CLAU: clauCites, PLATAFORMA_TALLER_SERVEI: serveiCita } = entorn;
  if (!url || !clau) return null;
  return { url, clau, clauCites: clauCites || clau, ...(serveiCita && { serveiCita }) };
}
