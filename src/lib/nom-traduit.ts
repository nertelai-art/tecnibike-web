// La traducció d'un nom del catàleg de la plataforma (vegeu claus-cataleg.ts), sense afegir-hi el que el
// nom original no deia: la traducció de «Poma verda (amb cafeïna)» porta la cafeïna entre parèntesis, i
// un sabor «Poma verda» de la botiga no l'ha de dir. Es pot fer servir al navegador (no porta missatges).

export function nomTraduit(traduccio: string, original: string): string {
  if (original.includes('(')) return traduccio;
  return traduccio.replace(/\s*\([^)]*\)/g, '').trim() || traduccio;
}

type Traductor = { (clau: string): string; has(clau: string): boolean };

/** El nom d'un extra en l'idioma de la pàgina: `t` és el de `reserva`. */
export function nomExtra(e: { id: string; nom?: string; clau?: string }, t: Traductor): string {
  if (e.clau && t.has(`extresNoms.${e.clau}`)) return nomTraduit(t(`extresNoms.${e.clau}`), e.nom ?? '');
  return e.nom ?? (t.has(`extresNoms.${e.id}`) ? t(`extresNoms.${e.id}`) : e.id);
}

/** El nom d'un grup d'extres de la plataforma en l'idioma de la pàgina: `t` és el de `reserva`. */
export function nomGrup(nom: string | undefined, clau: string | undefined, t: Traductor): string | undefined {
  return clau && t.has(`grupsNoms.${clau}`) ? t(`grupsNoms.${clau}`) : nom;
}

/**
 * El nom d'un sabor en l'idioma de la pàgina: `t` és el de `nutricio`. Un producte d'un sol sabor de la
 * plataforma no en té el nom: llavors torna una cadena buida (no es diu).
 */
export function nomSabor(sabors: readonly { id: string; nom?: string; clau?: string }[], id: string, t: Traductor): string {
  const s = sabors.find((x) => x.id === id);
  if (s?.clau && t.has(`sabors.${s.clau}`)) return nomTraduit(t(`sabors.${s.clau}`), s.nom ?? '');
  if (s?.nom !== undefined) return s.nom;
  return t.has(`sabors.${id}`) ? t(`sabors.${id}`) : '';
}
