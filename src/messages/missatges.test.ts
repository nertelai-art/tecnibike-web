import ca from './ca.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';

/** Totes les claus d'un objecte de missatges, aplanades («reserva.fet.titol»). */
function claus(objecte: object, prefix = ''): string[] {
  return Object.entries(objecte).flatMap(([clau, valor]) =>
    typeof valor === 'object' && valor !== null ? claus(valor, `${prefix}${clau}.`) : [`${prefix}${clau}`],
  );
}

describe('traduccions', () => {
  const referencia = claus(ca).sort();

  it.each([
    ['es', es],
    ['en', en],
    ['fr', fr],
  ])('%s té exactament les mateixes claus que el català', (_, missatges) => {
    expect(claus(missatges).sort()).toEqual(referencia);
  });

  it('les dades de mostra porten l\'asterisc en tots els idiomes', () => {
    for (const missatges of [ca, es, en, fr]) {
      expect(missatges.faq.items.fianca.r).toContain('*');
      expect(missatges.reserva.pagament).toContain('*');
    }
  });
});
