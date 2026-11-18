import ca from '@/messages/ca.json';
import { productesNutricio } from '@/lib/plataforma/dades-nutricio';
import { colorSabor, descripcioDe, ORDRE_MARQUES, TEMES_MARCA } from './nutricio';

// El catàleg de prova no porta textos: surten dels missatges per l'id. Si se n'hi afegeix un sense
// text o sense color, la pàgina ho ensenyaria buit o gris.

describe('nutrició: textos i colors del catàleg de prova', () => {
  it('cada producte té descripció i cada sabor, nom i color propi', () => {
    for (const p of productesNutricio) {
      expect(ca.nutricio.productes, p.id).toHaveProperty([p.id]);
      for (const s of p.sabors) {
        expect(ca.nutricio.sabors, `${p.id} · ${s.id}`).toHaveProperty([s.id]);
        expect(colorSabor(s.id), s.id).not.toBe(colorSabor('cap-sabor-conegut'));
      }
    }
  });

  it('cada marca de la secció té tema i una línia que la presenta', () => {
    for (const marca of ORDRE_MARQUES) {
      const tema = TEMES_MARCA[marca]!;
      expect(tema, marca).toBeDefined();
      expect(ca.nutricio.marques, marca).toHaveProperty([tema.clau]);
    }
  });
});

describe('nutrició: fotos del catàleg de prova', () => {
  it('cada foto de producte i de sabor existeix a public/', async () => {
    const { existsSync } = await import('node:fs');
    const { join } = await import('node:path');
    for (const p of productesNutricio) {
      for (const img of [p.imatge, ...p.sabors.map((s) => s.imatge)].filter(Boolean)) {
        expect(existsSync(join(process.cwd(), 'public', img!)), img).toBe(true);
      }
    }
  });
});

// Els articles de la plataforma tenen ids que no són als missatges: sense descripció pròpia no se'n
// pinta cap, en lloc de la clau («nutricio.productes.<id>», com sortia el 18-11-2026).
describe('nutrició: la descripció de cada producte', () => {
  const t = Object.assign((clau: string) => `text de ${clau}`, { has: (clau: string) => clau === 'productes.gel-100' });
  it('la de la plataforma, la dels missatges si el producte és de prova, o cap', () => {
    expect(descripcioDe({ id: 'qualsevol', descripcio: 'De la botiga' }, t)).toBe('De la botiga');
    expect(descripcioDe({ id: 'gel-100' }, t)).toBe('text de productes.gel-100');
    expect(descripcioDe({ id: 'fea37395-cf5a-40b0-8d20-51825e4a2091' }, t)).toBeNull();
  });
});
