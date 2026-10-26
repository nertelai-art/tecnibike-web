import { duradaDe, formatEuros, preuLinia, preuLloguer, preuMinimPerDia, preuPerDia, totalReserva } from './preus';

const btt = { dia: 2800, de2a6: 2520, mesDe6: 2100 };
const eDoble = { dia: 5500, migDia: 4200, de2a6: 4800, mesDe6: 3900 };
const carretera = { dia: 3500, de2a6: 2800 };

describe('preuPerDia', () => {
  it('aplica el tram de cada durada de la tarifa 2026', () => {
    expect(preuPerDia(btt, { tipus: 'dies', dies: 1 })).toBe(2800);
    expect(preuPerDia(btt, { tipus: 'dies', dies: 2 })).toBe(2520);
    expect(preuPerDia(btt, { tipus: 'dies', dies: 6 })).toBe(2520);
    expect(preuPerDia(btt, { tipus: 'dies', dies: 7 })).toBe(2100);
  });

  it('un tram en blanc hereta el de 2 a 6 dies', () => {
    expect(preuPerDia(carretera, { tipus: 'dies', dies: 10 })).toBe(2800);
  });

  it('el mig dia només existeix si la tarifa el té', () => {
    expect(preuPerDia(eDoble, { tipus: 'migDia' })).toBe(4200);
    expect(preuPerDia(btt, { tipus: 'migDia' })).toBeNull();
  });

  it('rebutja durades impossibles', () => {
    expect(preuPerDia(btt, { tipus: 'dies', dies: 0 })).toBeNull();
    expect(preuPerDia(btt, { tipus: 'dies', dies: 1.5 })).toBeNull();
  });
});

describe('preuLloguer', () => {
  it('multiplica per dies i per bicis', () => {
    expect(preuLloguer(btt, { tipus: 'dies', dies: 3 }, 2)).toBe(2520 * 3 * 2);
    expect(preuLloguer(eDoble, { tipus: 'migDia' }, 1)).toBe(4200);
    expect(preuLloguer(btt, { tipus: 'dies', dies: 3 }, 0)).toBeNull();
  });
});

describe('preuMinimPerDia', () => {
  it('és el tram més barat', () => {
    expect(preuMinimPerDia(btt)).toBe(2100);
    expect(preuMinimPerDia(carretera)).toBe(2800);
  });
});

describe('formatEuros', () => {
  it('amaga els decimals quan són zero', () => {
    expect(formatEuros(2800, 'ca')).toMatch(/^28\s?€$/);
    expect(formatEuros(2520, 'ca')).toMatch(/^25,20\s?€$/);
  });
});

describe('duradaDe', () => {
  const m = (dia: string, hora: string) => ({ dia, hora });

  it('compta els dies de calendari de la recollida al retorn', () => {
    expect(duradaDe(m('2026-10-27', '09:00'), m('2026-10-28', '18:30'), btt)).toEqual({ tipus: 'dies', dies: 2 });
    expect(duradaDe(m('2026-10-27', '18:00'), m('2026-10-28', '09:00'), btt)).toEqual({ tipus: 'dies', dies: 2 });
  });

  it('el mateix dia és mig dia si dura quatre hores o menys i la tarifa en té', () => {
    expect(duradaDe(m('2026-10-27', '09:00'), m('2026-10-27', '13:00'), eDoble)).toEqual({ tipus: 'migDia' });
    expect(duradaDe(m('2026-10-27', '09:00'), m('2026-10-27', '13:30'), eDoble)).toEqual({ tipus: 'dies', dies: 1 });
    expect(duradaDe(m('2026-10-27', '09:00'), m('2026-10-27', '12:00'), btt)).toEqual({ tipus: 'dies', dies: 1 });
  });
});

describe('preuLinia i totalReserva', () => {
  const rec = { dia: '2026-10-27', hora: '09:00' };
  const ret = { dia: '2026-10-29', hora: '19:00' };
  const casc = { preu: 0, cobrament: 'perReserva' } as const;
  const cadenat = { preu: 300, cobrament: 'perReserva' } as const;
  const look = { preu: 200, cobrament: 'perDia' } as const;

  it('suma el lloguer, els extres per reserva i els extres per dia', () => {
    expect(preuLinia({ tarifa: btt, extres: [casc, cadenat, look] }, rec, ret)).toBe(2520 * 3 + 300 + 200 * 3);
  });

  it('el total és la suma de cada bici, cadascuna amb la seva tarifa', () => {
    const total = totalReserva([{ tarifa: btt, extres: [cadenat] }, { tarifa: carretera, extres: [look] }], rec, ret);
    expect(total).toBe(2520 * 3 + 300 + 2800 * 3 + 200 * 3);
  });

  it('un extra per dia en mig dia es cobra una vegada', () => {
    const migDia = { dia: '2026-10-27', hora: '13:00' };
    expect(preuLinia({ tarifa: eDoble, extres: [look] }, rec, migDia)).toBe(4200 + 200);
  });

  it('sense bicis no hi ha total', () => {
    expect(totalReserva([], rec, ret)).toBeNull();
  });
});
