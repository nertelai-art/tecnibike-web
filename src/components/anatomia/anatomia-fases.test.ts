import { DESMUNTADA, DURADA, FINAL, INICI, MOMENTS, ORDRE_PECES, seguentBanner, tempsDeProgres } from './anatomia-fases';

describe("escena del taller", () => {
  it('els moments són dins del vídeo i en ordre', () => {
    for (let i = 1; i < MOMENTS.length; i++) expect(MOMENTS[i]!.t).toBeGreaterThan(MOMENTS[i - 1]!.t);
    expect(MOMENTS.at(-1)!.t).toBeLessThan(10.04);
  });

  it('el bàner següent mai no repeteix la peça i les pot treure totes', () => {
    for (let actual = 0; actual < MOMENTS.length; actual++) {
      const vistes = new Set<number>();
      for (let a = 0; a < 1; a += 0.01) {
        const seguent = seguentBanner(actual, a);
        expect(seguent).not.toBe(actual);
        expect(seguent).toBeGreaterThanOrEqual(0);
        expect(seguent).toBeLessThan(MOMENTS.length);
        vistes.add(seguent);
      }
      expect(vistes.size).toBe(MOMENTS.length - 1);
    }
    expect(seguentBanner(-1, 0.999)).toBe(MOMENTS.length - 1);
  });

  it('cada peça té posició final i bàner dins del fotograma', () => {
    for (const peca of ORDRE_PECES) {
      const { x, y, bx, by } = FINAL[peca];
      for (const v of [x, y, bx, by]) expect(v >= 0 && v <= 100).toBe(true);
    }
  });

  it('amb el scroll, la bici sencera al principi i desmuntada al final, sense tornar mai enrere', () => {
    expect(tempsDeProgres(0)).toBe(0);
    expect(tempsDeProgres(INICI)).toBe(0);
    expect(tempsDeProgres(DESMUNTADA)).toBeCloseTo(DURADA);
    expect(tempsDeProgres(1)).toBeCloseTo(DURADA);
    let anterior = 0;
    for (let p = 0; p <= 1; p += 0.002) {
      const t = tempsDeProgres(p);
      expect(t).toBeGreaterThanOrEqual(anterior - 1e-9);
      anterior = t;
    }
  });
});
