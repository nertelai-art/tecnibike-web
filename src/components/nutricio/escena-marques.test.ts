import { estatCapitol, estatProducte, marcaActiva } from './escena-marques';

// Invariants de l'escena, mostrejant el progrés: no valors exactes de cada fotograma.

const TOTAL = 4;
const mostres = Array.from({ length: 401 }, (_, i) => i / 400);

describe('escena de marques', () => {
  it('a mig tram de cada marca, els seus productes són de cara, a lloc i sencers', () => {
    for (let marca = 0; marca < TOTAL; marca++) {
      const p = (marca + 0.5) / TOTAL;
      for (let i = 0; i < 4; i++) {
        expect(estatProducte(p, marca, TOTAL, i, 4)).toMatchObject({ opacitat: 1, girY: 0, escala: 1 });
      }
      expect(estatCapitol(p, marca, TOTAL).text).toBe(1);
    }
  });

  it("de cada marca només se'n veuen els productes al seu tram i a les vores amb les veïnes", () => {
    for (const p of mostres) {
      const actiu = marcaActiva(p, TOTAL);
      for (let marca = 0; marca < TOTAL; marca++) {
        if (Math.abs(marca - actiu) <= 1) continue;
        expect(estatProducte(p, marca, TOTAL, 0, 4).opacitat, `p=${p} marca=${marca}`).toBe(0);
      }
    }
  });

  it("al final, l'última marca queda a lloc i la resta ja ha marxat", () => {
    for (let i = 0; i < 4; i++) expect(estatProducte(1, TOTAL - 1, TOTAL, i, 4).opacitat).toBe(1);
    for (let marca = 0; marca < TOTAL - 1; marca++) expect(estatProducte(1, marca, TOTAL, 0, 4).opacitat).toBe(0);
    expect(estatCapitol(1, TOTAL - 1, TOTAL).text).toBe(1);
  });

  it('al principi, la primera marca ja es veu: no hi ha cap pantalla buida', () => {
    expect(estatProducte(0, 0, TOTAL, 0, 4).opacitat).toBeGreaterThan(0.5);
    expect(estatCapitol(0, 0, TOTAL).text).toBe(1);
  });

  it('en entrar, el producte fa més de mitja volta sobre si mateix', () => {
    const entrant = estatProducte(0.8 / TOTAL, 1, TOTAL, 0, 4);
    expect(entrant.girY).toBeLessThan(-180);
  });

  it('es mou sense salts: entre dos punts propers, el gir i la posició canvien poc', () => {
    const fi = Array.from({ length: 4001 }, (_, i) => i / 4000);
    for (let marca = 0; marca < TOTAL; marca++) {
      for (let i = 0; i < 4; i++) {
        fi.slice(1).forEach((p, k) => {
          const a = estatProducte(fi[k]!, marca, TOTAL, i, 4);
          const b = estatProducte(p, marca, TOTAL, i, 4);
          if (a.opacitat === 0 && b.opacitat === 0) return;
          expect(Math.abs(b.girY - a.girY), `gir p=${p} marca=${marca} i=${i}`).toBeLessThan(12);
          expect(Math.abs(b.y - a.y), `y p=${p} marca=${marca} i=${i}`).toBeLessThan(8);
        });
      }
    }
  });

  it('el mateix progrés dona sempre el mateix estat', () => {
    for (const p of mostres) expect(estatProducte(p, 2, TOTAL, 1, 4)).toEqual(estatProducte(p, 2, TOTAL, 1, 4));
  });

  it('la marca activa va de la primera a l\'última sense saltar-ne cap', () => {
    const vistes = new Set(mostres.map((p) => marcaActiva(p, TOTAL)));
    expect([...vistes].sort()).toEqual([0, 1, 2, 3]);
  });
});
