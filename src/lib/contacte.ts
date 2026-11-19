// Contacte de la botiga, en un sol lloc.

export const TELEFON = '+34972662951';
export const TELEFON_VISIBLE = '972 66 29 51';

/**
 * WhatsApp: el número de l'agent de WhatsApp de Nertel (el 872 43 99 96, el mateix que despenja la veu).
 * Tots els botons hi apunten sols: el del formulari del taller, el de la portada i el flotant.
 * Abans era el 658 90 94 55, el del botó de la web antiga.
 */
export const WHATSAPP = '34872439996';

export function enllacWhatsapp(missatge?: string): string {
  return missatge ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(missatge)}` : `https://wa.me/${WHATSAPP}`;
}
