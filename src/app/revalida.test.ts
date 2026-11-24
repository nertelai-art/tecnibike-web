import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REVALIDA_S } from '@/lib/plataforma/remota';

// Cada pàgina que llegeix la plataforma diu cada quant es torna a generar. Sense, Next ho dedueix dels
// `fetch` que la pàgina fa ella mateixa; però el catàleg, l'horari i els ajustos es comparteixen entre
// pàgines (remota/index.ts), i una pàgina que aprofita la lectura d'una altra quedaria estàtica fins al
// desplegament següent: una foto o un preu canviat a la plataforma no hi sortiria mai. (Fins al
// 16-11-2026, la portada ja quedava així.)

const APP = join(process.cwd(), 'src/app');

function pagines(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pagines(join(dir, e.name)) : e.name === 'page.tsx' ? [join(dir, e.name)] : [],
  );
}

const llegeixen = pagines(APP)
  .map((fitxer) => ({ fitxer: relative(APP, fitxer).replaceAll('\\', '/'), codi: readFileSync(fitxer, 'utf8') }))
  .filter(({ codi }) => /\bplataforma\.\w+\(/.test(codi) && !/export const dynamic = 'force-dynamic'/.test(codi));

describe('les pàgines que llegeixen la plataforma', () => {
  it('hi són (la portada, les fitxes de lloguer i la botiga)', () => {
    expect(llegeixen.map((p) => p.fitxer)).toEqual(expect.arrayContaining(['[locale]/page.tsx', '[locale]/lloguer/[id]/page.tsx', '[locale]/botiga/[categoria]/page.tsx']));
  });

  it.each(llegeixen.map((p) => [p.fitxer, p.codi]))('%s diu cada quant es torna a generar',(_fitxer, codi) => {
    expect(codi).toContain(`export const revalidate = ${REVALIDA_S};`);
  });
});
