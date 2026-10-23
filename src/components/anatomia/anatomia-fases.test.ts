import { aturat, MOMENTS, ORDRE_PECES, pasActiu, tempsVideo } from './anatomia-fases';

describe("línia de temps de l'anatomia", () => {
  it('comença amb la bici sencera i acaba al final del vídeo', () => {
    expect(tempsVideo(0)).toBe(0);
    expect(tempsVideo(1)).toBeCloseTo(MOMENTS.at(-1)!.t);
  });

  it('el temps del vídeo mai no va enrere quan es baixa', () => {
    let anterior = 0;
    for (let p = 0; p <= 1; p += 0.002) {
      const t = tempsVideo(p);
      expect(t).toBeGreaterThanOrEqual(anterior - 1e-9);
      anterior = t;
    }
  });

  it('recorre les sis peces en ordre i totes acaben aturades a lloc', () => {
    const vistes: number[] = [];
    for (let p = 0; p <= 1; p += 0.002) {
      const pas = pasActiu(p);
      if (pas >= 0 && !vistes.includes(pas)) vistes.push(pas);
    }
    expect(vistes).toEqual(ORDRE_PECES.map((_, i) => i));
    for (let i = 0; i < MOMENTS.length; i++) {
      const fiDelTram = 0.1 + ((i + 0.95) * 0.9) / MOMENTS.length;
      expect(aturat(fiDelTram)).toBe(true);
      expect(tempsVideo(fiDelTram)).toBeCloseTo(MOMENTS[i]!.t);
    }
  });

  it('els moments són dins del vídeo i en ordre', () => {
    for (let i = 1; i < MOMENTS.length; i++) expect(MOMENTS[i]!.t).toBeGreaterThan(MOMENTS[i - 1]!.t);
    expect(MOMENTS.at(-1)!.t).toBeLessThan(10.04);
  });
});
