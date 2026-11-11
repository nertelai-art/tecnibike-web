// Baixa les fotos de producte de nutrició de les webs de les marques (scripts/fotos-nutricio.tsv)
// a una carpeta, per retallar-les després amb scripts/retalla-fotos-nutricio.py. Les retallades ja
// són al repositori (public/img/nutricio): això és per regenerar-les o afegir-ne. Per publicar-les a
// producció cal el permís de les marques (docs/nutricio-productes.md).
//
//   node scripts/fotos-nutricio.mjs <carpeta-temporal>
//   py -3.12 scripts/retalla-fotos-nutricio.py <carpeta-temporal> public/img/nutricio

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const desti = process.argv[2];
if (!desti) throw new Error('Cal la carpeta on baixar-les.');
mkdirSync(desti, { recursive: true });

const linies = readFileSync(new URL('./fotos-nutricio.tsv', import.meta.url), 'utf8').trim().split('\n');
for (const linia of linies) {
  const [producte, sabor, url] = linia.trim().split('\t');
  const extensio = new URL(url).pathname.split('.').pop();
  const resposta = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!resposta.ok) {
    console.error(`No s'ha pogut baixar ${producte} · ${sabor}: ${resposta.status}`);
    continue;
  }
  writeFileSync(join(desti, `${producte}--${sabor}.${extensio}`), Buffer.from(await resposta.arrayBuffer()));
  await new Promise((r) => setTimeout(r, 300));
}
console.log(`Fet: ${linies.length} fotos a ${desti}`);
