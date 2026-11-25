import { clauExtra, clauGrup, clauSabor } from './claus-cataleg';
import { nomExtra, nomGrup, nomSabor, nomTraduit } from './nom-traduit';

// La plataforma només guarda un nom per article, en l'idioma en què l'escriu la botiga (el català).
// Si el nom és d'un extra, d'un sabor o d'un grup que la web ja té traduït, se n'ensenya la traducció.

describe('claus del catàleg: noms de la plataforma que la web sap traduir', () => {
  it('extres: pel nom en qualsevol idioma, amb accents, majúscules o guionets de partició', () => {
    expect(clauExtra('Cadira per a nadó')).toBe('cadiraNado');
    expect(clauExtra('cadenat')).toBe('cadenat');
    expect(clauExtra('Comptaquilòmetres')).toBe('comptaquilometres');
    expect(clauExtra('Porto els meus pedals')).toBe('pedals-propis');
    expect(clauExtra('Candado')).toBe('cadenat');
    expect(clauExtra('Seient de cuir vermell')).toBeUndefined();
  });

  it('sabors: pel nom exacte o pel sabor conegut que formen les paraules', () => {
    expect(clauSabor('Llimona')).toBe('llimona');
    expect(clauSabor('Maduixa i kiwi')).toBe('maduixaKiwi');
    expect(clauSabor('Poma verda')).toBe('pomaVerda');
    expect(clauSabor('Herbasana i regalèssia')).toBe('herbasanaRegalessia');
    expect(clauSabor('Edició especial')).toBeUndefined();
    expect(clauSabor('')).toBeUndefined();
  });

  it('grups', () => {
    expect(clauGrup('Pedals')).toBe('pedals');
    expect(clauGrup('Accessoris')).toBe('accessoris');
    expect(clauGrup('Lots de temporada')).toBeUndefined();
  });

  it('la traducció no afegeix el que el nom original no deia (el que va entre parèntesis)', () => {
    expect(nomTraduit('Manzana verde (con cafeína)', 'Poma verda')).toBe('Manzana verde');
    expect(nomTraduit('Manzana verde (con cafeína)', 'Poma verda (amb cafeïna)')).toBe('Manzana verde (con cafeína)');
    expect(nomTraduit('Candado', 'Cadenat')).toBe('Candado');
  });
});

describe('el nom que ensenya la pàgina, en castellà', () => {
  // Un traductor de mentida amb els missatges en castellà de la web.
  const traductor = (missatges: Record<string, string>) => Object.assign((clau: string) => missatges[clau] ?? clau, { has: (clau: string) => clau in missatges });
  const reserva = traductor({ 'extresNoms.cadenat': 'Candado', 'grupsNoms.pedals': 'Pedales' });
  const nutricio = traductor({ 'sabors.pomaVerda': 'Manzana verde (con cafeína)', 'sabors.neutre': 'Neutro' });

  it('tradueix els noms coneguts de la plataforma i deixa els altres com els va escriure la botiga', () => {
    expect(nomExtra({ id: 'uuid', nom: 'Cadenat', clau: 'cadenat' }, reserva)).toBe('Candado');
    expect(nomExtra({ id: 'uuid', nom: 'Seient de cuir' }, reserva)).toBe('Seient de cuir');
    expect(nomGrup('Pedals', 'pedals', reserva)).toBe('Pedales');
    expect(nomGrup('Lots', undefined, reserva)).toBe('Lots');
    expect(nomSabor([{ id: 'uuid', nom: 'Poma verda', clau: 'pomaVerda' }], 'uuid', nutricio)).toBe('Manzana verde');
    expect(nomSabor([{ id: 'uuid', nom: '' }], 'uuid', nutricio)).toBe('');
    // Les dades de prova: sense nom, pel seu id.
    expect(nomSabor([{ id: 'neutre' }], 'neutre', nutricio)).toBe('Neutro');
  });
});
