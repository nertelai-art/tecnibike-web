import { FASES, ORDRE_PECES, obertura, opacitatPortada, pasActiu } from './anatomia-fases';

describe('fases de l\'anatomia', () => {
  it('les fases es toquen o se solapen: no hi ha forats morts', () => {
    expect(FASES.esbotzat[0]).toBeLessThanOrEqual(FASES.portada[1]);
    expect(FASES.peces[0]).toBeLessThanOrEqual(FASES.esbotzat[1]);
    expect(FASES.muntatge[0]).toBeLessThanOrEqual(FASES.peces[1]);
  });

  it('la bici comença i acaba muntada, i és oberta mentre es recorren les peces', () => {
    expect(obertura(0)).toBe(0);
    expect(obertura(0.5)).toBe(1);
    expect(obertura(1)).toBe(0);
  });

  it('recorre les sis peces en ordre i acaba amb totes vistes', () => {
    expect(pasActiu(0.1)).toBe(-1);
    const vistos = new Set<number>();
    for (let p = FASES.peces[0]; p < FASES.peces[1]; p += 0.005) vistos.add(pasActiu(p));
    expect([...vistos]).toEqual(ORDRE_PECES.map((_, i) => i));
    expect(pasActiu(0.9)).toBe(ORDRE_PECES.length);
  });

  it('el text de portada es fon abans que s\'obri del tot', () => {
    expect(opacitatPortada(0)).toBe(1);
    expect(opacitatPortada(0.2)).toBe(0);
  });
});
