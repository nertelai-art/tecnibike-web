import { optimitzable } from './imatges';

describe('quines fotos optimitza la web', () => {
  it('les pròpies i les del magatzem públic de la plataforma', () => {
    expect(optimitzable('/img/flota/btt.png')).toBe(true);
    expect(optimitzable('https://abcd1234.supabase.co/storage/v1/object/public/cataleg/btt.png')).toBe(true);
  });

  it('una adreça de fora es mostra tal qual: no està autoritzada a next.config', () => {
    expect(optimitzable('https://botiga-antiga.example.com/foto.jpg')).toBe(false);
    expect(optimitzable('https://abcd1234.supabase.co/storage/v1/object/sign/privat.png')).toBe(false);
    expect(optimitzable('//cdn.example.com/x.png')).toBe(false);
  });
});
