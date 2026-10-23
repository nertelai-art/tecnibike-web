import { rutes } from '@/content/rutes';
import { camiPerfil, distancia, perfil } from './perfil';

describe('perfil d\'alçada', () => {
  it('la distància entre dos punts coneguts és la real', () => {
    // De la botiga al castell de Calonge, uns 3 km en línia recta.
    const d = distancia([3.1084, 41.8501, 0], [3.0733, 41.863, 0]);
    expect(d).toBeGreaterThan(3000);
    expect(d).toBeLessThan(3300);
  });

  it('la distància acumulada quadra amb la que dona l\'encaminador', () => {
    for (const ruta of rutes) {
      const total = perfil(ruta.punts).at(-1)!.d;
      // El traçat està simplificat (un punt cada 30 m), així que perd una mica de longitud als revolts.
      expect(total / ruta.metres).toBeGreaterThan(0.95);
      expect(total / ruta.metres).toBeLessThanOrEqual(1.01);
    }
  });

  it('el traçat SVG comença a l\'esquerra i acaba a la dreta del rectangle', () => {
    const { linia, area } = camiPerfil(rutes[0]!.punts, 600, 120);
    expect(linia.startsWith('M0.0 ')).toBe(true);
    expect(area.endsWith('L0 120 Z')).toBe(true);
  });

  it('totes les rutes surten i tornen a prop de la botiga o de Calonge', () => {
    for (const ruta of rutes) {
      const [primer, darrer] = [ruta.punts[0]!, ruta.punts.at(-1)!];
      expect(distancia(primer, darrer)).toBeLessThan(500);
    }
  });
});
