import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { routing } from '@/i18n/routing';
import { FITXES_MARQUES } from './fitxes-marques';
import { enllacMarca, MARQUES, slugMarca } from './marques';

// Clicar una marca porta a la seva fitxa (o al catàleg de nutrició). Si una marca de la botiga no en
// té, l'enllaç acaba en un 404; si una fitxa apunta a una foto que no hi és, surt trencada.

describe('fitxes de marques', () => {
  it('cada marca que no és de nutrició té fitxa, i cada fitxa és d’una marca', () => {
    const ambFitxa = MARQUES.filter((m) => m.categoria !== 'nutricio').map(slugMarca).sort();
    expect(FITXES_MARQUES.map((f) => f.slug).sort()).toEqual(ambFitxa);
  });

  it('les marques porten a la fitxa, i les de nutrició al catàleg filtrat', () => {
    expect(enllacMarca({ nom: 'Muc-Off', categoria: 'components' })).toBe('/marques/muc-off');
    expect(enllacMarca({ nom: 'Maurten', categoria: 'nutricio' })).toBe('/botiga/nutricio?marca=Maurten#nutricio-productes');
  });

  it('cada fitxa té els textos en tots els idiomes i les fotos existeixen', () => {
    for (const f of FITXES_MARQUES) {
      for (const l of routing.locales) {
        expect(f.lema[l], `${f.slug} · lema ${l}`).toBeTruthy();
        expect(f.descripcio[l], `${f.slug} · descripció ${l}`).toBeTruthy();
        for (const d of f.destacats) expect(d.descripcio[l], `${f.slug} · ${d.nom} ${l}`).toBeTruthy();
      }
      expect(() => new Intl.DisplayNames(['ca'], { type: 'region' }).of(f.pais), f.slug).not.toThrow();
      for (const i of f.imatges) expect(existsSync(join(process.cwd(), 'public', i.src)), i.src).toBe(true);
    }
  });
});
