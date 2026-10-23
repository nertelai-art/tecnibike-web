import { formatEuros, preuLloguer, preuMinimPerDia, preuPerDia, totalReserva } from './preus';

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

describe('totalReserva', () => {
  const preus = { casc: 0, cadenat: 300, cadiraNado: 800, alforges: 600, comptaquilometres: 400 };

  it('suma els accessoris un cop per bici', () => {
    expect(totalReserva(btt, { tipus: 'dies', dies: 2 }, 2, ['casc', 'cadenat'], preus)).toBe(2520 * 2 * 2 + 300 * 2);
  });

  it('un accessori repetit només es cobra una vegada', () => {
    expect(totalReserva(btt, { tipus: 'dies', dies: 1 }, 1, ['alforges', 'alforges'], preus)).toBe(2800 + 600);
  });

  it('no dona preu si la durada no és possible', () => {
    expect(totalReserva(btt, { tipus: 'migDia' }, 1, [], preus)).toBeNull();
  });
});
