import { routing } from '@/i18n/routing';
import { enllacCreditNertel } from './credit-nertel';

// La franja «Web feta per Nertel» porta a nertel.ai en l'idioma de la pàgina, i marca d'on ve la
// visita perquè a l'analítica de nertel.ai es vegi quines webs de clients ens envien gent.
describe('enllaç de crèdit a Nertel', () => {
  it("porta a nertel.ai en l'idioma de la pàgina (nertel.ai té els quatre de la web)", () => {
    expect(new URL(enllacCreditNertel('ca')).pathname).toBe('/ca');
    expect(new URL(enllacCreditNertel('es')).pathname).toBe('/es');
    expect(new URL(enllacCreditNertel('en')).pathname).toBe('/en');
    expect(new URL(enllacCreditNertel('fr')).pathname).toBe('/fr');
    expect(new URL(enllacCreditNertel('ca')).origin).toBe('https://nertel.ai');
  });

  it('diu que la visita ve del peu de la web de Tecnibike, en tots els idiomes', () => {
    for (const locale of routing.locales) {
      const params = new URL(enllacCreditNertel(locale)).searchParams;
      expect(params.get('utm_source')).toBe('tecnibike-web.vercel.app');
      expect(params.get('utm_medium')).toBe('credit');
    }
  });
});
