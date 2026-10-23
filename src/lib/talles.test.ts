import { tallaSuggerida } from './talles';

describe('tallaSuggerida', () => {
  it('fa servir la taula general per alçada', () => {
    expect(tallaSuggerida(172, ['XS', 'S', 'M', 'L', 'XL'])).toBe('M');
    expect(tallaSuggerida(190, ['48', '51', '54', '56', '58'])).toBe('58');
    expect(tallaSuggerida(155, ['48', '51', '54', '56', '58'])).toBe('48');
  });

  it('si la bici no té la talla ideal, tria la més propera', () => {
    expect(tallaSuggerida(155, ['S', 'M', 'L', 'XL'])).toBe('S');
    expect(tallaSuggerida(195, ['S', 'M', 'L'])).toBe('L');
  });

  it('sense talles, no suggereix res', () => {
    expect(tallaSuggerida(170, [])).toBeNull();
  });
});
