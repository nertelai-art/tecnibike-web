import { citaDeLAdreca, enllacCita } from './obrir-cita';

// La cita al taller només es demana al diàleg de l'inici. Des d'una altra pàgina, l'enllaç porta a
// l'inici amb `?cita` (i la peça, si n'hi ha), i l'inici obre el diàleg en carregar-se.

describe('enllaç a la cita del taller', () => {
  it("porta a l'inici amb el diàleg obert, i la peça si n'hi ha", () => {
    expect(enllacCita()).toEqual({ pathname: '/', query: { cita: 'taller' } });
    expect(enllacCita('frens')).toEqual({ pathname: '/', query: { cita: 'taller', peca: 'frens' } });
  });

  it("l'inici llegeix de l'adreça si ha d'obrir el diàleg i amb quina peça", () => {
    expect(citaDeLAdreca('?cita=taller&peca=rodes')).toEqual({ obrir: true, peca: 'rodes' });
    expect(citaDeLAdreca('?cita=taller')).toEqual({ obrir: true, peca: null });
    expect(citaDeLAdreca('?cita=taller&peca=inventada')).toEqual({ obrir: true, peca: null });
    expect(citaDeLAdreca('')).toEqual({ obrir: false, peca: null });
    expect(citaDeLAdreca('?marca=Maurten')).toEqual({ obrir: false, peca: null });
  });
});
