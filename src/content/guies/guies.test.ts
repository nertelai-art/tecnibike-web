import { routing } from '@/i18n/routing';
import { CATEGORIES_EQUIPAMENT } from '@/content/equipament';
import { GUIES_EQUIPAMENT } from './index';
import type { Text } from './tipus';

// Cada categoria de la botiga té la seva guia, sencera i en els quatre idiomes: si en falta un tros,
// la pàgina de la categoria surt amb forats.

function complet(text: Text, on: string) {
  for (const l of routing.locales) expect(text[l]?.trim(), `${on} · ${l}`).toBeTruthy();
}

describe("guies de les categories d'equipament", () => {
  it('hi ha una guia per a cada categoria, i cap més', () => {
    expect(Object.keys(GUIES_EQUIPAMENT).sort()).toEqual([...CATEGORIES_EQUIPAMENT].sort());
    for (const c of CATEGORIES_EQUIPAMENT) expect(GUIES_EQUIPAMENT[c].categoria).toBe(c);
  });

  it('cada guia té tots els trossos en tots els idiomes', () => {
    for (const g of Object.values(GUIES_EQUIPAMENT)) {
      const c = g.categoria;
      complet(g.lema, `${c} · lema`);
      complet(g.intro, `${c} · intro`);
      complet(g.aTecnibike, `${c} · aTecnibike`);
      expect(g.tipus.length, `${c} · tipus`).toBeGreaterThanOrEqual(3);
      expect(g.consells.length, `${c} · consells`).toBeGreaterThanOrEqual(3);
      expect(g.preguntes.length, `${c} · preguntes`).toBeGreaterThanOrEqual(3);
      g.tipus.forEach((t, i) => (complet(t.nom, `${c} · tipus ${i}`), complet(t.text, `${c} · tipus ${i}`)));
      g.consells.forEach((t, i) => (complet(t.titol, `${c} · consell ${i}`), complet(t.text, `${c} · consell ${i}`)));
      g.preguntes.forEach((p, i) => (complet(p.pregunta, `${c} · pregunta ${i}`), complet(p.resposta, `${c} · resposta ${i}`)));
      expect(g.fonts.length, `${c} · fonts`).toBeGreaterThan(0);
      for (const f of g.fonts) expect(() => new URL(f.url), `${c} · ${f.url}`).not.toThrow();
    }
  });
});
