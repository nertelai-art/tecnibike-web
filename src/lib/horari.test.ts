import { diesEntre, horesRecollida, horesRetorn, validaFranja } from './horari';
import type { HorariBotiga } from './plataforma/esquema';

const feiner = [
  { obre: '09:00', tanca: '13:00' },
  { obre: '16:00', tanca: '20:00' },
];
const horari: HorariBotiga = {
  setmana: [[], feiner, feiner, feiner, feiner, feiner, feiner],
  periodes: [{ des: '2027-07-01', fins: '2027-08-31', setmana: [[{ obre: '09:00', tanca: '13:00' }], feiner, feiner, feiner, feiner, feiner, feiner] }],
  tancats: [{ dia: '2026-12-08', ficticia: true }],
  pasMinuts: 30,
};

describe('hores de recollida i retorn', () => {
  it("es recull fins mitja hora abans de tancar i es torna fins a l'hora de tancar", () => {
    const recollida = horesRecollida('2026-10-27', horari);
    expect(recollida[0]).toBe('09:00');
    expect(recollida).toContain('12:30');
    expect(recollida).not.toContain('13:00');
    expect(recollida).not.toContain('14:00');
    expect(recollida.at(-1)).toBe('19:30');
    const retorn = horesRetorn('2026-10-27', horari);
    expect(retorn).toContain('13:00');
    expect(retorn.at(-1)).toBe('20:00');
  });

  it('diumenge i els dies tancats no tenen hores', () => {
    expect(horesRecollida('2026-10-25', horari)).toEqual([]);
    expect(horesRetorn('2026-12-08', horari)).toEqual([]);
  });

  it("un període especial canvia l'horari d'aquells dies", () => {
    expect(horesRecollida('2027-07-04', horari)).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']);
    expect(horesRecollida('2027-09-05', horari)).toEqual([]);
  });
});

describe('validaFranja', () => {
  const ara = { dia: '2026-10-27', hora: '10:10' };
  const franja = (rd: string, rh: string, td: string, th: string) => ({ recollida: { dia: rd, hora: rh }, retorn: { dia: td, hora: th } });

  it('accepta una franja dins de l\'horari', () => {
    expect(validaFranja(franja('2026-10-27', '11:00', '2026-10-28', '19:00'), horari, ara)).toBeNull();
    expect(validaFranja(franja('2026-10-27', '16:00', '2026-10-27', '20:00'), horari, ara)).toBeNull();
  });

  it('no es pot recollir en una hora ja passada', () => {
    expect(validaFranja(franja('2026-10-27', '10:00', '2026-10-28', '19:00'), horari, ara)).toBe('passat');
  });

  it('rebutja hores fora de l\'horari, dies tancats i hores que no són de la graella', () => {
    expect(validaFranja(franja('2026-10-27', '14:00', '2026-10-28', '19:00'), horari, ara)).toBe('recollida');
    expect(validaFranja(franja('2026-10-27', '11:10', '2026-10-28', '19:00'), horari, ara)).toBe('recollida');
    expect(validaFranja(franja('2026-10-27', '11:00', '2026-11-01', '10:00'), horari, ara)).toBe('retorn');
    expect(validaFranja(franja('2026-12-07', '11:00', '2026-12-08', '10:00'), horari, ara)).toBe('retorn');
  });

  it('el retorn ha de ser després de la recollida', () => {
    expect(validaFranja(franja('2026-10-28', '11:00', '2026-10-28', '11:00'), horari, ara)).toBe('ordre');
    expect(validaFranja(franja('2026-10-29', '11:00', '2026-10-28', '19:00'), horari, ara)).toBe('ordre');
  });

  it('un lloguer no passa de 30 dies', () => {
    expect(validaFranja(franja('2026-10-28', '11:00', '2026-11-26', '19:00'), horari, ara)).toBeNull();
    expect(validaFranja(franja('2026-10-28', '11:00', '2026-11-27', '19:00'), horari, ara)).toBe('massaLlarg');
  });
});

describe('diesEntre', () => {
  it('compta els dies de calendari, el primer i l\'últim inclosos', () => {
    expect(diesEntre('2026-10-27', '2026-10-27')).toBe(1);
    expect(diesEntre('2026-10-27', '2026-10-28')).toBe(2);
    expect(diesEntre('2026-10-30', '2026-11-02')).toBe(4);
  });
});
