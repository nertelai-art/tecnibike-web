import { ENQUADRE, etiquetaActiva, FINAL, MOMENTS, ORDRE_PECES, seguentBanner } from './anatomia-fases';

describe("escena del taller", () => {
  it('els moments són dins del vídeo i en ordre', () => {
    for (let i = 1; i < MOMENTS.length; i++) expect(MOMENTS[i]!.t).toBeGreaterThan(MOMENTS[i - 1]!.t);
    expect(MOMENTS.at(-1)!.t).toBeLessThan(10.04);
  });

  it('cada peça té la seva etiqueta just quan surt, una darrere l’altra i mai dues alhora', () => {
    const ordre: number[] = [];
    for (let t = 0; t <= 10.04; t += 0.01) {
      const i = etiquetaActiva(t);
      if (i >= 0 && ordre.at(-1) !== i) ordre.push(i);
    }
    expect(ordre).toEqual(ORDRE_PECES.map((_, i) => i));
    MOMENTS.forEach((m, i) => expect(etiquetaActiva(m.t - 0.05)).toBe(i));
  });

  it('amb la bici sencera no hi ha cap etiqueta', () => {
    expect(etiquetaActiva(0)).toBe(-1);
    expect(etiquetaActiva(MOMENTS[0]!.t - 1)).toBe(-1);
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

  it('el fotograma de la bici cap dins de l’escena', () => {
    expect(ENQUADRE.x + ENQUADRE.ample).toBeLessThanOrEqual(100);
    expect(ENQUADRE.y + ENQUADRE.alt).toBeLessThanOrEqual(100);
  });
});
