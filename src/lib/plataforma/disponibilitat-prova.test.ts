import { frangesTaller, HORES_RECEPCIO, unitatsLliures } from './disponibilitat-prova';

describe('disponibilitat de proves', () => {
  it('és estable: la mateixa consulta dona sempre el mateix', () => {
    expect(unitatsLliures('btt', 'M', '2026-11-02', 3)).toBe(unitatsLliures('btt', 'M', '2026-11-02', 3));
  });

  it('un lloguer més llarg mai té més unitats que un de més curt', () => {
    for (const talla of ['S', 'M', 'L']) {
      expect(unitatsLliures('gravel', talla, '2026-11-02', 5)).toBeLessThanOrEqual(unitatsLliures('gravel', talla, '2026-11-02', 1));
    }
  });

  it('les reserves resten unitats sense baixar de zero', () => {
    const lliures = unitatsLliures('btt', 'L', '2026-11-03', 1);
    expect(unitatsLliures('btt', 'L', '2026-11-03', 1, 1)).toBe(Math.max(0, lliures - 1));
    expect(unitatsLliures('btt', 'L', '2026-11-03', 1, 99)).toBe(0);
  });

  it('el taller no té franges el diumenge', () => {
    expect(frangesTaller('2026-10-25')).toEqual([]);
    expect(frangesTaller('2026-10-26').map((f) => f.inici)).toEqual([...HORES_RECEPCIO]);
  });

  it('una franja ocupada perd places', () => {
    const lliure = frangesTaller('2026-10-27').find((f) => f.inici === '10:00')!.places;
    const despres = frangesTaller('2026-10-27', { '10:00': 1 }).find((f) => f.inici === '10:00')!.places;
    expect(despres).toBe(Math.max(0, lliure - 1));
  });
});
