import { araABotiga, dataLocal, diaSetmana, esData, esObert, esPassat, propersDiesOberts, sumaDies } from './calendari';

describe('calendari', () => {
  it('valida dates reals', () => {
    expect(esData('2026-10-23')).toBe(true);
    expect(esData('2026-02-30')).toBe(false);
    expect(esData('23/10/2026')).toBe(false);
  });

  it('suma dies travessant mesos i anys', () => {
    expect(sumaDies('2026-10-30', 3)).toBe('2026-11-02');
    expect(sumaDies('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('la botiga tanca els diumenges', () => {
    expect(diaSetmana('2026-10-25')).toBe(0);
    expect(esObert('2026-10-25')).toBe(false);
    expect(esObert('2026-10-24')).toBe(true);
  });

  it('salta els diumenges en llistar els dies oberts', () => {
    expect(propersDiesOberts('2026-10-23', 3)).toEqual(['2026-10-23', '2026-10-24', '2026-10-26']);
  });

  it('pren la data local del navegador, no la UTC', () => {
    expect(dataLocal(new Date(2026, 9, 23, 23, 30))).toBe('2026-10-23');
  });
});

describe('hores passades', () => {
  const ara = { dia: '2026-10-23', hora: '14:20' };

  it("una hora d'avui ja passada no es pot reservar", () => {
    expect(esPassat('2026-10-23', '10:00', ara)).toBe(true);
    expect(esPassat('2026-10-23', '16:00', ara)).toBe(false);
    expect(esPassat('2026-10-22', '19:00', ara)).toBe(true);
    expect(esPassat('2026-10-24', '09:00', ara)).toBe(false);
  });

  it("l'hora de la botiga és la de Madrid, sigui on sigui el servidor", () => {
    expect(araABotiga(new Date('2026-10-23T12:20:00Z'))).toEqual({ dia: '2026-10-23', hora: '14:20' });
    expect(araABotiga(new Date('2026-12-31T23:30:00Z'))).toEqual({ dia: '2027-01-01', hora: '00:30' });
  });
});
