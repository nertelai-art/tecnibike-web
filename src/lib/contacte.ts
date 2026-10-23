// Contacte de la botiga, en un sol lloc.

export const TELEFON = '+34972662951';
export const TELEFON_VISIBLE = '972 66 29 51';

/**
 * WhatsApp: ara és el número del botó de la web antiga. Quan l'agent de WhatsApp de Nertel estigui
 * en marxa, aquí hi va el seu número i tots els botons hi apunten sols.
 */
export const WHATSAPP = '34658909455';

export function enllacWhatsapp(missatge?: string): string {
  return missatge ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(missatge)}` : `https://wa.me/${WHATSAPP}`;
}
