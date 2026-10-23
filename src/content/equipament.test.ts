import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATEGORIES_EQUIPAMENT, FOTOS_EQUIPAMENT, marquesDeCategoria } from './equipament';
import { MARQUES } from './marques';

const PUBLIC = join(__dirname, '../../public');

describe('equipament i marques', () => {
  it('cada categoria té marques, sense repetir-ne cap', () => {
    for (const categoria of CATEGORIES_EQUIPAMENT) {
      const noms = marquesDeCategoria(categoria).map((m) => m.nom);
      expect(noms.length, categoria).toBeGreaterThan(0);
      expect(new Set(noms).size).toBe(noms.length);
    }
  });

  it('els accessoris ajunten manteniment i portabicis', () => {
    expect(marquesDeCategoria('accessoris').map((m) => m.nom)).toEqual(['Muc-Off', 'X-Sauce', 'Thule']);
  });

  it('tots els logos i les fotos existeixen', () => {
    for (const m of MARQUES) if (m.logo) expect(existsSync(join(PUBLIC, 'img/marques', m.logo)), m.logo).toBe(true);
    for (const foto of Object.values(FOTOS_EQUIPAMENT)) expect(existsSync(join(PUBLIC, foto.src)), foto.src).toBe(true);
  });

  it('cap marca surt dues vegades al carrusel', () => {
    expect(new Set(MARQUES.map((m) => m.nom)).size).toBe(MARQUES.length);
  });
});
