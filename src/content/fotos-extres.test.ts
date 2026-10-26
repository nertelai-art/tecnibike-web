import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { plataforma } from '@/lib/plataforma';
import { FOTOS_EXTRES } from './fotos-extres';

const PUBLIC = join(__dirname, '../../public');

describe('fotos dels extres', () => {
  it('cada extra amb foto en té els crèdits i el fitxer existeix', async () => {
    for (const extra of await plataforma.extres()) {
      if (!extra.imatge) continue;
      expect(FOTOS_EXTRES[extra.id]?.src, extra.id).toBe(extra.imatge);
      expect(existsSync(join(PUBLIC, extra.imatge)), extra.imatge).toBe(true);
    }
  });
});
