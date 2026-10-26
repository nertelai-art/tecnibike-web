import type { HorariBotiga } from './plataforma/esquema';
import { extresLliures, primeraRecollida, retornPerDefecte, tallesLliures } from './reserva';

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
