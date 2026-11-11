import ca from '@/messages/ca.json';
import { productesNutricio } from '@/lib/plataforma/dades-nutricio';
import { colorSabor, ORDRE_MARQUES, TEMES_MARCA } from './nutricio';

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
