import { describe, expect, it } from 'vitest';
import { routing } from '@/i18n/routing';
import { DIES_CONVERSES, RESPONSABLE, SECCIONS_PRIVACITAT } from './privacitat';

// La política ha de dir el mateix en tots els idiomes: mateixes seccions, el responsable amb el NIF,
// els encarregats que tracten les converses i el termini de les converses.
describe('política de privacitat', () => {
  const ca = SECCIONS_PRIVACITAT.ca;

  it.each(routing.locales)('%s té les mateixes seccions i llistes que el català', (locale) => {
    const seccions = SECCIONS_PRIVACITAT[locale];
    expect(seccions).toHaveLength(ca.length);
    seccions.forEach((seccio, i) => {
      expect(seccio.llista?.length ?? 0).toBe(ca[i]?.llista?.length ?? 0);
      expect(seccio.paragrafs?.length ?? 0).toBe(ca[i]?.paragrafs?.length ?? 0);
      expect(seccio.despres?.length ?? 0).toBe(ca[i]?.despres?.length ?? 0);
    });
  });

  it.each(routing.locales)('%s diu el responsable, el NIF, el correu i els dies de les converses', (locale) => {
    const text = JSON.stringify(SECCIONS_PRIVACITAT[locale]);
    for (const dada of [RESPONSABLE.rao, RESPONSABLE.nif, RESPONSABLE.correu, `${DIES_CONVERSES} `]) {
      expect(text).toContain(dada);
    }
  });

  it.each(routing.locales)('%s anomena els encarregats de les converses i dels pagaments', (locale) => {
    const text = JSON.stringify(SECCIONS_PRIVACITAT[locale]);
    for (const proveidor of ['Nertel', 'ElevenLabs', 'Twilio', 'YCloud', 'Meta', 'OpenRouter', 'Stripe', 'www.aepd.es']) {
      expect(text).toContain(proveidor);
    }
  });
});
