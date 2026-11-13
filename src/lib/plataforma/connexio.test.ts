import { connexioDe } from './connexio';

// Una sola clau per a la web (lloguer i taller), com la de l'Enric del 13-11-2026; la de cites a part
// és opcional i, si hi és, mana.

describe('connexió amb la plataforma', () => {
  it('amb una sola clau, les cites del taller fan servir la mateixa', () => {
    expect(connexioDe({ PLATAFORMA_API_URL: 'https://app.prova', PLATAFORMA_API_CLAU: 'una' })).toEqual({ url: 'https://app.prova', clau: 'una', clauCites: 'una' });
  });

  it('una clau de cites pròpia, si n’hi ha, mana per a les cites', () => {
    expect(connexioDe({ PLATAFORMA_API_URL: 'https://app.prova', PLATAFORMA_API_CLAU: 'una', PLATAFORMA_CITES_CLAU: 'cites', PLATAFORMA_TALLER_SERVEI: 'cita' })).toEqual({
      url: 'https://app.prova',
      clau: 'una',
      clauCites: 'cites',
      serveiCita: 'cita',
    });
  });

  it('sense adreça o sense clau, cap connexió: la web fa servir les dades de prova', () => {
    expect(connexioDe({ PLATAFORMA_API_CLAU: 'una' })).toBeNull();
    expect(connexioDe({ PLATAFORMA_API_URL: 'https://app.prova', PLATAFORMA_API_CLAU: '' })).toBeNull();
  });
});
