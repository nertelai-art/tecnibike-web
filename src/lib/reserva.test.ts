import type { HorariBotiga } from './plataforma/esquema';
import { afegeixNutricio, commutaExtra, extresLliures, nutricioLliure, primeraRecollida, retornPerDefecte, tallesLliures, variantsLliures } from './reserva';

const feiner = [
  { obre: '09:00', tanca: '13:00' },
  { obre: '16:00', tanca: '20:00' },
];
const horari: HorariBotiga = { setmana: [[], feiner, feiner, feiner, feiner, feiner, feiner], periodes: [], tancats: [], pasMinuts: 30 };

describe('unitats lliures per a cada bici del carro', () => {
  const disponibilitat = { bicis: { btt: { S: 1, M: 2 }, gravel: { M: 1 } }, extres: { casc: 3, cadiraNado: 1, 'pedals-propis': null } };
  const linia = (biciId: string, talla: string | null, extres: string[] = [], pedals = 'pedals-plans') => ({ biciId, talla, pedals, extres });

  it('resta el que ja han triat les altres bicis, però no la mateixa', () => {
    const linies = [linia('btt', 'M'), linia('btt', 'M'), linia('gravel', 'M')];
    expect(tallesLliures(disponibilitat, linies, 0)).toEqual({ S: 1, M: 1 });
    expect(tallesLliures(disponibilitat, linies, 2)).toEqual({ M: 1 });
  });

  it('una bici sense dades de disponibilitat no té talles lliures', () => {
    expect(tallesLliures(disponibilitat, [linia('urbana', null)], 0)).toEqual({});
    expect(tallesLliures(null, [linia('btt', null)], 0)).toBeNull();
  });

  it("els extres i els pedals també es resten entre bicis; els que no tenen límit, no", () => {
    const linies = [linia('btt', 'M', ['casc', 'cadiraNado']), linia('btt', 'S', ['casc'], 'pedals-propis')];
    expect(extresLliures(disponibilitat, linies, 1)).toEqual({ casc: 2, cadiraNado: 0, 'pedals-propis': null });
  });
});

describe('variants dels extres', () => {
  const disponibilitat = { bicis: {}, extres: { casc: 5 }, variantsExtres: { casc: { S: 1, M: 4 } } };
  const linia = (variants: Record<string, string>) => ({ biciId: 'btt', talla: 'M', pedals: 'pedals-plans', extres: ['casc'], variants });

  it("resta el que han triat les altres bicis de la mateixa variant", () => {
    const linies = [linia({ casc: 'S' }), linia({ casc: 'M' }), linia({ casc: 'M' })];
    expect(variantsLliures(disponibilitat, linies, 0, 'casc')).toEqual({ S: 1, M: 2 });
    expect(variantsLliures(disponibilitat, linies, 1, 'casc')).toEqual({ S: 0, M: 3 });
  });

  it("sense disponibilitat o sense variants, res", () => {
    expect(variantsLliures(null, [linia({})], 0, 'casc')).toEqual({});
    expect(variantsLliures(disponibilitat, [linia({})], 0, 'cadenat')).toEqual({});
  });
});

describe('nutrició de la reserva', () => {
  it("afegir el mateix producte i sabor en suma la quantitat; un altre sabor és una línia nova", () => {
    let linies = afegeixNutricio([], 'gel', 'cola');
    linies = afegeixNutricio(linies, 'gel', 'cola');
    linies = afegeixNutricio(linies, 'gel', 'llima');
    expect(linies).toEqual([
      { producteId: 'gel', sabor: 'cola', quantitat: 2 },
      { producteId: 'gel', sabor: 'llima', quantitat: 1 },
    ]);
  });

  it("no passa del màxim per línia", () => {
    expect(afegeixNutricio([{ producteId: 'gel', sabor: 'cola', quantitat: 10 }], 'gel', 'cola')).toEqual([{ producteId: 'gel', sabor: 'cola', quantitat: 10 }]);
  });

  it("el que queda d'un sabor descompta el que ja hi ha a la reserva; sense límit, null", () => {
    const disponibilitat = { nutricio: { gel: { cola: 5, llima: null } } };
    const linies = [{ producteId: 'gel', sabor: 'cola', quantitat: 2 }];
    expect(nutricioLliure(disponibilitat, linies, 'gel', 'cola')).toBe(3);
    expect(nutricioLliure(disponibilitat, linies, 'gel', 'llima')).toBeNull();
    expect(nutricioLliure(null, linies, 'gel', 'cola')).toBeUndefined();
  });
});

describe('primera recollida i retorn per defecte', () => {
  it("és la primera hora que encara no ha passat, avui o el pròxim dia obert", () => {
    expect(primeraRecollida({ dia: '2026-10-27', hora: '10:10' }, horari)).toEqual({ dia: '2026-10-27', hora: '10:30' });
    expect(primeraRecollida({ dia: '2026-10-27', hora: '19:40' }, horari)).toEqual({ dia: '2026-10-28', hora: '09:00' });
    // Dissabte al vespre: diumenge tanca, toca dilluns.
    expect(primeraRecollida({ dia: '2026-10-31', hora: '21:00' }, horari)).toEqual({ dia: '2026-11-02', hora: '09:00' });
  });

  it("per defecte es torna el mateix dia a l'última hora", () => {
    expect(retornPerDefecte({ dia: '2026-10-27', hora: '10:30' }, horari)).toEqual({ dia: '2026-10-27', hora: '20:00' });
  });
});

describe('triar extres', () => {
  const extres = [
    { id: 'casc', grupId: 'g-casc' },
    { id: 'cadenat', grupId: 'g-acc' },
    { id: 'compta', grupId: 'g-acc' },
    { id: 'alforges' },
  ];

  it('afegeix i treu un extra', () => {
    expect(commutaExtra(['casc'], 'alforges', extres)).toEqual(['casc', 'alforges']);
    expect(commutaExtra(['casc', 'alforges'], 'casc', extres)).toEqual(['alforges']);
  });

  it("d'un mateix grup de la plataforma se'n pot triar un com a molt: el nou substitueix l'anterior", () => {
    expect(commutaExtra(['casc', 'cadenat'], 'compta', extres)).toEqual(['casc', 'compta']);
  });
});
